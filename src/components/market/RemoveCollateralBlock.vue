<template>
  <div>
    <div>
      <div class="row">
        <h3 class="title">Remove collateral</h3>
      </div>

      <h4 class="subtitle">
        Select the amount of {{ collateralToken.name }} to withdraw from the
        Cauldron
      </h4>
    </div>

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
  </div>
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

      if(maxToRemove.gt(userCollateralAmount)) return userCollateralAmount;

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
