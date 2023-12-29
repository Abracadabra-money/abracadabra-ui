<template>
  <TokenInput
    :value="inputValue"
    :name="collateralToken.name"
    :icon="collateralToken.icon"
    :max="maxToRemove"
    :decimals="collateralToken.decimals"
    :tokenPrice="collateralToken.price"
    isBigNumber
    @updateInputValue="onUpdateWithdrawValue"
  />
</template>

<script lang="ts">
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
// @ts-ignore
import { mapGetters } from "vuex";
import { trimZeroDecimals } from "@/helpers/numbers";
import { getMaxCollateralToRemove } from "@/helpers/cauldron/utils";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";
import { PERCENT_PRESITION } from "@/helpers/cauldron/utils";

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
    inputAmpunt(value) {
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
    TokenInput: defineAsyncComponent(
      () => import("@/components/market/TokenInput.vue")
    ),
  },
};
</script>

<style lang="scss" scoped></style>
