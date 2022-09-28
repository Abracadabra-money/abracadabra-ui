<template>
  <div class="wrap">
    <div class="info" :class="{ difference: isDifference }">
      <span class="title">
        <img
          src="@/assets/images/info.svg"
          alt="info"
          v-tooltip="tooltipText"
        />
        Execution Price
      </span>
      <span class="price">{{ executionPrice }}</span>
    </div>
    <p v-if="isDifference" class="error">Warning! Exchange rate is low.</p>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    pool: {
      type: Object,
    },
    sellAmount: {
      type: [String, Number],
    },
    slipage: {
      type: [String, Number],
    },
  },

  data() {
    return {
      price: 0,
      isMoreOnePercent: false,
      updateInterval: null,
      fetching: false,
    };
  },

  computed: {
    executionPrice() {
      if (this.fetching) return "Fetching...";

      return 1 / this.price;
    },

    isDifference() {
      if (this.isMoreOnePercent && !this.fetching) return true;

      return false;
    },

    tooltipText() {
      return `Execution price of 1 ${this.pool.collateralToken.name} in MIM terms, given your chosen leverage.`;
    },
  },

  watch: {
    sellAmount() {
      this.getExecutionPrice(this.pool);
    },
  },

  methods: {
    async getExecutionPrice(pool) {
      this.fetching = true;
      const url = "https://api.0x.org/swap/v1/quote";
      const {
        collateralToken,
        borrowToken,
        tokenOraclePrice,
        levSwapperContract,
      } = pool;

      const params = {
        buyToken: collateralToken.address,
        sellToken: borrowToken.address,
        sellAmount: this.sellAmount,
        slippagePercentage: this.slipage,
        skipValidation: true,
        takerAddress: levSwapperContract.address,
      };

      const response = await axios.get(url, { params: params });

      const { price } = response.data;

      this.price = price;

      this.fetching = false;

      const difference =
        Math.abs(
          (+tokenOraclePrice - +price) / ((+tokenOraclePrice + +price) / 2)
        ) * 100;

      this.isMoreOnePercent = difference > 1;
    },
  },

  async mounted() {
    this.getExecutionPrice(this.pool);

    this.updateInterval = setInterval(async () => {
      await this.getExecutionPrice(this.pool);
    }, 10000);
  },

  beforeDestroy() {
    clearInterval(this.updateInterval);
  },
};
</script>

<style lang="scss" scoped>
.info {
  padding: 13px 16px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.difference {
  background: rgba(255, 148, 173, 0.06);
  border: 1px solid #e54369;

  .price {
    color: #e54369;
  }
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
