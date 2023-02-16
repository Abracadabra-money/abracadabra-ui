import { mapGetters } from "vuex";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import { getSetMaxBorrowData } from "@/helpers/cauldron/cook/setMaxBorrow";
import { signMasterContract } from "@/helpers/signature";
import { setMasterContractApproval } from "@/helpers/cauldron/boxes";
import { swap0xRequest } from "@/helpers/0x";
import { actions } from "@/helpers/cauldron/cook/actions";
import { cook } from "@/helpers/cauldron/cauldron";

const usdcAddress = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const gmxLensAddress = "0xF6939A5D9081799041294B05f1939A06A0AdB75c";
import gmxLensAbi from "@/utils/abi/lp/GmxLens";

export default {
  data() {
    return {
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
      masterContract,
      approved = true,
      addNonce = 0
    ) {
      if (!this.itsMetamask) return "ledger";

      const user = this.account;
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

    async getWhitelistCallData(cookData, pool) {
      try {
        const whitelistedInfo = pool.userInfo?.whitelistedInfo;

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
      const masterContract = await pool.contractInstance.masterContract();

      if (!isApprowed) {
        const approvalEncode = await this.getApprovalEncode(
          pool,
          masterContract
        );

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

    async get0xLeverageSwapData(pool, amount, slipage) {
      try {
        let buyToken = pool.collateralToken.address;
        if (this.isGLP) buyToken = usdcAddress;

        const swapResponse = await swap0xRequest(
          this.chainId,
          buyToken,
          pool.borrowToken.address,
          slipage,
          amount,
          pool.levSwapperContract.address
        );

        return swapResponse.data;
      } catch (error) {
        console.log("get0xLeverageSwapData error: ", error);
      }
    },

    async get0xDeleverageSwapData(pool, collateralAmount, slipage) {
      try {
        const swapper = pool.liqSwapperContract.address;
        const mim = pool.borrowToken.address;
        let selToken = pool.collateralToken.address;
        let selAmount = collateralAmount;

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
          mim,
          selToken,
          slipage,
          selAmount,
          swapper
        );

        return response.data;
      } catch (error) {
        console.log("get0xDeleverageSwapData error: ", error);
      }
    },

    async recipeAddCollatral(
      cookData,
      pool,
      token,
      isWrap,
      to,
      amount,
      collateralValue
    ) {
      if (isWrap) {
        const { lpAddress, tokenWrapper } = pool.lpLogic;

        cookData = await actions.bentoDeposit(
          cookData,
          lpAddress,
          to,
          amount,
          "0"
        );
        
        cookData = await actions.bentoWithdraw(
          cookData,
          lpAddress,
          tokenWrapper,
          "-1",
          "0"
        );

        // 30
        // wrap and deposit to cauldron
        const swapStaticTx =
          await pool.lpLogic.tokenWrapperContract.populateTransaction.wrap(
            pool.contractInstance.address,
            amount
          );

        const data = swapStaticTx.data.substring(0, 74);

        cookData = await actions.call(
          cookData,
          tokenWrapper,
          data,
          true,
          false,
          2
        );
      } else {
        cookData = await actions.bentoDeposit(
          cookData,
          token,
          to,
          amount,
          "0",
          collateralValue
        );
      }

      cookData = await actions.addCollateral(cookData, "-2", to, false);

      return cookData;
    },

    async recipeRemoveCollateral(cookData, pool, share, userAddr, tokenAddr) {
      if (pool.lpLogic) {
        const { tokenWrapper, lpAddress } = pool.lpLogic;

        cookData = await actions.removeCollateral(cookData, share, userAddr);

        cookData = await actions.bentoWithdraw(
          cookData,
          pool.collateralToken.address,
          tokenWrapper,
          "0",
          share
        );

        // 30 unwrap and deposit for alice in degenbox
        const swapStaticTx =
          await pool.lpLogic.tokenWrapperContract.populateTransaction.unwrap(
            userAddr,
            share
          );

        const data = swapStaticTx.data.substring(0, 74);

        cookData = await actions.call(
          cookData,
          tokenWrapper,
          data,
          true,
          false,
          2
        );

        cookData = await actions.bentoWithdraw(
          cookData,
          lpAddress,
          userAddr,
          "-1",
          "0"
        );
      } else {
        cookData = await actions.removeCollateral(cookData, share, userAddr);

        cookData = await actions.bentoWithdraw(
          cookData,
          tokenAddr,
          userAddr,
          "0x00",
          share
        );
      }

      return cookData;
    },

    async recipeBorrow(cookData, part, to, mim) {
      cookData = await actions.borrow(cookData, part, to);
      cookData = await actions.bentoWithdraw(cookData, mim, to, "0", "-0x02");
      return cookData;
    },

    async recipeRepay(cookData, pool, itsMax, part) {
      const mim = pool.borrowToken.address;
      const to = this.account;
      const userBorrowPart = pool.userInfo.contractBorrowPart

      if(!itsMax) {
        cookData = await actions.bentoDeposit(cookData, mim, to, part, "0x00");
        cookData = await actions.getRepayPart(cookData, "-2");
        cookData = await actions.repay(cookData, '-1', to, false);
  
        return cookData;
      }

      cookData = await actions.getRepayShare(cookData, userBorrowPart);
      cookData = await actions.bentoDeposit(cookData, mim, to, "0x00", "-1");
      cookData = await actions.repay(cookData, userBorrowPart, to, false);
      
      return cookData;
    },

    async recipeLeverage(
      cookData,
      pool,
      amount,
      minExpected,
      slipage,
      is0x = false
    ) {
      const swapperAddres = pool.levSwapperContract.address;
      const userAddr = this.account;

      if (!is0x) {
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

        return cookData;
      }

      const swapData = await this.get0xLeverageSwapData(pool, amount, slipage);

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

      cookData = await actions.call(
        cookData,
        swapperAddres,
        swapStaticTx.data,
        false,
        false,
        2
      );

      return cookData;
    },

    async recipeDeleverage(cookData, pool, collateralAmount, slipage, is0x) {
      const collateralTokenAddr = pool.collateralToken.address;
      const mim = pool.borrowToken.address;
      const swapper = pool.liqSwapperContract.address;
      const userAddr = this.account;

      if (!is0x) {
        const swapStaticTx =
          await pool.liqSwapperContract.populateTransaction.swap(
            collateralTokenAddr,
            mim,
            userAddr,
            0,
            collateralAmount,
            {
              gasLimit: 1000000000,
            }
          );

        const swapCallByte = swapStaticTx.data;

        cookData = await actions.call(
          cookData,
          swapper,
          swapCallByte,
          false,
          false,
          2
        );

        return cookData;
      }

      const swapData = await this.get0xDeleverageSwapData(
        pool,
        collateralAmount,
        slipage
      );

      const swapStaticTx =
        await pool.liqSwapperContract.populateTransaction.swap(
          collateralTokenAddr,
          mim,
          userAddr,
          0,
          collateralAmount,
          swapData,
          {
            gasLimit: 1000000000,
          }
        );

      const swapCallByte = swapStaticTx.data;

      cookData = await actions.call(
        cookData,
        swapper,
        swapCallByte,
        false,
        false,
        2
      );

      return cookData;
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

      cookData = await this.recipeAddCollatral(
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
        cookData = await this.getWhitelistCallData(cookData, pool);
      }

      cookData = await this.recipeBorrow(cookData, amount, userAddr, pairToken);

      await this.sendCook(pool.contractInstance, cookData, 0, notificationId);
    },

    async cookAddCollateralAndBorrow(
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

      cookData = await this.recipeBorrow(cookData, amount, userAddr, pairToken);

      cookData = await this.recipeAddCollatral(
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

      cookData = await this.recipeRemoveCollateral(
        cookData,
        pool,
        amount,
        userAddr,
        tokenAddr
      );

      await this.sendCook(pool.contractInstance, cookData, 0, notificationId);
    },

    async cookRepay(
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

      cookData = await this.recipeRepay(cookData, pool, itsMax, amount);

      await this.sendCook(pool.contractInstance, cookData, 0, notificationId);
    },

    async cookRemoveCollateralAndRepay(
      { amount, collateralAmount, updatePrice, itsMax },
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

      console.log("itsMAx", itsMax)

      cookData = await this.recipeRepay(
        cookData,
        pool,
        itsMax,
        collateralAmount
      );

      cookData = await this.recipeRemoveCollateral(
        cookData,
        pool,
        amount,
        userAddr,
        tokenAddr
      );

      await this.sendCook(pool.contractInstance, cookData, 0, notificationId);
    },

    async cookLeverage(
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
        cookData = await this.getWhitelistCallData(cookData, pool);
      }

      cookData = await this.recipeAddCollatral(
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

      cookData = await this.recipeLeverage(
        cookData,
        pool,
        amount,
        minExpected,
        slipage,
        pool.is0xSwap
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

    async cookDeleverage(
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

      cookData = await this.recipeDeleverage(
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
        cookData = await this.recipeRemoveCollateral(
          cookData,
          pool,
          removeCollateralAmount,
          userAddr,
          collateralTokenAddr
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
        console.log("cook Error:", e);

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
