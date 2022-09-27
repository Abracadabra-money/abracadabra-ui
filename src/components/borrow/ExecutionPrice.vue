<template>
  <div class="wrap" :class="{ difference: isMoreOnePercent }">
    <span>Execution Price</span>
    <span class="price">{{ price }}</span>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    pool: {
      type: Object,
    },
  },

  data() {
    return {
      price: 0,
      isMoreOnePercent: false,
      updateInterval: null,
    };
  },

  methods: {
    async getExecutionPrice(pool) {
      const url = "https://api.0x.org/swap/v1/quote";
      const { collateralToken, borrowToken, tokenOraclePrice } = pool;
      const sellAmount = (1000000000000000000).toString();
      const slippagePercentage = 0;

      const params = {
        buyToken: collateralToken.address,
        sellToken: borrowToken.address,
        sellAmount,
        slippagePercentage,
      };

      const response = await axios.get(url, { params: params });

      const { price } = response.data;

      this.price = price;

      const difference =
        Math.abs(
          (+tokenOraclePrice - +price) / ((+tokenOraclePrice + +price) / 2)
        ) * 100;

      this.isMoreOnePercent = difference > 1;

      this.$emit("differencePrice", this.isMoreOnePercent);
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
.wrap {
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

@media (max-width: 375px) {
  .wrap {
    font-size: 14px;
  }
}
</style>
