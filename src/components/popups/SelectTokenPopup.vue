<template>
  <div class="tokens-popup">
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
      <template v-for="token in tokens">
        <button
          @click="selectToken(token.chainId)"
          class="token-wrap"
          :key="token.chainId"
        >
          <div class="token-data">
            <img class="token-icon" :src="token.icon" alt="token" />
            <p>{{ token.name }}</p>
          </div>
          <div class="token-value">
            <p>30</p>
            <p>$ 91,792.2</p>
          </div>
        </button>
        <div class="token-spacer-wrap" :key="`spacer-${token.chainId}`">
          <div class="token-spacer"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tokens: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({ search: "" }),
  methods: {
    selectToken(chainId) {
      this.$emit("select", chainId);
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.tokens-popup {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
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
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
}

.search-wrap {
  padding-bottom: 20px;
  border-bottom: solid 1px rgba(255, 255, 255, 0.1);
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
