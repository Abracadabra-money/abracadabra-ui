<template>
    <div
      class="checkbox"
      :class="{ active: value, disabled: disabled }"
      @click="updateCheckbox"
    >
      <img src="@/assets/images/blast/checkbox-active.svg" v-if="value" />
      <img src="@/assets/images/blast/checkbox-default.svg" v-else />
      I understand the consequences of withdrawing
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
    background: rgba(255, 255, 255, 0.06);
    cursor: pointer;
  }
  .active {
    border: 1px solid #7088cc;
  }
  </style>