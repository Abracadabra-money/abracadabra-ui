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
      <span v-if="item.loading" class="loader"></span>
      <span v-else>
        {{ item.value }}{{ item.name !== "Price" ? "%" : "" }}</span
      >
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { getGlpApr } from "@/helpers/glpApr";
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

  data() {
    return {
      glpLoading: true
    }
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    infoData() {
      if (this.infoArr) return this.infoArr;

      return this.info;
    },

    isGlpPool() {
      return this.pool.id === 2 && this.chainId === 42161;
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

      if (this.isGlpPool) {
        info.push({
          loading: this.glpLoading,
          name: "Self Repaying APY",
          value: `${this.selfRepayingAPY || "~"}`,
          tooltip: `Used to repay the borrowing, Up to 10%.`,
        });

        info.push({
          loading: this.glpLoading,
          name: "Management Fee",
          value: `${this.managementFee || "~"}`,
          tooltip: `Fees when the APY outperform 10%`,
        });
      }

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

  watch: {
    async pool() {
      const { selfRepayingAPY, managementFee } = await getGlpApr();
      this.selfRepayingAPY = parseFloat(selfRepayingAPY).toFixed(2);
      this.managementFee = parseFloat(managementFee).toFixed(2);
      this.glpLoading = false;
    },
  },

  async created() {
    if (this.pool) {
      const { selfRepayingAPY, managementFee } = await getGlpApr();
      this.selfRepayingAPY = parseFloat(selfRepayingAPY).toFixed(2);
      this.managementFee = parseFloat(managementFee).toFixed(2);
      this.glpLoading = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.loader {
  margin-right: 15px;
  position: relative;
  // top: 2px;
  display: block;
  width: 8px;
  // height: 30px;
  animation: rectangle infinite 1s ease-in-out -0.2s;
  border-radius: 4px;
  background-color: #fff;
}
.loader:before,
.loader:after {
  position: absolute;

  width: 8px;
  height: 8px;
  border-radius: 4px;

  content: "";

  background-color: #fff;
}
.loader:before {
  left: -10px;
  animation: rectangle infinite 1s ease-in-out -0.4s;
}
.loader:after {
  right: -10px;
  animation: rectangle infinite 1s ease-in-out;
}

@keyframes rectangle {
  0%,
  80%,
  100% {
    height: 6px;
  }
  40% {
    height: 8px;
  }
}

.info-item {
  display: flex;
  align-items: center;
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
    cursor: pointer;
  }
}
</style>
