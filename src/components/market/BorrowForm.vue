<template>
  <div class="borrow-form">
    <div class="deposit-wrap">
      <DepositBlock
        :cauldron="cauldron"
        :inputAmpunt="borrowConfig.amounts.deposit.inputAmount"
        :useNativeToken="useNativeToken"
        :useUnwrapToken="useUnwrapToken"
        :toggleNativeToken="() => (useNativeToken = !useNativeToken)"
        :toggleUnwrapToken="() => (useUnwrapToken = !useUnwrapToken)"
        @updateDepositAmounts="onUpdateDepositAmounts"
      />
    </div>

    <div class="borrow-wrap">
      <div class="borrow-logic">
        <div class="borrow-head">
          <div class="borrow-head-row">
            <h3 class="title-wrap">
              <span> Borrow MIM</span>
              <SlippagePopup v-if="borrowConfig.useLeverage" />
            </h3>

            <Toggle
              :selected="borrowConfig.useLeverage"
              text="Leverage"
              @updateToggle="onToggleLeverage"
            />
          </div>

          <h4 class="subtitle">
            Select the amount of MIM to borrow from the Cauldron
          </h4>
        </div>

        <LeverageBlock
          v-if="borrowConfig.useLeverage"
          :depositCollateralAmount="
            borrowConfig.amounts.deposit.collateralTokenAmount
          "
          :leverageAmounts="borrowConfig.amounts.leverageAmounts"
          :cauldron="cauldron"
          @updateLeverageAmounts="onUpdateLeverageAmounts"
        />

        <BorrowBlock
          v-else
          :cauldron="cauldron"
          :inputAmount="borrowConfig.amounts.borrowAmount"
          :collateralTokenAmount="
            borrowConfig.amounts.deposit.collateralTokenAmount
          "
          @updateBorrowAmount="onUpdateBorrowAmount"
        />
      </div>

      <BaseButton primary disabled>Nothing to do </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { BigNumber } from "ethers";
import { defineAsyncComponent } from "vue";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
  },

  data() {
    return {
      useNativeToken: false,
      useUnwrapToken: false,
      // TODO: add types
      borrowConfig: {
        useLeverage: false,
        useDeleverage: true,
        amounts: {
          // TODO: rename to depositAmounts
          deposit: {
            inputAmount: BigNumber.from(0),
            collateralTokenAmount: BigNumber.from(0),
            unwrapTokenAmount: BigNumber.from(0),
          },
          borrowAmount: BigNumber.from(0),
          leverageAmounts: {
            amountFrom: BigNumber.from(0),
            amountToMin: BigNumber.from(0),
          },
          deleverageAmounts: {
            amountFrom: BigNumber.from(0),
            amountToMin: BigNumber.from(0),
          },
          repayAmount: BigNumber.from(0),
          withdrawAmount: BigNumber.from(0),
        },
      },
    };
  },

  watch: {
    useUnwrapToken() {
      this.setEmptyState(); // NOTICE: do we need this?
    },

    useNativeToken() {
      this.setEmptyState(); // NOTICE: do we need this?
    },

    borrowConfig: {
      handler(value) {
        this.$emit("updateBorrowConfig", value);
      },
      deep: true,
    },
  },

  methods: {
    setEmptyState() {
      this.borrowConfig = {
        useLeverage: false,
        useDeleverage: true,
        amounts: {
          // TODO: rename to depositAmounts
          deposit: {
            inputAmount: BigNumber.from(0),
            collateralTokenAmount: BigNumber.from(0),
            unwrapTokenAmount: BigNumber.from(0),
          },
          borrowAmount: BigNumber.from(0),
          leverageAmounts: {
            amountFrom: BigNumber.from(0),
            amountToMin: BigNumber.from(0),
          },
          deleverageAmounts: {
            amountFrom: BigNumber.from(0),
            amountToMin: BigNumber.from(0),
          },
          repayAmount: BigNumber.from(0),
          withdrawAmount: BigNumber.from(0),
        },
      };
    },

    onToggleLeverage() {
      // IMPORTANT: fix this
      this.borrowConfig = {
        useLeverage: !this.borrowConfig.useLeverage,
        useDeleverage: false,

        amounts: {
          // TODO: rename to depositAmounts
          deposit: this.borrowConfig.amounts.deposit,
          borrowAmount: BigNumber.from(0),
          leverageAmounts: {
            amountFrom: BigNumber.from(0),
            amountToMin: BigNumber.from(0),
          },
          deleverageAmounts: {
            amountFrom: BigNumber.from(0),
            amountToMin: BigNumber.from(0),
          },
          repayAmount: BigNumber.from(0),
          withdrawAmount: BigNumber.from(0),
        },
      };
    },

    onUpdateDepositAmounts(amounts: any) {
      this.borrowConfig.amounts.deposit = amounts;
      this.$emit("updateAmounts", this.borrowConfig.amounts);
    },

    onUpdateBorrowAmount(amount: BigNumber) {
      this.borrowConfig.amounts.borrowAmount = amount;
      this.$emit("updateAmounts", this.borrowConfig.amounts);
    },

    onUpdateLeverageAmounts(amounts: any) {
      this.borrowConfig.amounts.leverageAmounts = amounts;
      this.$emit("updateAmounts", this.borrowConfig.amounts);
    },
  },

  components: {
    DepositBlock: defineAsyncComponent(
      () => import("@/components/market/DepositBlock.vue")
    ),
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    SlippagePopup: defineAsyncComponent(
      () => import("@/components/popups/SlippagePopup.vue")
    ),
    LeverageBlock: defineAsyncComponent(
      () => import("@/components/market/LeverageBlock.vue")
    ),
    BorrowBlock: defineAsyncComponent(
      () => import("@/components/market/BorrowBlock.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.borrow-form {
  @include font;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 410px;
  width: 100%;
  height: 100%;
}

.deposit-wrap {
  @include block-wrap;
}

.borrow-wrap {
  @include block-wrap;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.borrow-logic {
  gap: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.borrow-head-row {
  height: 30px;
  display: flex;
  margin-bottom: 4px;
  align-items: center;
  justify-content: space-between;
}

.title-wrap {
  gap: 16px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
}

.subtitle {
  color: #878b93;
  font-size: 12px;
  line-height: 20px;
}
</style>
