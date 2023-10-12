<template>
  <div class="popup" v-if="stakeInfo">
    <div class="popup-header">
      <h3 class="popup-title">{{ action }}</h3>
      <img
        class="popup-btn-close"
        src="@/assets/images/close.svg"
        @click="closePopup"
        alt="Close button"
      />
    </div>

    <div>
      <InputLabel :amount="formatAmount(fromToken.balance)" />
      <BaseTokenInput
        :icon="fromToken.icon"
        :name="fromTokenName"
        :max="formatAmount(fromToken.balance)"
        :value="inputValue"
        :error="errorMainValue"
        @updateValue="updateMainValue"
      />
    </div>

    <SwapButton @click="toggleAction" />

    <div>
      <InputLabel :amount="formatAmount(toToken.balance)" />
      <BaseTokenInput
        :value="expectedAmount"
        :icon="toToken.icon"
        :name="toTokenName"
        :disabled="true"
      />
    </div>

    <BaseButton primary :disabled="isActionDisabled" @click="actionHandler">{{
      actionBtnText
    }}</BaseButton>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
import { parseUnits, formatUnits } from "viem";
import actions from "@/helpers/stake/crv/actions/";
import { approveTokenViem } from "@/helpers/approval"; //todo
import { mapGetters, mapMutations, mapActions } from "vuex";
import notification from "@/helpers/notification/notification.js";
import { getCrvStakeInfo } from "@/helpers/stake/crv/getCrvStakeInfo.ts";
import { getCrv3cryptoStakeInfo } from "@/helpers/stake/crv3crypto/getCrv3cryptoStakeInfo.ts";

export default {
  data() {
    return {
      inputValue: "",
      stakeInfo: null,
      action: "Deposit",
      updateInterval: null,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      popupData: "getPopupData",
    }),

    isWithdraw() {
      return this.action === "Withdraw";
    },

    mainToken() {
      return this.stakeInfo.mainToken;
    },

    stakeToken() {
      return this.stakeInfo.stakeToken;
    },

    fromToken() {
      if (this.isWithdraw) return this.mainToken;
      return this.stakeToken;
    },

    toToken() {
      if (this.isWithdraw) return this.stakeToken;
      return this.mainToken;
    },

    fromTokenName() {
      if (this.isWithdraw && this.popupData?.label)
        return `${this.fromToken.name} ${this.popupData.label}`;
      return this.fromToken.name;
    },

    toTokenName() {
      if (!this.isWithdraw && this.popupData?.label)
        return `${this.toToken.name} ${this.popupData.label}`;
      return this.toToken.name;
    },

    parsedInputValue() {
      return parseUnits(this.inputValue, this.fromToken.decimals);
    },

    precision() {
      return parseUnits("1", this.fromToken.decimals);
    },

    expectedAmount() {
      const { tokensRate } = this.stakeInfo;

      const amount = this.isWithdraw
        ? (this.parsedInputValue * tokensRate) / this.precision
        : (this.parsedInputValue * this.precision) / tokensRate;

      return filters.formatToFixed(this.formatAmount(amount), 6);
    },

    errorMainValue() {
      if (this.parsedInputValue > this.fromToken.balance) {
        return `The value cannot be greater than ${this.formatAmount(
          this.fromToken.balance
        )}`;
      }

      return "";
    },

    isActionDisabled() {
      return !!(!this.inputValue || this.errorMainValue);
    },

    actionBtnText() {
      if (this.isActionDisabled) return "Nothing to do";
      if (!this.isTokenApproved) return "Approve";
      return this.action;
    },

    isTokenApproved() {
      if (this.isWithdraw) return true;
      if (this.errorMainValue) return true;
      return this.stakeToken.approvedAmount >= this.parsedInputValue;
    },

    actionInfo() {
      return this.isWithdraw
        ? { methodName: "withdraw", options: [this.parsedInputValue] }
        : {
            methodName: "deposit",
            options: [this.parsedInputValue, this.account],
          };
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({
      deleteNotification: "notifications/delete",
      updateNotification: "notifications/updateTitle",
      closePopup: "closePopups",
    }),

    formatAmount(value) {
      return formatUnits(value, this.fromToken.decimals);
    },

    toggleAction() {
      this.inputValue = "";
      this.action = this.isWithdraw ? "Deposit" : "Withdraw";
    },

    updateMainValue(value) {
      this.inputValue = value;
    },

    async approveTokenHandler() {
      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveTokenViem(
        this.stakeToken.contract,
        this.mainToken.contract.address
      );

      if (approve) await this.createStakeInfo();
      await this.deleteNotification(notificationId);
      if (!approve) await this.createNotification(notification.approveError);
      return false;
    },

    async actionHandler() {
      if (this.isActionDisabled) return false;
      if (!this.isTokenApproved) return this.approveTokenHandler();

      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error } = await actions[this.actionInfo.methodName](
        this.mainToken.contract,
        ...this.actionInfo.options
      );

      if (error) {
        await this.deleteNotification(notificationId);
        await this.createNotification(error);
      } else {
        await this.createStakeInfo();
        this.inputValue = "";
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      }
    },

    async createStakeInfo() {
      this.stakeInfo = this.popupData?.isThreeCrypto
        ? await getCrv3cryptoStakeInfo(this.chainId, this.account)
        : await getCrvStakeInfo(
            this.chainId,
            this.account,
            this.popupData?.address
          );
    },
  },

  async created() {
    await this.createStakeInfo();

    this.updateInterval = setInterval(async () => {
      await this.createStakeInfo();
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    InputLabel: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputLabel.vue")
    ),
    BaseTokenInput: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenInput.vue")
    ),
    SwapButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/SwapButton.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.popup {
  background: #302e38;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  padding: 15px 25px;
  width: 540px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 40px;
}

.popup-title {
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
}

.popup-btn-close {
  width: 14px;
  height: 14px;
  cursor: pointer;
}

@media (max-width: 600px) {
  .popup {
    max-width: 540px;
    width: 100%;
    padding: 15px 10px;
  }
}
</style>
