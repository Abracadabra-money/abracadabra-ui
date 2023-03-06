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
      <span v-else class="price" :class="{ yellow: !itsClose, blue: itsClose }">{{
        lpAmount
      }}</span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { swap0xRequest } from "@/helpers/0x";

const usdt = {
  1: {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
  },
  10: {
    address: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
    decimals: 6,
  },
  56: {
    address: "0x55d398326f99059ff775485246999027b3197955",
    decimals: 18,
  },
  137: {
    address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    decimals: 6,
  },
  250: {
    address: "0x049d68029688eabf473097a2fc38ef61633a3c7a",
    decimals: 6,
  },
  42161: {
    address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    decimals: 6,
  },
  43114: {
    address: "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7",
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
    };
  },

  computed: {
    chainId() {
      return this.$store.getters.getChainId;
    },
    lpAmount() {
      if (!this.price || !+this.amount) return false;

      const estimateAmount = parseFloat(
        this.amount - this.price * this.amount
      ).toFixed(2);
      const percent = parseFloat(
        100 - ((this.price * this.amount) / this.amount) * 100
      ).toFixed(2);

      return `$${estimateAmount} / ${percent}%`;
    },

    // - Dynamic Opening Fee
    // - Dynamic Opening Bonus
    // - Dynamic Closing Fee
    // - Dynamic Closing Bonus

    titleText() {
      if (this.itsClose) return "Dynamic Closing Fee/Bonus";
      return "Dynamic Opening Fee/Bonus";
    },

    tooltipText() {
      return `Opening Fees may vary depending on current $MIM liquidity and it is not collected by the protocol. The closer $MIM is trading at peg, the lower the fee.`;
    },
    buyToken() {
      if (this.itsClose) return usdt[this.chainId].address;
      return this.mim;
    },
    sellToken() {
      if (this.itsClose) return this.mim;
      return usdt[this.chainId].address;
    },
    sellTokenDecimals() {
      if (this.itsClose) return 18; // mim
      return usdt[this.chainId].decimals;
    },
    parsedAmount() {
      if (!this.amount) return false;

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
      const { price } = await swap0xRequest(
        this.chainId,
        this.buyToken,
        this.sellToken,
        this.slipage,
        this.parsedAmount.toString()
      );

      // if !itsClose & price > 1 user in profit else its fee
      // if itsClose & price > 1 user in profit else its fee

      this.price = price;
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
