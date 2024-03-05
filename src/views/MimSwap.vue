<template>
  <div class="swap-view">
    <div class="swap-wrapper">
      <div class="swap-head">
        <h3 class="title">MIM SWAP</h3>

        <SwapSettingsPopup />
      </div>

      <div class="swap-body">
        <SwapForm
          :fromToken="fromToken"
          :toToken="toToken"
          @openTokensPopup="openTokensPopup"
          @updateFromInputValue="updateFromValue"
          @updateToInputValue="updateToValue"
        />

        <SwapInfoBlock />

        <SwapRouterInfoBlock />

        <!-- :disabled="disableBtn" @click="actionHandler" -->
        <BaseButton :primary="true">Swap</BaseButton>
      </div>
    </div>

    <LocalPopupWrap
      isSwapPopup
      :isOpened="isTokensPopupOpened"
      @closePopup="isTokensPopupOpened = false"
    >
      <SwapListPopup
        :tokensList="tokensList"
        :popularTokens="popularTokens"
        :selectedToken="selectedToken"
        @updateSelectedToken="updateSelectedToken"
      />
    </LocalPopupWrap>
  </div>
</template>

<script lang="ts">
import { useImage } from "@/helpers/useImage";
import { defineAsyncComponent } from "vue";

const tokensList = [
  {
    name: "MIM",
    icon: useImage("assets/images/tokens/MIM.png"),
    balance: 10000000000000000000000n,
    price: 10_000000000000000000n,
    decimals: 18,
  },
  {
    name: "SPELL",
    icon: useImage("assets/images/tokens/SPELL.png"),
    balance: 30000000000000000000000n,
    price: 20_000000000000000000n,
    decimals: 18,
  },
  {
    name: "ETH",
    icon: useImage("assets/images/tokens/ETH.png"),
    balance: 70000000000000000000000n,
    price: 30_000000000000000000n,
    decimals: 18,
  },
];

const emptyToken = {
  name: "Select Token",
  icon: "",
  balance: 0n,
  price: "0",
  decimals: 18,
};

const popularTokens = [
  {
    name: "ETH",
    icon: useImage("assets/images/tokens/ETH.png"),
  },
  {
    name: "MIM",
    icon: useImage("assets/images/tokens/MIM.png"),
  },
  {
    name: "SPELL",
    icon: useImage("assets/images/tokens/SPELL.png"),
  },
];

export default {
  data() {
    return {
      fromToken: emptyToken as any,
      toToken: emptyToken,
      isTokensPopupOpened: false,
      tokensList,
      popularTokens,
      tokenType: "from",
      actionConfig: {
        fromInputValue: 0n,
        toInputValue: 0n,
      },
    };
  },

  computed: {
    selectedToken() {
      return this.tokenType === "from" ? this.fromToken : this.toToken;
    },
  },

  methods: {
    updateFromValue(value: bigint) {
      if (value === null) this.actionConfig.fromInputValue = 0n;
      else this.actionConfig.fromInputValue = value;
    },

    updateToValue(value: bigint) {
      if (value === null) this.actionConfig.toInputValue = 0n;
      else this.actionConfig.toInputValue = value;
    },

    updateSelectedToken(token: any) {
      if (this.tokenType === "from") this.fromToken = token;
      else this.toToken = token;

      this.isTokensPopupOpened = false;
    },

    openTokensPopup(type: string) {
      this.tokenType = type;
      this.isTokensPopupOpened = true;
    },
  },

  created() {
    this.fromToken = tokensList[0];
  },

  components: {
    SwapSettingsPopup: defineAsyncComponent(
      () => import("@/components/popups/SwapSettingsPopup.vue")
    ),
    SwapForm: defineAsyncComponent(
      () => import("@/components/swap/SwapForm.vue")
    ),
    SwapInfoBlock: defineAsyncComponent(
      () => import("@/components/swap/SwapInfoBlock.vue")
    ),
    SwapRouterInfoBlock: defineAsyncComponent(
      () => import("@/components/swap/SwapRouterInfoBlock.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    LocalPopupWrap: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/popups/LocalPopupWrap.vue")
    ),
    SwapListPopup: defineAsyncComponent(
      () => import("@/components/popups/SwapListPopup.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.swap-view {
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100vh;
  width: 100%;
}

.swap-wrapper {
  max-width: 550px;
  width: 100%;
  padding: 0 8px;
  margin: 0 auto;
}

.swap-head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  line-height: normal;
}

.swap-body {
  @include block-wrap;
  gap: 24px;
  display: flex;
  flex-direction: column;
}

@media screen and (max-width: 600px) {
  .title {
    font-size: 24px;
  }

  .swap-body {
    padding: 16px;
    gap: 20px;
  }
}
</style>
