import { mapGetters } from "vuex";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import { getSetMaxBorrowData } from "@/helpers/cauldron/cook/setMaxBorrow";
import { getGlpLevData, getGlpLiqData } from "@/helpers/glpData/getGlpSwapData";
import { signMasterContract } from "@/helpers/signature";
import { setMasterContractApproval } from "@/helpers/cauldron/boxes";
import { swap0xRequest } from "@/helpers/0x";
import { actions } from "@/helpers/cauldron/cook/actions";
import { cook } from "@/helpers/cauldron/cauldron";
import vyperContractAbi from "@/utils/abi/lp/vyperContract";

import degenBoxCookHelperMixin from "@/mixins/borrow/degenBoxCookHelper.js";

// const usdcAddress = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const apeAddress = "0x4d224452801ACEd8B2F0aebE155379bb5D594381";
const usdtAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const vyperAddress = "0xD51a44d3FaE010294C616388b506AcdA1bfAAE46";

export default {
  mixins: [degenBoxCookHelperMixin],
  data() {
    return {
      defaultTokenAddress: "0x0000000000000000000000000000000000000000",
      glpPoolsId: [2, 3], // TODO: move to config
    };
  },
  computed: {
    ...mapGetters({
      account: "getAccount",
      itsMetamask: "getMetamaskActive",
      chainId: "getChainId",
      signer: "getSigner",
      provider: "getProvider",
    }),

    // TODO: move to config
    needWhitelisterApprove() {
      if (!(this.selectedPool.id === 33 && this.chainId === 1)) return false;

      if (
        +this.selectedPool.userInfo?.whitelistedInfo.amountAllowedParsed <
        +this.selectedPool.userInfo?.whitelistedInfo.userBorrowPart
      )
        return true;

      return false;
    },

    // TODO: move to config
    isGlp() {
      return (
        this.chainId === 42161 &&
        this.glpPoolsId.includes(+this.selectedPool?.id)
      );
    },

    // TODO: move to config
    isVelo() {
      return this.chainId === 10 && this.selectedPool.id === 1;
    },

    // TODO: move to config
    isApe() {
      return this.chainId === 1 && this.selectedPool.id === 39;
    },

    isCrv3crypto() {
      return this.chainId === 1 && this.selectedPool.id === 41;
    },
  },
  methods: {
    async signAndGetData(
      cookData,
      pool,
      masterContract,
      approved = true,
      addNonce = 0
    ) {
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

      cookData = actions.bentoSetApproval(
        cookData,
        user,
        masterContract,
        approved,
        parsedSignature.v,
        parsedSignature.r,
        parsedSignature.s
      );

      return cookData;
    },

    async get0xLeverageSwapData(pool, amount, slipage) {
      if (this.isVelo) return "0x00";

      let buyToken = pool.collateralToken.address;
      if (this.isGlp) {
        const leverageResp = await getGlpLevData(
          this.signer,
          pool,
          amount,
          42161,
          slipage
        );
        return leverageResp.swapDataEncode;
      }
      if (this.isApe) buyToken = apeAddress;

      if (this.isCrv3crypto) buyToken = usdtAddress;

      const swapResponse = await swap0xRequest(
        this.chainId,
        buyToken,
        pool.borrowToken.address,
        slipage,
        amount,
        pool.levSwapperContract.address
      );

      if (this.isCrv3crypto) {
        return this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "uint256", "bytes"],
          ["0xdac17f958d2ee523a2206206994597c13d831ec7", "0", swapResponse.data]
        );
      }

      return swapResponse.data;
    },

    async get0xDeleverageSwapData(pool, collateralAmount, slipage) {
      if (this.isVelo) return "0x00";

      const swapper = pool.liqSwapperContract.address;
      const mim = pool.borrowToken.address;
      let selToken = pool.collateralToken.address;
      let selAmount = collateralAmount;

      if (this.isGlp) {
        const deleverageResp = await getGlpLiqData(
          this.signer,
          pool,
          collateralAmount,
          42161,
          slipage
        );
        return deleverageResp.swapDataEncode;
      }

      if (this.isApe) {
        selToken = apeAddress;
        selAmount = await pool.collateralToken.contract.convertToAssets(
          collateralAmount
        );
      }

      if (this.isCrv3crypto) {
        selToken = usdtAddress;
        selAmount = await this.calculate3cryptoUsdtAmount(selAmount);
      }

      const response = await swap0xRequest(
        this.chainId,
        mim,
        selToken,
        slipage,
        selAmount,
        swapper
      );

      if (this.isCrv3crypto) {
        return this.$ethers.utils.defaultAbiCoder.encode(
          ["uint256", "bytes"],
          ["0", response.data]
        );
      }

      return response.data;
    },

    async calculate3cryptoUsdtAmount(selAmount) {
      const vyperContract = new this.$ethers.Contract(
        vyperAddress,
        JSON.stringify(vyperContractAbi),
        this.provider
      );

      return vyperContract.calc_withdraw_one_coin(selAmount.toString(), "0");
    },

    async recipeSetMaxBorrow(cookData, whitelistedInfo, user) {
      const data = await getSetMaxBorrowData(
        whitelistedInfo.whitelisterContract,
        user,
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
    },

    async checkAndSetMcApprove(cookData, pool, mcApproved) {
      const isApproved = this.cookHelper
        ? await this.isCookHelperApproved(pool)
        : mcApproved;

      const masterContract = this.cookHelper
        ? this.cookHelper.address
        : await pool.contractInstance.masterContract();

      if (!isApproved) {
        cookData = await this.recipeApproveMC(
          cookData,
          pool,
          true,
          masterContract
        );
      }

      return cookData;
    },

    async recipeApproveMC(cookData, pool, approved = true, masterContract) {
      const addNonce = cookData.events.filter((value) => value === 24).length;

      // [leger issue] out of date?
      if (!this.itsMetamask && !approved) {
        const approvalMaster = await setMasterContractApproval(
          pool.masterContractInstance,
          this.account,
          masterContract,
          true
        );
        if (!approvalMaster) return false; // TODO: update catch
        return cookData;
      }

      cookData = await this.signAndGetData(
        cookData,
        pool,
        masterContract,
        approved,
        addNonce
      );

      return cookData;
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

        cookData = await this.bentoDepositEncodeHandler(
          cookData,
          lpAddress,
          to,
          amount,
          "0",
          collateralValue,
          false,
          false,
          2
        );

        cookData = await this.bentoWithdrawEncodeHandler(
          cookData,
          lpAddress,
          tokenWrapper,
          "0",
          "-2",
          false,
          true,
          1
        );

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
        cookData = await this.bentoDepositEncodeHandler(
          cookData,
          token,
          pool.contractInstance.address,
          amount,
          "0",
          collateralValue,
          false,
          false,
          2
        );
      }

      cookData = await actions.addCollateral(cookData, "-2", to, true);

      return cookData;
    },

    async recipeRemoveCollateral(cookData, pool, share, userAddr, tokenAddr) {
      if (pool.lpLogic) {
        const { tokenWrapper, lpAddress } = pool.lpLogic;

        cookData = await actions.removeCollateral(cookData, share, userAddr);

        cookData = await this.bentoWithdrawEncodeHandler(
          cookData,
          pool.collateralToken.address,
          tokenWrapper,
          "0",
          share,
          false,
          false,
          1
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

        cookData = await this.bentoWithdrawEncodeHandler(
          cookData,
          lpAddress,
          userAddr,
          "0",
          "-2",
          false,
          true
        );
      } else {
        cookData = await actions.removeCollateral(cookData, share, userAddr);

        cookData = await this.bentoWithdrawEncodeHandler(
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
      cookData = await this.bentoWithdrawEncodeHandler(
        cookData,
        mim,
        to,
        "0",
        "-0x02",
        false,
        true
      );
      return cookData;
    },

    async recipeRepay(cookData, pool, itsMax, part) {
      const mim = pool.borrowToken.address;
      const to = this.account;
      const userBorrowPart = pool.userInfo.contractBorrowPart;

      if (!itsMax) {
        cookData = await this.bentoDepositEncodeHandler(
          cookData,
          mim,
          to,
          part,
          "0",
          "0",
          false,
          false,
          2
        );
        cookData = await actions.getRepayPart(cookData, "-2");
        cookData = await this.repayEncodeHandler(
          cookData,
          pool.contractInstance.address,
          "-1",
          to,
          false,
          true,
          false,
          0
        );

        return cookData;
      }

      cookData = await actions.getRepayShare(cookData, userBorrowPart);
      cookData = await this.bentoDepositEncodeHandler(
        cookData,
        mim,
        to,
        "0",
        "-1",
        "0",
        true,
        false,
        0
      );
      cookData = await this.repayEncodeHandler(
        cookData,
        pool.contractInstance.address,
        userBorrowPart,
        to
      );

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

      if (this.isGlp)
        return await getGlpLevData(
          cookData,
          this.signer,
          pool,
          amount,
          42161,
          slipage
        );

      if (!is0x) {
        const swapStaticTx =
          await pool.levSwapperContract.populateTransaction.swap(
            userAddr,
            minExpected,
            0
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

    async recipeDeleverage(
      cookData,
      pool,
      shareFrom,
      shareToMin,
      slipage,
      is0x
    ) {
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
            shareToMin,
            shareFrom
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
        shareFrom,
        slipage
      );

      const swapStaticTx =
        await pool.liqSwapperContract.populateTransaction.swap(
          collateralTokenAddr,
          mim,
          userAddr,
          shareToMin,
          shareFrom,
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
      wrap = false
    ) {
      const token = itsDefaultBalance
        ? this.defaultTokenAddress
        : pool.collateralToken.address;
      const value = itsDefaultBalance ? amount.toString() : 0;
      const to = this.account;
      const isWrap = wrap && isLpLogic;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await this.checkAndSetMcApprove(cookData, pool, isApprowed);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      cookData = await this.recipeAddCollatral(
        cookData,
        pool,
        token,
        isWrap,
        to,
        amount,
        value
      );

      if (isApprowed && this.cookHelper)
        cookData = await this.recipeApproveMC(
          cookData,
          pool,
          false,
          await pool.contractInstance.masterContract()
        );

      await this.sendCook(
        pool.contractInstance,
        cookData,
        value,
        notificationId
      );
    },

    async cookBorrow(
      { amount, updatePrice },
      isApprowed,
      pool,
      notificationId
    ) {
      const mim = pool.borrowToken.address;
      const userAddr = this.account;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await this.checkAndSetMcApprove(cookData, pool, isApprowed);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (this.needWhitelisterApprove) {
        cookData = await this.recipeSetMaxBorrow(
          cookData,
          pool.userInfo?.whitelistedInfo,
          userAddr
        );
      }

      cookData = await this.recipeBorrow(cookData, amount, userAddr, mim);

      if (isApprowed && this.cookHelper)
        cookData = await this.recipeApproveMC(
          cookData,
          pool,
          false,
          await pool.contractInstance.masterContract()
        );

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

      cookData = await this.checkAndSetMcApprove(cookData, pool, isApprowed);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

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

      if (isApprowed && this.cookHelper)
        cookData = await this.recipeApproveMC(
          cookData,
          pool,
          false,
          await pool.contractInstance.masterContract()
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

      cookData = await this.checkAndSetMcApprove(cookData, pool, isApprowed);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      cookData = await this.recipeRemoveCollateral(
        cookData,
        pool,
        amount,
        userAddr,
        tokenAddr
      );

      if (isApprowed && this.cookHelper)
        cookData = await this.recipeApproveMC(
          cookData,
          pool,
          false,
          await pool.contractInstance.masterContract()
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

      cookData = await this.checkAndSetMcApprove(cookData, pool, isApprowed);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      cookData = await this.recipeRepay(cookData, pool, itsMax, amount);

      if (isApprowed && this.cookHelper)
        cookData = await this.recipeApproveMC(
          cookData,
          pool,
          false,
          await pool.contractInstance.masterContract()
        );

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

      cookData = await this.checkAndSetMcApprove(cookData, pool, isApprowed);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      cookData = await this.recipeRepay(
        cookData,
        pool,
        itsMax,
        collateralAmount // mim part
      );

      cookData = await this.recipeRemoveCollateral(
        cookData,
        pool,
        amount, // collateral share
        userAddr,
        tokenAddr
      );

      if (isApprowed && this.cookHelper)
        cookData = await this.recipeApproveMC(
          cookData,
          pool,
          false,
          await pool.contractInstance.masterContract()
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
      const userAddr = this.account;
      const collateralValue = itsDefaultBalance
        ? collateralAmount.toString()
        : 0;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await this.checkAndSetMcApprove(cookData, pool, isApprowed);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (this.needWhitelisterApprove) {
        cookData = await this.recipeSetMaxBorrow(
          cookData,
          pool.userInfo?.whitelistedInfo,
          userAddr
        );
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

      if (isApprowed && this.cookHelper)
        cookData = await this.recipeApproveMC(
          cookData,
          pool,
          false,
          await pool.contractInstance.masterContract()
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

      cookData = await this.checkAndSetMcApprove(cookData, pool, isApprowed);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      cookData = await actions.removeCollateral(
        cookData,
        collateralAmount,
        reverseSwapperAddr
      );

      cookData = await this.recipeDeleverage(
        cookData,
        pool,
        collateralAmount,
        borrowAmount,
        slipage,
        pool.is0xSwap
      );

      if (itsMax) {
        cookData = await this.repayEncodeHandler(
          cookData,
          pool.contractInstance.address,
          userBorrowPart,
          userAddr
        );
      } else {
        cookData = await actions.getRepayPart(cookData, "-2");
        cookData = await this.repayEncodeHandler(
          cookData,
          pool.contractInstance.address,
          "-1",
          userAddr,
          false,
          true
        );
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

      if (isApprowed && this.cookHelper)
        cookData = await this.recipeApproveMC(
          cookData,
          pool,
          false,
          await pool.contractInstance.masterContract()
        );

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
