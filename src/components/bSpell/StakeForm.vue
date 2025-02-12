<template>
  <div class="stake-form" v-if="bSpellInfo">
    <div class="inputs-wrap">
      <BaseTokenInput
        :value="inputValue"
        :icon="bSpellInfo.bSpell?.icon"
        :name="bSpellInfo.bSpell?.name"
        :max="bSpellInfo.bSpell?.balance"
        :tokenPrice="bSpellInfo.bSpell?.price"
        @updateInputValue="updateMainValue"
      />
    </div>

    <div class="lock-info">
      <img src="@/assets/images/stake/lock.svg" alt="Lock icon" />

      <span>Unstaking is locked for 7 days after staking</span>
    </div>

    <AprInfoBlock :aprInfo="aprInfo" />

    <BaseButton primary :disabled="isActionDisabled" @click="actionHandler">
      {{ actionButtonText }}
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import type { PropType } from "vue";
import { defineAsyncComponent } from "vue";
import { approveTokenViem } from "@/helpers/approval";
import { stake } from "@/helpers/bSpell/actions/stake";
import { mapActions, mapGetters, mapMutations } from "vuex";
import ErrorHandler from "@/helpers/errorHandler/ErrorHandler";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import notification from "@/helpers/notification/notification";
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
      return this.chainId === this.selectedNetwork;
    },

    isInsufficientBalance() {
      return this.inputAmount > (this.bSpellInfo?.bSpell?.balance || 0n);
    },

    isActionDisabled() {
      if (!this.bSpellInfo) return true;
      if (!this.bSpellInfo.stakeInfo) return true;
      if (!this.account) return false;
      if (!this.isUnsupportedChain) return false;
      if (!this.inputAmount) return true;
      return this.isInsufficientBalance;
    },

    isTokenApproved() {
      if (!this.inputAmount) return true;
      if (!this.account) return true;
      if (!this.isUnsupportedChain) return true;
      if (!this.bSpellInfo?.stakeInfo) return true;

      return this.bSpellInfo.stakeInfo?.approvedAmount >= this.inputAmount;
    },

    actionButtonText() {
      if (!this.account && this.isUnsupportedChain) return "Connect wallet";
      if (!this.isUnsupportedChain) return "Switch Network";
      if (this.isInsufficientBalance) return "Insufficient balance";
      if (!this.isTokenApproved) return "Approve";
      return "Stake";
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

    async approveTokenHandler() {
      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveTokenViem(
        this.bSpellInfo!.bSpell.contract,
        this.bSpellInfo!.stakeInfo!.contract.address,
        this.inputAmount
      );

      if (approve) this.$emit("updateBSpellInfo");
      this.deleteNotification(notificationId);

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
        switchNetwork(this.selectedNetwork);
        return false;
      }

      if (!this.isTokenApproved) return await this.approveTokenHandler();
      this.stakeHandler();
    },

    async stakeHandler() {
      try {
        const notificationId = await this.createNotification(
          notification.pending
        );

        await stake(this.bSpellInfo!.stakeInfo!.contract, this.inputAmount);
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
    AprInfoBlock: defineAsyncComponent(
      () => import("@/components/bSpell/AprInfoBlock.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.stake-form {
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
  .stake-form {
    gap: 16px;
  }

  .lock-info {
    font-size: 14px;
  }
}
</style>
