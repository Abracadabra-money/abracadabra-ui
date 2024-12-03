<template>
  <div :class="['base-checkbox-wrap', { disabled }]" @click="updateCheckbox">
    <img src="@/assets/images/blast/checkbox-active.svg" v-if="chosen" />
    <img src="@/assets/images/blast/checkbox-default.svg" v-else />

    <slot></slot>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    chosen: {
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
.base-checkbox-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  height: fit-content;
  cursor: pointer;
}

.base-checkbox-wrap.disabled {
  cursor: auto;
}

.checkbox {
  display: flex;
  align-items: center;
  align-self: stretch;
  height: 40px;
  padding: 8px;
  gap: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
}
.active {
  border: 1px solid #7088cc;
}
</style>
