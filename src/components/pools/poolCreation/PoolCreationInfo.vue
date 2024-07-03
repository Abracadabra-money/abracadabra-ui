<template>
  <div class="pool-creation-info">
    <div class="pool-creation-info-header">
      <div class="chosen-creation-type">
        <h3 class="creation-type-title">Pegged Pool Type</h3>
        <p class="creation-type-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor
        </p>
      </div>

      <div class="slippage-coefficient-selector">
        <span class="selector-text">Slippage Coefficient</span>
        <span class="coefficient-value">K=0.0001</span>
        <img
          class="settings-icon"
          src="@/assets/images/pools/pool-creation/settings-icon.svg"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  components: {
    SettingsButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/SettingsButton.vue")
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
}

.chosen-creation-type {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 326px;
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
  cursor: pointer;
}

.slippage-coefficient-selector:hover {
  border: 1px solid #2d4a96;
}

.selector-text {
  color: #7088cc;
  font-size: 16px;
  font-weight: 500;
}
</style>
