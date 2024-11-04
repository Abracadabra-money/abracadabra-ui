<template>
  <div class="action-form">
    <div class="inputs-wrap">
      <BaseTokenInput
        :value="inputValue"
        :icon="lockerInfo.bSpell?.icon"
        :name="lockerInfo.bSpell?.name"
        :max="lockerInfo.bSpell?.balance"
        :tokenPrice="lockerInfo.bSpell?.price"
        @updateInputValue="updateMainValue"
      />

      <div class="arrow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4.71932 12.9698C4.78898 12.9 4.8717 12.8447 4.96275 12.807C5.05379 12.7692 5.15139 12.7498 5.24995 12.7498C5.34851 12.7498 5.44611 12.7692 5.53716 12.807C5.6282 12.8447 5.71092 12.9 5.78057 12.9698L11.2499 18.4401L11.25 3.75039C11.25 3.55147 11.329 3.36071 11.4696 3.22006C11.6103 3.0794 11.801 3.00039 12 3.00039C12.1989 3.00039 12.3896 3.0794 12.5303 3.22006C12.6709 3.36071 12.75 3.55147 12.75 3.75039L12.7499 18.4401L18.2193 12.9698C18.3601 12.829 18.5509 12.75 18.7499 12.75C18.949 12.75 19.1398 12.829 19.2806 12.9698C19.4213 13.1105 19.5004 13.3014 19.5004 13.5004C19.5004 13.6994 19.4213 13.8903 19.2806 14.031L12.5306 20.781C12.4609 20.8507 12.3782 20.9061 12.2872 20.9438C12.1961 20.9815 12.0985 21.001 11.9999 21.001C11.9014 21.001 11.8038 20.9815 11.7127 20.9438C11.6217 20.9061 11.539 20.8507 11.4693 20.781L4.71932 14.031C4.64959 13.9614 4.59427 13.8786 4.55653 13.7876C4.51879 13.6965 4.49936 13.5989 4.49936 13.5004C4.49936 13.4018 4.51879 13.3042 4.55653 13.2132C4.59427 13.1221 4.64959 13.0394 4.71932 12.9698Z"
            fill="white"
          />
        </svg>
      </div>

      <BaseTokenInput
        :value="inputValue"
        :icon="lockerInfo.spell.icon"
        :name="lockerInfo.spell.name"
        :tokenPrice="lockerInfo.spell.price"
        disabled
      />
    </div>

    <div class="toggle-wraper">
      <Toggle
        text="Instant Redeem"
        :selected="isInstantRedeem"
        @updateToggle="updateToggle"
      />

      <Tooltip :tooltip="'tooltip'" />
    </div>

    <div class="unlock-info" v-if="!isInstantRedeem">
      <img
        class="icon-left"
        src="@/assets/images/bSpell/lock-bg-left.png"
        alt=""
      />

      <div>
        <h3 class="unlock-title">
          Unlocks on <Tooltip :tooltip="'tooltip'" />
        </h3>
        <div class="unlock-timer">{{ unlocksOn }}</div>
      </div>

      <img
        class="icon-right"
        src="@/assets/images/bSpell/lock-bg-right.png"
        alt=""
      />
    </div>

    <div class="instant-redeem-info" v-else>
      <img
        class="redeem-icon-left"
        src="@/assets/images/bSpell/penalty-left-icon.png"
        alt=""
      />

      <div>
        <h3 class="unlock-title">Penalty <Tooltip :tooltip="'tooltip'" /></h3>
        <div class="penalty-amount-wrap">
          <img
            class="token-icon"
            src="@/assets/images/tokens/SPELL.png"
            alt=""
          />
          {{ penaltyAmount }}
        </div>
      </div>

      <img
        class="redeem-icon--right"
        src="@/assets/images/bSpell/penalty-right-icon.png"
        alt=""
      />
    </div>

    <BaseButton primary :disabled="isActionDisabled" @click="actionHandler">
      {{ actionButtonText }}
    </BaseButton>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { formatUnits } from "viem";
import type { PropType } from "vue";
import { defineAsyncComponent } from "vue";
import { approveTokenViem } from "@/helpers/approval";
import { formatTokenBalance } from "@/helpers/filters";
import { redeem } from "@/helpers/bSpell/actions/redeem";
import type { LockerInfo } from "@/helpers/bSpell/types";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { PERCENT_PRESITION } from "@/helpers/cauldron/utils";
import notification from "@/helpers/notification/notification";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { instantRedeem } from "@/helpers/bSpell/actions/instantRedeem";

