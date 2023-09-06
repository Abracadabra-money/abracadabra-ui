import { mapGetters } from "vuex";
import { actions } from "@/helpers/cauldron/cook/actions";
import checkWhitelistLogic from "@/helpers/cauldron/cook/checkWhitelistLogic";
import sendCook from "@/helpers/cauldron/cook/sendCook";

import recipeAddCollatral from "@/helpers/cauldron/cook/recipies/recipeAddCollateral";
import recipeRemoveCollateral from "@/helpers/cauldron/cook/recipies/recipeRemoveCollateral";
import recipeBorrow from "@/helpers/cauldron/cook/recipies/recipeBorrow";
import recipeRepay from "@/helpers/cauldron/cook/recipies/recipeRepay";
import recipeLeverage from "@/helpers/cauldron/cook/recipies/recipeLeverage";
import recipeDeleverage from "@/helpers/cauldron/cook/recipies/recipeDeleverage";

import recipeSetMaxBorrow from "@/helpers/cauldron/cook/recipies/recipeSetMaxBorrow";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";

import {
  repayEncodeHandler,
  bentoDepositEncodeHandler,
  bentoWithdrawEncodeHandler,
} from "./cook/degenBoxHelper/actionHandlers";

// const usdcAddress = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const apeAddress = "0x4d224452801ACEd8B2F0aebE155379bb5D594381";

