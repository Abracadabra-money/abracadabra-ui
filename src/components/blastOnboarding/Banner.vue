<template>
  <div class="banner">
    <div class="description">
      <img class="blast-icon" src="@/assets/images/networks/blast.png" />
      <div>
        <h3 class="description-title">Build on Blast</h3>
        <h4 class="description-subtitle">Native Yield & Airdrops included</h4>
      </div>
    </div>

    <div class="total-wrap">
      <div class="total-item">
        <h3 class="total-title">Total Gold Distributed</h3>
        <p class="total-value">
          {{
            formatTokenBalance(
              pointsStatistics?.developerPoints?.total?.finalized ?? 0
            )
          }}
        </p>
      </div>
      <div class="total-item">
        <h3 class="total-title">Total Points Distributed</h3>
        <p class="total-value">
          {{
            formatLargeSum(
              pointsStatistics?.liquidityPoints?.total?.finalized ?? 0
            )
          }}
        </p>
      </div>
      <div class="total-item">
        <h3 class="total-title">Total Potions Distributed</h3>
        <p class="total-value">
          {{
            formatTokenBalance(
              pointsStatistics?.potionPoints?.total?.finalized ?? 0
            )
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatTokenBalance, formatLargeSum } from "@/helpers/filters";

export default {
  props: {
    pointsStatistics: {
      type: Object,
      required: true,
    },
  },

  methods: {
    formatLargeSum,
    formatTokenBalance,
  },
};
</script>

<style lang="scss" scoped>
.banner {
  color: #000;
  width: 100%;
  padding: 12px 17px 12px 26px;
  border-radius: 12px;
  background-image: url("@/assets/images/points-dashboard/banner-bg.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position-x: right;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.description {
  gap: 8px;
  display: flex;
  align-items: center;
}

.blast-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.description-title {
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
  text-transform: uppercase;
}

.description-subtitle {
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
}

.total-wrap {
  width: 710px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
}

.total-value {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  line-height: 150%;
}

@media screen and (max-width: 1260px) {
  .banner {
    background-image: url("@/assets/images/points-dashboard/banner-tablet-bg.png");
  }
}

@media screen and (max-width: 1160px) {
  .banner {
    padding: 0;
    background: none;
    flex-direction: column;
    gap: 14px;
  }

  .description {
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 12px;
    background: #fcfd02;
    border-radius: 12px 12px 0 0;
  }

  .total-wrap {
    width: 100%;
    background: #fcfd02;
    padding: 12px 26px;
    border-radius: 0 0 12px 12px;
  }
}

@media screen and (max-width: 768px) {
  .total-wrap {
    flex-direction: column;
    background: none;
    gap: 12px;
    padding: 0;
  }

  .total-item {
    width: 100%;
    background: #fcfd02;
    padding: 12px 26px;
  }

  .total-item:last-child {
    border-radius: 0 0 12px 12px;
  }
}
</style>
