<template>
  <div class="tooltip-wrap">
    <img class="tooltip-icon" src="@/assets/images/info.svg" alt="info" />
    <div class="apr-info">
      <div class="apr-item" v-for="item in tokensInfo" :key="item.address">
        <img :src="item.icon" alt="" class="token-icon" />
        <p class="name">{{ item.title }}:</p>
        <p class="apr">{{ item.apr }}</p>
      </div>
      <div class="apr-item total-item">
        <p class="name">Total:</p>
        <p class="apr">{{ totalApr }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index";

export default {
  name: "AprTooltip",
  props: {
    farm: {
      type: Object,
      required: true,
    },
  },
  computed: {
    tokensInfo() {
      const { tokensApr } = this.farm;
      const { rewardTokens } = this.farm.config;

      return rewardTokens.map((tokenItem, index) => {
        const title = index === 0 ? "Base APR" : "Boosted";

        const { apr } = tokensApr.find(
          (item) => item.address === tokenItem.address
        );

        return {
          ...tokenItem,
          apr: filters.formatPercent(apr),
          title,
        };
      });
    },
    totalApr() {
      return filters.formatPercent(this.farm.farmRoi);
    },
  },
};
</script>

<style lang="scss" scoped>
.tooltip-wrap {
  margin-right: 3px;
  position: relative;

  &:hover {
    .apr-info {
      opacity: 1;
      z-index: 100;
    }
  }

  .tooltip-icon {
    width: 16px;
    height: 16px;
    object-fit: contain;
    cursor: pointer;
  }

  .apr-info {
    opacity: 0;
    z-index: -100;
    position: absolute;
    left: -92px;
    top: 100%;
    min-width: 200px;
    border-radius: 12px;
    background: #15192a;
    box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
    padding: 12px;
    transition: opacity 0.3s ease;

    .total-item {
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      padding-top: 8px;
    }

    .apr-item {
      width: 100%;
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-bottom: 8px;

      .token-icon {
        width: 20px;
        height: 20px;
        object-fit: contain;
        margin-right: 4px;
      }

      .name {
        color: #878b93;
      }

      .apr {
        font-weight: 500;
        margin-left: auto;
        text-align: right;
      }
    }
  }
}
</style>
