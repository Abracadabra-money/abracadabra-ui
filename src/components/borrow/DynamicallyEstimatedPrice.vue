<template>
  <div class="dynamic-fee">
    <div class="dynamic-fee-title">
      {{ estimationDescription }}
      <TooltipIcon
        :width="20"
        :height="20"
        fill="#878B93"
        :tooltip="tooltipText"
      />
    </div>
    <div class="dynamic-fee-value">
      {{ estimationResult }}
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import filters from "@/filters/index.js";
// @ts-ignore
import { swap0xRequest } from "@/helpers/0x";
import { chainsUsdcConfigs } from "@/utils/tokens/usdcConfig";
// @ts-ignore
import { mapGetters } from "vuex";
import { ethers } from "ethers";
import { defineAsyncComponent } from "vue";

export default {
  props: {
    mimAddress: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
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

      if (!this.price || !this.amount) return "≈";

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
      if (!this.price || !this.amount) return false;

      return parseFloat(
        Math.abs(this.amount - this.price * this.amount).toString()
      ).toFixed(2);
    },

    estimatePercent() {
      if (!this.price || !this.amount) return false;

      return parseFloat(
        Math.abs(
          100 - ((this.price * this.amount) / this.amount) * 100
        ).toString()
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
      if (!this.isClose)
        return chainsUsdcConfigs[this.chainId as keyof typeof chainsUsdcConfigs]
          .address;
      return this.mimAddress;
    },

    sellToken() {
      if (!this.isClose) return this.mimAddress;
      return chainsUsdcConfigs[this.chainId as keyof typeof chainsUsdcConfigs]
        .address;
    },

    parsedAmount() {
      if (!this.amount) return false;
      return ethers.utils.parseUnits(filters.formatToFixed(+this.amount, 18));
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

  components: {
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.dynamic-fee {
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dynamic-fee-title {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  display: flex;
  gap: 4px;
  align-items: center;
}

.dynamic-fee-value {
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  text-transform: uppercase;
}
</style>
