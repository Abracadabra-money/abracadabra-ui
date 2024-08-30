<template>
  <BaseTokenInput
    primary-max
    :value="inputValue"
    :name="collateralToken.name"
    :icon="collateralToken.icon"
    :max="maxToRemove"
    :decimals="collateralToken.decimals"
    :tokenPrice="collateralToken.price"
    isBigNumber
    @updateInputValue="onUpdateWithdrawValue"
  />

  <div class="expected-amount" v-if="withdrawUnwrapToken">
    <span> Expected</span>
    <span
      >{{ expectedTokenAmount }}
      {{ cauldron.config.wrapInfo.unwrappedToken.name }}</span
    >
  </div>
</template>

<script lang="ts">
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { trimZeroDecimals } from "@/helpers/numbers";
import { getMaxCollateralToRemove } from "@/helpers/cauldron/utils";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";
import { PERCENT_PRESITION } from "@/helpers/cauldron/utils";
import { formatToFixed } from "@/helpers/filters";
import { formatUnits } from "viem";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
    inputAmount: {
      type: BigNumber,
    },
    repayAmount: {
      type: BigNumber,
    },
    withdrawUnwrapToken: {
      type: Boolean,
      default: true,
    },
  },

  emits: ["updateWithdrawAmount"],

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

    expectedTokenAmount() {
      const price = 100000;
      const { decimals } = this.cauldron.config.collateralInfo;
      const { collateralPrice } = this.cauldron.mainParams.alternativeData;

      const precision =
        Number(formatUnits(collateralPrice, decimals)) > price ? 6 : 2;

      return formatToFixed(
        +this.inputValue *
          +utils.formatUnits(this.cauldron.additionalInfo.tokensRate),
        precision
      );
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

    maxToRemove() {
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const { oracleExchangeRate } = this.cauldron.mainParams;

      const mcr = expandDecimals(this.cauldron.config.mcr, PERCENT_PRESITION);
      const expectedBorrowAmount = userBorrowAmount.sub(this.repayAmount);

      const maxToRemove = getMaxCollateralToRemove(
        userCollateralAmount,
        expectedBorrowAmount,
        mcr,
        oracleExchangeRate
      );

      if (maxToRemove.gt(userCollateralAmount)) return userCollateralAmount;

      return maxToRemove;
    },
  },

  watch: {
    inputAmount(value) {
      const { decimals } = this.collateralToken;

      if (value.eq(0)) {
        this.inputValue = "";
        return false;
      }

      this.inputValue = trimZeroDecimals(utils.formatUnits(value, decimals));
    },
  },

  methods: {
    setEmptyState() {
      this.$emit("updateWithdrawAmount", BigNumber.from(0));
      this.inputValue = "";
    },

    onUpdateWithdrawValue(value: BigNumber | null) {
      if (value === null) return this.setEmptyState();
      this.$emit("updateWithdrawAmount", value);
    },
  },

  components: {
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.expected-amount {
  margin-top: 16px;
  padding: 6px 12px;
  color: #878b93;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.42px;
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
</style>
