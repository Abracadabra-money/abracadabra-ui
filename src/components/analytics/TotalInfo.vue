<template>
  <h3>Total info</h3>
  <div class="total-value-cards">
    <div class="card">
      <h4 class="cart-title">Total Value Locked</h4>
      <p class="card-value">$ {{ totalValueLocked }}</p>
    </div>
    <div class="card">
      <h4 class="cart-title">Total Fees Generated</h4>
      <p class="card-value">$ {{ totalFeesGenerated.formatted }}</p>
    </div>
    <div class="card">
      <h4 class="cart-title">Total MIM Borrowed</h4>
      <p class="card-value">$ {{ totalMimBorrowed }}</p>
    </div>

    <div class="card">
      <h4 class="cart-title">Borrowing Fees</h4>
      <p class="card-value">$ {{ borrowingFees.formatted }}</p>
    </div>
    <div class="card">
      <h4 class="cart-title">Interest Fees</h4>
      <p class="card-value">$ {{ interestFees.formatted }}</p>
    </div>
    <div class="card">
      <h4 class="cart-title">Liquidation Fees</h4>
      <p class="card-value">$ {{ liquidationFees.formatted }}</p>
    </div>
    <div class="card">
      <h4 class="cart-title">Unregistered Fees</h4>
      <p class="card-value">$ {{ unregisteredFees.formatted }}</p>
    </div>
  </div>
</template>

<script>
import { getTotal } from "@/helpers/analytics/getTotal";
import { getFees } from "@/helpers/analytics/getFees";

import filters from "@/filters";

export default {
  props: {
    cauldronsData: { type: Array },
  },

  computed: {
    queryMethods() {
      return {
        VALUE_LOCKED: "totalValueLockedUsd",
        FEES_GENERATED: "totalFeesGenerated",
        MIM_BORROWED: "totalMimBorrowed",
        BORROWING_FEES: "borrowFeesGenerated",
        INTEREST_FEES: "interestFeesGenerated",
        LIQUIDATION_FEES: "liquidationFeesGenerated",
      };
    },

    totalValueLocked() {
      return filters.formatNumber(
        getTotal(this.cauldronsData, this.queryMethods.VALUE_LOCKED)
      );
    },

    totalMimBorrowed() {
      return filters.formatNumber(
        getTotal(this.cauldronsData, this.queryMethods.MIM_BORROWED)
      );
    },

    totalFeesGenerated() {
      const totalFeesGenerated = getTotal(
        this.cauldronsData,
        this.queryMethods.FEES_GENERATED
      );
      return {
        native: totalFeesGenerated,
        formatted: filters.formatNumber(totalFeesGenerated),
      };
    },

    borrowingFees() {
      const borrowingFees = getFees(
        this.cauldronsData,
        this.queryMethods.BORROWING_FEES
      );
      return {
        native: borrowingFees,
        formatted: filters.formatNumber(borrowingFees),
      };
    },

    interestFees() {
      const interestFees = getFees(
        this.cauldronsData,
        this.queryMethods.INTEREST_FEES
      );
      return {
        native: interestFees,
        formatted: filters.formatNumber(interestFees),
      };
    },

    liquidationFees() {
      const liquidationFees = getFees(
        this.cauldronsData,
        this.queryMethods.LIQUIDATION_FEES
      );
      return {
        native: liquidationFees,
        formatted: filters.formatNumber(liquidationFees),
      };
    },

    unregisteredFees() {
      const unregisteredFees =
        this.totalFeesGenerated.native -
        this.interestFees.native -
        this.liquidationFees.native -
        this.borrowingFees.native;

      return {
        native: unregisteredFees,
        formatted: filters.formatNumber(unregisteredFees),
      };
    },
  },
};
</script>

<style lang="scss">
.total-value-cards {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.card {
  max-width: 25%;
  margin: 20px;
  padding: 10px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 3px -2px,
    rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px;
  background-color: rgb(43, 43, 60);
  text-align: center;
}
</style>
