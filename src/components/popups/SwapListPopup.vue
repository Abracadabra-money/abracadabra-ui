<template>
  <div class="popup-content">
    <h3 class="title">Select a token</h3>

    <InputSearch class="input-search" @input="changeSearch" />

    <template v-if="filteredTokensList.length">
      <h4 class="subtitle">Most traded</h4>

      <div class="popular-tokens">
        <div
          class="popular-token-item"
          v-for="token in popularTokens"
          :key="token.config.name"
          @click="$emit('updateSelectedToken', token)"
        >
          <img class="popular-token-icon" :src="token.config.icon" alt="" />
          <span class="popular-token-name">{{ token.config.name }}</span>
        </div>
      </div>

      <div class="line"></div>

      <div class="tokens-list">
        <div
          :class="[
            'token-item',
            { active: token.config.name === selectedToken.config.name },
          ]"
          v-for="token in filteredTokensList"
          :key="token.config.name"
          @click="$emit('updateSelectedToken', token)"
        >
          <div class="token-info">
            <div class="wrap-icon">
              <SelectedIcon />
            </div>
            <img class="token-icon" :src="token.config.icon" alt="" />
            <div>
              <div class="token-name">{{ token.config.name }}</div>
              <div class="token-chain">Ethereum</div>
            </div>
          </div>

          <div class="token-balances">
            <div class="token-balance">
              {{
                formatTokenBalance(
                  formatUnits(token.userInfo.balance, token.config.decimals)
                )
              }}
            </div>
            <div class="token-balance-usd">{{ getTokenBalance(token) }}</div>
          </div>
        </div>
      </div>
    </template>

    <div class="empty-wrap" v-else>
      <BaseSearchEmpty text="There are no Token" />
    </div>
  </div>
</template>

<script lang="ts">
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";

export default {
  props: {
    tokensList: {
      type: Array as () => any[],
      requred: true,
      default: () => [],
    },
    selectedToken: {
      type: Object as () => any,
      requred: true,
      default: () => {},
    },
  },

  data() {
    return {
      search: "",
    };
  },

  computed: {
    filteredTokensList() {
      if (!this.tokensList) return [];

      return this.search
        ? this.tokensList.filter(
            ({ config }) =>
              config.name.toLowerCase().indexOf(this.search.toLowerCase()) !==
              -1
          )
        : this.tokensList;
    },

    popularTokens() {
      return this.tokensList.filter(({ isPopular }) => isPopular);
    },
  },

  methods: {
    formatUnits,
    formatTokenBalance,

    changeSearch({ target }: any) {
      this.search = target.value;
    },

    getTokenBalance(token: any) {
      return formatUSD(
        +formatUnits(token.userInfo.balance, token.config.decimals) *
          token.price
      );
    },
  },

  components: {
    InputSearch: defineAsyncComponent(
      () => import("@/components/ui/inputs/InputSearch.vue")
    ),
    BaseSearchEmpty: defineAsyncComponent(
      () => import("@/components/base/BaseSearchEmpty.vue")
    ),
    SelectedIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/SelectedIcon.vue")
    ),
  },
};
</script>

<style lang="scss">
@include scrollbar;

.popup-content {
  gap: 16px;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
}

.input-search {
  width: 100% !important;
}

.subtitle {
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
}

.popular-tokens {
  gap: 12px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.popular-token-item {
  gap: 4px;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(111, 111, 111, 0.06);
  cursor: pointer;
}

.popular-token-icon {
  width: 24px;
  height: 24px;
}

.line {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    270deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
}

.tokens-list {
  padding-right: 5px;
  gap: 16px;
  display: flex;
  flex-direction: column;
  min-height: 314px;
  max-height: 314px;
  overflow-y: scroll;
}

.token-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.token-info {
  position: relative;
  gap: 8px;
  display: flex;
  align-items: center;
}

.wrap-icon {
  display: none;
  position: absolute;
  top: -2px;
  left: 24px;
}

.active {
  .wrap-icon {
    display: block;
  }
}

.token-icon {
  width: 32px;
  height: 32px;
}

.token-name,
.token-balance {
  font-weight: 500;
  line-height: normal;
}

.token-chain,
.token-balance-usd {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  line-height: 14px;
}

.token-balance-usd {
  text-align: right;
}

.empty-wrap {
  height: 385px;
}
</style>