export default {
  data() {
    return {
      defaultTokenAddress: "0x0000000000000000000000000000000000000000",
    };
  },
  computed: {
    ...mapGetters({
      account: "getAccount",
      signer: "getSigner",
    }),
  },
  methods: {
    async cookAddCollateral(
      { amount, updatePrice, itsDefaultBalance },
      isApprowed,
      cauldronObject,
      notificationId,
      isLpLogic = false,
      wrap = false
    ) {
      const { address } = cauldronObject.config.collateralInfo;
      const { cauldron } = cauldronObject.contracts;

      const useDegenBoxHelper =
        cauldronObject.config.cauldronSettings.useDegenBoxHelper;

      const token = itsDefaultBalance ? this.defaultTokenAddress : address;
      const value = itsDefaultBalance ? amount.toString() : 0;
      const to = this.account;
      const isWrap = wrap && isLpLogic;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await checkAndSetMcApprove(
        cookData,
        cauldronObject,
        isApprowed
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      cookData = await recipeAddCollatral(
        cookData,
        cauldronObject,
        token,
        isWrap,
        to,
        amount,
        value
      );

      if (isApprowed && useDegenBoxHelper)
        cookData = await recipeApproveMC(
          cookData,
          cauldronObject,
          false,
          await cauldron.masterContract()
        );

      await sendCook(cauldron, cookData, value, notificationId);
    },

    async cookBorrow(
      { amount, updatePrice },
      isApprowed,
      cauldronObject,
      notificationId
    ) {
      const { address } = cauldronObject.config.mimInfo;
      const { whitelistedInfo } = cauldronObject.additionalInfo;
      const { cauldron } = cauldronObject.contracts;

      const useDegenBoxHelper =
        cauldronObject.config.cauldronSettings.useDegenBoxHelper;

      const mim = address;
      const userAddr = this.account;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await checkAndSetMcApprove(
        cookData,
        cauldronObject,
        isApprowed
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (checkWhitelistLogic(cauldronObject)) {
        cookData = await recipeSetMaxBorrow(
          cookData,
          whitelistedInfo,
          userAddr
        );
      }

      cookData = await recipeBorrow(
        cookData,
        cauldronObject,
        amount,
        userAddr,
        mim
      );

      if (isApprowed && useDegenBoxHelper)
        cookData = await recipeApproveMC(
          cookData,
          cauldronObject,
          false,
          await cauldron.masterContract()
        );

      await sendCook(cauldron, cookData, 0, notificationId);
    },

    async cookAddCollateralAndBorrow(
      { collateralAmount, amount, updatePrice, itsDefaultBalance },
      isApprowed,
      cauldronObject,
      notificationId,
      isLpLogic = false,
      isWrap = false
    ) {
      const { address } = cauldronObject.config.collateralInfo;
      const { address: mimAddress } = cauldronObject.config.mimInfo;
      const { cauldron } = cauldronObject.contracts;

      const tokenAddr = itsDefaultBalance ? this.defaultTokenAddress : address;

      const useDegenBoxHelper =
        cauldronObject.config.cauldronSettings.useDegenBoxHelper;

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

      cookData = await checkAndSetMcApprove(
        cookData,
        cauldronObject,
        isApprowed
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      cookData = await recipeBorrow(
        cookData,
        cauldronObject,
        amount,
        userAddr,
        pairToken
      );

      cookData = await recipeAddCollatral(
        cookData,
        cauldronObject,
        tokenAddr,
        isLpLogic && isWrap,
        userAddr,
        collateralAmount,
        collateralValue
      );

      if (isApprowed && useDegenBoxHelper)
        cookData = await recipeApproveMC(
          cookData,
          cauldronObject,
          false,
          await cauldron.masterContract()
        );

      await sendCook(cauldron, cookData, collateralValue, notificationId);
    },

    async cookRemoveCollateral(
      { amount, updatePrice },
      isApprowed,
      cauldronObject,
      notificationId
    ) {
      const { cauldron } = cauldronObject.contracts;
      const tokenAddr = cauldronObject.config.collateralInfo.address;
      const userAddr = this.account;

      const useDegenBoxHelper =
        cauldronObject.config.cauldronSettings.useDegenBoxHelper;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await checkAndSetMcApprove(
        cookData,
        cauldronObject,
        isApprowed
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      cookData = await recipeRemoveCollateral(
        cookData,
        cauldronObject,
        amount,
        userAddr,
        tokenAddr
      );

      if (isApprowed && useDegenBoxHelper)
        cookData = await recipeApproveMC(
          cookData,
          cauldronObject,
          false,
          await cauldron.masterContract()
        );

      await sendCook(cauldron, cookData, 0, notificationId);
    },

    async cookRepay(
      { amount, updatePrice, itsMax },
      isApprowed,
      cauldronObject,
      notificationId
    ) {
      const { cauldron } = cauldronObject.contracts;

      const useDegenBoxHelper =
        cauldronObject.config.cauldronSettings.useDegenBoxHelper;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await checkAndSetMcApprove(
        cookData,
        cauldronObject,
        isApprowed
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      cookData = await recipeRepay(
        cookData,
        cauldronObject,
        itsMax,
        amount
      );

      if (isApprowed && useDegenBoxHelper)
        cookData = await recipeApproveMC(
          cookData,
          cauldronObject,
          false,
          await cauldron.masterContract()
        );

      await sendCook(cauldron, cookData, 0, notificationId);
    },

    async cookRemoveCollateralAndRepay(
      { amount, collateralAmount, updatePrice, itsMax },
      isApprowed,
      cauldronObject,
      notificationId
    ) {
      const { cauldron } = cauldronObject.contracts;
      const tokenAddr = cauldronObject.config.collateralInfo.address;
      const userAddr = this.account;

      const useDegenBoxHelper =
        cauldronObject.config.cauldronSettings.useDegenBoxHelper;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await checkAndSetMcApprove(
        cookData,
        cauldronObject,
        isApprowed
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      cookData = await recipeRepay(
        cookData,
        cauldronObject,
        itsMax,
        collateralAmount // mim part
      );

      cookData = await recipeRemoveCollateral(
        cookData,
        cauldronObject,
        amount, // collateral share
        userAddr,
        tokenAddr
      );

      if (isApprowed && useDegenBoxHelper)
        cookData = await recipeApproveMC(
          cookData,
          cauldronObject,
          false,
          await cauldron.masterContract()
        );

      await sendCook(cauldron, cookData, 0, notificationId);
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
      cauldronObject,
      notificationId,
      isWrap
    ) {
      const { whitelistedInfo } = cauldronObject.additionalInfo;
      const { collateral, leverageSwapper } = cauldronObject.contracts;
      const { is0xSwap } = cauldronObject.config.cauldronSettings;
      const { cauldron } = cauldronObject.contracts;
      const userAddr = this.account;
      const collateralValue = itsDefaultBalance
        ? collateralAmount.toString()
        : 0;

      const useDegenBoxHelper =
        cauldronObject.config.cauldronSettings.useDegenBoxHelper;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await checkAndSetMcApprove(
        cookData,
        cauldronObject,
        isApprowed
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (checkWhitelistLogic(cauldronObject)) {
        cookData = await recipeSetMaxBorrow(
          cookData,
          whitelistedInfo,
          userAddr
        );
      }

      cookData = await recipeAddCollatral(
        cookData,
        cauldronObject,
        collateral.address,
        isWrap,
        this.account,
        collateralAmount,
        collateralValue
      );

      cookData = await actions.borrow(
        cookData,
        amount,
        leverageSwapper.address
      );

      cookData = await recipeLeverage(
        cookData,
        cauldronObject,
        amount,
        minExpected,
        slipage,
        is0xSwap
      );

      cookData = await actions.addCollateral(
        cookData,
        "-2",
        this.account,
        false
      );

      if (isApprowed && useDegenBoxHelper)
        cookData = await recipeApproveMC(
          cookData,
          cauldronObject,
          false,
          await cauldron.masterContract()
        );

      await sendCook(cauldron, cookData, collateralValue, notificationId);
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
      cauldronObject,
      account,
      notificationId
    ) {
      const { collateral, liquidationSwapper, cauldron } =
        cauldronObject.contracts;
      const { userBorrowPart } = cauldronObject.userPosition.borrowInfo;
      const { is0xSwap } = cauldronObject.config.cauldronSettings;
      const collateralTokenAddr = collateral.address;
      const reverseSwapperAddr = liquidationSwapper.address;
      const userAddr = account;

      const useDegenBoxHelper =
        cauldronObject.config.cauldronSettings.useDegenBoxHelper;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await checkAndSetMcApprove(
        cookData,
        cauldronObject,
        isApprowed
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      cookData = await actions.removeCollateral(
        cookData,
        collateralAmount,
        reverseSwapperAddr
      );

      cookData = await recipeDeleverage(
        cookData,
        cauldronObject,
        collateralAmount,
        borrowAmount,
        slipage,
        is0xSwap
      );

      if (itsMax) {
        cookData = await repayEncodeHandler(
          cookData,
          cauldronObject, // TODO
          userBorrowPart,
          userAddr
        );
      } else {
        cookData = await actions.getRepayPart(cookData, "-2");
        cookData = await repayEncodeHandler(
          cookData,
          cauldronObject,
          "-1",
          userAddr,
          false,
          true
        );
      }

      if (+removeCollateralAmount > 0) {
        cookData = await recipeRemoveCollateral(
          cookData,
          cauldronObject,
          removeCollateralAmount,
          userAddr,
          collateralTokenAddr
        );
      }

      if (isApprowed && useDegenBoxHelper)
        cookData = await recipeApproveMC(
          cookData,
          cauldronObject,
          false,
          await cauldron.masterContract()
        );

      await this.sendCook(cauldron, cookData, 0, notificationId);
    },
  },
};
