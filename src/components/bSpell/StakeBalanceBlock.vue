<template>
  <div class="stake-balance-block">
    <h3 class="title">Your Staked Balance</h3>
    <div class="stake-balance">
      <img
        class="stake-token-icon"
        src="@/assets/images/tokens/bSPELL.png"
        alt="Stake Token Icon"
      />
      <span class="stake-balance-amount">{{ stakedBalance }}</span>
    </div>
    <div class="stake-balance-usd">{{ stakedBalanceUsd }}</div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import type { PropType } from "vue";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";

export default {
  props: {
    balance: {
      type: Object as PropType<bigint>,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    decimals: {
      type: Number,
      required: true,
    },
  },

  computed: {
    stakedBalance() {
      return formatTokenBalance(formatUnits(this.balance, this.decimals));
    },

    stakedBalanceUsd() {
      return formatUSD(
        Number(formatUnits(this.balance, this.decimals)) * this.price
      );
    },
  },
};
</script>

<style scoped>
.stake-balance-block {
  padding: 40px 32px;
  max-width: 284px;
  width: 100%;
  text-align: center;
  border-radius: 16px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.24) 0%,
    rgba(116, 92, 210, 0.24) 100%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  background: url("@/assets/images/bSpell/stake-balance-bg.png");
  background-size: cover;
}

.title {
  font-weight: 500;
  line-height: normal;
}

.stake-balance {
  gap: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stake-token-icon {
  width: 32px;
  height: 32px;
}

.stake-balance-amount {
  font-size: 24px;
  font-weight: 500;
  line-height: normal;
}

.stake-balance-usd {
  color: #a7a7a7;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
}

@media screen and (max-width: 1024px) {
  .stake-balance-block {
    padding: 12px;
    max-width: 100%;
  }

  .title {
    font-size: 14px;
  }

  .stake-token-icon {
    width: 24px;
    height: 24px;
  }

  .stake-balance-amount {
    font-size: 20px;
  }
}
</style>
