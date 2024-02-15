<template>
  <div class="dynamic-price">
    <div class="title">
      {{ estimationDescription }}
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
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
// @ts-ignore
import { swap0xRequest } from "@/helpers/0x";
import { chainsUsdcConfigs } from "@/configs/tokens/usdc";

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

      const paylod = [
        this.chainId,
        this.buyToken,
        this.sellToken,
        this.slippage,
      ];

      if (this.isClose) paylod.push(0, undefined, this.amount);
      else paylod.push(this.amount);

      const { price }: any = await swap0xRequest(...paylod);

      this.isProfit = this.isClose ? price <= 1 : price >= 1;

      this.price = price;
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
  color: #878b93;
}

.value {
  text-transform: uppercase;
}
</style>
