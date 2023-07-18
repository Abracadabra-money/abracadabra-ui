<!-- todo refactoring component -->
<template>
  <div class="wrap">
    <div class="info" :class="{ warning: isWarning }">
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
    <p v-if="isWarning" class="error">Warning! Exchange rate is low.</p>
  </div>
</template>

<script>
import { utils } from "ethers";
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import { swap0xRequest } from "@/helpers/0x";
export default {
  props: {
    cauldron: {
      type: Object,
    },
    slippage: {
      type: [String, Number],
    },
    maxBorrowValue: {},
    collateralValue: {},
    multiplier: {},
  },

  data() {
    return {
      price: 0,
      isMoreOnePercent: false,
      updateInterval: null,
      fetching: true,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
    }),

    executionPrice() {
      if (this.fetching) return "Fetching...";
      if (!+this.price) return "0.0";
      return filters.formatTokenBalance(1 / this.price);
    },

    isWarning() {
      if (this.isMoreOnePercent && !this.fetching) return true;
      return false;
    },

    tooltipText() {
      return `Execution price of 1 ${this.cauldron.config.name} in MIM terms, given your chosen leverage.`;
    },

    sellAmount() {
      const { mcr } = this.cauldron.config;
      const { decimals } = this.cauldron.config.mimInfo;
      const { formatToFixed } = filters;

      const maxBorrowValue = formatToFixed(this.maxBorrowValue, decimals);
      const amountMultiplyer = +mcr / 100;

      let startAmount = +maxBorrowValue * 0.995;
      let finalAmount = 0;

      for (let i = this.multiplier; i > 0; i--) {
        finalAmount += +startAmount;
        startAmount = +startAmount * +amountMultiplyer;
      }

      return utils.parseUnits(formatToFixed(finalAmount, decimals)).toString();
    },
  },

  watch: {
    async collateralValue() {
      await this.getExecutionPrice();
    },
  },

  methods: {
    async getExecutionPrice() {
      if (!+this.sellAmount) {
        this.fetching = false;
        return 0;
      }
      this.fetching = true;

      const { collateralInfo, mimInfo, leverageInfo } = this.cauldron.config;
      const { oracleExchangeRate } = this.cauldron.mainParams;

      const oraclePrice = utils.formatUnits(oracleExchangeRate, 18);

      const { price } = await swap0xRequest(
        this.chainId,
        collateralInfo.address,
        mimInfo.address,
        this.slippage,
        this.sellAmount,
        leverageInfo.address
      );

      this.price = price;
      this.fetching = false;

      const difference =
        Math.abs((+oraclePrice - +price) / ((+oraclePrice + +price) / 2)) * 100;

      this.isMoreOnePercent = difference > 1;
    },
  },

  async mounted() {
    await this.getExecutionPrice();

    this.updateInterval = setInterval(async () => {
      await this.getExecutionPrice();
    }, 10000);
  },

  beforeUnmount() {
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

.warning {
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
