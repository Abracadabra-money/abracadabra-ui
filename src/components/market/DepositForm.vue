<template>
  <div>
    <div class="row">
      <h3 class="title">Deposit collateral</h3>

      <Toggle
        v-if="cauldron.config.cauldronSettings.acceptUseDefaultBalance"
        :selected="useNativeToken"
        :text="nativeTokenName"
        @updateToggle="changeToggle('toogleUseNativeToken')"
      />

      <Toggle
        v-if="!!cauldron.config?.wrapInfo"
        :selected="useUnwrapToken"
        :text="toggleTokenName"
        @updateToggle="changeToggle('toogleUseUnwrapToken')"
      />
    </div>
    <h4 class="subtitle">
      Select the amount of GLP to deposit in the Cauldron
    </h4>
  </div>

  <!-- todo price -->
  <TokenInput
    :value="inputValue"
    :name="activeToken.name"
    :icon="activeToken.icon"
    :max="activeToken.balance"
    :decimals="activeToken.decimals"
    :tokenPrice="activeToken.price"
    isBigNumber
    @updateInputValue="updateInputValue"
  />
</template>

<script lang="ts">
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { applyTokenWrapperRate } from "@/helpers/cauldron/utils";
import { getChainById } from "@/helpers/chains";

export default {
  props: {
    useUnwrapToken: Boolean as any,
    useNativeToken: Boolean as any,
    cauldron: Object as any,
    depositInputValue: Object as any,
  },

  emits: [
    "updateCollateralValues",
    "toogleUseUnwrapToken",
    "toogleUseNativeToken",
  ],

  data() {
    return {
      inputValue: false,
    };
  },

  computed: {
    toggleTokenName() {
      if (this.cauldron.config?.wrapInfo?.useUnwrappedByDefault)
        return this.cauldron.config.name;
      return this.cauldron.config?.wrapInfo.unwrappedToken.name;
    },

    nativeTokenName() {
      const { symbol }: any = getChainById(this.cauldron.config.chainId);

      return symbol;
    },

    activeToken() {
      const { config, userTokensInfo, mainParams } = this.cauldron;
      const { collateralPrice } = mainParams;
      const { wrapInfo, name, icon, collateralInfo } = config;
      const { collateralBalance, unwrappedTokenBalance, nativeTokenBalance } =
        userTokensInfo;

      if (this.useNativeToken) {
        const { symbol, baseTokenIcon }: any = getChainById(config.chainId);

        return {
          name: symbol,
          icon: baseTokenIcon,
          balance: nativeTokenBalance,
          decimals: 18,
          price: utils.formatUnits(collateralPrice),
        };
      }

      if (wrapInfo?.useUnwrappedByDefault && !this.useUnwrapToken) {
        return {
          name: wrapInfo.unwrappedToken.name,
          icon: wrapInfo.unwrappedToken.icon,
          balance: unwrappedTokenBalance,
          decimals: collateralInfo.decimals,
          price: utils.formatUnits(collateralPrice),
        };
      }

      return {
        name,
        icon,
        balance: collateralBalance,
        decimals: collateralInfo.decimals,
        price: utils.formatUnits(collateralPrice),
      };
    },
  },

  watch: {
    useUnwrapToken() {
      this.inputValue = !this.inputValue;
    },

    depositInputValue() {
      this.inputValue = !this.inputValue;
    },
  },

  methods: {
    changeToggle(emit: any) {
      this.$emit(emit);
    },

    updateInputValue(value: any) {
      const { tokensRate } = this.cauldron.additionalInfo;
      const { decimals } = this.cauldron.config.collateralInfo;

      const isUnwrapToken = this.cauldron.config?.wrapInfo
        ?.useUnwrappedByDefault
        ? !this.useUnwrapToken
        : this.useUnwrapToken;

      const collateralTokenAmount = isUnwrapToken
        ? applyTokenWrapperRate(value, tokensRate, decimals)
        : value;

      const unwrapTokenAmount = value ? value : BigNumber.from(0);

      this.$emit("updateCollateralValues", {
        collateralTokenAmount,
        unwrapTokenAmount,
      });
    },
  },

  components: {
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    TokenInput: defineAsyncComponent(
      () => import("@/components/market/TokenInput.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.market-actions-wrap {
  @include font;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 410px;
  width: 100%;
}

.deposit-block,
.borrow-block {
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.borrow-block {
  height: 350px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
}

.subtitle {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
}

.dynamic-fee {
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dynamic-fee-title {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  display: flex;
  gap: 4px;
  align-items: center;
}

.dynamic-fee-value {
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  text-transform: uppercase;
}
</style>
