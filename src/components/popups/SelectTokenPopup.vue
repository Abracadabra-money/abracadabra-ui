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
      <template v-for="(token, i) in filteredTokens">
        <TokenPopupItem
          @click="selectToken(token)"
          :key="token.chainId"
          :name="token.name"
          :balance="
            !isUnstake
              ? token.userData.balance
              : token.userData.depositedBalance
          "
          :price="token.lpPrice"
          :icon="token.icon || selectIcon"
        />
        <div
          v-if="i !== filteredTokens.length - 1"
          class="token-spacer-wrap"
          :key="`spacer-${token.id}`"
        >
          <div class="token-spacer"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
const TokenPopupItem = () => import("@/components/popups/TokenPopupItem");

import selectIcon from "@/assets/images/select.svg";

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
  data: () => ({ search: "", selectIcon }),
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
  },
  components: {
    TokenPopupItem,
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
