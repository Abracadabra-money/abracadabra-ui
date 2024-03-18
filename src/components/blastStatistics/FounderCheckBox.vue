<template>
  <div
    class="checkbox"
    :class="{ active: value, disabled: disabled }"
    @click="updateCheckbox"
  >
    <img src="@/assets/images/checkbox/rectangle-active.svg" v-if="value" />
    <img src="@/assets/images/checkbox/rectangle-default.svg" v-else />
    Become
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
  align-items: center;
  align-self: stretch;
  height: 40px;
  padding: 8px;
  gap: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  cursor: pointer;
}

.active {
  border: 1px solid #7088cc;
}
</style>
