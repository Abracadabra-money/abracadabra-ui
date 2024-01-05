<template>
  <button class="info-button">
    <span class="inner-wrap">
      <span class="button-title">{{ title }}</span>
      <Tooltip :width="13" :height="13" fill="#878B93" :tooltip="tooltip" />
      <span class="button-value">{{ value }}</span>
    </span>
  </button>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  props: {
    title: { type: String },
    value: { type: String },
    tooltip: { type: String, default: "tooltip" },
  },

  components: {
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.info-button {
  padding: 1px;
  background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
  border-radius: 8px;
  border: transparent;
  outline: transparent;
  cursor: pointer;
}

.inner-wrap {
  display: flex;
  padding: 5px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: #303557;
  color: #fff;
  min-width: 120px;
  width: 100%;
  height: 30px;
}

.button-title {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  margin-right: 4px;
}

.button-value {
  margin-left: 12px;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  text-transform: uppercase;
}
</style>
