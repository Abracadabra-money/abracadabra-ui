<template>
  <div class="fee-tier-selector-wrap">
    <h4 class="action-title">
      Select a Fee Tier
      <Tooltip tooltip="tooltip" />
    </h4>
    <ul class="fee-tier-options" v-if="poolType">
      <li
        :class="['fee-tier-option', { active: index == currentOptionIndex }]"
        v-for="(feeTier, index) in feeTierOptions"
        :key="index"
        @click="selectOption(index)"
      >
        <span class="fee-tier-value">
          {{ formatFeeTier(feeTier) }}
          <RadioButton :active="index == currentOptionIndex" />
        </span>
      </li>
    </ul>

    <div class="explanation-wrap" v-else>
      <p class="explanation">
        Select Pool Type to see available Fee Tiers for your Pool
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import { formatPercent } from "@/helpers/filters";
import { formatUnits } from "viem";
import { PoolTypes, FEE_TIER_DECIMALS } from "@/constants/pools/poolCreation";

export default {
  props: {
    poolType: { type: String as PropType<PoolTypes | null> },
  },

  data() {
    return {
      currentOptionIndex: 0,
      PoolTypes,
    };
  },

  computed: {
    feeTierOptions() {
      switch (this.poolType) {
        case PoolTypes.Pegged:
          return [400000000000000n, 500000000000000n];

        case PoolTypes.Standard:
          return [300000000000000n];

        default:
          return [];
      }
    },
  },

  watch: {
    poolType() {
      this.selectOption(0);
    },
  },

  methods: {
    formatFeeTier(feeTier: bigint) {
      return formatPercent(formatUnits(feeTier, FEE_TIER_DECIMALS));
    },

    selectOption(index: number) {
      this.currentOptionIndex = index;
      this.$emit("selectFeeTier", this.feeTierOptions[index] || 0n);
    },
  },

  created() {
    this.selectOption(0);
  },

  components: {
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
    RadioButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/RadioButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.fee-tier-selector-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fee-tier-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  height: 71px;
}

.fee-tier-option {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: calc(50% - 12px);
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: background-color 0.3s ease-in;
}

.fee-tier-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 19px 20px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 500;
}

.fee-tier-option.active {
  padding: 1px 1.25px;
  background: linear-gradient(90deg, #2d4a96, #745cd2);
  border: none;
}

.fee-tier-option.active .fee-tier-value {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #1c2b53 0%, #303063 100%);
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.explanation-wrap {
  @include block-wrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.explanation {
  max-width: 247px;
  font-size: 14px;
  text-align: center;
}

@media (max-width: 1024px) {
  .fee-tier-options {
    height: 56px;
  }

  .fee-tier-value {
    padding: 12px;
  }
}
</style>
