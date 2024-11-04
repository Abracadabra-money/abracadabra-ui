<template>
  <div class="tabs-wrap">
    <button
      v-for="tabInfo in tabsInfo"
      :key="tabInfo.name"
      :class="['tab-item', { 'tab-active': activeTab === tabInfo.name }]"
      @click="$emit('changeActiveTab', tabInfo.name)"
    >
      {{ tabInfo.title }}
    </button>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { TabInfo } from "@/helpers/bSpell/types";

export default {
  emits: ["changeActiveTab"],

  props: {
    tabsInfo: {
      type: Array as PropType<TabInfo[]>,
      required: true,
    },

    activeTab: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs-wrap {
  padding: 6px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(16, 18, 23, 0.38);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tab-item {
  display: flex;
  height: 36px;
  justify-content: center;
  align-items: center;
  width: 100%;
  cursor: pointer;
  border-radius: 8px;
  background: transparent;
  border: transparent;
  outline: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 500;
}

.tab-active {
  color: var(--Primary-Solid, #7088cc);
  background: rgba(111, 111, 111, 0.06);
}
</style>
