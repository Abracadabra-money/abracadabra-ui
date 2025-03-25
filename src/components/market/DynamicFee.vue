<template>
  <div class="dynamic-price">
    <div class="title">
      <p>{{ estimationDescription }}</p>

      <TooltipIcon
        :width="20"
        :height="20"
        fill="#878B93"
        :tooltip="tooltipText"
      />
    </div>
    <div class="value">
      {{ estimationResult }}
    </div>
  </div>
</template>

<script lang="ts">
import { utils } from "ethers";
import { formatUnits } from "viem";
import { swap0xRequestV2 } from "@/helpers/0x";
import { defineAsyncComponent, PropType } from "vue";
import { CauldronInfo } from "@/helpers/cauldron/types";
import { chainsUsdcConfigs } from "@/configs/tokens/usdc";
import { normalizeDecimals } from "@/helpers/normalizeDecimals";

export default {
  props: {
    mimAddress: {
      type: String,
      required: true,
    },
    amount: {
      type: Object as any,
    },
    slippage: {
      type: [String, Number],
      default: 1,
    },
    isClose: {
      type: Boolean,
      default: false,
    },
    chainId: {
      type: Number,
      default: 1,
    },
    cauldron: {
      type: Object as PropType<CauldronInfo>,
      required: true,
    },
  },

  data() {
    return {
      price: null as null | number,
      isFetching: false,
      isProfit: false,
    };
  },

  computed: {
    formatAmount() {
      return Number(utils.formatUnits(this.amount || "0"));
    },

    estimationResult() {
      if (this.isFetching) return "...Fetching";
      if (!this.price || this.amount?.isZero()) return "≈";
      return `$${this.estimateAmount} / ${this.estimatePercent}%`;
    },

    estimateAmount() {
      if (!this.price || this.amount?.isZero()) return false;

      return parseFloat(
        Math.abs(this.formatAmount - this.price * this.formatAmount).toString()
      ).toFixed(2);
    },

    estimatePercent() {
      if (!this.price || !this.amount) return false;

      return parseFloat(
        Math.abs(
          100 - ((this.price * this.formatAmount) / this.formatAmount) * 100
        ).toString()
      ).toFixed(2);
    },

    estimationDescription() {
      if (this.isClose) return `Dynamic Closing ${this.profitStatus}`;
      return `Dynamic Opening ${this.profitStatus}`;
    },

    profitStatus() {
      return this.isProfit ? "Bonus" : "Fee";
    },

    tooltipText() {
      return this.isProfit
        ? "Dynamic Bonus may vary depending on current $MIM liquidity and will result in a profit when opening/closing a position."
        : "Dynamic Fees may vary depending on current $MIM liquidity and it is not collected by the protocol. The closer $MIM is trading to $1, the lower the fee.";
    },

    mimToken() {
      return {
        address: this.mimAddress,
        decimals: 18,
      };
    },

    usdcToken() {
      return {
        address:
          chainsUsdcConfigs[this.chainId as keyof typeof chainsUsdcConfigs]
            .address,
        decimals: 6,
      };
    },

    buyToken() {
      if (!this.isClose) return this.usdcToken;
      return this.mimToken;
    },

    sellToken() {
      if (!this.isClose) return this.mimToken;
      return this.usdcToken;
    },
  },

  watch: {
    amount(value) {
      if (!value.isZero()) this.getPrice();
    },
  },

  methods: {
    async getPrice() {
      if (this.isFetching) return false;
      this.isFetching = true;

      const leverageInfo = this.cauldron.config.leverageInfo;
      const deleverageInfo = this.cauldron.config.deleverageInfo;

      if (!leverageInfo || !deleverageInfo) return false;

      const takerAddress = this.isClose
        ? deleverageInfo!.address
        : leverageInfo!.address;

      const normalizedAmount = this.isClose
        ? normalizeDecimals(
            this.amount.toBigInt(),
            this.buyToken.decimals,
            this.sellToken.decimals
          )
        : this.amount;

      const swapResponse = await swap0xRequestV2(
        this.chainId,
        this.buyToken.address,
        this.sellToken.address,
        this.slippage,
        normalizedAmount,
        takerAddress
      );

      const buyAmount = Number(
        formatUnits(swapResponse.buyAmount.toBigInt(), this.buyToken.decimals)
      );

      const sellAmount = Number(
        formatUnits(swapResponse.sellAmount.toBigInt(), this.sellToken.decimals)
      );

      this.price = this.isClose
        ? sellAmount / buyAmount
        : buyAmount / sellAmount;
      this.isProfit = this.isClose ? this.price <= 1 : this.price >= 1;

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
.dynamic-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
}

.title {
  gap: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #878b93;
}

.value {
  text-transform: uppercase;
}

@media (max-width: 460px) {
  .value {
    width: max-content;
    min-width: 45%;
    text-align: right;
  }
}
</style>
