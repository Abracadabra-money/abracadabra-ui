<template>
  <div class="token-info">
    <router-link class="cauldrons-link" :to="{ name: 'Cauldrons' }">
      <CauldronIcon />
    </router-link>

    <ArrowRightIcon />

    <div class="icons-wrap">
      <img class="token-icon" :src="cauldron.config.icon" alt="Token icon" />

      <img
        class="chain-icon"
        :src="getChainIcon(cauldron.config.chainId)"
        alt="Chain icon"
      />
    </div>

    <div>
      <div class="token-name">{{ cauldron.config.name }}</div>
      <div class="tokens-rate">
        1 {{ cauldron.config.name }} = $ {{ collateralToUsd }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { utils } from "ethers";
// @ts-ignore
import filters from "@/filters";
import { defineAsyncComponent } from "vue";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
  },

  computed: {
    collateralToUsd() {
      const tokenToMim = utils
        .parseEther("1")
        .mul(expandDecimals(1, this.cauldron.config.collateralInfo.decimals))
        .div(this.cauldron.mainParams.oracleExchangeRate);

      const rate = +utils.formatUnits(tokenToMim);
      const decimals = rate < 0.0001 ? 6 : 4;
      return filters.formatTokenBalance(filters.formatToFixed(rate, decimals));
    },
  },

  methods: { getChainIcon },

  components: {
    CauldronIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/CauldronIcon.vue")
    ),
    ArrowRightIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/ArrowRightIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.token-info {
  @include font;
  display: flex;
  gap: 8px;
  align-items: center;
}

.cauldrons-link {
  width: 20px;
  height: 20px;
}

.icons-wrap {
  position: relative;
  width: 50px;
  height: 50px;
  margin-right: 6px;
}

.token-icon {
  width: 50px;
  height: 50px;
}

.chain-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  top: -5px;
  right: -10px;
  border: 1px solid #0d1427;
}

.token-name {
  font-size: 28px;
  font-weight: 600;
  line-height: 150%;
}

.tokens-rate {
  color: #787a9b;
  font-size: 12px;
  font-weight: 400;
  line-height: 150%;
}
</style>
