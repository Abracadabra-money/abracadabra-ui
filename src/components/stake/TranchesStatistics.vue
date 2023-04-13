<template>
  <div class="info-block wrap">
    <div>
      <h5 class="info-title">Tranches Statistics</h5>
      <div class="tranches-boxes">
        <div class="tranche-box" v-for="(data, idx) in staticData" :key="idx">
          <div class="tranche-header">
            <div class="tranche-logo">
              <img :src="data.icon" class="tranche-icon" />
              <h6 class="logo-title">
                {{ data.type }} <br />
                Tranches
              </h6>
            </div>
            <span class="risk-marker" :class="data.risk"
              >{{ data.risk }} risk</span
            >
          </div>
          <ul class="tranche-box-info">
            <li class="info-field">
              <span class="field-title">APR</span>
              <span class="field-value">{{ data.apr }}%</span>
            </li>
            <li class="info-field">
              <span class="field-title">Total Rewards</span>
              <span class="field-value">${{ data.totalRewards }}</span>
            </li>
            <li class="info-field">
              <span class="field-title">Total supply</span>
              <span class="field-value">${{ data.totalSupply }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="supply-rewards">
      <div
        class="supply-rewards-block"
        v-for="(data, idx) in totalData"
        :key="idx"
      >
        <h5 class="info-title">{{ data.title }}</h5>
        <div class="info-item">
          <div class="info-icon">
            <BaseTokenIcon :icon="data.icon" size="40px" />
            <span>{{ data.name }}</span>
          </div>
          <div class="info-balance">
            <span class="info-value">${{ data.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");
export default {
  computed: {
    staticData() {
      return [
        {
          icon: require("@/assets/images/stake/senior-icon.svg"),
          type: "Senior",
          risk: "low",
          apr: "90.59",
          totalRewards: "304,210.19",
          totalSupply: "5,304,313.99",
        },
        {
          icon: require("@/assets/images/stake/mezzanine-icon.svg"),
          type: "Mezzanine",
          risk: "medium",
          apr: "90.59",
          totalRewards: "304,210.19",
          totalSupply: "5,304,313.99",
        },
        {
          icon: require("@/assets/images/stake/junior-icon.svg"),
          type: "Junior",
          risk: "high",
          apr: "90.59",
          totalRewards: "304,210.19",
          totalSupply: "5,304,313.99",
        },
      ];
    },

    totalData() {
      return [
        {
          title: "Total Supply",
          icon: require("@/assets/images/tokens/totalLVL.png"),
          name: "Magic Tranches",
          value: "304,313.99",
        },
        {
          title: "Total Rewards Earned",
          icon: require("@/assets/images/tokens/LVL.png"),
          name: "LVL",
          value: "7,304,313.99",
        },
      ];
    },
  },
  components: {
    BaseTokenIcon,
  },
};
</script>
<style lang="scss" scoped>
.info-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.info-title {
  text-align: left;
}
.tranches-boxes {
  display: flex;
  justify-content: space-between;
  gap: 9px;
  margin: 10px auto 16px auto;
}
.tranche-box {
  width: 100%;
  height: 114px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
}
.tranche-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}
.tranche-logo {
  display: flex;
  align-items: center;
  gap: 9px;
}
.logo-title {
  text-align: left;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.025em;
}
.risk-marker {
  font-weight: 400;
  font-size: 10px;
  line-height: 15px;
  text-align: right;
  text-transform: uppercase;
  color: #92e2ff;
}

.medium {
  color: #9f71ff;
}
.high {
  color: #ffb274;
}
.tranche-box-info {
  width: 100%;
  list-style: none;
}
.info-field {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.field-title {
  text-align: left;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: rgba(255, 255, 255, 0.8);
}
.field-value {
  text-align: right;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: #ffffff;
}
.supply-rewards {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  position: relative;
}

.supply-rewards::after {
  content: "";
  position: absolute;
  top: 60%;
  left: 0;
  right: 0;
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 auto;
}
.supply-rewards-block {
  width: 100%;
  text-align: left;
}
.balance-token {
  display: flex;
  font-weight: 400;
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

.token-balance {
  font-weight: 700;
  font-size: 24px;
  line-height: 30px;
}

.token-price {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.info-block {
  margin-bottom: 24px;
}

.info-title {
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  margin-bottom: 14px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-icon {
  display: flex;
  align-items: center;
}

.info-balance {
  display: flex;
  flex-direction: column;
  align-items: end;
}

.info-value {
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  letter-spacing: 0.4px;
}

.info-usd {
  font-size: 14px;
  line-height: 21px;
  display: flex;
  color: rgba(255, 255, 255, 0.6);
}

@media screen and (max-width: 1340px) {
  .tranches-boxes {
    flex-direction: column;
  }
}

@media (max-width: 770px) {
  .tranches-boxes {
    flex-direction: column;
  }
  .supply-rewards {
    flex-direction: column;
  }
  .supply-rewards::after {
    display: none;
  }
}
</style>
