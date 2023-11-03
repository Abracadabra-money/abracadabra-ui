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

    <div class="card" v-for="category in feesByCategory">
      <h4 class="cart-title">{{ category.name }}</h4>
      <p class="card-value">$ {{ category.value }}</p>
    </div>
  </div>
</template>

<script>
import {
  getTotal,
  getByChain,
  getByCauldron,
  getFeesByCategory,
  queryMethods,
} from "@/helpers/analytics/getTotal";

import filters from "@/filters";

export default {
  props: {
    cauldronsData: { type: Array },
  },

  data() {
    return {
      feesByCategory: [],
    };
  },

  computed: {
    totalValueLocked() {
      return filters.formatNumber(
        getTotal(this.cauldronsData, queryMethods.VALUE_LOCKED)
      );
    },

    totalMimBorrowed() {
      return filters.formatNumber(
        getTotal(this.cauldronsData, queryMethods.MIM_BORROWED)
      );
    },

    totalFeesGenerated() {
      const totalFeesGenerated = getTotal(
        this.cauldronsData,
        queryMethods.FEES_GENERATED
      );
      return {
        native: totalFeesGenerated,
        formatted: filters.formatNumber(totalFeesGenerated),
      };
    },
  },

  async created() {
    this.feesByCategory = await getByChain(queryMethods.MIM_BORROWED);
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
