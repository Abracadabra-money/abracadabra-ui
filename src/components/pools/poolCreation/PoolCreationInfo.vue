<template>
  <div class="pool-creation-info">
    <template v-if="tokensSelected && poolType">
      <div class="pool-creation-info-header">
        <div class="chosen-creation-type">
          <h3 class="creation-type-title">{{ poolType }} Pool Type</h3>
          <p class="creation-type-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor
          </p>
        </div>

        <div class="slippage-coefficient-selector">
          <span class="selector-text">Slippage Coefficient</span>
          <Tooltip
            :width="20"
            :height="20"
            fill="#7088CC"
            tooltip="tooltip"
            v-if="poolType == PoolTypes.Standard"
          />
          <span class="coefficient-value">K={{ formattedKValue }}</span>
          <img
            class="settings-icon"
            src="@/assets/images/pools/pool-creation/settings-icon.svg"
            @click="openSlippagePopup"
            v-if="poolType == PoolTypes.Pegged"
          />
        </div>
      </div>

      <SlippageChart :kValue="kValue" />
    </template>

    <div class="empty-creation-info">
      <EmptyState column reverse v-if="!poolType">
        <div class="empty-state-content">
          <span class="empty-state-main-text">Select Pool Type</span>
          <p class="empty-state-description">
            Select Pool Type for your Pool to enable ‘’K’’ and Fee Tier settigns
          </p>
        </div>
      </EmptyState>

      <div class="divider" v-if="!tokensSelected && !poolType"></div>

      <EmptyState column reverse v-if="!tokensSelected">
        <div class="empty-state-content">
          <span class="empty-state-main-text">Select Tokens</span>
          <p class="empty-state-description">
            Select tokens you would like to create Pool with to enable price
            settings
          </p>
        </div>
      </EmptyState>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type Prop, type PropType } from "vue";
import { formatUnits } from "viem";
import { PoolTypes, K_VALUE_DECIMALS } from "@/constants/pools/poolCreation";

export default {
  props: {
    tokensSelected: Boolean,
    poolType: { type: String as PropType<PoolTypes | null> },
    kValue: BigInt as Prop<bigint>,
  },

  data() {
    return { PoolTypes };
  },

  computed: {
    formattedKValue() {
      return formatUnits(this.kValue || 0n, K_VALUE_DECIMALS);
    },
  },

  methods: {
    openSlippagePopup() {
      if (this.poolType != PoolTypes.Standard) this.$emit("openSlippagePopup");
    },
  },

  components: {
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
    SlippageChart: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/charts/SlippageChart.vue")
    ),
    EmptyState: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/PoolCreationEmptyState.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-creation-info {
  @include block-wrap;
  gap: 20px;
  display: flex;
  flex-direction: column;
}

.pool-creation-info-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.chosen-creation-type {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-basis: 50%;
}

.creation-type-title {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: capitalize;
}

.creation-type-description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 400;
}

.slippage-coefficient-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: fit-content;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #2d4a96;
  background: rgba(25, 31, 47, 0.38);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  transition: border 0.3s ease-in-out;
}

.slippage-coefficient-selector:hover {
  border: 1px solid #4564b2;
}

.selector-text {
  color: #7088cc;
  font-size: 16px;
  font-weight: 500;
}

.settings-icon {
  cursor: pointer;
}

.chart-wrap {
  height: 325.44px;
}

.empty-creation-info {
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.empty-state-main-text {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.empty-state-description {
  color: #878b93;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}

.divider {
  height: 318px;
  width: 1px;
  background: linear-gradient(
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
}

@media (max-width: 1300px) {
  .chosen-creation-type {
    flex-basis: 100%;
  }

  .slippage-coefficient-selector {
    flex-basis: 100%;
  }
}

@media (max-width: 600px) {
  .pool-creation-info {
    padding: 16px;
  }

  .selector-text {
    font-weight: 400;
  }

  .coefficient-value {
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
