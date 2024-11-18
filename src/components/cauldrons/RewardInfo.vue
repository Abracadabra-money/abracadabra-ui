<template>
  <div :class="['reward-info', { small }]" v-if="isMultiplierLabel">
    <div class="additional-info">
      <div class="additional-info-title">Elixir Potions Multiplier</div>
      <div class="additional-info-value">5x - 29.5x</div>
    </div>
  </div>

  <div :class="['reward-info', { small }]" v-else-if="isPillsPoints">
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
.reward-info {
  max-width: 180px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  box-shadow: 0px 4px 9px 0px rgba(134, 92, 230, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 18px;
}

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
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.additional-info-value {
  text-align: center;
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px;
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

@media screen and (max-width: 600px) {
  .reward-info {
    padding: 5px 8px;
  }

  .additional-info-title {
    font-size: 10px;
  }
}
</style>
