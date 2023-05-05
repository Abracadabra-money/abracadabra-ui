<template>
  <div class="balance-block wrap">
    <h4 class="balance-title">Your balance</h4>
    <div class="balance-boxes">
      <div class="balance-box" v-for="(info, idx) in InfoArr" :key="idx">
        <div class="box-header">
          <img :src="info.icon" class="tranche-icon" />
          <h6 class="logo-title">{{ info.title }}</h6>
        </div>

        <div class="balance">
          <span class="balance-tag">Balance</span>
          <span class="balance-value">{{ formatBalance(info.balance) }}</span>
        </div>

        <p class="rate">1 mLVL = {{ info.rate }} LVL</p>
      </div>
    </div>
  </div>
</template>
<script>
import filters from "@/filters/index.js";
import seniorIcon from "@/assets/images/stake/senior-icon.svg";
import juniorIcon from "@/assets/images/stake/junior-icon.svg";
import mezzanineIcon from "@/assets/images/stake/mezzanine-icon.svg";
export default {
  props: {
    tokensInfo: Object,
  },

  computed: {
    mSeniorRate() {
      return filters.formatToFixed(1 * this.tokensInfo.senior.tokensRate, 4);
    },

    mMezzanineRate() {
      return filters.formatToFixed(1 * this.tokensInfo.mezzanine.tokensRate, 4);
    },

    mJuniorRate() {
      return filters.formatToFixed(1 * this.tokensInfo.junior.tokensRate, 4);
    },

    InfoArr() {
      const { senior, mezzanine, junior } = this.tokensInfo;
      return [
        {
          icon: seniorIcon,
          title: "Senior Tranches",
          balance: senior.stakeToken.formatBalance,
          rate: this.mSeniorRate,
        },
        {
          icon: mezzanineIcon,
          title: "Mezzanine Tranches",
          balance: mezzanine.stakeToken.formatBalance,
          rate: this.mMezzanineRate,
        },
        {
          icon: juniorIcon,
          title: "Junior Tranches",
          balance: junior.stakeToken.formatBalance,
          rate: this.mJuniorRate,
        },
      ];
    },
  },

  methods: {
    formatBalance(balance) {
      return filters.formatTokenBalance(balance);
    },
  },
};
</script>
<style lang="scss" scoped>
.balance-title {
  text-align: left;
  margin-bottom: 10px;
}
.balance-boxes {
  display: flex;
  justify-content: space-between;
  gap: 9px;
}
.balance-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 98px;
  padding: 8px;
  background: #2b2b3c;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
}
.box-header {
  display: flex;
  gap: 8px;
}
.logo-title {
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
.balance-tag {
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
.rate {
  padding: 6px 4px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  text-align: left;
}

@media screen and (max-width: 1340px) {
  .balance-boxes {
    flex-direction: column;
  }
}

@media (max-width: 770px) {
  .balance-boxes {
    flex-direction: column;
  }
}
</style>
