<template>
  <div class="pools-popup">
    <div class="search-wrap">
      <p class="title">Select token</p>
      <input
        v-model="search"
        type="text"
        placeholder="Search"
        class="search-input"
      />
    </div>
    <SelectPopupItem
      v-for="pool in filterPools"
      :key="pool.id"
      :pool="pool"
      @enterPool="selectPool"
    />
  </div>
</template>

<script>
const SelectPopupItem = () =>
  import("@/components/popups/selectPoolPopup/SelectPopupItem");

export default {
  props: {
    pools: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      search: "",
    };
  },

  computed: {
    filterPools() {
      return this.pools
        .filter(
          (pool) =>
            pool.name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
        )
        .sort((a, b) =>
          a.userInfo.userBalance > b.userInfo.userBalance ? -1 : 1
        );
    },
  },

  methods: {
    selectPool(pool) {
      this.$emit("select", pool);
      this.$emit("close");
    },
  },

  components: {
    SelectPopupItem,
  },
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-thumb {
  border-width: 1px 1px 1px 2px;
  border-radius: 2px;
  background-color: #252423;
}

::-webkit-scrollbar-thumb:hover {
  border-width: 1px 1px 1px 2px;
  background-color: #565656;
}

::-webkit-scrollbar-track {
  border-width: 1px;

  background-color: #414141;
  border-color: transparent;
}
.pools-popup {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
}

.search-wrap {
  padding-bottom: 20px;
  border-bottom: solid 1px rgba(255, 255, 255, 0.1);
}

.title {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
}

.search-input {
  background-color: rgba(255, 255, 255, 0.1);
  height: 50px;
  width: 100%;
  font-size: 20px;
  border-radius: 20px;
  border: none;
  outline: none;
  color: white;
  padding: 0 14px;
  margin-top: 10px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}
</style>
