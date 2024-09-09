<template>
  <div
    class="checkbox"
    :class="{ active: value, disabled: disabled }"
    @click="updateCheckbox"
  >
    <img src="@/assets/images/checkbox/rectangle-active.svg" v-if="value" />
    <img src="@/assets/images/checkbox/rectangle-default.svg" v-else />
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    updateCheckbox() {
      if (this.disabled) return false;
      this.$emit("update");
    },
  },
};
</script>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  padding: 6px 8px;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  font-size: 16px;
  font-weight: 400;
  color: #878b93;
  cursor: pointer;
}

.active {
  border: 1px solid #7088cc;
}
</style>
