<template>
  <div class="farm-action-block">
    <h4 class="subtitle">
      {{ inputTitleText }}
    </h4>

    <BaseTokenInput
      :value="value"
      @updateInputValue="updateValue"
      :name="selectedFarm?.stakingToken?.name"
      :icon="selectedFarm?.icon"
      :max="max"
      :error="error"
      :disabled="!selectedFarm"
      :tokenPrice="Number(selectedFarm?.lpPrice)"
    />

    <BaseButton
      @click="$emit('actionHandler')"
      :disabled="isButtonDisabled"
      primary
      >{{ buttonText }}
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import type { FarmItem } from "@/configs/farms/types";

export default {
  props: {
    selectedFarm: { type: Object as PropType<FarmItem> },
    inputTitleText: { type: String },
    max: { type: BigInt as any as PropType<bigint> },
    error: { type: String },
    value: { type: String },
    isButtonDisabled: { type: Boolean },
    buttonText: { type: String },
  },

  methods: {
    updateValue(e: bigint) {
      this.$emit("updateValue", e);
    },
  },

  components: {
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.farm-action-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
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
.subtitle {
  align-self: flex-start;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.45px;
}
</style>