export default {
  emits: ["updateBSpellInfo"],

  props: {
    lockerInfo: {
      type: Object as PropType<LockerInfo>,
      required: true,
    },

    selectedChain: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      inputValue: "" as string | bigint,
      inputAmount: BigInt(0),
      isInstantRedeem: false,
      deadline: 500n,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),

    isUnsupportedChain() {
      return this.chainId === this.selectedChain;
    },

    isInsufficientBalance() {
      return this.inputAmount > this.lockerInfo.bSpell?.balance;
    },

    isActionDisabled() {
      if (!this.account) return false;
      if (!this.isUnsupportedChain) return false;
      if (!this.inputAmount) return true;
      return this.isInsufficientBalance;
    },

    isTokenApproved() {
      if (!this.inputAmount) return true;
      if (!this.account) return true;
      if (!this.isUnsupportedChain) return true;
      return this.lockerInfo.bSpell?.approvedAmount >= this.inputAmount;
    },

    actionButtonText() {
      if (!this.account && this.isUnsupportedChain) return "Connect wallet";
      if (!this.isUnsupportedChain) return "Switch Network";
      if (this.isInsufficientBalance) return "Insufficient balance";
      if (!this.isTokenApproved) return "Approve";
      if (this.isInstantRedeem) return "Instant Redeem";
      return "Redeem";
    },

    unlocksOn() {
      return moment
        .unix(
          Number(moment().unix()) +
            Number(this.lockerInfo?.lockInfo?.lockDuration || 0)
        )
        .format("DD MMM YYYY");
    },

    penaltyAmount() {
      const penaltyPercent = Number(
        formatUnits(
          this.lockerInfo.lockInfo.instantRedeemParams.immediateBips,
          PERCENT_PRESITION
        )
      );
      const inputAmount = Number(formatUnits(this.inputAmount, 18));
      return formatTokenBalance((inputAmount / 100) * penaltyPercent);
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    updateMainValue(amount: bigint) {
      if (!amount) {
        this.inputValue = "";
        this.inputAmount = BigInt(0);
      } else {
        this.inputAmount = amount;
        this.inputValue = formatUnits(amount, 18);
      }
    },

    updateToggle() {
      this.isInstantRedeem = !this.isInstantRedeem;
    },

    async approveTokenHandler() {
      if (!this.isUnsupportedChain) return false;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveTokenViem(
        this.lockerInfo.bSpell.contract,
        this.lockerInfo.tokenBank.address,
        this.inputAmount
      );

      if (approve) this.$emit("updateBSpellInfo");
      await this.deleteNotification(notificationId);
      if (!approve) await this.createNotification(notification.approveError);
      return false;
    },

    async actionHandler() {
      if (this.isActionDisabled) return false;

      if (!this.account && this.isUnsupportedChain) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      if (!this.isUnsupportedChain) {
        switchNetwork(this.selectedChain);
        return false;
      }

      if (!this.isTokenApproved) return await this.approveTokenHandler();

      switch (this.isInstantRedeem) {
        case true:
          await this.instantRedeemHandler();
          break;
        default:
          await this.redeemHandler();
          break;
      }
    },

    async redeemHandler() {
      const notificationId = await this.createNotification(
        notification.pending
      );

      // @ts-ignore
      const { error } = await redeem(
        this.lockerInfo.tokenBank,
        this.inputAmount,
        this.account,
        this.deadline
      );

      if (error) {
        await this.deleteNotification(notificationId);
        await this.createNotification(error);
      } else {
        this.$emit("updateBSpellInfo");
        this.inputValue = "";
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      }
    },

    async instantRedeemHandler() {
      const notificationId = await this.createNotification(
        notification.pending
      );

      // @ts-ignore
      const { error } = await instantRedeem(
        this.lockerInfo.tokenBank,
        this.inputAmount,
        this.account
      );

      if (error) {
        await this.deleteNotification(notificationId);
        await this.createNotification(error);
      } else {
        this.$emit("updateBSpellInfo");
        this.inputValue = "";
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      }
    },
  },

  components: {
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.action-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.inputs-wrap {
  position: relative;
  gap: 16px;
  display: flex;
  flex-direction: column;
}

.arrow {
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

.toggle-wraper {
  gap: 8px;
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0) 0%,
    rgba(116, 92, 210, 0) 100%
  );
}

.unlock-info,
.instant-redeem-info {
  position: relative;
  overflow: hidden;
  height: 100px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-left,
.redeem-icon-left {
  position: absolute;
  top: 0;
  left: 0;
  max-width: 130px;
}

.icon-right,
.redeem-icon--right {
  position: absolute;
  top: 0;
  right: 0;
  max-width: 130px;
}

.unlock-title {
  gap: 4px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  justify-content: center;
}

.unlock-timer {
  text-align: center;
  font-size: 33px;
  font-weight: 600;
  line-height: 150%;
}

.instant-redeem-info {
  border: 1px solid var(--Additional-Yellow, #fed84f);
  background: linear-gradient(
    90deg,
    rgba(254, 216, 79, 0.24) 0%,
    rgba(178, 127, 0, 0.24) 100%
  );
}

.redeem-icon-left {
  top: 10%;
}

.redeem-icon--right {
  top: 10%;
}

.penalty-amount-wrap {
  gap: 4px;
  display: flex;
  align-items: center;
  font-size: 33px;
  font-weight: 600;
  line-height: 150%;
}

.token-icon {
  width: 38px;
  height: 38px;
}
</style>
