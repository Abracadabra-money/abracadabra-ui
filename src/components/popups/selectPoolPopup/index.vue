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
    <div
      v-if="!pools.length && !isCreatingPoolsBorrow"
      style="margin: 30px 0; text-align: center"
    >
      LOADING....
    </div>
    <div class="tokens-list" v-else-if="filterPools.length">
      <SelectPopupItem
        v-for="pool in filterPools"
        :key="pool.id"
        :pool="pool"
        @enterPool="selectPool"
      />
    </div>
    <div class="not-found" v-else-if="!filterPools.length && pools.length">
      <img
        class="not-found__img"
        :src="require('@/assets/images/empty.svg')"
        alt=""
      />
      <p class="not-found__text">
        No token found with this name, please search via contract address
      </p>
    </div>
    <div class="not-found" v-else-if="!filterPools.length && !isLoadPools">
      <img
        class="not-found__img"
        :src="require('@/assets/images/empty.svg')"
        alt=""
      />
      <p class="not-found__text">NO POOLS ON THIS NETWORK</p>
      <p class="not-found__text">in the future they will be displayed here</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
    ...mapGetters({
      isLoadPools: "getLoadPoolsBorrow",
      isCreatingPoolsBorrow: "getCreatePoolsBorrow",
    }),

    filterPools() {
      return this.pools
        .filter(
          (pool) =>
            pool.name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
        )
        .sort((a, b) =>
          a.userInfo?.userBalance > b.userInfo?.userBalance ? -1 : 1
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
  background: rgba(129, 126, 166, 0.2);
  height: 50px;
  width: 100%;
  font-size: 20px;
  border-radius: 20px;
  border: 1px solid #494661;
  outline: none;
  color: white;
  padding: 0 14px;
  margin-top: 10px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.1);
}

.tokens-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
