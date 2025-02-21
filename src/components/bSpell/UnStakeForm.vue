<template>
  <div class="unstake-form" v-if="bSpellInfo">
    <div class="inputs-wrap">
      <BaseTokenInput
        :value="inputValue"
        :icon="bSpellInfo.bSpell?.icon"
        :name="bSpellInfo.bSpell?.name"
        :max="bSpellInfo.stakeInfo?.stakeBalance"
        :tokenPrice="bSpellInfo.bSpell?.price"
        @updateInputValue="updateMainValue"
      />
    </div>

    <div class="lock-info">
      <div class="lock-title">
        <img src="@/assets/images/stake/lock.svg" alt="Lock icon" />
        <span class="lock-text">Unlock is</span>
      </div>
      <Timer
        small
        padding="0px 4px"
        :endDateTimestamp="bSpellInfo.stakeInfo?.unlockTime"
      />
    </div>

    <BaseButton primary :disabled="isActionDisabled" @click="actionHandler">
      {{ actionButtonText }}
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import type { PropType } from "vue";
import { defineAsyncComponent } from "vue";
import type { BSpellInfo } from "@/helpers/bSpell/types";
import { unStake } from "@/helpers/bSpell/actions/unStake";
import { mapActions, mapGetters, mapMutations } from "vuex";
import notification from "@/helpers/notification/notification";
import ErrorHandler from "@/helpers/errorHandler/ErrorHandler";
import { switchNetwork } from "@/helpers/connect/switchNetwork";

export default {
  emits: ["updateBSpellInfo"],

  props: {
    selectedNetwork: {
      type: Number,
      required: true,
    },

    bSpellInfo: {
      type: Object as PropType<BSpellInfo | null>,
      required: true,
    },
  },

  data() {
    return {
      inputValue: "" as string | bigint,
      inputAmount: BigInt(0),
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),

    isUnsupportedChain() {
      return this.chainId === this.selectedNetwork;
    },

    isInsufficientBalance() {
      return this.inputAmount > (this.bSpellInfo?.bSpell?.balance ?? 0n);
    },

    isActionDisabled() {
      if (!this.account) return false;
      if (!this.isUnsupportedChain) return false;
      if (!this.inputAmount) return true;
      return this.isInsufficientBalance;
    },

    actionButtonText() {
      if (!this.account && this.isUnsupportedChain) return "Connect wallet";
      if (!this.isUnsupportedChain) return "Switch Network";
      if (this.isInsufficientBalance) return "Insufficient balance";
      return "Unstake";
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

    async actionHandler() {
      if (!this.bSpellInfo) return false;
      if (this.isActionDisabled) return false;
      if (!this.bSpellInfo.stakeInfo) return false;

      if (!this.account && this.isUnsupportedChain) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      if (!this.isUnsupportedChain) return switchNetwork(this.selectedNetwork);
      await this.unstakeHandler();
    },

    async unstakeHandler() {
      try {
        const notificationId = await this.createNotification(
          notification.pending
        );

        await unStake(this.bSpellInfo!.stakeInfo!.contract, this.inputAmount);

        this.$emit("updateBSpellInfo");
        this.inputValue = "";
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      } catch (error) {
        ErrorHandler.handleError(error as Error);
      }
    },
  },

  components: {
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    Timer: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/stake/earnPoints/Timer.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.unstake-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.inputs-wrap {
  position: relative;
  gap: 16px;
  display: flex;
  flex-direction: column;
}

.lock-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  border: 1px solid var(--Primary-Gradient, #2d4a96);
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  padding: 12px;
  gap: 8px;
  display: flex;
  align-items: center;
}

.lock-title {
  gap: 8px;
  display: flex;
  align-items: center;
}

.lock-text {
  min-width: 75px;
}

.reward-info {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.apr-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.row {
  gap: 12px;
  display: flex;
  align-items: center;
}

.reward-icon {
  width: 48px;
  height: 48px;
}

.apr-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
}

.tokens-info-wrap {
  gap: 4px;
  display: flex;
  align-items: center;
}

.tokens-info {
  display: flex;
  align-items: center;
}

.token-icon {
  width: 24px;
  height: 24px;

  &:not(:first-child) {
    margin-left: -4px;
  }
}

.apr-percent {
  color: #fff;
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 23px;
  font-weight: 600;
  line-height: normal;
}

.tokens-apr-info {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.token-apr-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.token-info {
  gap: 12px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
}

.token-apr-icon {
  width: 24px;
  height: 24px;
}

.token-apr-percent {
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
}
</style>
