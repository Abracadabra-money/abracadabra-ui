<template>
  <div class="swap-view">
    <div class="swap-wrapper">
      <div class="swap-head">
        <h3 class="head-title">MIM SWAP</h3>

        <SwapSettingsPopup />
      </div>

      <div class="swap-body">
        <SwapForm
          :fromToken="fromToken"
          :toToken="toToken"
          @openTokensPopup="openTokensPopup"
        />

        <div class="swap-info">
          <div class="swap-info-item">
            <div class="info-title">Current price</div>
            <div class="info-value">
              <SwapIcon fill="#7088CC" />
              <span>1 GLP = 1,636.39 ETH</span>
              <span class="info-price">($1,687.87)</span>
            </div>
          </div>
          <div class="swap-info-item">
            <div class="info-title">Price Impact</div>
            <div class="info-value">93.00%</div>
          </div>
          <div class="swap-info-item">
            <div class="info-title">Minimum received</div>
            <div class="info-value">0.242371 DAI</div>
          </div>
          <div class="swap-info-item">
            <div class="info-title">Network Fee</div>
            <div class="info-value"><FeeIcon /> $0.01</div>
          </div>
        </div>

        <div class="router-wrap">
          <h4 class="title">Auto Router</h4>

          <div class="router">
            <div class="dashed"></div>
            <img
              class="token-icon"
              src="@/assets/images/tokens/MIM.png"
              alt=""
            />
            <img
              class="token-icon"
              src="@/assets/images/tokens/SPELL.png"
              alt=""
            />
            <img
              class="token-icon"
              src="@/assets/images/tokens/ETH.png"
              alt=""
            />
          </div>

          <p class="text">
            This route optimizes your total output by considering split routes,
            multiple hops, and the gas cost of each step.
          </p>
        </div>

        <!-- :disabled="disableBtn"
      @click="actionHandler" -->
        <BaseButton :primary="true"> Swap</BaseButton>
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
      fromInputValue: "",
      toInputValue: "",
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
    openTokensPopup(type: string) {
      this.tokenType = type;
      this.isTokensPopupOpened = true;
    },

    updateSelectedToken(token: any) {
      if (this.tokenType === "from") this.fromToken = token;
      else this.toToken = token;

      this.isTokensPopupOpened = false;
    },

    updateFromValue(value: any) {
      console.log("updateFromValue", value);
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
    SwapIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/SwapIcon.vue")
    ),
    FeeIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/FeeIcon.vue")
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

.head-title {
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

.swap-info,
.router-wrap {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.swap-info-item {
  display: flex;
  justify-content: space-between;
  color: #878b93;
  line-height: normal;
  flex-wrap: wrap;
}

.info-value {
  font-weight: 500;
  gap: 4px;
  display: flex;
  align-items: center;
}

.info-price {
  color: #575c62;
}

.title {
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
}

.router {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashed {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 1px;
  width: 100%;
  background-image: linear-gradient(
    90deg,
    #7088cc,
    #7088cc 65%,
    transparent 65%,
    transparent 100%
  );
  background-size: 20px 1px;
  border: none;
}

.token-icon {
  z-index: 1;
  width: 20px;
  height: 20px;
}

.text {
  color: #878b93;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
}

@media screen and (max-width: 600px) {
  .head-title {
    font-size: 24px;
  }

  .swap-body {
    padding: 16px;
    gap: 20px;
  }
}
</style>
