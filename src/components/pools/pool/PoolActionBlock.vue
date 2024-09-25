<template>
  <div class="pool-action-block-wrap">
    <div class="pool-header">
      <TokenPair class="token-pair" :pool="pool" />

      <div class="initial-parameters">
        <ParameterChip>{{ feeTier }}</ParameterChip>
        <ParameterChip>{{ poolType }}</ParameterChip>
      </div>

      <SwapSettingsPopup
        :slippage="20n"
        :defaultSlippage="20n"
        :deadline="100n"
        pool
        @updateSlippageValue="updateSlippageValue"
        @updateDeadlineValue="updateDeadlineValue"
      />

      <!-- 
        <Tabs
          class="tabs"
          :name="activeTab"
          :items="tabItems"
          @select="selectTab"
        /> -->

      <button
        class="my-position-button"
        @click="$emit('openPositionPopup')"
        v-if="isUserPositionOpen"
      >
        My position
      </button>
    </div>

    <RemoveUnstakeWrap
      :pool="pool"
      :slippage="slippage"
      :deadline="deadline"
      @updatePoolInfo="$emit('getPoolInfo')"
      v-show="isRemove"
    />

    <DepositStakeWrap
      :pool="pool"
      :slippage="slippage"
      :deadline="deadline"
      @updatePoolInfo="$emit('getPoolInfo')"
      v-show="!isRemove"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { formatUnits } from "viem";
import { formatPercent } from "@/helpers/filters";
import {
  FEE_TIER_DECIMALS,
  PoolTypes,
  STANDARD_K_VALUE,
} from "@/constants/pools/poolCreation";

export const actionStatus = {
  SUCCESS: "success",
  PENDING: "pending",
  WAITING: "waiting",
};

export default {
  props: {
    pool: { type: Object },
    isUserPositionOpen: { type: Boolean, default: false },
  },

  emits: ["getPoolInfo", "openPositionPopup"],

  data() {
    return {
      isMyPositionPopupOpened: false,
      activeTab: "deposit",
      tabItems: ["deposit", "remove"],
      slippage: 20n,
      deadline: 100n,
    };
  },

  computed: {
    isRemove() {
      return this.activeTab === "remove";
    },

    feeTier() {
      return formatPercent(
        formatUnits(this.pool.initialParameters.lpFeeRate, FEE_TIER_DECIMALS)
      );
    },

    poolType() {
      return this.pool.initialParameters.K === STANDARD_K_VALUE
        ? PoolTypes.Standard
        : PoolTypes.Pegged;
    },
  },

  methods: {
    selectTab(action) {
      this.activeTab = action;
    },

    updateSlippageValue(value) {
      this.slippage = value;
    },

    updateDeadlineValue(value) {
      this.deadline = value;
    },
  },

  components: {
    // Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    TokenPair: defineAsyncComponent(() =>
      import("@/components/pools/pool/TokenPair.vue")
    ),
    SwapSettingsPopup: defineAsyncComponent(() =>
      import("@/components/popups/swap/SwapSettingsPopup.vue")
    ),
    DepositStakeWrap: defineAsyncComponent(() =>
      import("@/components/pools/pool/DepositStakeWrap.vue")
    ),
    RemoveUnstakeWrap: defineAsyncComponent(() =>
      import("@/components/pools/pool/RemoveUnstakeWrap.vue")
    ),
    ParameterChip: defineAsyncComponent(() =>
      import("@/components/pools/pool/ParameterChip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-header {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 16px;
}

.initial-parameters {
  display: flex;
  align-items: center;
  gap: 12px;
}

.settings-wrap {
  margin-left: auto;
}

.my-position-button {
  display: none;
  color: inherit;
  padding: 8px 24px;
  gap: 10px;
  border-radius: 12px;
  border: 2px solid #7088cc;
  background: rgba(255, 255, 255, 0.01);
  color: #7088cc;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.my-position-button:hover {
  opacity: 0.7;
}

@media (max-width: 1400px) {
  .pool-management {
    width: 100%;
    flex-wrap: wrap;
    gap: 16px;
  }

  .token-pair {
    order: 1;
  }

  .tabs {
    order: 3;
    margin-right: auto;
  }

  .my-position-button {
    display: block;
    order: 2;
  }
}

@media (max-width: 600px) {
  .my-position-button {
    font-size: 14px;
  }
}

@media (max-width: 375px) {
  .my-position-button {
    font-size: 12px;
  }
}
</style>
