<template>
  <div class="token-info">
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
import { formatUnits, parseUnits } from "viem";
import { ONE_ETHER_VIEM } from "@/constants/global";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import { formatTokenBalance, formatToFixed } from "@/helpers/filters";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
  },

  computed: {
    collateralToUsd() {
      const { decimals } = this.cauldron.config.collateralInfo;
      const { oracleExchangeRate } = this.cauldron.mainParams.alternativeData;
      const expandDecimals = parseUnits("1", decimals);
      const tokenToMim = (ONE_ETHER_VIEM * expandDecimals) / oracleExchangeRate;

      const tokenPrice = Number(
        formatUnits(tokenToMim, this.cauldron.config.collateralInfo.decimals)
      );

      const numbersAfterComa =
        tokenPrice > 0.01 ? 2 : tokenPrice < 0.0001 ? 6 : 4;
      return formatTokenBalance(formatToFixed(tokenPrice, numbersAfterComa));
    },
  },

  methods: { getChainIcon },
};
</script>

<style lang="scss" scoped>
.token-info {
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
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.chain-icon {
  width: 22px;
  height: 22px;
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

@media screen and (max-width: 860px) {
  .icons-wrap {
    width: 40px;
    height: 40px;
  }

  .token-name {
    font-size: 24px;
    line-height: 1;
  }

  .tokens-rate {
    font-size: 12px;
    line-height: 1.6;
  }
}
</style>
