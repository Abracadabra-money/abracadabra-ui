<template>
  <div class="position-info">
    <div class="position-tags">
      <div class="timer-wrap" v-if="+mainToken.lockTimestamp">
        <img class="timer-icon" src="@/assets/images/Clock.svg" alt="Timer" />
        <LockedTimer :finalTime="mainToken.lockTimestamp" />
      </div>
    </div>

    <div class="position-preview">
      <div class="position-item" v-for="(item, i) in positionInfo" :key="i">
        <p class="item-title">{{ item.title }}</p>

        <div class="item-description">
          <div class="item-icon-wrap">
            <img
              v-for="(icon, key) in item.icon"
              :key="key"
              class="item-icon"
              :src="icon"
              alt="Token icon"
            />
          </div>

          <div>
            <p class="item-name">{{ item.name }}</p>
            <p class="item-value" v-if="item.value">{{ item.value }}</p>
            <p class="item-value-usd" v-if="item.valueInUsd">
              {{ item.valueInUsd }}
            </p>
            <p class="item-text" v-if="item.text">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
import { parseUnits, formatUnits } from "viem";

export default {
  props: {
    stakeToken: {
      type: Object,
      required: true,
    },
    mainToken: {
      type: Object,
      required: true,
    },
  },

  computed: {
    positionInfo() {
      const precision = parseUnits("1", this.mainToken.decimals);
      const stakeTokenAmountUsd = this.formatAmount(
        (this.stakeToken.balance * this.stakeToken.price) / precision
      );
      const mainTokenAmountUsd = this.formatAmount(
        (this.mainToken.balance * this.mainToken.price) / precision
      );

      return [
        {
          name: this.stakeToken.name,
          icon: [this.stakeToken.icon],
          title: "Your balance",
          value: filters.formatTokenBalance(
            this.formatAmount(this.stakeToken.balance)
          ),
          valueInUsd: filters.formatUSD(stakeTokenAmountUsd),
        },
        {
          name: this.mainToken.name,
          icon: [this.mainToken.icon],
          title: "Staked",
          value: filters.formatTokenBalance(
            this.formatAmount(this.mainToken.balance)
          ),
          valueInUsd: filters.formatUSD(mainTokenAmountUsd),
        },
        {
          name: "Ratio",
          icon: [this.stakeToken.icon],
          text: `1 ${this.mainToken.name} = ${filters.formatToFixed(
            this.formatAmount(this.mainToken.rate),
            4
          )} ${this.stakeToken.name}`,
        },
        {
          name: "Staking APR",
          icon: [this.stakeToken.icon, this.mainToken.icon],
          text: filters.formatPercent(this.mainToken.apr),
        },
      ];
    },
  },

  methods: {
    formatAmount(value) {
      return formatUnits(value, this.mainToken.decimals) || "0.0";
    },
  },

  components: {
    LockedTimer: defineAsyncComponent(() =>
      import("@/components/stake/LockedTimer.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.position-info {
  background-color: rgba(35, 33, 45, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 30px;
  min-height: 300px;
}

.position-tags {
  display: flex;
  padding: 9px 30px 7px 30px;
  min-height: 40px;
}

.timer-wrap {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.timer-icon {
  margin-right: 10px;
  width: 24px;
  height: 24px;
}

.position-preview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 16px 30px;
  background: #2b2b3c;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(100px);
  border-radius: 30px;
}

.position-item {
  text-align: left;
  border-bottom: 1px rgba(255, 255, 255, 0.1) solid;
  padding: 14px 0;

  &:nth-child(odd) {
    border-right: 1px rgba(255, 255, 255, 0.1) solid;
  }
  &:nth-child(even) {
    padding-left: 30px;
  }

  &:nth-last-child(-n + 2) {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:nth-child(-n + 2) {
    padding-top: 0;
  }
}

.item-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}

.item-description {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item-icon-wrap {
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  min-width: 64px;
  height: 64px;
}

.item-icon {
  min-width: 20px;
  height: 20px;
}

.item-name {
  font-size: 18px;
  line-height: 27px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 9px;
}

.item-value {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 5px;
}

.item-value-usd {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.item-text {
  font-weight: bold;
  line-height: 24px;
}

@media (max-width: 1320px) {
  .position-preview {
    padding: 24px 15px;
  }

  .item-value {
    font-size: 18px;
  }
}

@media (max-width: 600px) {
  .position-preview {
    grid-template-columns: 1fr;
  }

  .position-item:nth-child(odd) {
    border-right: none;
  }

  .position-item:nth-child(even) {
    padding-left: 0;
  }

  .position-item:nth-last-child(-n + 2) {
    border-bottom: 1px rgba(255, 255, 255, 0.1) solid;
    padding-bottom: 14px;
  }

  .position-item:nth-last-child(n-1) {
    padding-bottom: 14px;
    padding-top: 14px;
  }
}
</style>
