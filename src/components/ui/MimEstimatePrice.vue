<template>
  <div class="wrap">
    <div class="info">
      <span class="title">
        <img
          src="@/assets/images/info.svg"
          alt="info"
          v-tooltip="tooltipText"
        />
        {{ titleText }}
      </span>
      <span v-if="fetching">Fetching...</span>
      <span v-else-if="!+price || !+amount">~</span>
      <span
        v-else
        class="price"
        :class="{ yellow: !itsProfit, blue: itsProfit }"
        >{{ paramsText }}</span
      >
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { swap0xRequest } from "@/helpers/0x";

const usdc = {
  1: {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
  },
  10: {
    address: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
    decimals: 6,
  },
  56: {
    address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    decimals: 18,
  },
  137: {
    address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    decimals: 6,
  },
  250: {
    address: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
    decimals: 6,
  },
  42161: {
    address: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
    decimals: 6,
  },
  43114: {
    address: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
    decimals: 6,
  },
};

export default {
  props: {
    mim: {
      type: String,
      required: true,
    },
    amount: {
      type: [String, Number],
    },
    slipage: {
      type: [String, Number],
      default: 1,
    },
    itsClose: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      price: null,
      updateInterval: null,
      fetching: false,
      itsProfit: false,
    };
  },

  computed: {
    chainId() {
      return this.$store.getters.getChainId;
    },
    paramsText() {
      if (!this.price || !+this.amount) return false;

      return `$${this.estimateAmount} / ${this.estimatePercent}%`;
    },

    paramsTextColor() {
      if (this.itsProfit) return "blue";

      if (+this.estimatePercent) {
        if (+this.estimatePercent <= 0.1) return "blue";
        if (+this.estimatePercent <= 1) return "yellow";
        return "red";
      }

      return "";
    },

    estimateAmount() {
      if (!this.price || !+this.amount) return false;

      const estimateAmount = parseFloat(
        Math.abs(this.amount - this.price * this.amount)
      ).toFixed(2);

      return estimateAmount;
    },
    estimatePercent() {
      if (!this.price || !+this.amount) return false;
      const percent = parseFloat(
        Math.abs(100 - ((this.price * this.amount) / this.amount) * 100)
      ).toFixed(2);

      return percent;
    },

    titleText() {
      if (this.itsClose) return `Dynamic Closing ${this.statusText}`;
      return `Dynamic Opening ${this.statusText}`;
    },

    statusText() {
      if (this.itsProfit) return "Bonus";
      return "Fee";
    },

    tooltipText() {
      return this.itsProfit
        ? "Dynamic Bonus may vary depending on current $MIM liquidity and will result in a profit when opening/closing a position."
        : "Dynamic Fees may vary depending on current $MIM liquidity and it is not collected by the protocol. The closer $MIM is trading to $1, the lower the fee.";
    },
    buyToken() {
      if (!this.itsClose) return usdc[this.chainId].address;
      return this.mim;
    },
    sellToken() {
      if (!this.itsClose) return this.mim;
      return usdc[this.chainId].address;
    },
    sellTokenDecimals() {
      return 18; // mim
    },
    parsedAmount() {
      if (!this.amount) return false;

      // TODO: weird expansion
      return this.$ethers.utils.parseUnits(
        Vue.filter("formatToFixed")(this.amount, this.sellTokenDecimals),
        this.sellTokenDecimals
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
      if (this.fetching) return false;

      this.fetching = true;
      let priceIntermediate;
      if (this.itsClose) {
        const { price } = await swap0xRequest(
          this.chainId,
          this.buyToken,
          this.sellToken,
          this.slipage,
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
          this.slipage,
          this.parsedAmount.toString()
        );
        priceIntermediate = price;
      }

      this.itsProfit = this.itsClose
        ? priceIntermediate <= 1
        : priceIntermediate >= 1;
      this.price = priceIntermediate;
      this.fetching = false;
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

.wrap {
  padding: 5px 0;
}

.info {
  padding: 10px 16px;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  background: #3c394b;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  display: flex;
  align-items: center;

  img {
    margin-right: 5px;
    cursor: pointer;
  }
}

.error {
  text-align: left;
  color: #cc123f;
  font-size: 10px;
  margin-top: 5px;
  margin-left: 10px;
}

@media (max-width: 375px) {
  .wrap {
    font-size: 14px;
  }
}
</style>
