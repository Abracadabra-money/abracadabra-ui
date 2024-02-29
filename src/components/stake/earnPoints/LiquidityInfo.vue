<template>
  <div class="liquidity-info">
    <div class="header">
      <div class="title-subtitle">
        <h3 class="title">MIM Swap</h3>
        <p class="subtitle">Liquidity Launch Event</p>
      </div>

      <Timer />
    </div>

    <div class="fill-indicators">
      <div class="fill-indicator usdb">
        <BaseTokenIcon :icon="usdbIcon" name="USDB" size="32px" />

        <div class="scale-wrap">
          <div
            class="filling-scale"
            :style="`width: ${calculatePercentage(
              indicatorsInfo[1].total,
              indicatorsInfo[1].caps
            )}%`"
          ></div>
          <div class="filled-amount">
            {{ formatTokenBalance(indicatorsInfo[1].total) }} out of
            {{ formatTokenBalance(indicatorsInfo[1].caps) }}
          </div>
        </div>
      </div>

      <div class="fill-indicator mim">
        <BaseTokenIcon :icon="mimIcon" name="MIM" size="32px" />

        <div class="scale-wrap">
          <div
            class="filling-scale"
            :style="`width: ${calculatePercentage(
              indicatorsInfo[0].total,
              indicatorsInfo[0].caps
            )}%`"
          ></div>
          <div class="filled-amount">
            {{ formatTokenBalance(indicatorsInfo[0].total) }} out of
            {{ formatTokenBalance(indicatorsInfo[0].caps) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import Timer from "@/components/stake/earnPoints/Timer.vue";
import mimIcon from "@/assets/images/tokens/MIM.png";
import usdbIcon from "@/assets/images/tokens/USDB.png";
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";

export default {
  props: {
    stakeInfo: {
      type: Object,
      required: true,
    },
  },

  data() {
    return { mimIcon, usdbIcon };
  },

  computed: {
    indicatorsInfo() {
      return this.stakeInfo.tokensInfo.map(({ caps, totals }: any) => {
        return {
          caps: caps,
          total: totals.total,
        };
      });
    },
  },

  methods: {
    formatTokenBalance(value: bigint) {
      return formatTokenBalance(formatUnits(value, 18));
    },

    calculatePercentage(total: bigint, caps: bigint) {
      if (!caps) return 100;
      const pers = (total * 100n) / caps;
      return formatUnits(pers, 0);
    },
  },

  components: { BaseTokenIcon, Timer },
};
</script>

<style lang="scss" scoped>
.liquidity-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-subtitle {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8;
}

.title {
  font-size: 24px;
  font-weight: 500;
}

.subtitle {
  font-size: 14px;
  font-weight: 400;
}

.fill-indicators {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.fill-indicator {
  display: flex;
  align-items: center;
}

.scale-wrap {
  position: relative;
  width: 100%;
  height: 24px;
  border-radius: 10px;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
}

.filling-scale {
  height: 100%;
  border-radius: 10px;
  background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
}

.filled-amount {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 600px) {
  .liquidity-info {
    padding: 16px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .title {
    font-size: 16px;
  }

  .subtitle {
    font-size: 12px;
  }
}
</style>
