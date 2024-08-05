<template>
  <div class="popup-content">
    <h3 class="title">Mint MIM against deUSD</h3>

    <div class="description-wrap">
      <img
        class="description-image"
        src="@/assets/images/notification-icons/info-icon.png"
      />
      <p class="description-text">
        Note! Deleverage function for the deUSD cauldron is currently
        unavailable
      </p>
    </div>

    <BaseButton @click="confirmAction" primary>Got it</BaseButton>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  methods: {
    confirmAction() {
      this.$emit("confirmAction");
    },
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.popup-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.title {
  font-size: 24px;
  font-weight: 500;
}

.description-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.description-image {
  width: 52px;
  height: 52px;
}

.description-text {
  font-size: 16px;
  font-weight: 400;
}
</style>
