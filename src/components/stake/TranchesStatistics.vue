<template>
  <div class="statistics-block">
    <div class="tokens-info">
      <h3 class="title">Tranche Statistics</h3>

      <div class="tokens-info-wrap">
        <div
          class="token-info-item"
          v-for="data in statisticData"
          :key="data.type"
        >
          <div class="token-info">
            <div class="token-logo-wrap">
              <img class="token-icon" :src="data.icon" />
              <h6 class="token-name">
                {{ data.type }} <br />
                Tranche
              </h6>
            </div>
            <span class="token-risk" :class="data.risk"
              >{{ data.risk }} risk
            </span>
          </div>

          <ul class="token-list-info">
            <li class="list-info-item">
              <span class="info-title">APR</span>
              <span class="info-value">{{ data.apr }}</span>
            </li>
            <li class="list-info-item">
              <span class="info-title">Total Rewards</span>
              <span class="info-value">{{ data.totalRewards }}</span>
            </li>
            <li class="list-info-item">
              <span class="info-title">Total supply</span>
              <span class="info-value">{{ data.totalSupply }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="rewards-info-wrap">
      <div
        class="rewards-info-item"
        v-for="{ title, icon, name, value } in rewardData"
        :key="title"
      >
        <h3 class="title">{{ title }}</h3>

        <div class="reward-info">
          <div class="reward-icon">
            <BaseTokenIcon :icon="icon" size="40px" />
            <span>{{ name }}</span>
          </div>

          <div class="reward-amount">{{ value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatUnits } from "viem";
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";

export default {
  props: {
    stakeInfo: { type: Object },
  },

  computed: {
    statisticData() {
      const { formatPercent, formatUSD } = filters;
      const { tranchesStatistics, senior, mezzanine, junior } = this.stakeInfo;

      return [
        {
          type: "Senior",
          risk: "low",
          icon: useImage("assets/images/stake/senior-icon.svg"),
          apr: formatPercent(tranchesStatistics.seniorApy),
          totalRewards: formatUSD(tranchesStatistics.seniorTotalRewardsUsd),
          totalSupply: formatUSD(
            formatUnits(
              senior.mainToken.totalSupplyUsd,
              senior.mainToken.decimals
            )
          ),
        },
        {
          type: "Mezzanine",
          risk: "medium",
          icon: useImage("assets/images/stake/mezzanine-icon.svg"),
          apr: formatPercent(tranchesStatistics.mezzanineApy),
          totalRewards: formatUSD(tranchesStatistics.mezzanineTotalRewardsUsd),
          totalSupply: formatUSD(
            formatUnits(
              mezzanine.mainToken.totalSupplyUsd,
              mezzanine.mainToken.decimals
            )
          ),
        },
        {
          type: "Junior",
          risk: "high",
          icon: useImage("assets/images/stake/junior-icon.svg"),
          apr: formatPercent(tranchesStatistics.juniorApy),
          totalRewards: formatUSD(tranchesStatistics.juniorTotalRewardsUsd),
          totalSupply: formatUSD(
            formatUnits(
              junior.mainToken.totalSupplyUsd,
              junior.mainToken.decimals
            )
          ),
        },
      ];
    },

    rewardData() {
      const { formatUSD } = filters;
      const { totalRewardsUsd, totalSupplyUsd } =
        this.stakeInfo.tranchesStatistics;

      return [
        {
          name: "LVL",
          title: "Total Rewards Earned",
          icon: useImage("assets/images/tokens/LVL.png"),
          value: formatUSD(totalRewardsUsd),
        },
        {
          name: "Magic Tranches",
          title: "Total Supply",
          icon: useImage("assets/images/tokens/magicTranches.png"),
          value: formatUSD(formatUnits(totalSupplyUsd, 18)),
        },
      ];
    },
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.statistics-block {
  width: 100%;
  padding: 16px;
  background: #2b2b3c;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.05);
  backdrop-filter: blur(50px);
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  text-align: left;
  line-height: 150%;
  margin-bottom: 10px;
}

.tokens-info-wrap {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin: 0 auto 16px;
}

.token-info-item {
  width: 100%;
  height: 114px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
}

.token-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.token-logo-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.token-name {
  text-align: left;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.025em;
}

.token-risk {
  font-size: 10px;
  line-height: 150%;
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

.token-list-info {
  width: 100%;
  list-style: none;
}

.list-info-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.info-title {
  text-align: left;
  font-size: 12px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.8);
}

.info-value {
  text-align: right;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: #ffffff;
}

.rewards-info-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  position: relative;
}

.rewards-info-wrap::after {
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

.rewards-info-item {
  width: 100%;
  text-align: left;
}

.reward-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reward-icon {
  display: flex;
  align-items: center;
}

.reward-amount {
  display: flex;
  flex-direction: column;
  align-items: end;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  letter-spacing: 0.4px;
}

@media screen and (max-width: 1200px) {
  .tokens-info-wrap,
  .rewards-info-wrap {
    flex-direction: column;
  }

  .rewards-info-wrap::after {
    display: none;
  }
}
</style>
