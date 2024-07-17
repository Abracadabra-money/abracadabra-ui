<template>
  <div class="popup-content">
    <h3 class="title">Select a token</h3>

    <InputSearch class="input-search" @input="changeSearch" />

    <template v-if="listToRender.length">
      <template v-if="popularTokens.length">
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
      </template>

      <div class="tokens-list">
        <div
          :class="[
            'token-item',
            { active: token.config.address === activeTokenAddress },
            {
              disabled: token.config.address === disabledTokenAddress,
            },
          ]"
          v-for="token in listToRender"
          :key="token.config.name"
          @click="updatedSelectedToken(token)"
        >
          <div class="token-info">
            <div class="wrap-icon">
              <SelectedIcon />
            </div>
            <img class="token-icon" :src="token.config.icon" alt="" />
            <div>
              <div class="token-name">{{ token.config.name }}</div>
            </div>
          </div>

          <div class="token-balances" v-if="token.userInfo">
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
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import type {
  PoolCreationTokenInfo,
  PoolCreationTokenConfig,
} from "@/configs/pools/poolCreation/types";
import customTokenConfigs from "@/configs/pools/poolCreation/tokens/custom";

const searchFields = ["name", "symbol", "address"];

export default {
  props: {
    tokensList: {
      type: Array as () => PoolCreationTokenInfo[],
      requred: true,
      default: () => [],
    },
    tokenType: {
      type: String,
      default: "base",
    },
    baseTokenAddress: {
      type: String,
      default: "",
    },
    quoteTokenAddress: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      search: "",
    };
  },

  computed: {
    filteredLocalTokensList() {
      return this.search
        ? this.tokensList.filter(({ config }) => this.checkForMatch(config))
        : this.tokensList;
    },

    filteredCustomTokensList() {
      return customTokenConfigs
        .filter((config) => this.checkForMatch(config))
        .map((config) => {
          return { config, price: 0, userInfo: undefined };
        });
    },

    listToRender() {
      return this.filteredLocalTokensList.length
        ? this.filteredLocalTokensList
        : this.filteredCustomTokensList;
    },

    popularTokens() {
      return this.tokensList.filter(({ config }) => config.isPopular);
    },

    activeTokenAddress() {
      if (this.tokenType === "base") return this.quoteTokenAddress;
      return this.baseTokenAddress;
    },

    disabledTokenAddress() {
      if (this.tokenType === "base") return this.baseTokenAddress;
      return this.quoteTokenAddress;
    },

    lowerCaseSearch() {
      return this.search.toLowerCase();
    },
  },

  methods: {
    formatUnits,
    formatTokenBalance,

    changeSearch(event: InputEvent) {
      const target = event.target as HTMLInputElement;
      this.search = target.value;
    },

    getTokenBalance(token: PoolCreationTokenInfo) {
      return formatUSD(
        +formatUnits(token.userInfo.balance, token.config.decimals) *
          token.price
      );
    },

    updatedSelectedToken(token: PoolCreationTokenInfo) {
      if (token.config.address !== this.disabledTokenAddress)
        this.$emit("updateSelectedToken", token);
    },

    checkForMatch(config: PoolCreationTokenConfig) {
      return searchFields.some((field) =>
        config[field as keyof PoolCreationTokenConfig]
          .toLowerCase()
          .includes(this.lowerCaseSearch)
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
  gap: 24px;
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

.disabled {
  color: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;

  .token-chain,
  .token-balance-usd {
    color: rgba(255, 255, 255, 0.3);
  }

  .token-icon {
    -webkit-filter: brightness(40%);
    filter: brightness(40%);
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
