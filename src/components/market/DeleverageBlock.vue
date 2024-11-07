<template>
  <div class="deleverage-block">
    <div>
      <div class="row">
        <div class="title-wrap">
          <h3 class="title">To repay</h3>

          <SlippagePopup
            :amount="slippage"
            @updateSlippage="onUpdateSlippage"
          />
        </div>

        <Toggle
          :selected="true"
          text="Deleverage"
          @updateToggle="onToggleDeleverage"
        />
      </div>

      <h4 class="subtitle">Chose the amount of MIM you want to repay</h4>
    </div>

    <BaseTokenInput
      :value="inputAmount"
      :name="cauldron.config.mimInfo.name"
      :icon="cauldron.config.mimInfo.icon"
      :decimals="cauldron.config.mimInfo.decimals"
      :max="maxToRepay"
      isBigNumber
      primaryMax
      @updateInputValue="onUpdateInputAmount"
    />

    <div class="dynamic-wrap" v-if="showDynamicBlock">
      <DynamicFee
        v-if="!hideDynamicFee"
        :isClose="true"
        :amount="deleverageAmounts.amountToMin"
        :mimAddress="cauldron.config.mimInfo.address"
        :chainId="cauldron.config.chainId"
      />

      <GmPriceImpact
        v-if="cauldron.config.cauldronSettings.isGMXMarket"
        :cauldronObject="cauldron"
        :amount="deleverageAmounts.amountFrom"
        :actionType="2"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  getLiquidationPrice,
  getPositionHealth,
  getDeleverageAmounts,
} from "@/helpers/cauldron/utils";
import { mapGetters } from "vuex";
import type { PropType } from "vue";
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { trimZeroDecimals } from "@/helpers/numbers";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { BERA_BARTIO_CHAIN_ID, KAVA_CHAIN_ID } from "@/constants/global";

export default {
  props: {
    cauldron: {
      type: Object as PropType<CauldronInfo>,
      required: true,
    },
    slippage: {
      type: BigNumber,
    },
    deleverageAmounts: {
      default: {
        amountFrom: BigNumber.from(0),
        amountToMin: BigNumber.from(0),
      },
    },
    withdrawAmount: {
      type: BigNumber,
      default: BigNumber.from(0),
    },
  },

  data() {
    return {
      value: BigNumber.from(0),
    };
  },

  emits: ["updateDeleverageAmounts", "updateSlippage", "updateToggle"],

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    inputAmount() {
      const repayAmount = this.deleverageAmounts.amountToMin
        ? this.deleverageAmounts.amountToMin
        : BigNumber.from(0);
      if (repayAmount.eq(BigNumber.from(0))) {
        return "";
      }
      return trimZeroDecimals(
        utils.formatUnits(repayAmount, this.cauldron.config.mimInfo.decimals)
      );
    },

    showDynamicBlock() {
      return (
        !this.hideDynamicFee ||
        this.cauldron.config.cauldronSettings.isGMXMarket
      );
    },

    hideDynamicFee() {
      const disabledChains = [KAVA_CHAIN_ID, BERA_BARTIO_CHAIN_ID];

      return disabledChains.indexOf(this.cauldron.config.chainId) !== -1;
    },

    maxToRepay() {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      return userBorrowAmount;
    },

    expectedBorrowAmount() {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;

      const { amountToMin } = this.deleverageAmounts;

      const expectedBorrowAmount = userBorrowAmount.sub(amountToMin);

      return expectedBorrowAmount.lt(0)
        ? BigNumber.from(0)
        : expectedBorrowAmount;
    },

    expectedCollateralAmount() {
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;
      const { amountFrom } = this.deleverageAmounts;

      const expectedCollateralAmount = userCollateralAmount
        .sub(amountFrom)
        .sub(this.withdrawAmount);

      return expectedCollateralAmount.lt(0)
        ? BigNumber.from(0)
        : expectedCollateralAmount;
    },

    expectedLiquidationPrice() {
      return getLiquidationPrice(
        this.expectedBorrowAmount,
        this.expectedCollateralAmount,
        this.cauldron.config.mcr,
        this.cauldron.config.collateralInfo.decimals
      );
    },

    positionHealth() {
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const { decimals } = this.cauldron.config.collateralInfo;

      const { status } = getPositionHealth(
        this.expectedLiquidationPrice,
        oracleExchangeRate,
        decimals
      );

      return status;
    },
  },

  watch: {
    slippage() {
      this.updateDeleverageAmounts(this.value);
    },
  },

  methods: {
    onUpdateInputAmount(value: BigNumber) {
      this.value = value;
      this.updateDeleverageAmounts(value);
    },

    onUpdateSlippage(slippage: BigNumber) {
      this.$emit("updateSlippage", slippage);
    },

    onToggleDeleverage() {
      this.$emit("updateToggle", "useDeleverage", true);
    },

    updateDeleverageAmounts(value: BigNumber) {
      const { oracleExchangeRate } = this.cauldron.mainParams;

      const deleverageAmounts = getDeleverageAmounts(
        value,
        this.slippage!,
        oracleExchangeRate
      );

      this.$emit("updateDeleverageAmounts", deleverageAmounts);
    },
  },

  components: {
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    DynamicFee: defineAsyncComponent(
      () => import("@/components/market/DynamicFee.vue")
    ),
    GmPriceImpact: defineAsyncComponent(
      () => import("@/components/market/GmPriceImpact.vue")
    ),

    SlippagePopup: defineAsyncComponent(
      () => import("@/components/popups/SlippagePopup.vue")
    ),
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
  },
};
</script>

<style lang="scss" scoped>
.deleverage-block {
  gap: 16px;
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-wrap {
  gap: 16px;
  display: flex;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
}

.subtitle {
  color: #878b93;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.dynamic-wrap {
  border-radius: 8px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  padding: 5px 12px;
}
</style>
