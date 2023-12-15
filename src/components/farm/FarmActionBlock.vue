<template>
  <div class="farm-action-block">
    <h4 class="subtitle">
      {{ inputTitleText }}
    </h4>

    <FarmInput
      :value="inputAmount"
      @updateValue="updateValue"
      :name="selectedFarm?.stakingToken?.name"
      :icon="selectedFarm?.icon"
      :max="max"
      :error="error"
      :disabled="!selectedFarm"
      :lpPrice="selectedFarm?.lpPrice"
    />

    <BaseButton
      @click="$emit('actionHandler')"
      :disabled="isButtonDisabled"
      primary
      >{{ buttonText }}
    </BaseButton>
  </div>
</template>

<script>
import FarmInput from "@/components/farm/FarmInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";

export default {
  props: {
    selectedFarm: { type: Object },
    inputTitleText: { type: String },
    max: { type: BigInt },
    error: { type: String },
    inputAmount: { type: BigInt },
    isButtonDisabled: { type: Boolean },
    buttonText: { type: String },
  },

  methods: {
    updateValue(e) {
      this.$emit("updateValue", e);
    },
  },

  components: { FarmInput, BaseButton },
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
