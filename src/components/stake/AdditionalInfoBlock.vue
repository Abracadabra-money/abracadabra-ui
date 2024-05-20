<template>
  <div class="additional-info-block">
    <div class="info-item" :key="config.title" v-for="config in configs">
      <img
        class="mim-icon"
        src="@/assets/images/market/m-icon.svg"
        alt="Mim icon"
      />

      <h4 class="title">
        {{ config.title }}
        <TooltipIcon
          :width="20"
          :height="20"
          fill="#878B93"
          :tooltip="config.tooltip"
        />
      </h4>

      <p class="value">
        <img class="token-icon" :src="config.icon" alt="Collateral icon" />
        {{ formatTokenBalance(config.amount, config.decimals) }}
      </p>

      <p class="price">
        {{ formatUSD(config.amountUsd, config.decimals) }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { defineAsyncComponent, type PropType } from "vue";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";
import type { AdditionalConfig } from "@/helpers/stake/magicApe/types";

export default {
  props: {
    configs: {
      type: Object as PropType<AdditionalConfig[]>,
    },
  },

  methods: {
    formatTokenBalance(value: bigint, decimals: number) {
      return formatTokenBalance(formatUnits(value, decimals));
    },

    formatUSD(value: bigint, decimals: number) {
      return formatUSD(formatUnits(value, decimals));
    },
  },

  components: {
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.additional-info-block {
  gap: 20px;
  display: flex;
  align-items: center;
}

.info-item {
  width: 100%;
  padding: 24px;
  height: 144px;
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
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.mim-icon {
  position: absolute;
  top: 17px;
  left: -11px;
}

.title {
  color: #99a0b2;
  font-weight: 500;
  line-height: 150%;
  gap: 4px;
  display: flex;
  align-items: center;
}

.value {
  font-size: 32px;
  font-weight: 500;
  line-height: 150%;
  gap: 4px;
  display: flex;
  align-items: center;
}

.token-icon {
  width: 32px;
  height: 32px;
}

.price {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
}

@media screen and (max-width: 600px) {
  .additional-info-block {
    flex-direction: column;
  }
}
</style>
