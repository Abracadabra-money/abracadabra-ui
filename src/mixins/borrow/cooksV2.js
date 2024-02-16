import { mapGetters } from "vuex";
import toAmount from "@/helpers/toAmount";
import { swap0xRequest } from "@/helpers/0x";
import { cook } from "@/helpers/cauldron/cauldron";
import { signMasterContract } from "@/helpers/signature";
import { actions } from "@/helpers/cauldron/cook/actions";
import { MAINNET_APE_ADDRESS } from "@/constants/tokensAddress";
import { MAINNET_USDT_ADDRESS } from "@/constants/tokensAddress";
import { DEFAULT_TOKEN_ADDRESS } from "@/constants/tokensAddress";
import { setMasterContractApproval } from "@/helpers/cauldron/boxes";
import { getSetMaxBorrowData } from "@/helpers/cauldron/cook/setMaxBorrow";
import degenBoxCookHelperMixin from "@/mixins/borrow/degenBoxCookHelper.js";
import { USDC_ADDRESS, WETH_ADDRESS, ORDER_AGENT } from "@/constants/gm";

import { getGlpLevData, getGlpLiqData } from "@/helpers/glpData/getGlpSwapData";
import { getOpenoceanLeverageSwapData } from "@/helpers/openocean/getOpenoceanLeverageSwapData";
import { getOpenoceanDeleverageSwapData } from "@/helpers/openocean/getOpenoceanDeleverageSwapData";
import {
  estimateExecuteDepositGasLimit,
  estimateExecuteWithdrawalGasLimit,
  getExecutionFee,
} from "@/helpers/gm/fee/getExecutionFee";

import { getGasLimits } from "@/helpers/gm/fee/getGasLimits";

import { getDepositAmount } from "@/helpers/gm/getDepositAmount";
import { getWithdrawalAmountsByMarket } from "@/helpers/gm/getWithdrawalAmounts";

import { getOrderBalances } from "@/helpers/gm/orders";
import { BigNumber, Contract, utils } from "ethers";
import OrderAgentAbi from "@/abis/gm/OrderAgentAbi";

