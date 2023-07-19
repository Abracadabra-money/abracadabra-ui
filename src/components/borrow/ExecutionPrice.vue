<template>
  <div class="execution-price" :class="{ warning: isWarning }">
    <span class="price-title">
      <Tooltip class="tooltip" :tooltip="tooltipText" />
      Execution Price
    </span>
    <span class="price-value">{{ executionPrice }}</span>
  </div>
  <p class="warning" v-if="isWarning">Warning! Exchange rate is low.</p>
</template>

<script>
import { utils } from "ethers";
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import { swap0xRequest } from "@/helpers/0x";
import Tooltip from "@/components/ui/icons/Tooltip.vue";

export default {
  props: {
    cauldron: {
      type: Object,
    },
    slippage: {
      type: [String, Number],
    },
    maxBorrowValue: { type: Number },
    collateralValue: { type: Number },
    multiplier: { type: Number },
  },

  data() {
    return {
      price: 0,
      isMoreOnePercent: false,
      updateInterval: null,
      isFetching: true,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
    }),

    executionPrice() {
      if (this.isFetching) return "Fetching...";
      if (!+this.price) return "0.0";
      return filters.formatTokenBalance(1 / this.price);
    },

    isWarning() {
      if (this.isMoreOnePercent && !this.isFetching) return true;
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
        this.isFetching = false;
        return 0;
      }
      this.isFetching = true;

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
      this.isFetching = false;

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

  components: { Tooltip },
};
</script>

<style lang="scss" scoped>
.execution-price {
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
}

.warning .price-title {
  color: #e54369;
}

.price-title {
  display: flex;
  align-items: center;
}

.tooltip {
  margin-right: 5px;
  cursor: pointer;
}

.warning {
  text-align: left;
  color: #cc123f;
  font-size: 10px;
  margin-top: 5px;
  margin-left: 10px;
}

@media (max-width: 375px) {
  .execution-price,
  .warning {
    font-size: 14px;
  }
}
</style>
