<template>
  <div class="pool-creation-view">
    <div class="pool-creation-wrap">
      <div class="actions-block">
        <h3 class="pool-creation-title">Pool Creation</h3>

        <div class="action-form">
          <TokensSelector
            :baseToken="actionConfig.baseToken"
            :quoteToken="actionConfig.quoteToken"
            @updateTokenInputValue="updateTokenInputValue"
            @openTokensPopup="openTokensPopup"
          />

          <PriceSelector
            :baseToken="actionConfig.baseToken"
            :quoteToken="actionConfig.quoteToken"
          />

          <FeeTierSelector
            :poolType="actionConfig.poolType"
            v-if="actionConfig.poolType"
          />
          <EmptyState v-else>
            <span class="empty-state-main-text">Select Pool Type</span>
          </EmptyState>

          <BaseButton primary>Create</BaseButton>
        </div>
      </div>

      <div class="pool-creation-info-wrap">
        <CreationTypeTabs
          :poolType="actionConfig.poolType"
          @selectPoolType="selectPoolType"
        />
        <PoolCreationInfo @openSlippagePopup="isSlippagePopupOpened = true" />
      </div>
    </div>

    <SlippageCoefficientPopup
      v-if="isSlippagePopupOpened"
      @close="isSlippagePopupOpened = !isSlippagePopupOpened"
    />

    <LocalPopupWrap
      isFarm
      :isOpened="isTokensPopupOpened"
      @closePopup="isTokensPopupOpened = false"
    >
      <TokenListPopup
        :tokensList="tokenList"
        :tokenType="tokenType"
        :baseTokenAddress="actionConfig.baseToken.config.contract.address"
        :quoteTokenAddress="actionConfig.quoteToken.config.contract.address"
        @updateSelectedToken="updateSelectedToken"
      />
    </LocalPopupWrap>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { getTokenList } from "@/helpers/pools/poolCreation/getTokenList";
import type { PoolCreationTokenInfo } from "@/configs/pools/poolCreation/types";

const emptyPoolCreationTokenInfo: PoolCreationTokenInfo = {
  config: {
    name: "Select Token",
    chainId: 1,
    decimals: 18,
    icon: "",
    contract: { address: "0x", abi: "" },
  },
  userInfo: {
    balance: 0n,
    allowance: 0n,
  },
};

export enum TokenTypes {
  Base = "base",
  Quote = "quote",
}

export enum PoolTypes {
  Standard = "standard",
  Pegged = "pegged",
}

export type ActionConfig = {
  poolType: PoolTypes | null;
  baseToken: PoolCreationTokenInfo;
  quoteToken: PoolCreationTokenInfo;
  baseInputValue: bigint;
  quoteInputValue: bigint;
};

export default {
  data() {
    return {
      tokenList: [] as PoolCreationTokenInfo[],
      tokenType: "base",
      actionConfig: {
        poolType: null,
        baseToken: emptyPoolCreationTokenInfo,
        quoteToken: emptyPoolCreationTokenInfo,
        baseInputValue: 0n,
        quoteInputValue: 0n,
      } as ActionConfig,
      isTokensPopupOpened: false,
      isSlippagePopupOpened: false,
      updateInterval: null as NodeJS.Timeout | null,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),
  },

  methods: {
    updateTokenInputValue(type: TokenTypes, value: bigint) {
      this.actionConfig[`${type}InputValue`] = value;
    },

    openTokensPopup(type: TokenTypes) {
      this.tokenType = type;
      this.isTokensPopupOpened = true;
    },

    updateSelectedToken(token: PoolCreationTokenInfo) {
      if (this.tokenType === "quote") {
        if (this.actionConfig.baseToken.config.name === token.config.name) {
          this.actionConfig.baseToken = this.actionConfig.quoteToken;
          this.actionConfig.quoteToken = token;
        } else {
          this.actionConfig.quoteToken = token;
        }
      }

      if (this.tokenType === "base") {
        if (this.actionConfig.quoteToken.config.name === token.config.name) {
          this.actionConfig.quoteToken = this.actionConfig.baseToken;
          this.actionConfig.baseToken = token;
        } else {
          this.actionConfig.baseToken = token;
        }
      }

      this.isTokensPopupOpened = false;
    },

    selectPoolType(poolType: PoolTypes) {
      this.actionConfig.poolType = poolType;
    },
  },

  async created() {
    this.tokenList = await getTokenList(this.chainId, this.account);
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    EmptyState: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/PoolCreationEmptyState.vue")
    ),
    TokensSelector: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/TokensSelector.vue")
    ),
    PriceSelector: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/PriceSelector.vue")
    ),
    FeeTierSelector: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/FeeTierSelector.vue")
    ),
    CreationTypeTabs: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/CreationTypeTabs.vue")
    ),
    PoolCreationInfo: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/PoolCreationInfo.vue")
    ),
    SlippageCoefficientPopup: defineAsyncComponent(
      () =>
        import(
          "@/components/pools/poolCreation/popups/SlippageCoefficientPopup.vue"
        )
    ),
    LocalPopupWrap: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/popups/LocalPopupWrap.vue")
    ),
    TokenListPopup: defineAsyncComponent(
      () =>
        import(
          "@/components/pools/poolCreation/popups/PoolCreationTokenListPopup.vue"
        )
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-creation-view {
  min-height: 100vh;
}

.pool-creation-wrap {
  position: relative;
  max-width: 1310px;
  width: 100%;
  padding: 124px 15px 90px;
  display: grid;
  grid-template-columns: 520px 1fr;
  grid-gap: 24px;
  margin: 0 auto;
}

.actions-block {
  gap: 20px;
  display: flex;
  flex-direction: column;
}

.action-form {
  @include block-wrap;
  gap: 40px;
  display: flex;
  flex-direction: column;
}

.action-form::v-deep(.action-title) {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 500;
}

.pool-creation-info-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state-main-text {
  font-size: 18px;
  font-weight: 500;
}

@media screen and (max-width: 1200px) {
  .pool-creation-wrap {
    grid-template-columns: 400px 1fr;
  }
}

@media screen and (max-width: 1024px) {
  .pool-creation-wrap {
    grid-template-columns: 100%;
    grid-template-rows: auto;
  }
}

@media screen and (max-width: 600px) {
  .action-form {
    padding: 16px;
  }

  .empty-state-main-text {
    font-size: 16px;
  }
}
</style>
