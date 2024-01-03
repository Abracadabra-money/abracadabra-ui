import cookMixin from "@/mixins/borrow/cooksV2.js";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getCookTypeByAction } from "@/helpers/cauldron/getCookActionType";
import { validateCookByAction } from "@/helpers/cauldron/validators";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification.js";
import { approveToken } from "@/helpers/approval";
import { WARNING_TYPES } from "@/helpers/cauldron/validators";
import { getCookPayload } from "@/helpers/cauldron/getCookPayload";
import { ACTION_TYPES } from "@/helpers/cauldron/getCookActionType";

const approvalWarnings = [
  WARNING_TYPES.DEPOSIT_ALLOWANCE,
  WARNING_TYPES.REPAY_ALLOWANCE,
];

export default {
  mixins: [cookMixin],
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
        this.action
      );
    },
  },
  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),
    async actionHandler() {
      const isApprove = approvalWarnings.indexOf(this.cookValidationData.errorType) !== -1;

      return isApprove
        ? await this.approveTokenHandler()
        : await this.cookHandler();
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

      if (approve) await this.createCauldronInfo();
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

        console.log("cookActionType", cookActionType)
        console.log("cookPayload", cookPayload)

        switch (cookActionType) {
          case ACTION_TYPES.ACTION_DEPOSIT:
            await this.cookAddCollateral(...cookPayload);
            break;
          case ACTION_TYPES.ACTION_BORROW:
            await this.cookBorrow(...cookPayload);
            break;
          case ACTION_TYPES.ACTION_DEPOSIT_AND_BORROW:
            await this.cookAddCollateralAndBorrow(...cookPayload);
            break;
          case ACTION_TYPES.ACTION_REPAY:
            await this.cookRepay(...cookPayload);
            break;
          case ACTION_TYPES.ACTION_REMOVE_COLLATERAL:
            await this.cookRemoveCollateral(...cookPayload);
            break;
          case ACTION_TYPES.ACTION_REPAY_AND_REMOVE_COLLATERAL:
            await this.cookRemoveCollateralAndRepay(...cookPayload);
            break;
          case ACTION_TYPES.ACTION_LEVERAGE:
            await this.cookLeverage(...cookPayload);
            break;
          case ACTION_TYPES.ACTION_DELEVERAGE:
            await this.cookDeleverage(...cookPayload);
            break;
        }

        // TODO: cauldron object update
        this.deleteNotification(notificationId);
        this.createNotification(notification.success);
      } catch (error) {
        console.log("cook error", error)
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
