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
    <div class="tokens-list">
      <template v-for="pool in filterPools">
        <button @click="selectPool(pool)" class="token-wrap" :key="pool.id">
          <div class="token-data">
            <TokenIcon :token="pool.name" />
            <p>{{ pool.name }}</p>
          </div>
          <div class="token-value">
            <p>{{ pool.initialMax }}</p>
            <p>$ {{ Number(pool.totalBorrow).toFixed(2) }}</p>
          </div>
        </button>
        <div class="token-spacer-wrap" :key="`spacer-${pool.id}`">
          <div class="token-spacer"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
const TokenIcon = () => import("@/components/ui/TokenIcon");

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
      return this.pools.filter(
        (pool) =>
          pool.name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
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
    TokenIcon,
  },
};
</script>

<style lang="scss" scoped>
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

.tokens-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.token-wrap {
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: white;
}

.token-data {
  display: flex;
  align-items: center;
}
.token-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  background-color: white;
  border-radius: 10px;
  margin-right: 10px;
}

.token-value {
  text-align: right;
}

.token-spacer-wrap {
  display: flex;
  justify-content: flex-end;
  flex: 0 0 1px;
}
.token-spacer {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.1);
  height: 1px;
  width: calc(100% - 42px);
}
</style>
