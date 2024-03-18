<template>
  <div class="totals-wrap">
    <div class="total">
      <h3 class="title">Total deposited</h3>
      <div class="value">$ {{ totalDeposited }}</div>

      <div class="line"></div>

      <div class="tokens-wrap">
        <div class="token-info">
          <BaseTokenIcon :icon="mimIcon" name="USDB" size="32px" />
          <span class="token-total"> {{ totalMimDeposited }}</span>
        </div>

        <div class="token-info">
          <BaseTokenIcon :icon="usdbIcon" name="USDB" size="32px" />
          <span class="token-total">{{ totalUsdbDeposited }}</span>
        </div>
      </div>
    </div>

    <div class="total">
      <h3 class="title">Total Point Distributed</h3>
      <div class="value">
        {{ formatAmount(pointsStatistics?.total || 0) }}
      </div>

      <div class="line"></div>

      <div class="info-wrap">
        <div class="pending-info">
          <span>Next airdrop in</span>
          <span class="pending-value">
            {{ formatAmount(pointsStatistics?.totalPending || 0) }}</span
          >
        </div>

        <div class="airdrop-info">
          <span>Pending</span>
          <span class="pending-value"> <Timer airdrop /></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";

import mimIcon from "@/assets/images/tokens/MIM.png";
import usdbIcon from "@/assets/images/tokens/USDB.png";

export default {
  props: {
    stakeInfo: {
      type: Object,
      required: true,
    },
    pointsStatistics: {
      type: Object,
      requared: true,
    },
  },

  data() {
    return { mimIcon, usdbIcon, windowWidth: window.innerWidth };
  },

  computed: {
    totalDeposited() {
      let totalDeposited = 0n;
      this.stakeInfo.tokensInfo.forEach(
        (token: any) => (totalDeposited += token.totals.total)
      );
      return this.formatTokenBalance(totalDeposited);
    },

    totalMimDeposited() {
      return formatUSD(
        formatUnits(this.stakeInfo.tokensInfo[1].totals.total, 18)
      );
    },
    totalUsdbDeposited() {
      return formatUSD(
        formatUnits(this.stakeInfo.tokensInfo[0].totals.total, 18)
      );
    },
  },

  methods: {
    formatTokenBalance(value: bigint) {
      return formatTokenBalance(formatUnits(value, 18));
    },

    formatAmount(value: number) {
      return formatTokenBalance(value);
    },
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    Timer: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/stake/earnPoints/Timer.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.totals-wrap {
  gap: 20px;
  display: flex;
  align-items: center;
}

.total {
  padding: 24px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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

.title {
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 4px;
}

.value {
  text-align: center;
  font-size: 32px;
  font-weight: 500;
  line-height: 32px;
}

.line {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0) 0.01%,
    rgba(255, 255, 255, 0.12) 46.96%,
    rgba(255, 255, 255, 0) 100%
  );
  margin: 16px 0;
}

.tokens-wrap {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.token-info {
  gap: 9px;
  display: flex;
  align-items: center;
}

.token-total {
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
}

.info-wrap {
  width: 100%;
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.pending-info,
.airdrop-info {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 500;
  line-height: 32px;
}

@media (max-width: 700px) {
  .total {
    padding: 12px;
  }

  .totals-wrap {
    flex-direction: column;
  }

  .title {
    font-size: 14px;
  }

  .value {
    font-size: 28px;
  }
}
</style>
