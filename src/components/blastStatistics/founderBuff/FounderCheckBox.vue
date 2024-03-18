<template>
  <div
    class="checkbox"
    :class="{ active: value, disabled: disabled }"
    @click="updateCheckbox"
  >
    <img src="@/assets/images/checkbox/rectangle-active.svg" v-if="value" />
    <img src="@/assets/images/checkbox/rectangle-default.svg" v-else />
    {{ checkBoxText }}
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

  computed: {
    checkBoxText() {
      if (this.value)
        return "Lock MLPs for 3 months and achieve Founder’s Boost";

      return "Lock MLP for 3 month and get Buff";
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
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
}

.active {
  border: 1px solid #7088cc;
}
</style>
