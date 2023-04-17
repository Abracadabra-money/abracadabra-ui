<template>
  <div class="dropdown-wrap" tabindex="0">
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
  data() {
    return {
      isBtnAlreadyFocused: false,
    }
  },
  methods: {
    checkFocus() {
      const btn = this.$refs.dropdownBtn.children[0];
      this.isBtnAlreadyFocused = btn === document.activeElement;
    },
    clickHandler() {
      const btn = this.$refs.dropdownBtn.children[0];
      if (this.isBtnAlreadyFocused) document.activeElement.blur();
      else btn.focus();
    },
    listClickHandler(event) {
      if (event.target.tabIndex >= 0) document.activeElement.blur();
    },
  },
};
</script>

<style scoped lang="scss">
.dropdown-wrap {
  position: relative;
  display: block;
  .dropdown-btn {
    width: 100%;
  }
  .dropdown-list {
    display: none;
    position: absolute;
    top: 100%;
    flex-direction: column;
    width: 100%;
    z-index: 300;
  }
  &:focus-within {
    .dropdown-list {
      display: flex;
    }
  }
}
</style>
