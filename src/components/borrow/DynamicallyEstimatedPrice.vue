<template>
  <div class="dynamical-price-block">
    <span class="estimation-description">
      <img
        class="tooltip"
        src="@/assets/images/info.svg"
        alt="info"
        v-tooltip="tooltipText"
      />
      {{ estimationDescription }}
    </span>
    <span class="estimation-result" :class="estimationResultTextColor">
      {{ estimationResult }}
    </span>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import { swap0xRequest } from "@/helpers/0x";
import { chainsUsdcConfigs } from "@/utils/tokens/usdcConfig";
import { mapGetters } from "vuex";

export default {
  props: {
    mimAddress: {
      type: String,
      required: true,
    },
    amount: {
      type: [String, Number],
    },
    slippage: {
      type: [String, Number],
      default: 1,
    },
    isClose: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      price: null,
      updateInterval: null,
      isFetching: false,
      isProfit: false,
    };
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    estimationResult() {
      if (this.isFetching) return "...Fetching";

      if (!this.price || !+this.amount) return "~";

      return `$${this.estimateAmount} / ${this.estimatePercent}%`;
    },

    estimationResultTextColor() {
      if (this.isProfit) return "blue";

      if (+this.estimatePercent) {
        if (+this.estimatePercent <= 0.1) return "blue";
        if (+this.estimatePercent <= 2.5) return "yellow";
        return "red";
      }

      return "";
    },

    estimateAmount() {
      if (!this.price || !+this.amount) return false;

      return parseFloat(
        Math.abs(this.amount - this.price * this.amount)
      ).toFixed(2);
    },

    estimatePercent() {
      if (!this.price || !+this.amount) return false;

      return parseFloat(
        Math.abs(100 - ((this.price * this.amount) / this.amount) * 100)
      ).toFixed(2);
    },

    estimationDescription() {
      if (this.isClose) return `Dynamic Closing ${this.profitStatus}`;
      return `Dynamic Opening ${this.profitStatus}`;
    },

    profitStatus() {
      if (this.isProfit) return "Bonus";
      return "Fee";
    },

    tooltipText() {
      return this.isProfit
        ? "Dynamic Bonus may vary depending on current $MIM liquidity and will result in a profit when opening/closing a position."
        : "Dynamic Fees may vary depending on current $MIM liquidity and it is not collected by the protocol. The closer $MIM is trading to $1, the lower the fee.";
    },

    buyToken() {
      if (!this.isClose) return chainsUsdcConfigs[this.chainId].address;
      return this.mimAddress;
    },

    sellToken() {
      if (!this.isClose) return this.mimAddress;
      return chainsUsdcConfigs[this.chainId].address;
    },

    parsedAmount() {
      if (!this.amount) return false;
      return this.$ethers.utils.parseUnits(
        filters.formatToFixed(this.amount, 18)
      );
    },
  },

  watch: {
    amount(val) {
      if (+val) this.getPrice();
    },
  },

  methods: {
    async getPrice() {
      if (this.isFetching) return false;

      this.isFetching = true;
      let priceIntermediate;
      if (this.isClose) {
        const { price } = await swap0xRequest(
          this.chainId,
          this.buyToken,
          this.sellToken,
          this.slippage,
          0,
          undefined,
          this.parsedAmount.toString()
        );
        priceIntermediate = price;
      } else {
        const { price } = await swap0xRequest(
          this.chainId,
          this.buyToken,
          this.sellToken,
          this.slippage,
          this.parsedAmount.toString()
        );
        priceIntermediate = price;
      }

      this.isProfit = this.isClose
        ? priceIntermediate <= 1
        : priceIntermediate >= 1;
      this.price = priceIntermediate;
      this.isFetching = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.yellow {
  color: #ffb800;
}

.blue {
  color: #75c9ee;
}

.red {
  color: #fe1842;
}

.dynamical-price-block {
  margin: 5px 0;
  padding: 10px 16px;
  font-size: 14px;
  line-height: 24px;
  background: #3c394b;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.estimation-description {
  display: flex;
  align-items: center;
}

.estimation-description .tooltip {
  margin-right: 5px;
  cursor: pointer;
}
</style>
