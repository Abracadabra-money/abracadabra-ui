<template>
  <div class="myPositions-info">
    <div class="title-desc">
      <h2 class="title">Positions</h2>
      <p class="description">
        <span class="desc-line"> Manage your positions </span>
      </p>
    </div>

    <div class="reward-cards">
      <div
        :class="['reward-card', { elixir: index === 0 }, { mim: index === 2 }]"
        v-for="(data, index) in totalAssetsData"
        :key="data.title"
      >
        <h4 class="reward-title">Total {{ data.title }}</h4>
        <div class="reward-values">
          <div
            :class="['token-amount', { 'elixir-token-amount': index === 0 }]"
          >
            <img
              class="token-icon"
              src="@/assets/images/tokens/MIM.png"
              alt="MIM"
              v-if="index === 2"
            />
            {{ data.value }}
          </div>
        </div>
        <div class="reward-weekly" v-if="data?.rate">
          1 sdeUSD earns
          <span class="reward-weekly-value">{{ data.rate }}</span> Potions
          weekly
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";

export type TotalAssetsData = {
  title: string;
  value: string | number;
  rate?: string;
};

export default {
  props: {
    totalAssetsData: {
      type: Array as PropType<TotalAssetsData[]>,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.myPositions-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
}

.title {
  color: #fff;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 10px;
}

.description {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}

.desc-line {
  display: flex;
  align-items: center;
}

.mim-symbol {
  margin-right: 4px;
}

.reward-cards {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.reward-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 14px;
  width: 262px;
  height: 102px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: url("../../assets/images/myPositions/reward-card-background.png");
  background-repeat: no-repeat;
  background-position: 0 20px;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.reward-title {
  color: #99a0b2;
  font-size: 16px;
  font-weight: 500;
}

.reward-values {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.token-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  color: #fff;
  font-size: 28px;
  font-weight: 500;
}

.elixir-token-amount {
  background: -webkit-linear-gradient(
    180deg,
    #ffe47c 0%,
    #ff43c3 53.78%,
    #8150d6 102.24%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.token-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
}

.token-usd-equivalent {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
}

.mim {
  border: 1px solid #25467c;
  background: linear-gradient(
      90deg,
      rgba(45, 74, 150, 0.32) 0%,
      rgba(116, 92, 210, 0.32) 100%
    ),
    url("../../assets/images/myPositions/reward-mim-background.png");
  background-repeat: no-repeat;
  background-position: 20% 30%;
}

.elixir {
  border: 1px solid transparent;
  border-radius: 16px;
  background: linear-gradient(to right, #14182a, #14182a),
    linear-gradient(90deg, #8c4fd5 0%, #ff43c3 50%, #ffda80 100%);
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
}

.reward-weekly {
  font-size: 12px;
  line-height: 18px;
  color: #99a0b2;
}

.reward-weekly-value {
  font-weight: 500;
  color: #fff;
}

@media screen and (max-width: 1050px) {
  .myPositions-info {
    flex-direction: column;
    gap: 16px;
  }

  .reward-cards {
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media screen and (max-width: 620px) {
  .reward-card {
    width: 100%;
  }

  .title {
    font-size: 24px;
  }

  .desc-line {
    font-size: 14px;
  }

  .mim {
    background: linear-gradient(
        90deg,
        rgba(45, 74, 150, 0.32) 0%,
        rgba(116, 92, 210, 0.32) 100%
      ),
      url("../../assets/images/myPositions/reward-mim-background-mobile.png");

    background-position: right bottom;
    background-repeat: no-repeat;
  }
}
</style>
