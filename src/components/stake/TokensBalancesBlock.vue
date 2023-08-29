<template>
  <div class="balances-block">
    <h4 class="title">Your balance</h4>
    <div class="balances-wrap">
      <div class="balance-item" v-for="info in balancesInfo" :key="info.title">
        <div class="token-info">
          <img class="token-icon" :src="info.icon" />
          <h5 class="token-name">{{ info.title }}</h5>
        </div>

        <div class="balance">
          <span class="balance-title">{{ info.stakeTokenName }} Balance</span>
          <span class="balance-value">{{
            formatTokenBalance(info.stakeBalance)
          }}</span>
        </div>

        <div class="balance">
          <span class="balance-title">{{ info.mainTokenName }} Balance</span>
          <span class="balance-value">{{
            formatTokenBalance(info.mainBalance)
          }}</span>
        </div>

        <p class="tokens-rate">1 mLVL = {{ info.rate }} LVL</p>
      </div>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import { useImage } from "@/helpers/useImage";
export default {
  props: {
    stakeInfo: { type: Object, required: true },
  },

  computed: {
    balancesInfo() {
      const { senior, mezzanine, junior } = this.stakeInfo;
      const mSeniorRate = filters.formatToFixed(1 * senior.tokensRate, 4);
      const mMezzanineRate = filters.formatToFixed(1 * mezzanine.tokensRate, 4);
      const mJuniorRate = filters.formatToFixed(1 * junior.tokensRate, 4);

      return [
        {
          icon: useImage("assets/images/stake/senior-icon.svg"),
          title: "Senior Tranche",
          stakeBalance: senior.stakeToken.balance,
          mainBalance: senior.mainToken.balance,
          stakeTokenName: senior.stakeToken.name,
          mainTokenName: senior.mainToken.name,
          rate: mSeniorRate,
        },
        {
          icon: useImage("assets/images/stake/mezzanine-icon.svg"),
          title: "Mezzanine Tranche",
          stakeBalance: mezzanine.stakeToken.balance,
          mainBalance: mezzanine.mainToken.balance,
          stakeTokenName: mezzanine.stakeToken.name,
          mainTokenName: mezzanine.mainToken.name,
          rate: mMezzanineRate,
        },
        {
          icon: useImage("assets/images/stake/junior-icon.svg"),
          title: "Junior Tranche",
          stakeBalance: junior.stakeToken.balance,
          mainBalance: junior.mainToken.balance,
          stakeTokenName: junior.stakeToken.name,
          mainTokenName: junior.mainToken.name,
          rate: mJuniorRate,
        },
      ];
    },
  },

  methods: {
    formatTokenBalance(balance) {
      return filters.formatTokenBalance(balance);
    },
  },
};
</script>
<style lang="scss" scoped>
.balances-block {
  width: 100%;
  padding: 16px;
  background: #2b2b3c;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.05);
  backdrop-filter: blur(50px);
  border-radius: 30px;
}

.title {
  text-align: left;
  margin-bottom: 10px;
}

.balances-wrap {
  display: flex;
  justify-content: space-between;
  gap: 9px;
}

.balance-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 116px;
  padding: 8px;
  background: #2b2b3c;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
}

.token-info {
  display: flex;
  gap: 8px;
}

.token-name {
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.025em;
}

.balance {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.balance-title {
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: rgba(255, 255, 255, 0.8);
}

.balance-value {
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: #ffffff;
}

.tokens-rat {
  padding: 6px 4px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  text-align: left;
}

@media screen and (max-width: 1200px) {
  .balances-wrap {
    flex-direction: column;
  }
}
</style>
