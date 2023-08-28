<template>
  <div class="additional-block">
    <div>
      <h3 class="title">Total Supply</h3>

      <div class="description">
        <div class="token-info">
          <BaseTokenIcon :icon="mainToken.icon" size="40px" />
          <span class="token-symbol">{{ mainToken.name }}</span>
        </div>

        <div class="info-balance">
          <span class="amount">{{
            formatTokenBalance(mainToken.totalSupply)
          }}</span>
          <span class="price">{{ formatUSD(mainToken.totalSupplyUsd) }}</span>
        </div>
      </div>
    </div>

    <div class="delimiter-line"></div>

    <div>
      <h3 class="title">Total Rewards Earned</h3>

      <div class="description">
        <div class="token-info">
          <BaseTokenIcon :icon="rewardToken.icon" size="40px" />
          <span class="token-symbol">{{ rewardToken.symbol }}</span>
        </div>

        <div class="info-balance">
          <span class="amount">{{
            formatTokenBalance(rewardToken.amount)
          }}</span>
          <span class="price">{{ formatUSD(rewardToken.amountUsd) }}</span>
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
    rewardToken: { type: Object, required: true },
  },

  methods: {
    formatUSD(value) {
      return filters.formatUSD(value);
    },

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },
  },

  components: { BaseTokenIcon },
};
</script>

<style lang="scss" scoped>
.additional-block {
  display: grid;
  grid-template-columns: 1fr 33px 1fr;
  width: 100%;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.05);
  backdrop-filter: blur(50px);
  background: #2b2b3c;
  border-radius: 30px;
  text-align: left;
}

.title {
  line-height: 27px;
  margin-bottom: 14px;
}

.description {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.token-info {
  display: flex;
  align-items: center;
}

.amount {
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  letter-spacing: 0.4px;
}

.price {
  font-size: 14px;
  line-height: 21px;
  display: flex;
  color: rgba(255, 255, 255, 0.6);
}

.delimiter-line {
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 1px;
    height: 45px;
    background: rgba(255, 255, 255, 0.1);
  }
}

@media (max-width: 1200px) {
  .additional-block {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .delimiter-line {
    display: none;
  }
}
</style>
