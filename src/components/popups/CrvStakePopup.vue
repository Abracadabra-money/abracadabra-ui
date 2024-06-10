<template>
  <div class="popup" v-if="stakeInfo" v-click-outside="closePopup">
    <div class="popup-header">
      <h3 class="popup-title">{{ activeTab }}</h3>
      <img
        class="popup-btn-close"
        src="@/assets/images/close.svg"
        @click="closePopup"
        alt="Close button"
      />
    </div>

    <div class="tabs-wrap">
      <Tabs
        :name="activeTab"
        :items="tabItems"
        @select="changeTab"
        width="240px"
      />
    </div>

    <div class="inputs-wrap">
      <BaseTokenInput
        :value="inputValue"
        :icon="fromToken.icon"
        :name="fromTokenName"
        :max="fromToken.balance"
        @updateInputValue="updateMainValue"
      />
      <div class="arrow-wrap">
        <ArrowDownIcon />
      </div>
      <BaseTokenInput
        :value="expectedAmount"
        :icon="toToken.icon"
        :name="toTokenName"
        :max="toToken.balance"
        :disabled="true"
      />
    </div>

    <BaseButton primary :disabled="isActionDisabled" @click="actionHandler">{{
      actionButtonText
    }}</BaseButton>
  </div>
</template>

<script lang="ts">
import { formatToFixed } from "@/helpers/filters";
import { defineAsyncComponent } from "vue";
import { parseUnits, formatUnits } from "viem";
import actions from "@/helpers/stake/crv/actions/";
import { approveTokenViem } from "@/helpers/approval";
import { mapGetters, mapMutations, mapActions } from "vuex";
import notification from "@/helpers/notification/notification";
import { getCrvStakeInfo } from "@/helpers/stake/crv/getCrvStakeInfo";
import { getCrv3cryptoStakeInfo } from "@/helpers/stake/crv3crypto/getCrv3cryptoStakeInfo";

export default {
  data() {
    return {
      activeTab: "Deposit" as any,
      tabItems: ["Deposit", "Withdraw"],
      inputAmount: BigInt(0) as bigint,
      inputValue: "" as string | bigint,
      stakeInfo: null as any,
      updateInterval: null as any,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      popupData: "getPopupData",
    }),

    precision(): bigint {
      return parseUnits("1", this.mainToken.decimals);
    },

    isWithdraw() {
      return this.activeTab === "Withdraw";
    },

    isInsufficientBalance() {
      return this.inputAmount > this.fromToken.balance;
    },

    isActionDisabled() {
      if (!this.inputAmount) return true;
      return this.isInsufficientBalance;
    },

    isTokenApproved() {
      if (this.isWithdraw) return true;
      return this.stakeToken.approvedAmount >= this.inputAmount;
    },

    expectedAmount() {
      const amount = this.isWithdraw
        ? (this.inputAmount * this.precision) / this.stakeInfo.tokensRate
        : (this.inputAmount * this.stakeInfo.tokensRate) / this.precision;

      return formatToFixed(formatUnits(amount, this.mainToken.decimals), 6);
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

    mainToken() {
      return this.stakeInfo.mainToken;
    },

    stakeToken() {
      return this.stakeInfo.stakeToken;
    },

    fromToken() {
      return this.isWithdraw ? this.mainToken : this.stakeToken;
    },

    toToken() {
      return this.isWithdraw ? this.stakeToken : this.mainToken;
    },

    actionButtonText() {
      if (!this.isTokenApproved) return "Approve";
      if (this.isInsufficientBalance) return "Insufficient balance";
      if (this.isActionDisabled) return "Nothing to do";
      return this.activeTab;
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({
      deleteNotification: "notifications/delete",
      closePopup: "closePopups",
    }),

    updateMainValue(amount: bigint) {
      if (!amount) {
        this.inputValue = "";
        this.inputAmount = BigInt(0);
      } else {
        this.inputAmount = amount;
        this.inputValue = formatUnits(amount, this.mainToken.decimals);
      }
    },

    changeTab(action: string) {
      this.inputValue = "";
      this.activeTab = action;
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

      const methodName = this.isWithdraw ? "withdraw" : "deposit";

      const { error }: any = await actions[methodName](
        this.mainToken.contract,
        this.inputAmount,
        this.account
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
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    ArrowDownIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/ArrowDownIcon.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.popup {
  width: 533px;
  padding: 32px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  gap: 24px;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
}

.popup-title {
  font-size: 24px;
  font-weight: 500;
  line-height: 150%;
}

.popup-btn-close {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.tabs-wrap {
  max-width: 250px;
}

.inputs-wrap {
  gap: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.arrow-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  border-radius: 16px;
  border: 1px solid #2d4a96;
  background: rgba(25, 31, 47, 0.38);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(67.9000015258789px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-text::first-letter {
  text-transform: uppercase;
}

@media (max-width: 600px) {
  .popup {
    max-width: 540px;
    width: 100%;
    padding: 15px 10px;
  }
}
</style>
