<template>
  <div :class="['base-checkbox-wrap', { disabled }]" @click="updateCheckbox">
    <div
      :class="[
        'checkbox',
        {
          checked,
        },
      ]"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.75"
          y="0.75"
          width="18.5"
          height="18.5"
          rx="1.25"
          :stroke="checked ? '#7088CC' : 'white'"
          stroke-width="1.5"
        />
        <path
          d="M15.5 5.5L8.83333 12.5L5.5 9"
          stroke="#7088CC"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          v-show="checked"
        />
      </svg>
    </div>

    <slot></slot>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    checked: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    checked(newVal) {
      console.log("checked", newVal);
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
  cursor: pointer;
}
</style>
