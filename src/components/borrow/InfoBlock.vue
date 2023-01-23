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
import { getVeloManagementFee } from "@/helpers/borrow/getVeloAPY";

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
      veloManagementFee: null,
    };
  },

  computed: {
    ...mapGetters({ chainId: "getChainId", signer: "getSigner" }),

    infoData() {
      if (this.infoArr) return this.infoArr;

      return this.info;
    },

    isGlpPool() {
      return this.pool?.id === 2 && this.chainId === 42161;
    },

    isVelodrome() {
      return this.chainId === 10 && this.pool?.id === 1;
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
      ];

      const borrowFee = {
        name: "Borrow fee",
        value: this.pool.borrowFee,
        tooltip: "This fee is added to your debt every time you borrow MIM.",
      };

      if (this.isVelodrome && this.veloManagementFee) {
        info.push({
          name: "Management fee",
          value: this.veloManagementFee,
          tooltip:
            "Percentage taken from rewards farmed through the Degenbox Strategy, as autocompounding fee.",
        });
      } else {
        info.push(borrowFee);
      }

      info.push({
        name: "Interest",
        value: this.pool.interest,
        tooltip:
          "This is the annualized percent that your debt will increase each year.",
      });

      if (this.isGlpPool) {
        info.push({
          name: "Repayment Rate",
          value: `${this.tokenApy || 0}`,
          tooltip: `The approximate rate at which users borrowed MIM will diminsh, thanks to GLP rewards.`,
        });

        info.push({
          name: "Management Fee",
          value: `${this.pool.lpLogic.feePercent || 0}`,
          tooltip: `Percentage of rewards taken by the protocol when harvesting WETH rewards. This value changes dynamically to ensure a 15% APR for Abracadabra.`,
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
      this.tokenApy = await getGlpApr();
    },
  },

  async created() {
    if (this.isGlpPool) this.tokenApy = await getGlpApr();

    if (this.isVelodrome)
      this.veloManagementFee = await getVeloManagementFee(
        this.pool,
        this.signer
      );
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
