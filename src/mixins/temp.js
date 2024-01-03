import cookMixin from "@/mixins/borrow/cooksV2.js";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getCookTypeByAction } from "@/helpers/cauldron/getCookActionType";
import { validateCookByAction } from "@/helpers/cauldron/validators";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification.js";
import { approveToken } from "@/helpers/approval";
import { WARNING_TYPES } from "@/helpers/cauldron/validators";

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
        console.log(this.actionConfig)
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
      const isApprove = approvalWarnings.indexOf(validationErrors[0]) !== -1;

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
        const cookActionType = getCookTypeByAction(this.actionConfig, this.action);



        this.deleteNotification(notificationId);
        this.createNotification(notification.success);
      } catch (error) {
        const errorNotification = {
          msg: notificationErrorMsg(error),
          type: errorType,
        };
        this.deleteNotification(notificationId);
        this.createNotification(errorNotification);
      }
    },
  },
};
