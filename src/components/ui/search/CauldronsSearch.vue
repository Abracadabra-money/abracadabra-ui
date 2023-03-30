<template>
  <div class="search">
    <img
      class="search-icon"
      src="@/assets/images/search.svg"
      alt="Search input"
    />
    <input
      type="text"
      placeholder="Search"
      class="search-input"
      @input="changeSerch"
    />
  </div>
</template>
<script>
export default {
  methods: {
    changeSerch(event) {
      this.$emit("changeSerch", event.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  height: 50px;
  display: flex;
  gap: 10px;
  padding: 10px;

  .search-icon {
    width: 20px;
    pointer-events: none;
  }

  .search-input {
    background-color: transparent;
    border: none;
    outline: none;
    color: #fff;
    width: 100%;

    &::placeholder {
      color: #fff;
    }
  }
}
</style>
