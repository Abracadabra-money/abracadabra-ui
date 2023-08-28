<template>
  <div class="balance-block">
    <div class="balance-block-header">
      <h3>Your balance</h3>

      <div class="token-rate">
        <img
          class="token-rate-icon"
          :src="mainToken.rateIcon"
          alt="Token icon"
        />
        <span class="token-rate-value">{{ tokensRate }}</span>
      </div>
    </div>

    <div class="tokens-list">
      <div class="token-info">
        <div class="token-icon">
          <BaseTokenIcon :icon="stakeToken.icon" size="60px" />
          <span class="token-icon-name">{{ stakeToken.name }}</span>
        </div>

        <div>
          <p class="token-symbol">{{ stakeToken.name }}</p>
          <p class="token-amount">
            {{ formatTokenBalance(stakeToken.balance) }}
          </p>
          <p class="token-price">
            {{ formatUSD(stakeToken.balanceUsd) }}
          </p>
        </div>
      </div>

      <div class="token-info">
        <div class="token-icon">
          <BaseTokenIcon :icon="mainToken.icon" size="60px" />
          <span class="token-icon-name">{{ mainToken.name }}</span>
        </div>

        <div>
          <p class="token-symbol">{{ mainToken.name }}</p>
          <p class="token-amount">
            {{ formatTokenBalance(mainToken.balance) }}
          </p>
          <p class="token-price">
            {{ formatUSD(mainToken.balanceUsd) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
export default {
  props: {
    mainToken: { type: Object, required: true },
    stakeToken: { type: Object, required: true },
  },

  computed: {
    tokensRate() {
      const rate = filters.formatToFixed(1 * this.mainToken.rate, 4);
      return `1 ${this.mainToken.name} = ${rate} ${this.stakeToken.name}`;
    },
  },

  methods: {
    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },

    formatUSD(value) {
      return filters.formatUSD(value);
    },
  },

  components: { BaseTokenIcon },
};
</script>

<style lang="scss" scoped>
.balance-block {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  padding: 16px;
  background: #2b2b3c;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.05);
  backdrop-filter: blur(50px);
  border-radius: 30px;
}

.balance-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.token-rate {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 14px;
}

.token-rate-icon {
  width: 24px;
  height: 24px;
}

.tokens-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  text-align: left;
}

.token-info {
  display: flex;
  align-items: center;
  line-height: 22px;
  font-size: 18px;
}

.token-icon {
  display: flex;
  align-items: center;
}

.token-icon-name {
  display: none;
}

.token-amount {
  font-weight: 700;
  font-size: 24px;
  line-height: 30px;
}

.token-price {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}

@media screen and (max-width: 1200px) {
  .tokens-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .token-symbol {
    display: none;
  }

  .token-icon-name {
    display: block;
  }

  .token-info {
    justify-content: space-between;
  }
}

@media screen and (max-width: 600px) {
  .balance-block-header {
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
