<template>
  <div class="dropdown-wrap">
    <div
      ref="dropdownBtn"
      class="dropdown-btn"
      @click="clickHandler"
      @mousedown="checkFocus"
    >
      <slot name="btn" />
    </div>
    <div class="dropdown-list" @click="listClickHandler">
      <slot name="list" />
    </div>
  </div>
</template>

<script>
export default {
  name: "DropdownWrap",
  data: () => ({
    isBtnAlreadyFocused: false,
  }),
  methods: {
    checkFocus() {
      const btn = this.$refs.dropdownBtn.children[0];
      this.isBtnAlreadyFocused = btn === document.activeElement;
    },
    clickHandler() {
      const btn = this.$refs.dropdownBtn.children[0];
      if (this.isBtnAlreadyFocused) btn.blur();
      else btn.focus();
    },
    listClickHandler(event) {
      if (event.target.tabIndex >= 0) event.target.blur();
    },
  },
};
</script>

<style scoped lang="scss">
.dropdown-wrap {
  position: relative;
  display: inline-block;
  width: 100%;
  .dropdown-btn {
    width: 100%;
  }
  .dropdown-list {
    display: none;
    position: absolute;
    top: 100%;
    flex-direction: column;
    width: 100%;
  }
  &:focus-within {
    .dropdown-list {
      display: flex;
    }
  }
}
</style>
