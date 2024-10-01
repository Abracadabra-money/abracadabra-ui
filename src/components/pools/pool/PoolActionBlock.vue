<template>
  <div class="pool-action-block-wrap">
    <div class="pool-header">
      <h2 class="title">Pool</h2>

      <TokenPair class="token-pair" chainIcon :pool="pool" />

      <div class="initial-parameters">
        <ParameterChip>{{ feeTier }}</ParameterChip>
        <ParameterChip>{{ poolType }}</ParameterChip>
      </div>

      <div class="header-buttons-wrap">
        <button
          class="my-position-button"
          @click="$emit('openPositionPopup')"
          v-if="account"
        >
          My position
        </button>

        <SwapSettingsPopup
          :slippage="20n"
          :defaultSlippage="20n"
          :deadline="100n"
          pool
          @updateSlippageValue="updateSlippageValue"
          @updateDeadlineValue="updateDeadlineValue"
        />
      </div>
    </div>

    <div class="pool-action">
      <div class="condition-management-wrap">
        <Tabs
          class="tabs"
          :name="activeTab"
          :items="tabItems"
          @select="selectTab"
        />

        <Toggle
          :text="toggleSettings.text"
          :selected="toggleSettings.selectedCondition"
          @updateToggle="toggleCondition"
        />
      </div>

      <Deposit
        :pool="pool"
        :slippage="slippage"
        :deadline="deadline"
        :isBalanced="toggleSettings.selectedCondition"
        @updatePoolInfo="$emit('updatePoolInfo')"
        v-show="!isRemove"
      />

      <Remove
        :pool="pool"
        :slippage="slippage"
        :deadline="deadline"
        :isSingleSide="toggleSettings.selectedCondition"
        @updatePoolInfo="$emit('updatePoolInfo')"
        v-show="isRemove"
      />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
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

  emits: ["updatePoolInfo", "openPositionPopup"],

  data() {
    return {
      isMyPositionPopupOpened: false,
      activeTab: "deposit",
      tabItems: ["deposit", "remove"],
      slippage: 20n,
      deadline: 100n,
      isBalanced: false,
      isSingleSide: false,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
    }),

    isRemove() {
      return this.activeTab === "remove";
    },

    toggleSettings() {
      return {
        text: this.isRemove ? "Single side" : "Balance",
        selectedCondition: this.isRemove ? this.isSingleSide : this.isBalanced,
      };
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

    toggleCondition() {
      if (this.isRemove) this.isSingleSide = !this.isSingleSide;
      else this.isBalanced = !this.isBalanced;
    },

    updateSlippageValue(value) {
      this.slippage = value;
    },

    updateDeadlineValue(value) {
      this.deadline = value;
    },
  },

  components: {
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    TokenPair: defineAsyncComponent(() =>
      import("@/components/pools/pool/TokenPair.vue")
    ),
    SwapSettingsPopup: defineAsyncComponent(() =>
      import("@/components/popups/swap/SwapSettingsPopup.vue")
    ),
    ParameterChip: defineAsyncComponent(() =>
      import("@/components/pools/pool/ParameterChip.vue")
    ),
    Remove: defineAsyncComponent(() =>
      import("@/components/pools/pool/actions/Remove.vue")
    ),
    Deposit: defineAsyncComponent(() =>
      import("@/components/pools/pool/actions/deposit/Deposit.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-header {
  display: grid;
  grid-template-columns: max-content 1fr min-content;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 16px;
}

.title {
  display: none;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
}

.initial-parameters {
  display: flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
}

.header-buttons-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
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

.pool-action {
  @include block-wrap;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.condition-management-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

@media (max-width: 1400px) {
  .pool-header {
    grid-template-areas:
      "title buttons buttons"
      "tokens tokens parameters";
    grid-template-columns: auto;
  }

  .title {
    display: block;
    grid-area: title;
  }

  .header-buttons-wrap {
    justify-content: flex-end;
    grid-area: buttons;
  }

  .token-pair {
    grid-area: tokens;
    min-width: max-content;
  }

  .initial-parameters {
    justify-self: flex-end;
    grid-area: parameters;
  }

  .my-position-button {
    display: block;
  }
}

@media (max-width: 600px) {
  .pool-action {
    gap: 20px;
    padding: 16px;
  }
  .pool-action::v-deep(.pool-action-block) {
    gap: 20px;
  }

  .my-position-button {
    font-size: 14px;
  }

  .token-pair::v-deep(.name) {
    font-size: 18px;
    font-weight: 500;
    line-height: 22px;
  }

  .token-pair::v-deep(.token-icon.base) {
    height: 30px !important;
    width: 30px !important;
  }

  .token-pair::v-deep(.token-icon.quote) {
    height: 34px !important;
    width: 34px !important;
    margin-left: -18px;
    border-radius: 12px !important;
  }

  .settings-wrap::v-deep(.settings-button) {
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 375px) {
  .my-position-button {
    font-size: 12px;
  }
}
</style>
