<template>
  <div class="deposit-stake-wrap">
    <div class="condition-management-wrap">
      <Tabs
        class="tabs"
        :name="activeTab"
        :items="tabItems"
        @select="selectTab"
      />
    </div>

    <Remove
      :pool="pool"
      :slippage="slippage"
      :deadline="deadline"
      @updatePoolInfo="$emit('updatePoolInfo')"
      v-if="!isUnstake"
    />

    <Unstake
      :pool="pool"
      :slippage="slippage"
      :deadline="deadline"
      @updatePoolInfo="$emit('updatePoolInfo')"
      v-else
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: {
    pool: { type: Object },
    slippage: { type: BigInt },
    deadline: { type: BigInt },
  },

  emits: ["updatePoolInfo"],

  data() {
    return {
      activeTab: "remove",
      tabItems: ["remove", "unstake"],
    };
  },

  computed: {
    isUnstake() {
      return this.activeTab == "unstake";
    },
  },

  methods: {
    selectTab(action) {
      this.activeTab = action;
    },
  },

  components: {
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),

    Remove: defineAsyncComponent(() =>
      import("@/components/pools/pool/actions/Remove.vue")
    ),

    Unstake: defineAsyncComponent(() =>
      import("@/components/pools/pool/actions/Unstake.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.deposit-stake-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  border-radius: 20px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  padding: 24px;
  width: 100%;
}

.condition-management-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.tabs {
  justify-self: flex-start;
}
</style>
