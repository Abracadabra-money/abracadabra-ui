<template>
  <div class="info-list">
    <div v-for="(item, i) in infoData" :key="i" class="info-item">
      <span>
        <img
          src="@/assets/images/info.svg"
          alt="info"
          v-tooltip="item.tooltip"
        />
        {{ item.name }}:</span
      >
      <span>{{ item.value }}{{ item.name !== "Price" ? "%" : "" }}</span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  props: {
    infoArr: {
      type: Array,
    },

    pool: {
      type: Object,
    },

    price: {
      type: [String, Number],
    },
  },

  computed: {
    infoData() {
      if (this.infoArr) return this.infoArr;

      return this.info;
    },

    info() {
      let info = [
        {
          name: "Maximum collateral ratio",
          value: this.pool.ltv,
          tooltip:
            "Maximum collateral ratio (MCR) - MCR represents the maximum amount of debt a user can borrow with a selected collateral token.",
        },
        {
          name: "Liquidation fee",
          value: this.pool.stabilityFee,
          tooltip:
            "This is the discount a liquidator gets when buying collateral flagged for liquidation.",
        },
        {
          name: "Borrow fee",
          value: this.pool.borrowFee,
          tooltip: "This fee is added to your debt every time you borrow MIM.",
        },
        {
          name: "Interest",
          value: this.pool.interest,
          tooltip:
            "This is the annualized percent that your debt will increase each year.",
        },
      ];

      if (this.price) {
        info.push({
          name: "Price",
          value: Vue.filter("formatExactPrice")(this.price),
          tooltip: "Price of one collateral token",
        });
      }

      return info;
    },
  },
};
</script>

<style lang="scss" scoped>
.info-item {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-item {
  span {
    display: flex;
    align-items: center;
  }

  img {
    margin-right: 5px;
  }
}
</style>
