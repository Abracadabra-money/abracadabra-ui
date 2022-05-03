<template>
  <div class="tokens-popup">
    <div class="search-wrap">
      <p class="title">Select Farm</p>
      <input
        v-if="!isLoading"
        v-model="search"
        type="text"
        placeholder="Search"
        class="search-input"
      />
    </div>

    <div v-if="isLoading" class="loader-wrap">
      <BaseLoader />
    </div>

    <div v-else-if="filteredTokens.length" class="tokens-list">
      <TokenPopupItem
        v-for="(token, i) in filteredTokens"
        @click="selectToken(token)"
        :key="i"
        :name="token.name"
        :icon="token.icon"
        :farmItem="token"
        :balance="token.accountInfo ? token.accountInfo.balance : null"
        :price="token.lpPrice"
      />
    </div>

    <div class="not-found" v-else-if="!filteredTokens.length && tokens.length">
      <img
        class="not-found__img"
        src="@/assets/images/empty-stats-list.png"
        alt=""
      />
      <p class="not-found__text">No farms found with this name</p>
    </div>
    <div class="not-found" v-else-if="!tokens.length">
      <img
        class="not-found__img"
        src="@/assets/images/empty-stats-list.png"
        alt=""
      />
      <p class="not-found__text">NO FARMS ON THIS NETWORK</p>
      <p class="not-found__text">in the future they will be displayed here</p>
    </div>
  </div>
</template>

<script>
const BaseLoader = () => import("@/components/base/BaseLoader");
const TokenPopupItem = () => import("@/components/popups/TokenPopupItem");

export default {
  props: {
    tokens: {
      type: Array,
      default: () => [],
    },
    isUnstake: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({ search: "" }),
  methods: {
    selectToken(chainId) {
      this.$emit("select", chainId);
      this.$emit("close");
    },
  },
  computed: {
    filteredTokens() {
      return !this.search
        ? this.tokens
        : this.tokens.filter(
            ({ name }) =>
              name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
          );
    },
    isLoading() {
      return this.$store.getters.getFarmPoolLoading;
    },
  },
  components: {
    BaseLoader,
    TokenPopupItem,
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
  padding: 10px 10px 20px 10px;
  border-bottom: solid 1px rgba(255, 255, 255, 0.1);
}

.tokens-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 500px;
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
.loader-wrap {
  display: flex;
  justify-content: center;
  margin-top: 52px;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 30px 10px;
}

.not-found__img {
  width: 186px;
  max-width: 100%;
  height: auto;
  margin-bottom: 19px;
}
</style>
