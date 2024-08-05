<template>
  <div class="popup-content">
    <h3 class="title">Initial price alert</h3>

    <p class="message">
      The initial price is different from the current market price, which may
      cause your pool to be arbitraged
    </p>

    <div class="buttons-wrap">
      <BaseButton @click="$emit('cancel')">Cancel</BaseButton>
      <BaseButton primary @click="$emit('confirm')">Confirm</BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.popup-content {
  gap: 24px;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 24px;
  font-weight: 500;
}

.message {
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
}

.buttons-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.default-button {
  width: fit-content !important;
}
</style>
