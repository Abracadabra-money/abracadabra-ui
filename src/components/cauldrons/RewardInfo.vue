<template>
  <div :class="['column', { small }]" v-if="isMultiplierLabel">
    <div class="additional-info">
      <div class="additional-info-title">Elixir Potion Multiplier</div>
      <div class="additional-info-value">5x - 29.5x</div>
    </div>
  </div>

  <div :class="['column', { small }]" v-else-if="isPillsPoints">
    <div class="additional-info">
      <div class="additional-info-title">Pills Multiplier</div>
      <div class="additional-info-value">1x - 6.3x</div>
    </div>
  </div>

  <div :class="['column', 'apr', { small }]" v-else>
    {{ loopApr }}
  </div>
</template>

<script lang="ts">
import { MAINNET_CHAIN_ID } from "@/constants/global";
import type { CauldronListItem } from "@/helpers/cauldron/lists/getMarketList";
import { formatToFixed } from "@/helpers/filters";

export default {
  props: {
    cauldron: {
      type: Object as () => CauldronListItem,
      required: true,
    },

    small: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      elixirPotions: [43, 44],
      pillsPoints: [45],
    };
  },

  computed: {
    isMultiplierLabel() {
      return (
        this.cauldron.config.chainId === MAINNET_CHAIN_ID &&
        this.elixirPotions.includes(this.cauldron.config.id)
      );
    },

    isPillsPoints() {
      return (
        this.cauldron.config.chainId === MAINNET_CHAIN_ID &&
        this.pillsPoints.includes(this.cauldron.config.id)
      );
    },

    loopApr(): string {
      if (!this.cauldron.apr.value) return "-";

      const { value, multiplier } = this.cauldron.apr;
      return `${value}% - ${formatToFixed(value * multiplier, 2)}%`;
    },
  },
};
</script>

<style lang="scss" scoped>
.column {
  max-width: 180px;
  width: 100%;
}

.small {
  max-width: initial;
  width: initial;
}

.additional-info {
  display: inline-flex;
  flex-direction: column;
}

.additional-info-title {
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  line-height: 15px;
}

.additional-info-value {
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
}

.apr {
  text-shadow: 0px 0px 16px #ab5de8;
  font-weight: 600;
  line-height: 150%;
}

.small {
  .additional-info-value,
  .apr {
    font-size: 14px;
  }
}
</style>
