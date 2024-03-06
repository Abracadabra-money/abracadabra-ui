<template>
  <div class="pool-action-block-wrap">
    <div class="pool-header">
      <div class="title-settings">
        <h3 class="title">MIM Pool</h3>
        <SwapSettingsPopup pool />
      </div>

      <div class="pool-management">
        <Tabs :name="activeTab" :items="tabItems" @select="selectTab" />

        <button
          class="my-position-button"
          @click="$emit('openPosition')"
          v-if="isUserPositionOpen"
        >
          My position
        </button>
      </div>
    </div>

    <Remove v-show="isRemove" />
    <Deposit v-show="!isRemove" />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: {
    pool: { type: Object },
    isUserPositionOpen: { type: Boolean, default: false },
  },

  data() {
    return {
      isMyPositionPopupOpened: false,
      inputAmount: null,
      inputValue: "",
      activeTab: "deposit",
      tabItems: ["deposit", "remove"],
      poolsTimer: null,
      selectedPool: null,
      isActionProcessing: false,
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
  },

  components: {
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    SwapSettingsPopup: defineAsyncComponent(() =>
      import("@/components/popups/SwapSettingsPopup.vue")
    ),
    Deposit: defineAsyncComponent(() =>
      import("@/components/pools/pool/Deposit.vue")
    ),
    Remove: defineAsyncComponent(() =>
      import("@/components/pools/pool/Remove.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 66px;
  width: 100%;
  margin-bottom: 16px;
}

.title-settings {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-settings .title {
  color: #fff;
  font-size: 32px;
  font-weight: 600;
}

.pool-management {
  display: flex;
  justify-content: space-between;
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

@media (max-width: 1300px) {
  .pool-header {
    flex-direction: column;
    align-items: start;
    gap: 16px;
  }

  .pool-management {
    width: 100%;
  }

  .my-position-button {
    display: block;
  }
}

@media (max-width: 600px) {
  .my-position-button {
    height: 39px;
    font-size: 14px;
  }
}

@media (max-width: 375px) {
  .my-position-button {
    font-size: 12px;
  }
}
</style>