export default {
  mixins: [degenBoxCookHelperMixin],
  data() {
    return {
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
      const { id } = this.cauldron.config;
      const { whitelistedInfo } = this.cauldron.additionalInfo;

      if (!(id === 33 && this.chainId === 1)) return false;

      if (
        +whitelistedInfo?.amountAllowedParsed < +whitelistedInfo?.userBorrowPart
      )
        return true;

      return false;
    },

    // TODO: move to config
    isGlp() {
      return (
        this.chainId === 42161 &&
        this.glpPoolsId.includes(+this.cauldron.config.id)
      );
    },

    // TODO: move to config
    isVelo() {
      return this.chainId === 10 && this.cauldron.config.id === 1;
    },

    // TODO: move to config
    isApe() {
      return this.chainId === 1 && this.cauldron.config.id === 39;
    },

    isSUSDT() {
      return this.chainId === 1 && this.cauldron.config.id === 42;
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
      const { cauldron, bentoBox } = pool.contracts;
      const verifyingContract = await cauldron.bentoBox();
      const nonce = await bentoBox.nonces(user);

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

      const { collateral, mim, leverageSwapper } = pool.contracts;

      let buyToken = collateral.address;
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
      if (this.isApe) buyToken = MAINNET_APE_ADDRESS;

      if (this.isSUSDT) buyToken = MAINNET_USDT_ADDRESS;

      const swapResponse = await swap0xRequest(
        this.chainId,
        buyToken,
        mim.address,
        slipage,
        amount,
        leverageSwapper.address
      );

      return swapResponse.data;
    },

    async get0xDeleverageSwapData(pool, collateralAmount, slipage) {
      if (this.isVelo) return "0x00";

      const {
        collateral,
        liquidationSwapper,
        mim: mimContract,
      } = this.cauldron.contracts;
      const swapper = liquidationSwapper.address;
      const mim = mimContract.address;
      let selToken = collateral.address;
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
        selToken = MAINNET_APE_ADDRESS;
        selAmount = await collateral.convertToAssets(collateralAmount);
      }

      if (this.isSUSDT) selToken = MAINNET_USDT_ADDRESS;

      const response = await swap0xRequest(
        this.chainId,
        mim,
        selToken,
        slipage,
        selAmount,
        swapper
      );
      return response.data;
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
      const { bentoBox, cauldron } = pool.contracts;

      const isApproved = this.cookHelper
        ? await this.isCookHelperApproved(bentoBox)
        : mcApproved;

      const masterContract = this.cookHelper
        ? this.cookHelper.address
        : await cauldron.masterContract();

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
      const { bentoBox } = pool.contracts;
      const addNonce = cookData.events.filter((value) => value === 24).length;

      // [leger issue] out of date?
      if (!this.itsMetamask && !approved) {
        const approvalMaster = await setMasterContractApproval(
          bentoBox,
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
      const { unwrappedToken, wrapper, cauldron } = pool.contracts;

      if (isWrap) {
        cookData = await this.bentoDepositEncodeHandler(
          cookData,
          unwrappedToken.address,
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
          unwrappedToken.address,
          wrapper.address,
          "0",
          "-2",
          false,
          true,
          1
        );

        const swapStaticTx = await wrapper.populateTransaction.wrap(
          cauldron.address,
          amount
        );

        const data = swapStaticTx.data.substring(0, 74);

        cookData = await actions.call(
          cookData,
          wrapper.address,
          data,
          true,
          false,
          2
        );
      } else {
        cookData = await this.bentoDepositEncodeHandler(
          cookData,
          token,
          cauldron.address,
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
    async recipeRemoveCollateral(
      cookData,
      pool,
      share,
      userAddr,
      tokenAddr,
      withdrawUnwrapToken = false
    ) {
      const wrapInfo = pool.config?.wrapInfo;
      const { wrapper, unwrappedToken, collateral } = pool.contracts;

      if (wrapInfo && withdrawUnwrapToken) {
        cookData = await actions.removeCollateral(cookData, share, userAddr);

        cookData = await this.bentoWithdrawEncodeHandler(
          cookData,
          collateral.address,
          wrapper.address,
          "0",
          share,
          false,
          false,
          1
        );

        // 30 unwrap and deposit for alice in degenbox
        const swapStaticTx = await wrapper.populateTransaction.unwrap(
          userAddr,
          share
        );

        const data = swapStaticTx.data.substring(0, 74);

        cookData = await actions.call(
          cookData,
          wrapper.address,
          data,
          true,
          false,
          2
        );

        cookData = await this.bentoWithdrawEncodeHandler(
          cookData,
          unwrappedToken.address,
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
      const { cauldron } = pool.contracts;
      const { userBorrowPart } = pool.userPosition.borrowInfo;
      const mim = pool.config.mimInfo.address;
      const to = this.account;

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
          cauldron.address,
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
        cauldron.address,
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
      is0x = false,
      isOpenocean = false
    ) {
      const { leverageSwapper, bentoBox } = this.cauldron.contracts;
      const mimAddress = this.cauldron.config.mimInfo.address;
      const swapperAddres = leverageSwapper.address;
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

      const shareFrom = await bentoBox.toShare(mimAddress, amount, false);

      if (!is0x && !isOpenocean) {
        const swapStaticTx = await leverageSwapper.populateTransaction.swap(
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

      // to be sure that sell amount in 0x and amountOut inside call will be same
      const amountToSwap = await toAmount(bentoBox, mimAddress, shareFrom);

      const swapData = isOpenocean
        ? await getOpenoceanLeverageSwapData(pool, amountToSwap, slipage)
        : await this.get0xLeverageSwapData(pool, amountToSwap, slipage);

      const swapStaticTx = await leverageSwapper.populateTransaction.swap(
        userAddr,
        minExpected,
        shareFrom,
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
      is0x,
      isOpenocean
    ) {
      const {
        collateral,
        mim: mimContract,
        liquidationSwapper,
        bentoBox,
      } = this.cauldron.contracts;

      const collateralTokenAddr = collateral.address;
      const mim = mimContract.address;
      const swapper = liquidationSwapper.address;
      const userAddr = this.account;

      if (!is0x && !isOpenocean) {
        const swapStaticTx = await liquidationSwapper.populateTransaction.swap(
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

      // to be sure that sell amount in openacean and amountOut inside call will be same
      const amountToSwap = await toAmount(
        bentoBox,
        collateralTokenAddr,
        shareFrom
      );

      const swapData = isOpenocean
        ? await getOpenoceanDeleverageSwapData(pool, amountToSwap, slipage)
        : await this.get0xDeleverageSwapData(pool, shareFrom, slipage);

      const swapStaticTx = await liquidationSwapper.populateTransaction.swap(
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
      isLpLogic = false,
      wrap = false
    ) {
      const { address } = pool.config.collateralInfo;
      const { cauldron } = pool.contracts;

      const token = itsDefaultBalance ? DEFAULT_TOKEN_ADDRESS : address;
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
          await cauldron.masterContract()
        );

      await cook(cauldron, cookData, value);
    },

    async cookBorrow({ amount, updatePrice }, isApprowed, pool) {
      const { address } = pool.config.mimInfo;
      const { whitelistedInfo } = this.cauldron.additionalInfo;
      const { cauldron } = this.cauldron.contracts;

      const mim = address;
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
          whitelistedInfo,
          userAddr
        );
      }

      cookData = await this.recipeBorrow(cookData, amount, userAddr, mim);

      if (isApprowed && this.cookHelper)
        cookData = await this.recipeApproveMC(
          cookData,
          pool,
          false,
          await cauldron.masterContract()
        );

      await cook(cauldron, cookData, 0);
    },

    async cookAddCollateralAndBorrow(
      { collateralAmount, amount, updatePrice, itsDefaultBalance },
      isApprowed,
      pool,
      isLpLogic = false,
      isWrap = false
    ) {
      const { address } = pool.config.collateralInfo;
      const { address: mimAddress } = pool.config.mimInfo;
      const { cauldron } = pool.contracts;

      const tokenAddr = itsDefaultBalance ? DEFAULT_TOKEN_ADDRESS : address;

      const collateralValue = itsDefaultBalance
        ? collateralAmount.toString()
        : 0;

      const pairToken = mimAddress;
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
          await cauldron.masterContract()
        );

      await cook(cauldron, cookData, collateralValue);
    },

    async cookRemoveCollateral(
      { amount, updatePrice, withdrawUnwrapToken },
      isApprowed,
      pool
    ) {
      const { cauldron } = pool.contracts;
      const tokenAddr = pool.config.collateralInfo.address;
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
        tokenAddr,
        withdrawUnwrapToken
      );

      if (isApprowed && this.cookHelper)
        cookData = await this.recipeApproveMC(
          cookData,
          pool,
          false,
          await cauldron.masterContract()
        );

      await cook(cauldron, cookData, 0);
    },

    async cookRepay({ amount, updatePrice, itsMax }, isApprowed, pool) {
      const { cauldron } = pool.contracts;

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
          await cauldron.masterContract()
        );

      await cook(cauldron, cookData, 0);
    },

    async cookRemoveCollateralAndRepay(
      { amount, collateralAmount, updatePrice, itsMax, withdrawUnwrapToken },
      isApprowed,
      pool
    ) {
      const { cauldron } = pool.contracts;
      const tokenAddr = pool.config.collateralInfo.address;
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
        tokenAddr,
        withdrawUnwrapToken
      );

      if (isApprowed && this.cookHelper)
        cookData = await this.recipeApproveMC(
          cookData,
          pool,
          false,
          await cauldron.masterContract()
        );

      await cook(cauldron, cookData, 0);
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
      isWrap
    ) {
      const { whitelistedInfo } = this.cauldron.additionalInfo;
      const { collateral, leverageSwapper } = this.cauldron.contracts;
      const { is0xSwap } = this.cauldron.config.cauldronSettings;
      const { isOpenocean } = this.cauldron.config.cauldronSettings;
      const { cauldron } = this.cauldron.contracts;
      const userAddr = this.account;
      const collateralValue = itsDefaultBalance
        ? collateralAmount.toString()
        : 0;
      const tokenAddr = itsDefaultBalance
        ? DEFAULT_TOKEN_ADDRESS
        : collateral.address;

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
          whitelistedInfo,
          userAddr
        );
      }

      // NOTICE: added in v3 revamp
      if (collateralAmount.gt(0)) {
        cookData = await this.recipeAddCollatral(
          cookData,
          pool,
          tokenAddr,
          isWrap,
          this.account,
          collateralAmount,
          collateralValue
        );
      }

      cookData = await actions.borrow(
        cookData,
        amount,
        leverageSwapper.address
      );

      cookData = await this.recipeLeverage(
        cookData,
        pool,
        amount,
        minExpected,
        slipage,
        is0xSwap,
        isOpenocean
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
          await cauldron.masterContract()
        );

      await cook(cauldron, cookData, collateralValue);
    },

    async cookDeleverage(
      {
        borrowAmount,
        collateralAmount,
        removeCollateralAmount,
        updatePrice,
        itsMax,
        slipage,
        withdrawUnwrapToken,
      },
      isApprowed,
      pool,
      account
    ) {
      const { collateral, liquidationSwapper, cauldron } =
        this.cauldron.contracts;
      const { userBorrowPart } = this.cauldron.userPosition.borrowInfo;
      const { is0xSwap } = this.cauldron.config.cauldronSettings;
      const { isOpenocean } = this.cauldron.config.cauldronSettings;
      const collateralTokenAddr = collateral.address;
      const reverseSwapperAddr = liquidationSwapper.address;
      const userAddr = account;

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
        is0xSwap,
        isOpenocean
      );

      if (itsMax) {
        cookData = await this.repayEncodeHandler(
          cookData,
          cauldron.address,
          userBorrowPart,
          userAddr
        );
      } else {
        cookData = await actions.getRepayPart(cookData, "-2");
        cookData = await this.repayEncodeHandler(
          cookData,
          cauldron.address,
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
          collateralTokenAddr,
          withdrawUnwrapToken
        );
      }

      if (isApprowed && this.cookHelper)
        cookData = await this.recipeApproveMC(
          cookData,
          pool,
          false,
          await cauldron.masterContract()
        );

      await cook(cauldron, cookData, 0);
    },

    async recipeCreateLeverageOrder(cookData, market, inputAmount) {
      const inputToken = USDC_ADDRESS;
      const deposit = true;

      const gasLimits = await getGasLimits(this.provider);
      const estimatedDepositGasLimit =
        estimateExecuteDepositGasLimit(gasLimits);

      const executionFee = await getExecutionFee(
        gasLimits,
        estimatedDepositGasLimit,
        this.provider
      );

      const minOutput = await getDepositAmount(
        market,
        0,
        inputAmount,
        this.provider
      );
      const minOutLong = 0; // ok for leverage

      const updatedCookData = actions.createOrder(
        cookData,
        executionFee,
        inputToken,
        deposit,
        inputAmount,
        executionFee,
        minOutput,
        minOutLong
      );

      return {
        updatedCookData,
        executionFee: executionFee,
        minOutput,
      };
    },

    async recipeCreateDeleverageOrder(cookData, inputToken, inputAmount) {
      const deposit = false;

      const gasLimits = await getGasLimits(this.provider);

      const orderAgentContract = new Contract(
        ORDER_AGENT,
        OrderAgentAbi,
        this.provider
      );
      const callbackGasLimit = await orderAgentContract.callbackGasLimit();

      const estimatedWithdrawGasLimit = estimateExecuteWithdrawalGasLimit(
        gasLimits,
        callbackGasLimit
      );

      const executionFee = await getExecutionFee(
        gasLimits,
        estimatedWithdrawGasLimit,
        this.provider
      );

      const { shortAmountOut, longAmountOut } =
        await getWithdrawalAmountsByMarket(
          inputToken,
          inputAmount,
          this.provider
        );

      const updatedCookData = actions.createOrder(
        cookData,
        executionFee,
        inputToken,
        deposit,
        inputAmount,
        executionFee,
        shortAmountOut,
        longAmountOut
      );

      return {
        updatedCookData,
        executionFee: executionFee,
      };
    },

    async recipeLeverageGM(pool, amount, slipage) {
      const { leverageSwapper, bentoBox, mim } = pool.contracts;
      const mimAddress = pool.config.mimInfo.address;
      const buyToken = USDC_ADDRESS;

      const shareFrom = await bentoBox.toShare(mimAddress, amount, false);

      // to be sure that sell amount in 0x and amountOut inside call will be same
      const amountToSwap = await toAmount(bentoBox, mimAddress, shareFrom);

      const swapResponse = await swap0xRequest(
        this.chainId,
        buyToken,
        mim.address,
        slipage,
        amountToSwap,
        leverageSwapper.address
      );

      const swapData = swapResponse.data;

      const minExpected = swapResponse.buyAmountWithSlippage;

      const swapStaticTx = await leverageSwapper.populateTransaction.swap(
        ORDER_AGENT,
        minExpected,
        shareFrom,
        swapData,
        {
          gasLimit: 1000000000,
        }
      );

      return { swapStaticTx, buyAmount: minExpected };
    },

    async recipeDeleverageGM(cookData, pool, shareFrom, shareToMin, slipage) {
      const { mim, liquidationSwapper, bentoBox } = this.cauldron.contracts;

      const userAddr = this.account;
      const sellToken = USDC_ADDRESS;

      const amountToSwap = await toAmount(bentoBox, sellToken, shareFrom);

      const swapResponse = await swap0xRequest(
        this.chainId,
        mim.address,
        sellToken,
        slipage,
        amountToSwap,
        liquidationSwapper.address
      );

      const buyShare = await bentoBox.toShare(
        mim.address,
        swapResponse.buyAmountWithSlippage,
        false
      );

      const swapStaticTx = await liquidationSwapper.populateTransaction.swap(
        sellToken,
        mim.address,
        userAddr,
        shareToMin.eq(0) ? buyShare : shareToMin,
        shareFrom,
        swapResponse.data,
        {
          gasLimit: 1000000000,
        }
      );

      const swapCallByte = swapStaticTx.data;

      cookData = await actions.call(
        cookData,
        liquidationSwapper.address,
        swapCallByte,
        false,
        false,
        2
      );

      return { cookData, buyAmount: swapResponse.buyAmount };
    },

    async cookRecoverFaliedLeverage(cauldronObject, order, account) {
      const { cauldron, collateral } = cauldronObject.contracts;

      const { balanceUSDC, balanceWETH } = await getOrderBalances(
        order,
        this.provider
      );

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = balanceWETH.gt(0)
        ? await actions.withdrawFromOrder(
            cookData,
            WETH_ADDRESS,
            account,
            balanceWETH,
            false
          )
        : cookData;

      cookData = await actions.withdrawFromOrder(
        cookData,
        USDC_ADDRESS,
        ORDER_AGENT,
        balanceUSDC,
        true
      );

      const { updatedCookData, executionFee } =
        await this.recipeCreateLeverageOrder(
          cookData,
          collateral.address,
          balanceUSDC
        );

      console.log(updatedCookData);

      await cook(cauldron, updatedCookData, executionFee);
    },

    async cookLeverageGM(
      { collateralAmount, amount, updatePrice, slipage },
      mcApproved,
      cauldronObject,
      isWrap = false
    ) {
      const { collateral, leverageSwapper, cauldron } =
        cauldronObject.contracts;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await this.checkAndSetMcApprove(
        cookData,
        cauldronObject,
        mcApproved
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      // NOTICE: added in v3 revamp
      if (collateralAmount.gt(0)) {
        cookData = await this.recipeAddCollatral(
          cookData,
          cauldronObject,
          collateral.address,
          isWrap,
          this.account,
          collateralAmount,
          0
        );
      }

      cookData = await actions.borrow(
        cookData,
        amount,
        leverageSwapper.address
      );

      const { swapStaticTx, buyAmount } = await this.recipeLeverageGM(
        cauldronObject,
        amount,
        slipage
      );

      cookData = await actions.call(
        cookData,
        leverageSwapper.address,
        swapStaticTx.data,
        false,
        false,
        2
      );

      const { updatedCookData, executionFee } =
        await this.recipeCreateLeverageOrder(
          cookData,
          collateral.address,
          buyAmount
        );

      await cook(cauldron, updatedCookData, executionFee);
    },

    async cookWitdrawToOrderGM(
      {
        borrowAmount,
        collateralAmount, // share TODO
        removeCollateralAmount,
        updatePrice,
        itsMax,
        slipage,
      },
      isApprowed,
      pool,
      account
    ) {
      const { collateral, cauldron, bentoBox } = this.cauldron.contracts;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await this.checkAndSetMcApprove(cookData, pool, isApprowed);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      // remove collateral to order agent & create order
      cookData = await actions.removeCollateral(
        cookData,
        collateralAmount,
        ORDER_AGENT
      );

      const amount = await toAmount(
        bentoBox,
        collateral.address,
        collateralAmount
      );

      const { updatedCookData, executionFee } =
        await this.recipeCreateDeleverageOrder(
          cookData,
          collateral.address,
          amount
        );

      await cook(cauldron, updatedCookData, executionFee);
    },

    async cookDeleverageFromOrder(
      {
        borrowAmount,
        collateralAmount, // share TODO
        removeCollateralAmount,
        updatePrice,
        itsMax,
        slipage,
      },
      cauldronObject,
      account,
      order
    ) {
      const { liquidationSwapper, cauldron, bentoBox } =
        cauldronObject.contracts;
      const collateralAddress = cauldronObject.config.collateralInfo.address;
      const { balanceUSDC } = await getOrderBalances(order, this.provider);

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = actions.withdrawFromOrder(
        cookData,
        USDC_ADDRESS,
        liquidationSwapper.address,
        balanceUSDC,
        true
      );

      const shareFrom = await bentoBox.toShare(
        USDC_ADDRESS,
        balanceUSDC,
        false
      );

      const deleverageData = await this.recipeDeleverageGM(
        cookData,
        cauldronObject,
        shareFrom,
        borrowAmount,
        slipage
      );

      cookData = deleverageData.cookData;

      const { userBorrowPart } = this.cauldron.userPosition.borrowInfo;

      if (itsMax || deleverageData.buyAmount.gt(userBorrowPart)) {
        cookData = await this.repayEncodeHandler(
          cookData,
          cauldron.address,
          userBorrowPart,
          account
        );
      } else {
        cookData = await actions.getRepayPart(cookData, "-2");
        cookData = await this.repayEncodeHandler(
          cookData,
          cauldron.address,
          "-1",
          account,
          false,
          true
        );
      }

      if (+removeCollateralAmount > 0) {
        cookData = await this.recipeRemoveCollateral(
          cookData,
          cauldronObject,
          removeCollateralAmount,
          account,
          collateralAddress
        );
      }

      await cook(cauldron, cookData, 0);
    },
  },
};
