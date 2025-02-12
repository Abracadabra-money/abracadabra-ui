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
      <img src="@/assets/images/stake/lock.svg" alt="Lock icon" />

      <span>Unstaking is locked for 7 days after staking </span>
    </div>

    <AprInfoBlock :aprInfo="aprInfo" />

    <BaseButton
      primary
      :disabled="isActionDisabled"
      :endDateTimestamp="bSpellInfo.stakeInfo?.unlockTime"
      @click="actionHandler"
    >
      {{ actionButtonText }}
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import type { PropType } from "vue";
import { defineAsyncComponent } from "vue";
import { unStake } from "@/helpers/bSpell/actions/unStake";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import notification from "@/helpers/notification/notification";
import ErrorHandler from "@/helpers/errorHandler/ErrorHandler";
import type { AprInfo, BSpellInfo } from "@/helpers/bSpell/types";

export default {
  emits: ["updateBSpellInfo"],

  props: {
    aprInfo: {
      type: Object as PropType<AprInfo | null>,
      required: true,
    },

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
      console.log("bSpellInfo", this.bSpellInfo);

      return this.chainId === this.selectedNetwork;
    },

    isInsufficientBalance() {
      return (
        this.inputAmount > (this.bSpellInfo?.stakeInfo?.stakeBalance ?? 0n)
      );
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
    AprInfoBlock: defineAsyncComponent(
      () => import("@/components/bSpell/AprInfoBlock.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
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

@media screen and (max-width: 600px) {
  .unstake-form {
    gap: 16px;
  }

  .lock-info {
    font-size: 14px;
  }
}
</style>
