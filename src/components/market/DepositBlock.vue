<template>
  <div class="deposit-wrap">
    <div>
      <div class="row">
        <h3 class="title">Deposit collateral</h3>
        <Toggle
          v-if="acceptNativeToken && nativeToken"
          :selected="useNativeToken"
          :text="nativeToken.name"
          @updateToggle="() => toggleNativeToken()"
        />

        <Toggle
          v-if="acceptUnwrapToken && unwrappedToken"
          :selected="useUnwrapToken"
          :text="unwrappedToken.name"
          @updateToggle="() => toggleUnwrapToken()"
        />
      </div>

      <h4 class="subtitle">
        Select the amount of {{ activeToken.name }} to deposit in the Cauldron
      </h4>
    </div>

    <TokenInput
      :value="inputValue"
      :name="activeToken.name"
      :icon="activeToken.icon"
      :max="activeToken.balance"
      :decimals="activeToken.decimals"
      :tokenPrice="activeToken.price"
      isBigNumber
      @updateInputValue="onUpdateDepositValue"
    />
  </div>
</template>

<script lang="ts">
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { getChainById } from "@/helpers/chains";
import { MAX_ALLOWANCE_VALUE } from "@/constants/cauldron";
// @ts-ignore
import { mapGetters } from "vuex";
import { applyTokenWrapperRate } from "@/helpers/cauldron/utils";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";

import { trimZeroDecimals } from "@/helpers/numbers";

type ActiveToken = {
  name: string;
  icon: string;
  balance: BigNumber;
  decimals: number;
  allowance: BigNumber;
  isNative?: boolean;
  price: string;
  contract?: any;
};

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
    inputAmpunt: {
      type: BigNumber,
    },
    useNativeToken: {
      type: Boolean,
    },
    useUnwrapToken: {
      type: Boolean,
    },
    toggleNativeToken: {
      type: Function,
      default: () => {},
    },
    toggleUnwrapToken: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {
      inputValue: "",
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    acceptNativeToken() {
      return this.cauldron.config.cauldronSettings.acceptUseDefaultBalance;
    },

    acceptUnwrapToken() {
      return !!this.cauldron.config?.wrapInfo;
    },

    activeToken(): ActiveToken {
      if (this.useNativeToken) return this.nativeToken;
      if (this.useUnwrapToken) return this.unwrappedToken;
      return this.collateralToken;
    },

    nativeToken() {
      const { config, userTokensInfo, mainParams, additionalInfo } =
        this.cauldron;
      const { nativeTokenBalance } = userTokensInfo;
      const { decimals } = config.collateralInfo;
      const { symbol, baseTokenIcon }: any = getChainById(config.chainId);

      const { collateralPrice } = mainParams;
      const { tokensRate } = additionalInfo;

      const price = collateralPrice
        .mul(expandDecimals(1, decimals))
        .div(tokensRate);

      return {
        name: symbol,
        icon: baseTokenIcon,
        balance: nativeTokenBalance,
        decimals: 18,
        allowance: BigNumber.from(MAX_ALLOWANCE_VALUE),
        isNative: true,
        price: utils.formatUnits(price, decimals),
      };
    },

    unwrappedToken() {
      const { config, userTokensInfo, additionalInfo, mainParams } =
        this.cauldron;
      const { decimals } = config.collateralInfo;
      const { name, icon } = config.wrapInfo.unwrappedToken;
      const { unwrappedTokenBalance, unwrappedTokenAllowance } = userTokensInfo;
      const { collateralPrice } = mainParams;
      const { tokensRate } = additionalInfo;

      const price = collateralPrice
        .mul(expandDecimals(1, decimals))
        .div(tokensRate);

      return {
        name,
        icon,
        balance: unwrappedTokenBalance,
        decimals,
        allowance: unwrappedTokenAllowance,
        contract: this.cauldron.contracts?.unwrappedToken,
        price: utils.formatUnits(price, decimals),
      };
    },

    collateralToken() {
      const { config, userTokensInfo, mainParams } = this.cauldron;
      const { collateralPrice } = mainParams;
      const { icon } = config;
      const { name, decimals } = config.collateralInfo;
      const { collateralBalance, collateralAllowance } = userTokensInfo;

      return {
        name,
        icon,
        balance: collateralBalance,
        decimals,
        allowance: collateralAllowance,
        contract: this.cauldron.contracts?.collateral,
        price: utils.formatUnits(collateralPrice, decimals),
      };
    },
  },

  watch: {
    useUnwrapToken() {
      this.setEmptyState();
    },

    useNativeToken() {
      this.setEmptyState();
    },

    inputAmpunt(value) {
      const { decimals } = this.activeToken;

      if (value.eq(0)) {
        this.inputValue = "";
        return false;
      }

      this.inputValue = trimZeroDecimals(utils.formatUnits(value, decimals));
    },
  },

  methods: {
    setEmptyState() {
      const depositAmounts = {
        inputAmount: BigNumber.from(0),
        collateralTokenAmount: BigNumber.from(0),
        unwrapTokenAmount: BigNumber.from(0),
      };

      this.$emit("updateDepositAmounts", depositAmounts);

      this.inputValue = "";
    },

    onUpdateDepositValue(value: BigNumber | null) {
      if (value === null) return this.setEmptyState();

      const { tokensRate } = this.cauldron.additionalInfo;
      const { decimals } = this.cauldron.config.collateralInfo;

      const collateralTokenAmount = this.useUnwrapToken
        ? applyTokenWrapperRate(value, tokensRate, decimals)
        : value;

      const unwrapTokenAmount = this.useUnwrapToken ? value : BigNumber.from(0);

      const depositAmounts = {
        inputAmount: value,
        collateralTokenAmount,
        unwrapTokenAmount,
      };

      this.$emit("updateDepositAmounts", depositAmounts);
    },
  },

  components: {
    TokenInput: defineAsyncComponent(
      () => import("@/components/market/TokenInput.vue")
    ),
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
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

.deposit-wrap {
  @include block-wrap;
}

.borrow-wrap {
  @include block-wrap;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 370px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
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
