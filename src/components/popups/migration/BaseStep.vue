<template>
  <h3 class="title">Migrate your MagicLP (MLP)</h3>

  <p class="subtitle">
    As a Founder, you're eligible to migrate your MLP from Blast to Arbitrum
  </p>

  <div class="popup-content">
    <img
      class="migration-icon"
      src="@/assets/images/blastLpMigration/migration-icon.png"
      alt=""
    />

    <div class="mlp-info">
      <p class="mlp-title">MLP available for migration</p>
      <div class="mlp-balance">
        <img
          class="mlp-icon"
          src="@/assets/images/tokens/MIM-USDB.png"
          alt=""
        />
        {{ formatTokenBalance(parseAvailableAmount) }}
      </div>
      <div class="mlp-balance-usd">{{ availableAmountUsd }}</div>
    </div>
  </div>

  <div class="btn-wrap">
    <BaseButton @click="actionHandler" primary>{{ buttonText }}</BaseButton>

    <p class="label">
      This process may require multiple transactions. Ensure you have enough ETH
      for gas fees on both networks.
    </p>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { mapGetters } from "vuex";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { BLAST_CHAIN_ID } from "@/constants/global";

export default {
  emits: ["changeSteap"],

  props: {
    availableAmount: {
      required: true,
      default: 0n,
    },
    poolInfo: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    parseAvailableAmount() {
      return formatUnits(this.availableAmount, this.poolInfo.decimals || 18);
    },

    availableAmountUsd() {
      if (!this.poolInfo) return 0;
      return formatUSD(Number(this.parseAvailableAmount) * this.poolInfo.price);
    },

    isProperNetwork() {
      return this.chainId === BLAST_CHAIN_ID;
    },

    buttonText() {
      if (!this.isProperNetwork) return "Switch to Blast";
      return "Proceed with Migration";
    },
  },

  methods: {
    formatTokenBalance,

    actionHandler() {
      if (this.chainId !== BLAST_CHAIN_ID) return switchNetwork(BLAST_CHAIN_ID);
      this.$emit("changeSteap", 2);
    },
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 24px;
  font-weight: 500;
  line-height: normal;
}

.popup-content {
  width: 100%;
  gap: 24px;
  display: flex;
  flex-direction: column;
}

.migration-icon {
  max-width: 360px;
  margin: 0 auto;
}

.mlp-info {
  gap: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mlp-title {
  font-weight: 500;
  line-height: normal;
}

.mlp-balance {
  font-size: 31px;
  font-weight: 500;
  line-height: normal;
  gap: 6px;
  display: flex;
  align-items: center;
}

.mlp-icon {
  width: 28px;
  height: 28px;
}

.mlp-balance-usd {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
}

.btn-wrap {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.label {
  text-align: center;
  font-size: 12px;
  line-height: normal;
}

@media screen and (max-width: 600px) {
  .title {
    font-size: 18px;
  }

  .migration-icon {
    max-width: 280px;
  }

  .subtitle {
    font-size: 14px;
  }

  .popup-content {
    width: 100%;
  }

  .mlp-info {
    flex-direction: column;
  }

  .mlp-balance {
    gap: 4px;
  }
}
</style>
