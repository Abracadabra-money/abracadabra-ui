<template>
  <div class="claim-block">
    <img
      class="spell-left"
      src="@/assets/images/bSpell/claim-spell-left.png"
      alt="Spell icon"
    />

    <div class="claim-wrap">
      <h3 class="claim-title">Spell to Claim</h3>
      <div class="action-wrap">
        <div class="claim-info">
          <img
            class="claim-token-icon"
            src="@/assets/images/tokens/SPELL.png"
            alt=""
          />
          <div class="claim-amounts">
            <span class="claim-amount">{{
              formatTokenBalance(claimAmount)
            }}</span>
            <span class="claim-amount-usd">{{ claimAmountUsd }}</span>
          </div>
        </div>

        <BaseButton primary :disabled="isClaimDisabled" @click="claimHandler">
          {{ claimButtonText }}
        </BaseButton>
      </div>
    </div>

    <img
      class="spell-right"
      src="@/assets/images/bSpell/claim-spell-right.png"
      alt="Spell icon"
    />
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { claim } from "@/helpers/bSpell/actions/claim";
import type { LockerInfo } from "@/helpers/bSpell/types";
import { mapActions, mapGetters, mapMutations } from "vuex";
import notification from "@/helpers/notification/notification";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";

export default {
  emits: ["updateBSpellInfo"],

  props: {
    lockerInfo: {
      type: Object as () => LockerInfo,
      required: true,
    },

    selectedChain: {
      type: Number,
      required: true,
    },
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),

    isUnsupportedChain() {
      return this.chainId === this.selectedChain;
    },

    claimButtonText() {
      if (!this.account) return "Connect Wallet";
      if (!this.isUnsupportedChain) return "Switch Network";
      return "Claim";
    },

    claimAmount() {
      const { decimals } = this.lockerInfo.spell;
      return formatUnits(
        this.lockerInfo?.lockInfo?.claimAmount || 0n,
        decimals
      );
    },

    claimAmountUsd() {
      return formatUSD(Number(this.claimAmount) * this.lockerInfo.spell.price);
    },

    isClaimDisabled() {
      return !Number(this.claimAmount) && this.account;
    },
  },

  methods: {
    formatTokenBalance,
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({
      deleteNotification: "notifications/delete",
    }),

    async claimHandler() {
      if (!this.account && this.isUnsupportedChain) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      if (!this.isUnsupportedChain) {
        switchNetwork(this.selectedChain);
        return false;
      }

      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error } = await claim(this.lockerInfo.tokenBank);

      if (error) {
        await this.deleteNotification(notificationId);
        await this.createNotification(error);
      } else {
        this.$emit("updateBSpellInfo");
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      }
    },
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style scoped>
.claim-block {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 108px;
  border-radius: 16px;
  border: 1px #2d4a96;
  background: linear-gradient(
      90deg,
      rgba(45, 74, 150, 0.32) 0%,
      rgba(116, 92, 210, 0.32) 100%
    ),
    linear-gradient(
      146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%
    );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.spell-left,
.spell-right {
  max-width: 200px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.spell-right {
  left: initial;
  right: 0;
}

.claim-wrap {
  z-index: 1;
}

.claim-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
  text-align: center;
}

.action-wrap,
.claim-info {
  gap: 14px;
  display: flex;
  align-items: center;
}

.claim-info {
  gap: 8px;
}

.claim-token-icon {
  width: 40px;
  height: 40px;
}

.claim-amounts {
  display: flex;
  flex-direction: column;
  min-width: 40px;
}

.claim-amount {
  font-size: 24px;
  font-weight: 500;
}

.claim-amount-usd {
  color: #878b93;
  font-size: 16px;
  font-weight: 500;
}
</style>
