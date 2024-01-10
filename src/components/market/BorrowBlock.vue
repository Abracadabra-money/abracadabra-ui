<template>
  <div class="market-actions-wrap">
    <TokenInput
      :value="inputValue"
      :name="borrowToken.name"
      :icon="borrowToken.icon"
      :max="maxToBorrow"
      :tokenPrice="borrowToken.price"
      isBigNumber
      @updateInputValue="onUpdateBorrowValue"
    />

    <div class="range-wrap" :key="2">
      <LtvRange
        :value="ltvRangeValue"
        :positionLtv="positionLtv"
        :mcr="cauldron.config.mcr"
        :max="cauldron.config.mcr"
        :risk="positionHealth"
        @updateValue="onUpdateBorrowValueByLtv"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  applyBorrowFee,
  getLiquidationPrice,
  getMaxToBorrow,
  getMimToBorrowByLtv,
  getPositionHealth,
  getUserLtv,
} from "@/helpers/cauldron/utils";
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
// @ts-ignore
import { mapActions, mapGetters, mapMutations } from "vuex";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";
import { trimZeroDecimals } from "@/helpers/numbers";
import { PERCENT_PRESITION } from "@/helpers/cauldron/utils";
const MIM_PRICE = 1;

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
    inputAmount: {
      type: BigNumber,
    },
    collateralTokenAmount: {
      type: BigNumber,
    },
  },

  emits: ["updateBorrowAmount"],

  data() {
    return {
      inputValue: "",
      ltvRangeValue: "",
    };
  },

  watch: {
    inputAmount(value) {
      if (value.eq(0)) {
        this.inputValue = "";
        return false;
      }

      this.inputValue = trimZeroDecimals(utils.formatUnits(value));
    },
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    maxToBorrow() {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const mcr = expandDecimals(this.cauldron.config.mcr, PERCENT_PRESITION);

      return getMaxToBorrow(
        this.expectedCollateralAmount,
        userBorrowAmount,
        mcr,
        oracleExchangeRate
      );
    },

    expectedCollateralAmount() {
      return this.cauldron.userPosition.collateralInfo.userCollateralAmount.add(
        this.collateralTokenAmount
      );
    },

    expectedBorrowAmount() {
      const { borrowFee } = this.cauldron.mainParams;
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;

      //@ts-ignore
      return applyBorrowFee(this.inputAmount, borrowFee * 1000).add(
        userBorrowAmount
      );
    },

    borrowToken() {
      const { config, userTokensInfo } = this.cauldron;
      return {
        name: config.mimInfo.name,
        icon: config.mimInfo.icon,
        balance: userTokensInfo.mimBalance,
        price: MIM_PRICE,
      };
    },

    positionLtv() {
      const positionLtv = utils.formatUnits(
        getUserLtv(
          this.expectedCollateralAmount,
          this.expectedBorrowAmount,
          this.cauldron.mainParams.oracleExchangeRate
        ),
        PERCENT_PRESITION
      );

      return Math.ceil(Number(positionLtv));
    },

    positionHealth() {
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const { decimals } = this.cauldron.config.collateralInfo;

      const expectedLiquidationPrice = getLiquidationPrice(
        this.expectedBorrowAmount,
        this.expectedCollateralAmount,
        this.cauldron.config.mcr,
        this.cauldron.config.collateralInfo.decimals
      );

      const { status } = getPositionHealth(
        expectedLiquidationPrice,
        oracleExchangeRate,
        decimals
      );

      return status;
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    setEmptyState() {
      const borrowAmount = BigNumber.from(0);
      this.$emit("updateBorrowAmount", borrowAmount);
      this.inputValue = "";
    },

    onUpdateBorrowValue(value: BigNumber | null) {
      if (value === null) return this.setEmptyState();
      this.$emit("updateBorrowAmount", value);
    },

    onUpdateBorrowValueByLtv(value: number) {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const ltv = expandDecimals(value, PERCENT_PRESITION);
      const mcr = expandDecimals(this.cauldron.config.mcr, PERCENT_PRESITION);

      const mimToBorrow = getMimToBorrowByLtv(
        ltv,
        mcr,
        this.expectedCollateralAmount,
        userBorrowAmount,
        this.cauldron.mainParams.oracleExchangeRate
      );

      this.inputValue = utils.formatUnits(mimToBorrow);
    },
  },

  components: {
    TokenInput: defineAsyncComponent(
      () => import("@/components/market/TokenInput.vue")
    ),
    LtvRange: defineAsyncComponent(
      () => import("@/components/ui/range/LtvRange.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.market-actions-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
