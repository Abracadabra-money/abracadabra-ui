<template>
  <div class="fee-tier-selector-wrap">
    <h4 class="action-title">
      Select a Fee Tier
      <Tooltip />
    </h4>
    <ul class="fee-tier-options">
      <li :class="['fee-tier-option']">
        <span class="fee-tier-value">0.04%</span>
        <p class="fee-tier-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing
        </p>
        <RadioButton />
      </li>

      <li :class="['fee-tier-option', 'active']">
        <span class="fee-tier-value">0.05%</span>
        <p class="fee-tier-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing
        </p>
        <RadioButton active />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
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
  flex-direction: column;
  gap: 12px;
}

.fee-tier-option {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.fee-tier-value {
  font-size: 18px;
  font-weight: 500;
}

.fee-tier-description {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
}

.fee-tier-option.active {
  border: 1px solid #2d4a96;
}

.radio-button {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
