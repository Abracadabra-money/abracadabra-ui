<template>
  <div class="token-rewards-wrap" v-if="tokenRewards">
    <h4 class="title">Earned</h4>

    <ul class="rewards-list">
      <li class="list-item">
        <span class="item-title">
          <img :src="tokenRewards.icon" class="reward-icon" />
          {{ tokenRewards.name }}
        </span>

        <div class="values-wrap">
          <p class="item-value">{{ tokenRewards.value }}</p>
          <p class="usd-value" v-if="price">{{ tokenRewards.usd }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { useImage } from "@/helpers/useImage";
import { formatUnits } from "viem";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";
import { getCoinsPrices } from "@/helpers/prices/defiLlama/index.ts";

export default {
  name: "RewardsWrap",
  props: {
    pool: { type: Object, required: true },
  },
  data() {
    return {
      rewards: {
        2222: {
          1: {
            icon: useImage("assets/images/networks/kava.png"),
            name: "wKAVA",
            address: "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b",
          },
        },
        42161: {
          1: {
            icon: useImage("assets/images/tokens/SPELL.png"),
            name: "SPELL",
            address: "0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF",
          },
        },
      },
      price: null,
    };
  },
  computed: {
    isPoolHasReward() {
      return (
        this.rewards[this.pool.chainId] &&
        this.rewards[this.pool.chainId][this.pool.id]
      );
    },
    reward() {
      if (!this.isPoolHasReward) return;
      return this.rewards[this.pool.chainId][this.pool.id];
    },

    tokenRewards() {
      if (!this.isPoolHasReward) return false;

      const value = this.formatTokenBalance(this.pool.stakeInfo.earned, 18); // TODO: notice decimals

      return {
        name: this.reward.name,
        icon: this.reward.icon,
        value,
        usd: formatUSD(value),
      };
    },
  },
  methods: {
    formatTokenBalance(value, decimals) {
      return formatTokenBalance(formatUnits(value, decimals));
    },
    async fetchRewardPrice() {
      if (!this.reward) return false;

      const prices = await getCoinsPrices(this.pool.chainId, [
        this.reward.address,
      ]);

      const rewardPrice = prices.find(
        (price) => price.address === this.reward.address
      );

      if (rewardPrice) this.price = rewardPrice.price;
    },
  },
  created() {
    this.fetchRewardPrice();
  },
};
</script>

<style scoped lang="scss">
.token-rewards-wrap {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.rewards-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
  list-style: none;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-title {
  display: flex;
  align-items: center;
  gap: 4px;
}

.reward-icon {
  width: 24px;
}

.values-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .item-value {
    font-size: 16px;
    font-weight: 400;
    line-height: 1.2;
  }

  .usd-value {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;
    line-height: 1;
  }
}
</style>
