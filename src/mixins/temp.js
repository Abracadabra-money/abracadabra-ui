import cookMixin from "@/mixins/borrow/cooksV2.js";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getCookTypeByAction } from "@/helpers/cauldron/getCookActionType";
import { validateCookByAction } from "@/helpers/cauldron/validators";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification";
import { approveToken } from "@/helpers/approval";
import { WARNING_TYPES } from "@/helpers/cauldron/validators";
import { getCookPayload } from "@/helpers/cauldron/getCookPayload";
import { ACTION_TYPES } from "@/helpers/cauldron/getCookActionType";
import { switchNetwork } from "@/helpers/chains/switchNetwork";

import cooks from "@/helpers/cauldron/cook/cooks";

const approvalWarnings = [
  WARNING_TYPES.DEPOSIT_ALLOWANCE,
  WARNING_TYPES.REPAY_ALLOWANCE,
];

//GM imports
import { saveOrder } from "@/helpers/gm/orders";
import { ZERO_ADDRESS } from "@/constants/gm";

// NOTICE: Temporary mixin, need to change to helpers after cooks refactoring
export default {
  emits: ["updateMarket", "clearData"],
  mixins: [cookMixin],
  data() {
    return {
      // GM variables
      isOpenGMPopup: false,
      activeOrder: null,
      gmDelevSuccessPayload: null,
    };
  },
  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      provider: "getProvider",
      signer: "getSigner",
      getChainById: "getChainById",
    }),
    cookValidationData() {
      return validateCookByAction(
        this.cauldron,
        this.actionConfig,
        this.action,
        this.chainId,
        this.account
      );
    },
    useNoDeleverageConfirmationPopup() {
      const validTexts = ["Borrow", "Leverage Up", "Add collateral and borrow"];
      const isProperAction = validTexts.includes(
        this.cookValidationData.btnText
      );
      return (
        this.cauldron?.config.cauldronSettings.isNoDeleverage &&
        !this.isDeleverageInfoPopupOpened &&
        isProperAction
      );
    },
  },
  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({
      deleteNotification: "notifications/delete",
      deleteAllNotification: "notifications/deleteAll",
    }),
    successNotification(notificationId) {
      this.deleteNotification(notificationId);
      this.createNotification(notification.success);
    },
    async actionHandler() {
      const isApprove =
        approvalWarnings.indexOf(this.cookValidationData.errorType) !== -1;

      if (isApprove) return await this.approveTokenHandler();

      const isSwitchChain =
        this.cookValidationData.errorType === WARNING_TYPES.SWITCH_CHAIN;

      if (isSwitchChain) return switchNetwork(this.cauldron.config.chainId);

      const isConnect =
        this.cookValidationData.errorType === WARNING_TYPES.CONNECTION;

      // @ts-ignore
      if (isConnect) return this.$openWeb3modal();

      if (this.useNoDeleverageConfirmationPopup) {
        this.isDeleverageInfoPopupOpened = true;
        return;
      }

      this.isDeleverageInfoPopupOpened = false;
      return await this.cookHandler();
    },
    async approveTokenHandler() {
      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const { useUnwrapToken } = this.actionConfig;

      const { unwrappedToken, collateral, bentoBox, mim } =
        this.cauldron.contracts;

      const depositContract = useUnwrapToken ? unwrappedToken : collateral;

      const contract = this.action === "borrow" ? depositContract : mim;

      const approve = await approveToken(contract, bentoBox.address);

      if (approve) this.$emit("updateMarket"); //await this.createCauldronInfo();
      this.deleteNotification(notificationId);

      if (!approve) await this.createNotification(notification.approveError);
    },
    async cookHandler() {
      const notificationId = await this.createNotification(
        notification.pending
      );

      try {
        const cookActionType = getCookTypeByAction(
          this.actionConfig,
          this.action
        );

        const cookPayload = await getCookPayload(
          this.account,
          this.cauldron,
          this.actionConfig,
          this.action
        );

        // GM CATCH
        const isGM = this.cauldron.config.cauldronSettings.isGMXMarket;
        if (cookActionType === ACTION_TYPES.ACTION_LEVERAGE && isGM) {
          await this.gmLeverageHandler(...cookPayload);
          this.successNotification(notificationId);
          return;
        }

        if (cookActionType === ACTION_TYPES.ACTION_DELEVERAGE && isGM) {
          await this.gmDeleverageHandler(...cookPayload, notificationId);
          this.successNotification(notificationId);
          return;
        }

        switch (cookActionType) {
          case ACTION_TYPES.ACTION_DEPOSIT:
            await cooks.cookAddCollateral(...cookPayload);
            break;
          case ACTION_TYPES.ACTION_BORROW:
            await cooks.cookBorrow(...cookPayload);
            break;
          case ACTION_TYPES.ACTION_DEPOSIT_AND_BORROW:
            await cooks.cookAddCollateralAndBorrow(...cookPayload);
            break;
          case ACTION_TYPES.ACTION_REPAY:
            await cooks.cookRepay(...cookPayload);
            break;
          case ACTION_TYPES.ACTION_REMOVE_COLLATERAL:
            await cooks.cookRemoveCollateral(...cookPayload);
            break;
          case ACTION_TYPES.ACTION_REPAY_AND_REMOVE_COLLATERAL:
            await cooks.cookRemoveCollateralAndRepay(...cookPayload);
            break;
          case ACTION_TYPES.ACTION_LEVERAGE:
            await cooks.cookLeverage(...cookPayload);
            break;
          case ACTION_TYPES.ACTION_DELEVERAGE:
            await cooks.cookDeleverage(...cookPayload);
            break;
        }

        // Notice: no await
        this.$emit("updateMarket");
        this.$emit("clearData");
        this.successNotification(notificationId);
      } catch (error) {
        console.log("cook error", error);
        const errorNotification = {
          msg: notificationErrorMsg(error),
          type: "error",
        };
        this.deleteNotification(notificationId);
        this.createNotification(errorNotification);
      }
    },

    //GM methods
    async gmLeverageHandler(cookPayload, cauldronObject) {
      const { cauldron } = cauldronObject.contracts;
      const cauldronActiveOrder = await cauldron.orders(this.account);

      if (cauldronActiveOrder !== ZERO_ADDRESS) {
        this.deleteAllNotification();
        throw new Error("GM Order exist");
      }

      // leverage & create order
      await cooks.gmCooks.cookLeverage(cookPayload, cauldronObject);

      const order = await cauldron.orders(this.account);

      const itsZero = order === ZERO_ADDRESS;

      // instant success
      if (itsZero) {
        // Notice: no await
        this.$emit("updateMarket");
        return;
      }

      this.activeOrder = order;
      this.isOpenGMPopup = true;
      this.$emit("clearData");
    },
    async gmDeleverageHandler(cookPayload, cauldronObject, notificationId) {
      const { cauldron } = cauldronObject.contracts;
      const cauldronActiveOrder = await cauldron.orders(cookPayload.to);

      if (cauldronActiveOrder !== ZERO_ADDRESS) {
        this.deleteAllNotification();
        this.createNotification(notification.gmOrderExist);
        return false;
      }

      // withdraw collateral & create order
      await cooks.gmCooks.cookWitdrawToOrderGM(cookPayload, cauldronObject);

      this.$emit("clearData");

      const order = await cauldron.orders(cookPayload.to);

      const itsZero = order === ZERO_ADDRESS;

      this.deleteNotification(notificationId);

      if (itsZero) {
        await this.createNotification(notification.gmDeleverageFailedOrder);
        return false; // order instantly failed
      }

      this.gmDelevSuccessPayload = cookPayload;
      this.activeOrder = order;
      this.isOpenGMPopup = true;
    },
    async gmRecoverLeverageOrder(order) {
      const notificationId = await this.createNotification(
        notification.pending
      );

      try {
        await cooks.gmCooks.cookRecoverFaliedLeverage(
          { order, to: this.account },
          this.cauldron
        );

        const { cauldron } = this.cauldron.contracts;
        const newOrder = await cauldron.orders(this.account);

        const itsZero = order === ZERO_ADDRESS;
        // instant success
        if (itsZero) {
          this.deleteNotification(notificationId);
          await this.successGmLeverageCallback(order);
          return false;
        }

        this.successNotification(notificationId);
        this.activeOrder = newOrder;
      } catch (error) {
        const errorType = String(error).indexOf("GM Capcity")
          ? "warning"
          : "error";

        const errorNotification = {
          msg: notificationErrorMsg(error),
          type: errorType,
        };

        this.deleteNotification(notificationId);
        this.createNotification(errorNotification);
      }
    },
    async gmDeleverageFromOrder(order, successPayload) {
      const notificationId = await this.createNotification(
        notification.gmDeleverageFromOrder
      );

      try {
        await cooks.gmCooks.cookDeleverageFromOrder(
          successPayload,
          this.cauldron
        );

        // save as success
        saveOrder(order, this.account);

        // Notice: no await
        this.$emit("updateMarket");
        this.$emit("clearData");

        this.isOpenGMPopup = false;
        this.activeOrder = null;

        this.successNotification(notificationId);
      } catch (error) {
        console.log("gmDeleverageFromOrder err:", error);

        this.deleteNotification(notificationId);
        this.createNotification(notification.error);
      }
    },
    async successGmLeverageCallback(order) {
      // save as success
      if (order) saveOrder(order, this.account);

      setTimeout(() => {
        // Notice: no await
        this.$emit("updateMarket");
      }, 1000);

      this.isOpenGMPopup = false;
      this.activeOrder = null;
      this.createNotification(notification.gmLeverageOrderSuccess);
    },
    async closeGMPopup() {
      this.isOpenGMPopup = false;
      this.activeOrder = null;
      // Notice: no await
      this.$emit("updateMarket");
    },
    async gmUnfinishedLeverage(order) {
      const notificationId = await this.createNotification(
        notification.pending
      );

      try {
        await cooks.gmCooks.cookUnfinishedLeverage(
          order,
          this.account,
          this.cauldron
        );

        this.$emit("updateMarket");
        this.successNotification(notificationId);
      } catch (error) {
        const errorNotification = {
          msg: notificationErrorMsg(error),
          type: "error",
        };

        this.deleteNotification(notificationId);
        this.createNotification(errorNotification);
      }
    },
  },
};
