import { mapGetters } from "vuex";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

// need to integrate pair tokens, now only for op - refatoring later(!)
// import { getLev0xData, getLiq0xData } from "@/utils/zeroXSwap/zeroXswapper";
import { getSetMaxBorrowData } from "@/helpers/cauldron/cook/setMaxBorrow";
import { signMasterContract } from "@/helpers/signature";
import { setMasterContractApproval } from "@/helpers/cauldron/boxes";
import { swap0xRequest } from "@/helpers/0x";
import { actions } from "@/helpers/cauldron/cook/actions";
import { cook } from "@/helpers/cauldron/cauldron";
const usdcAddress = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const gmxLensAddress = "0xF6939A5D9081799041294B05f1939A06A0AdB75c";
import cookHelperAbi from "@/utils/abi/cookHelperAbi";
import gmxLensAbi from "@/utils/abi/lp/GmxLens";

export default {
  data() {
    return {
      gasLimitConst: 1000,
      defaultTokenAddress: "0x0000000000000000000000000000000000000000",
      glpPoolsId: [2, 3],
    };
  },
  computed: {
    ...mapGetters({
      account: "getAccount",
      itsMetamask: "getMetamaskActive",
      chainId: "getChainId",
      signer: "getSigner",
    }),

    needWhitelisterApprove() {
      if (!(this.selectedPool.id === 33 && this.chainId === 1)) return false;

      if (
        +this.selectedPool.userInfo?.whitelistedInfo.amountAllowedParsed <
        +this.selectedPool.userInfo?.whitelistedInfo.userBorrowPart
      )
        return true;

      return false;
    },

    cookHelper() {
      if (
        this.chainId === 1 &&
        (this.selectedPool.id === 35 ||
          this.selectedPool.id === 36 ||
          this.selectedPool.id === 37)
      )
        return new this.$ethers.Contract(
          "0x3AeCB01be778fAA795f156B9D3627c0E05f700a1",
          JSON.stringify(cookHelperAbi),
          this.signer
        );

      if (this.chainId === 42161 && this.selectedPool.id === 2)
        return new this.$ethers.Contract(
          "0x129149DC63F5778a41f619Bb36212566ac54eA45",
          JSON.stringify(cookHelperAbi),
          this.signer
        );

      return false;
    },

    isGlp() {
      return (
        this.chainId === 42161 &&
        this.glpPoolsId.includes(+this.selectedPool?.id)
      );
    },
  },
  methods: {
    async temporaryGetCookCommonBaseData(
      cookData,
      pool,
      isApprowed,
      updatePrice
    ) {
      cookData = await this.temporaryApprovalBlockHelper(
        cookData,
        pool,
        isApprowed
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      return cookData;
    },

    async getApprovalEncode(
      pool,
      approved = true,
      useHelper = false,
      addNonce = 0
    ) {
      if (!this.itsMetamask) return "ledger";

      const user = this.account;
      const masterContract = useHelper
        ? this.cookHelper.address
        : await pool.contractInstance.masterContract();
      const verifyingContract = await pool.contractInstance.bentoBox();
      const nonce = await pool.masterContractInstance.nonces(user);

      const parsedSignature = await signMasterContract(
        this.signer,
        this.chainId,
        verifyingContract,
        user,
        masterContract,
        approved,
        +nonce + addNonce
      );

      return this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "bool", "uint8", "bytes32", "bytes32"],
        [
          user,
          masterContract,
          approved,
          parsedSignature.v,
          parsedSignature.r,
          parsedSignature.s,
        ]
      );
    },

    async approveMasterContract(pool) {
      try {
        const masterContract = await pool.contractInstance.masterContract();

        return await setMasterContractApproval(
          pool.masterContractInstance,
          this.account,
          masterContract,
          true
        );
      } catch (e) {
        console.log("approveMasterContract err:", e);
        return false;
      }
    },

    async getWhitelistCallData(cookData) {
      try {
        const whitelistedInfo = this.selectedPool.userInfo?.whitelistedInfo;

        const data = await getSetMaxBorrowData(
          whitelistedInfo.whitelisterContract,
          this.account,
          whitelistedInfo.userWhitelistedInfo.userBorrowPart,
          whitelistedInfo.userWhitelistedInfo.proof
        );

        cookData = await actions.call(
          cookData,
          whitelistedInfo.whitelisterContract.address,
          data,
          false,
          false,
          0
        );
        return cookData;
      } catch (e) {
        console.log("getWhitelistCallData error:", e);
      }
    },

    async temporaryApprovalBlockHelper(cookData, pool, isApprowed) {
      if (!isApprowed) {
        const approvalEncode = await this.getApprovalEncode(pool);

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract(pool);
          if (!approvalMaster) return false; // TODO: update
          return cookData;
        } else {
          cookData.events.push(24);
          cookData.values.push(0);
          cookData.datas.push(approvalEncode);
        }
      }

      return cookData;
    },

    async temporaryRevokeApprovalBlockHelper(pool, cookData) {
      const addNonce = cookData.events.filter((value) => value === 24).length;

      const removeApprovalEncode = await this.getApprovalEncode(
        pool,
        false,
        false,
        addNonce
      );
      if (removeApprovalEncode && removeApprovalEncode !== "ledger") {
        cookData.events.push(24);
        cookData.values.push(0);
        cookData.datas.push(removeApprovalEncode);
      }

      return cookData;
    },

    async baseAddCollateralBlock(
      cookData,
      pool,
      tokenAddr,
      isWrap,
      userAddr,
      collateralAmount,
      collateralValue
    ) {
      if (isWrap) {
        const { lpAddress, tokenWrapper } = pool.lpLogic;

        cookData = await actions.bentoDeposit(
          cookData,
          lpAddress,
          userAddr,
          collateralAmount,
          "0"
        );
        cookData = await actions.bentoWithdraw(
          cookData,
          lpAddress,
          tokenWrapper,
          collateralAmount,
          "0"
        );

        // 30
        // wrap and deposit to cauldron
        const swapStaticTx =
          await pool.lpLogic.tokenWrapperContract.populateTransaction.wrap(
            pool.contractInstance.address,
            collateralAmount
          );

        cookData = await actions.call(
          cookData,
          tokenWrapper,
          swapStaticTx.data,
          true,
          false,
          2
        );
      } else {
        cookData = await actions.bentoDeposit(
          cookData,
          tokenAddr,
          userAddr,
          collateralAmount,
          "0",
          collateralValue
        );
      }

      cookData = await actions.addCollateral(cookData, "-2", userAddr, false);

      return cookData;
    },

    async baseRemoveCollateral(cookData, pool, amount, userAddr, tokenAddr) {
      if (pool.lpLogic) {
        const { tokenWrapper, lpAddress } = pool.lpLogic;

        cookData = await actions.removeCollateral(cookData, amount, userAddr);

        cookData = await actions.bentoWithdraw(
          cookData,
          pool.collateralToken.address,
          tokenWrapper,
          "0",
          amount
        );

        // 30 unwrap and deposit for alice in degenbox
        const swapStaticTx =
          await pool.lpLogic.tokenWrapperContract.populateTransaction.unwrap(
            userAddr,
            amount
          );

        cookData = await actions.call(
          cookData,
          tokenWrapper,
          swapStaticTx.data,
          false,
          false,
          2
        );

        cookData = await actions.bentoWithdraw(
          cookData,
          lpAddress,
          userAddr,
          amount,
          "0"
        );
      } else {
        cookData = await actions.removeCollateral(cookData, amount, userAddr);

        cookData = await actions.bentoWithdraw(
          cookData,
          tokenAddr,
          userAddr,
          "0x00",
          amount
        );
      }

      return cookData;
    },

    async baseBorrow(cookData, amount, userAddr, pairToken) {
      cookData = await actions.borrow(cookData, amount, userAddr);

      cookData = await actions.bentoWithdraw(
        cookData,
        pairToken,
        userAddr,
        "0",
        "-0x02"
      );

      return cookData;
    },

    async baseRepay(cookData, pool, itsMax, amount) {
      const pairToken = pool.borrowToken.address;
      const userAddr = this.account;

      const userBorrowPart = pool.userInfo.contractBorrowPart;
      const repayPart = itsMax ? userBorrowPart : amount;

      cookData = await actions.getRepayShare(cookData, repayPart);

      cookData = await actions.bentoDeposit(
        cookData,
        pairToken,
        userAddr,
        "0x00",
        "-0x01"
      );

      cookData = await actions.repay(
        cookData,
        "-0x01",
        userAddr,
        false
      );

      return cookData;
    },

    async baseLeverage(cookData, pool, amount, minExpected, slipage, is0x) {
      const swapperAddres = pool.levSwapperContract.address;
      const userAddr = this.account;

      let buyToken = pool.collateralToken.address;
      if (this.isGLP) buyToken = usdcAddress;

      if (is0x) {
        const response = await swap0xRequest(
          this.chainId,
          buyToken,
          pool.borrowToken.address,
          slipage,
          amount,
          pool.levSwapperContract.address
        );

        const swapData = response.data;
        const swapStaticTx =
          await pool.levSwapperContract.populateTransaction.swap(
            userAddr,
            minExpected,
            amount,
            swapData,
            {
              gasLimit: 1000000000,
            }
          );
        const swapCallByte = swapStaticTx.data;

        cookData = await actions.call(
          cookData,
          swapperAddres,
          swapCallByte,
          false,
          false,
          2
        );
      } else {
        const swapStaticTx =
          await pool.levSwapperContract.populateTransaction.swap(
            userAddr,
            minExpected,
            0,
            {
              gasLimit: 1000000000,
            }
          );
        const swapCallByte = swapStaticTx.data.substr(0, 138);

        cookData = await actions.call(
          cookData,
          swapperAddres,
          swapCallByte,
          false,
          true,
          2
        );
      }

      return cookData;
    },

    async baseDeleverage(cookData, pool, collateralAmount, slipage, is0x) {
      const collateralTokenAddr = pool.collateralToken.address;
      const borrowTokenAddr = pool.borrowToken.address;
      const reverseSwapperAddr = pool.liqSwapperContract.address;
      const userAddr = this.account;
      let swapStaticTx;

      let selToken = pool.collateralToken.address;
      let selAmount = collateralAmount;

      if (is0x) {
        if (this.isGlp) {
          selToken = usdcAddress;

          const GmxLensContract = new this.$ethers.Contract(
            gmxLensAddress,
            JSON.stringify(gmxLensAbi),
            this.signer
          );

          const glpAmount = await pool.collateralToken.contract.convertToAssets(
            collateralAmount
          );

          const usdcAmount = await GmxLensContract.getTokenOutFromBurningGlp(
            usdcAddress,
            glpAmount
          );

          selAmount = usdcAmount;
        }

        const response = await swap0xRequest(
          this.chainId,
          pool.borrowToken.address,
          selToken,
          slipage,
          selAmount,
          pool.liqSwapperContract.address
        );

        const swapData = response.data;

        swapStaticTx = await pool.liqSwapperContract.populateTransaction.swap(
          collateralTokenAddr,
          borrowTokenAddr,
          userAddr,
          0,
          collateralAmount,
          swapData,
          {
            gasLimit: 1000000000,
          }
        );
      } else {
        swapStaticTx = await pool.liqSwapperContract.populateTransaction.swap(
          collateralTokenAddr,
          borrowTokenAddr,
          userAddr,
          0,
          collateralAmount,
          {
            gasLimit: 1000000000,
          }
        );
      }

      const swapCallByte = swapStaticTx.data;

      cookData = await actions.call(
        cookData,
        reverseSwapperAddr,
        swapCallByte,
        false,
        false,
        2
      );

      return cookData;
    },

    async cookCollateralAndBorrow(
      { collateralAmount, amount, updatePrice, itsDefaultBalance },
      isApprowed,
      pool,
      notificationId,
      isLpLogic = false,
      isWrap = false
    ) {
      const tokenAddr = itsDefaultBalance
        ? this.defaultTokenAddress
        : pool.collateralToken.address;

      const collateralValue = itsDefaultBalance
        ? collateralAmount.toString()
        : 0;

      const pairToken = pool.borrowToken.address;
      const userAddr = this.account;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      cookData = await this.baseBorrow(cookData, amount, userAddr, pairToken);

      cookData = await this.baseAddCollateralBlock(
        cookData,
        pool,
        tokenAddr,
        isLpLogic && isWrap,
        userAddr,
        collateralAmount,
        collateralValue
      );

      await this.sendCook(
        pool.contractInstance,
        cookData,
        collateralValue,
        notificationId
      );
    },

    async cookAddCollateral(
      { amount, updatePrice, itsDefaultBalance },
      isApprowed,
      pool,
      notificationId,
      isLpLogic = false,
      isWrap = false
    ) {
      const tokenAddr = itsDefaultBalance
        ? this.defaultTokenAddress
        : pool.collateralToken.address;
      const collateralValue = itsDefaultBalance ? amount.toString() : 0;

      const userAddr = this.account;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      cookData = await this.baseAddCollateralBlock(
        cookData,
        pool,
        tokenAddr,
        isLpLogic && isWrap,
        userAddr,
        amount,
        collateralValue
      );

      await this.sendCook(
        pool.contractInstance,
        cookData,
        collateralValue,
        notificationId
      );
    },

    async cookBorrow(
      { amount, updatePrice },
      isApprowed,
      pool,
      notificationId
    ) {
      const pairToken = pool.borrowToken.address;
      const userAddr = this.account;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      if (this.needWhitelisterApprove) {
        cookData = await this.getWhitelistCallData(cookData);
      }

      cookData = await this.baseBorrow(cookData, amount, userAddr, pairToken);

      await this.sendCook(pool.contractInstance, cookData, 0, notificationId);
    },

    async cookRemoveAndRepayMax(
      { amount, updatePrice },
      isApprowed,
      pool,
      notificationId
    ) {
      const tokenAddr = pool.collateralToken.address;
      const userAddr = this.account;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      cookData = await this.baseRepay(cookData, pool, true);
      cookData = await this.baseRemoveCollateral(
        cookData,
        pool,
        amount,
        userAddr,
        tokenAddr
      );

      await this.sendCook(pool.contractInstance, cookData, 0, notificationId);
    },

    async cookRemoveAndRepay(
      { amount, collateralAmount, updatePrice },
      isApprowed,
      pool,
      notificationId
    ) {
      const tokenAddr = pool.collateralToken.address;
      const userAddr = this.account;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      cookData = await this.baseRepay(cookData, pool, false, collateralAmount);

      cookData = await this.baseRemoveCollateral(
        cookData,
        pool,
        amount,
        userAddr,
        tokenAddr
      );

      await this.sendCook(pool.contractInstance, cookData, 0, notificationId);
    },

    async cookRemoveCollateral(
      { amount, updatePrice },
      isApprowed,
      pool,
      notificationId
    ) {
      const tokenAddr = pool.collateralToken.address;
      const userAddr = this.account;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      cookData = await this.baseRemoveCollateral(
        cookData,
        pool,
        amount,
        userAddr,
        tokenAddr
      );

      await this.sendCook(pool.contractInstance, cookData, 0, notificationId);
    },

    async cookRepayMim(
      { amount, updatePrice, itsMax },
      isApprowed,
      pool,
      notificationId
    ) {
      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      cookData = await this.baseRepay(cookData, pool, itsMax, amount);

      await this.sendCook(pool.contractInstance, cookData, 0, notificationId);
    },

    async cookMultiBorrow(
      {
        collateralAmount,
        amount,
        updatePrice,
        minExpected,
        itsDefaultBalance,
        slipage,
      },
      isApprowed,
      pool,
      notificationId
    ) {
      const tokenAddr = itsDefaultBalance
        ? this.defaultTokenAddress
        : pool.collateralToken.address;
      const collateralValue = itsDefaultBalance
        ? collateralAmount.toString()
        : 0;

      const swapperAddres = pool.levSwapperContract.address;
      const userAddr = this.account;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      if (this.needWhitelisterApprove) {
        cookData = await this.getWhitelistCallData(cookData);
      }

      cookData = await this.baseAddCollateralBlock(
        cookData,
        pool,
        tokenAddr,
        false,
        userAddr,
        collateralAmount,
        collateralValue
      );

      cookData = await actions.borrow(cookData, amount, swapperAddres);

      cookData = await this.baseLeverage(
        cookData,
        pool,
        amount,
        minExpected,
        slipage,
        pool.is0xSwap
      );

      cookData = await actions.addCollateral(
        cookData,
        "-0x02",
        userAddr,
        false
      );

      await this.sendCook(
        pool.contractInstance,
        cookData,
        collateralValue,
        notificationId
      );
    },

    async cookMultiBorrowXswapper(
      {
        collateralAmount,
        amount,
        updatePrice,
        minExpected,
        itsDefaultBalance,
        slipage,
      },
      isApprowed,
      pool,
      notificationId,
      isWrap
    ) {
      const collateralValue = itsDefaultBalance
        ? collateralAmount.toString()
        : 0;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      if (this.needWhitelisterApprove) {
        cookData = await this.getWhitelistCallData(cookData);
      }

      cookData = await this.baseAddCollateralBlock(
        cookData,
        pool,
        pool.collateralToken.address,
        isWrap,
        this.account,
        collateralAmount,
        collateralValue
      );

      cookData = await actions.borrow(
        cookData,
        amount,
        pool.levSwapperContract.address
      );

      cookData = await this.baseLeverage(
        cookData,
        pool,
        amount,
        minExpected,
        slipage,
        true
      );

      cookData = await actions.addCollateral(
        cookData,
        "-2",
        this.account,
        false
      );

      await this.sendCook(
        pool.contractInstance,
        cookData,
        collateralValue,
        notificationId
      );
    },

    async cookFlashRepay(
      {
        borrowAmount,
        collateralAmount,
        removeCollateralAmount,
        updatePrice,
        itsMax,
        slipage,
      },
      isApprowed,
      pool,
      account,
      notificationId
    ) {
      const collateralTokenAddr = pool.collateralToken.address;
      const reverseSwapperAddr = pool.liqSwapperContract.address;
      const userAddr = account;
      const userBorrowPart = pool.userInfo.contractBorrowPart;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      cookData = await actions.removeCollateral(
        cookData,
        collateralAmount,
        reverseSwapperAddr
      );

      cookData = await this.baseDeleverage(
        cookData,
        pool,
        collateralAmount,
        slipage,
        pool.is0xSwap
      );

      if (itsMax) {
        cookData = await actions.repay(
          cookData,
          userBorrowPart,
          userAddr,
          false
        );
      } else {
        cookData = await actions.repay(cookData, borrowAmount, userAddr, false);
      }

      if (+removeCollateralAmount > 0) {
        cookData = await this.baseRemoveCollateral(
          cookData,
          pool,
          removeCollateralAmount,
          userAddr,
          collateralTokenAddr
        );
      }

      await this.sendCook(pool.contractInstance, cookData, 0, notificationId);
    },

    async cookFlashRepayXswapper(
      {
        borrowAmount,
        collateralAmount,
        removeCollateralAmount,
        updatePrice,
        itsMax,
        slipage,
      },
      isApprowed,
      pool,
      account,
      notificationId
    ) {
      const reverseSwapperAddr = pool.liqSwapperContract.address;
      const userBorrowPart = pool.userInfo.contractBorrowPart;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      cookData = await actions.removeCollateral(
        cookData,
        collateralAmount,
        reverseSwapperAddr
      );

      cookData = await this.baseDeleverage(
        cookData,
        pool,
        collateralAmount,
        slipage,
        true
      );

      if (itsMax) {
        cookData = await actions.repay(
          cookData,
          userBorrowPart,
          account,
          false
        );
      } else {
        cookData = await actions.repay(cookData, borrowAmount, account, false);
      }

      if (+removeCollateralAmount > 0) {
        cookData = await this.baseRemoveCollateral(
          cookData,
          pool,
          removeCollateralAmount,
          account,
          pool.collateralToken.address
        );
      }

      await this.sendCook(pool.contractInstance, cookData, 0, notificationId);
    },

    async sendCook(cauldron, cookData, value, notificationId) {
      try {
        await cook(cauldron, cookData, value);

        await this.$store.commit("notifications/delete", notificationId);
        this.$store.commit("setPopupState", {
          type: "success",
          isShow: true,
        });
      } catch (e) {
        console.log("cookFlashRepayXswapper Error:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },
  },
};
