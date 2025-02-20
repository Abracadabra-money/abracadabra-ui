<template>
  <div :class="['reward-info', { small }]" v-if="isMultiplierLabel">
    <div class="elixir-info">
      <div class="elixir-multiplier">
        <span> 5x - 29.5x</span>
        <img
          class="elixir-icon"
          src="@/assets/images/get-lp-icons/elixir.png"
          alt="Elixir icon"
        />
      </div>

      <RowSkeleton v-if="aprsLoading" height="24px" />
      <div class="elixir-apr" v-else>
        {{ loopApr }}
        <img
          class="token-icon"
          src="@/assets/images/tokens/sdeUSD.png"
          alt="sdeUSD icon"
        />
      </div>
    </div>
  </div>

  <div :class="['column', 'apr', { small }]" v-else>
    <RowSkeleton v-if="aprsLoading" height="24px" />

    <template v-else>
      {{ loopApr }}
    </template>
  </div>
</template>

<script lang="ts">
import { MAINNET_CHAIN_ID } from "@/constants/global";
import type { CauldronListItem } from "@/helpers/cauldron/lists/getMarketList";
import { formatToFixed } from "@/helpers/filters";
import { defineAsyncComponent } from "vue";

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

    aprsLoading: { type: Boolean, default: false },
  },

  data() {
    return {
      elixirPotions: [43, 44],
    };
  },

  computed: {
    isMultiplierLabel() {
      return (
        this.cauldron.config.chainId === MAINNET_CHAIN_ID &&
        this.elixirPotions.includes(this.cauldron.config.id)
      );
    },

    loopApr(): string {
      if (!this.cauldron.apr.value) return "-";

      const { value, multiplier } = this.cauldron.apr;
      return `${formatToFixed(value, 2)}% - ${formatToFixed(
        value * multiplier,
        2
      )}%`;
    },
  },

  components: {
    RowSkeleton: defineAsyncComponent(
      () => import("@/components/ui/skeletons/RowSkeleton.vue")
    ),
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

.small {
  max-width: initial;
  width: initial;

  .additional-info-value,
  .apr {
    font-size: 14px;
  }
}

.elixir-info {
  gap: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.elixir-multiplier,
.elixir-apr {
  text-shadow: 0px 0px 16px #ab5de8;
  font-weight: 600;
  min-width: 170px;
  gap: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.elixir-apr {
  font-size: 14px;
}

.elixir-icon,
.token-icon {
  width: 20px;
  height: 20px;
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

.column {
  max-width: 180px;
  width: 100%;
}

.apr {
  text-shadow: 0px 0px 16px #ab5de8;
  font-weight: 600;
  line-height: 150%;
}

.row-skeleton {
  margin: auto;
}

@media screen and (max-width: 600px) {
  .reward-info {
    padding: 5px 8px;
  }

  .elixir-multiplier,
  .elixir-apr {
    font-size: 12px;
    min-width: initial;
  }

  .additional-info-title {
    font-size: 10px;
  }
}
</style>
