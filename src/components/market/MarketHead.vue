<template>
  <div class="market-head-wrap">
    <div class="market-head">
      <div class="column">
        <div class="token-info-wrap">
          <TokenInfo :cauldron="cauldron" />
        </div>

        <!-- todo add token to metamask -->
        <IconButton wallet />

        <IconButton link tag-name="a" :href="cauldronScanUrl" target="_blank" />

        <BaseLink
          v-if="strategyLink"
          :href="strategyLink"
          target="_blank"
          text="DEGENBOX"
        />

        <BaseLink
          :href="tokenLinkData.href"
          target="_blank"
          :text="tokenLinkData.label"
        />
      </div>

      <div class="column">
        <InfoButton title="TMB" :value="totalMimBorrowed" />
        <InfoButton title="TVL" :value="totalValueLocked" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { utils } from "ethers";
// @ts-ignore
import filters from "@/filters";
import { defineAsyncComponent } from "vue";
import { getTokenLinkData } from "@/helpers/getTokenLinkData";
import { chainsList } from "@/helpers/chains";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
  },

  computed: {
    strategyLink() {
      return this.cauldron.config.cauldronSettings.strategyLink;
    },

    tokenLinkData(): any {
      return getTokenLinkData(
        this.cauldron.config.id,
        this.cauldron.config.chainId
      );
    },

    totalMimBorrowed() {
      return filters.formatLargeSum(
        utils.formatUnits(this.cauldron.mainParams.totalBorrowed)
      );
    },

    totalValueLocked() {
      return filters.formatLargeSum(
        utils.formatUnits(this.cauldron.mainParams.tvl)
      );
    },

    cauldronScanUrl() {
      return `${
        chainsList[this.cauldron.config.chainId as keyof typeof chainsList]
          .blockExplorers.etherscan.url
      }/address/${this.cauldron.config.contract.address}`;
    },
  },

  components: {
    TokenInfo: defineAsyncComponent(
      () => import("@/components/market/TokenInfo.vue")
    ),
    IconButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/IconButton.vue")
    ),
    BaseLink: defineAsyncComponent(
      () => import("@/components/ui/links/BaseLink.vue")
    ),
    InfoButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/InfoButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.market-head-wrap {
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.07) 0%,
    rgba(116, 92, 210, 0.07) 100%
  );
  backdrop-filter: blur(10.75px);
}

.market-head {
  max-width: 1310px;
  width: 100%;
  padding: 4px 15px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.column {
  gap: 8px;
  display: flex;
  align-items: center;
}

.token-info-wrap {
  margin-right: 16px;
}
</style>
