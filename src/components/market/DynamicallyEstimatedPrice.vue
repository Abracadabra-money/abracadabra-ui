<template>
  <div class="dynamic-wrap" v-if="showDynamicBlock">
    <DynamicFee
      v-if="!hideDynamicFee"
      :amount="amount"
      :isClose="isClose"
      :mimAddress="cauldron.config.mimInfo.address"
      :chainId="cauldron.config.chainId"
    />

    <DynamicApr
      v-if="showDynamicApr"
      :aprInfo="aprInfo"
      :multiplier="multiplier"
    />

    <GmPriceImpact
      v-if="cauldron.config.cauldronSettings.isGMXMarket"
      :cauldronObject="cauldron"
      :amount="amount"
      :actionType="1"
    />
  </div>
</template>

<script lang="ts">
import { BigNumber } from "ethers";
import { defineAsyncComponent } from "vue";
// @ts-ignore
import { getCollateralApr } from "@/helpers/collateralsApy";
import { BERA_BARTIO_CHAIN_ID, KAVA_CHAIN_ID } from "@/constants/global";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
    multiplier: {
      type: Number,
    },
    amount: {
      default: BigNumber.from(0),
    },
    isClose: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      aprInfo: { value: 0, multiplier: 0 },
    };
  },

  computed: {
    hideDynamicFee() {
      const disabledChains = [KAVA_CHAIN_ID, BERA_BARTIO_CHAIN_ID];

      return disabledChains.indexOf(this.cauldron.config.chainId) !== -1;
    },

    showDynamicApr() {
      return this.aprInfo.value && this.multiplier;
    },

    showDynamicBlock() {
      return (
        !this.hideDynamicFee ||
        this.showDynamicApr ||
        this.cauldron.config.cauldronSettings.isGMXMarket
      );
    },
  },

  async created() {
    this.aprInfo = await getCollateralApr(this.cauldron);
  },

  components: {
    DynamicFee: defineAsyncComponent(
      () => import("@/components/market/DynamicFee.vue")
    ),
    DynamicApr: defineAsyncComponent(
      () => import("@/components/market/DynamicApr.vue")
    ),
    GmPriceImpact: defineAsyncComponent(
      () => import("@/components/market/GmPriceImpact.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.dynamic-wrap {
  display: flex;
  padding: 5px 12px;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
}
</style>
