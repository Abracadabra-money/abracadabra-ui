<template>
  <div class="blast-statistics-info">
    <div class="title-desc">
      <h2 class="title">The LLE Event has concluded!</h2>
      <p class="description">
        <span class="desc-line">
          During the MIMswap Liquidity Launch Event
          <span class="distributed-points"> {{ totalDistributedPoints }} </span>
          Blast Points have been distributed among participants
        </span>
        <span class="desc-line">
          Locked USDB and MIM deposits have been turned into MLP
        </span>
      </p>
    </div>

    <div class="info-card">
      <div class="total-deposited">
        <h3 class="info-card-title">Total deposited</h3>
        <p class="total-deposited-value">$ {{ totalDeposited }}</p>
      </div>

      <div class="divider"></div>

      <div class="total-by-token">
        <div
          class="token-part"
          :key="index"
          v-for="(token, index) in stakeInfo.tokensInfo"
        >
          <BaseTokenIcon
            :name="token.config.name"
            :icon="token.config.icon"
            size="32px"
          />
          $ {{ formatTokenBalance(token.totals.total, token.config.decimals) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";

export default {
  props: {
    stakeInfo: {
      type: Object,
      required: true,
    },
    totalDistributedPoints: {
      type: String,
    },
  },

  computed: {
    totalDeposited() {
      let totalDeposited = 0n;
      this.stakeInfo?.tokensInfo.forEach(
        (token) => (totalDeposited += token.totals.total)
      );
      return this.formatTokenBalance(totalDeposited);
    },
  },

  methods: {
    formatTokenBalance(value) {
      return formatTokenBalance(formatUnits(value, 18));
    },

    formatAmount(value) {
      return formatTokenBalance(value);
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
.blast-statistics-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
}

.title-desc {
  max-width: 675px;
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

.info-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 553px;
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

.total-deposited {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.info-card-title {
  font-size: 20px;
  font-weight: 500;
}

.total-deposited-value {
  font-size: 32px;
  font-weight: 500;
  line-height: 32px;
}

.total-by-token {
  display: flex;
  flex-direction: column-reverse;
  gap: 12px;
}

.token-part {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
}

.divider {
  width: 1px;
  height: 86px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0) 0.01%,
    rgba(255, 255, 255, 0.12) 46.96%,
    rgba(255, 255, 255, 0) 100%
  );
}

.distributed-points {
  color: #fcfc03;
  font-size: 16px;
  font-weight: 600;
}

@media screen and (max-width: 1200px) {
  .blast-statistics-info {
    flex-direction: column;
    gap: 16px;
  }

  .info-card {
    min-width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .total-deposited {
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .info-card-title {
    font-size: 27px;
    font-weight: 500;
  }

  .total-deposited-value {
    font-size: 28px;
    font-weight: 500;
    line-height: 32px;
  }

  .total-by-token {
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .token-part {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: 500;
    line-height: 32px;
  }

  .divider {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.12) 0%,
      rgba(255, 255, 255, 0) 0.01%,
      rgba(255, 255, 255, 0.12) 46.96%,
      rgba(255, 255, 255, 0) 100%
    );
    width: 100%;
    height: 1px;
    margin: auto;
  }
}

@media screen and (max-width: 620px) {
  .info-card {
    align-items: center;
  }

  .total-deposited,
  .total-by-token {
    justify-content: center;
  }

  .title {
    font-size: 24px;
  }

  .desc-line {
    font-size: 14px;
  }
}
</style>
