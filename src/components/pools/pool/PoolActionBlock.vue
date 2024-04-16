<template>
  <div class="pool-action-block-wrap">
    <div class="pool-header">
      <div class="title-settings">
        <h3 class="title">MIM Pool</h3>

        <BaseButton class="link-button" @click="goToSwap">Swap</BaseButton>

        <SwapSettingsPopup
          :slippage="50n"
          :defaultSlippage="50n"
          :deadline="100n"
          pool
          @updateSlippageValue="updateSlippageValue"
          @updateDeadlineValue="updateDeadlineValue"
        />
      </div>

      <div class="pool-management">
        <TokenPair class="token-pair" :pool="pool" />

        <Tabs :name="activeTab" :items="tabItems" @select="selectTab" />

        <button
          class="my-position-button"
          @click="$emit('openPositionPopup')"
          v-if="isUserPositionOpen"
        >
          My position
        </button>
      </div>
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
      slippage: 100n,
      deadline: 100n,
    };
  },

  computed: {
    isRemove() {
      return this.activeTab === "remove";
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

    goToSwap() {
      this.$router.push({
        name: "MimSwap",
      });
    },
  },

  components: {
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
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
  },
};
</script>

<style lang="scss" scoped>
.pool-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  min-height: 66px;
  width: 100%;
  margin-bottom: 16px;
}

.link-button {
  width: auto !important;
  margin-right: auto;
}

.title-settings {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.title-settings .title {
  color: #fff;
  font-size: 32px;
  font-weight: 600;
}

.pool-management {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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
  }

  .token-pair {
    display: none !important;
  }

  .my-position-button {
    display: block;
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
