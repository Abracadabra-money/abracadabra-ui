<template>
  <router-link
    :class="['cauldron-table-link', cauldronLabel, { open: isOpenPosition }]"
    :to="goToMarket(cauldron)"
  >
    <div class="label">{{ cauldronLabel }}</div>

    <div class="row">
      <div class="cauldron-info">
        <div class="icons-wrap">
          <img class="cauldron-icon" :src="cauldron.config.icon" alt="" />
          <img
            class="chain-icon"
            :src="getChainIcon(cauldron.config.chainId)"
            alt="Chain icon"
          />
        </div>
        {{ cauldron.config.name }}
      </div>

      <div class="multiplier" v-if="isMultiplierLabel">
        <div class="multiplier-title">Elixir Potion Multiplier</div>
        <div class="multiplier-value">5x - 29.5x</div>
      </div>

      <div class="apr" v-else>
        {{ loopApr }}
      </div>
    </div>

    <div class="row">
      <div>
        <h3 class="title">TVL</h3>
        <div class="value">
          ${{ formatLargeSum(cauldron.mainParams.alternativeData.tvl) }}
        </div>
      </div>

      <div>
        <h3 class="title">TMB</h3>
        <div class="value">
          {{
            formatLargeSum(cauldron.mainParams.alternativeData.totalBorrowed)
          }}
        </div>
      </div>

      <div>
        <h3 class="title">MIMS LB</h3>
        <div class="value">
          {{
            formatLargeSum(cauldron.mainParams.alternativeData.mimLeftToBorrow)
          }}
        </div>
      </div>

      <div>
        <h3 class="title">Interest</h3>
        <div class="value">{{ cauldron.mainParams.interest }}%</div>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import type { RouterLinkParams } from "@/types/global";
import { BERA_BARTIO_CHAIN_ID, MAINNET_CHAIN_ID } from "@/constants/global";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import { formatToFixed, formatLargeSum } from "@/helpers/filters";
import type { CauldronListItem } from "@/helpers/cauldron/lists/getMarketList";

enum CauldronLabel {
  empty = "",
  new = "new",
  testnet = "testnet",
  deprecated = "deprecated",
}

export default {
  props: {
    cauldron: {
      type: Object as () => CauldronListItem,
      required: true,
    },
  },

  data() {
    return {
      elixirPotions: [43, 44],
    };
  },

  computed: {
    isOpenPosition(): boolean {
      const { collateralInfo, borrowInfo } =
        this.cauldron.userPosition.alternativeData;
      return !!(collateralInfo.userCollateralShare + borrowInfo.userBorrowPart);
    },

    cauldronLabel(): CauldronLabel {
      const { chainId, cauldronSettings } = this.cauldron.config;
      if (chainId === BERA_BARTIO_CHAIN_ID) return CauldronLabel.testnet;
      if (cauldronSettings?.isNew) return CauldronLabel.new;
      if (cauldronSettings?.isDepreciated) return CauldronLabel.deprecated;
      return CauldronLabel.empty;
    },

    loopApr(): string {
      if (!this.cauldron.apr.value) return "-";

      const { value, multiplier } = this.cauldron.apr;
      return `${value}% - ${formatToFixed(value * multiplier, 2)}%`;
    },

    isMultiplierLabel() {
      return (
        this.cauldron.config.chainId === MAINNET_CHAIN_ID &&
        this.elixirPotions.includes(this.cauldron.config.id)
      );
    },
  },

  methods: {
    getChainIcon,

    goToMarket(cauldron: CauldronListItem): RouterLinkParams {
      const { chainId, id } = cauldron.config;
      return { name: "Market", params: { chainId, cauldronId: id } };
    },

    formatLargeSum(value: bigint, decimals = 18): string {
      return formatLargeSum(formatUnits(value, decimals));
    },
  },
};
</script>

<style lang="scss" scoped>
.cauldron-table-link {
  border-radius: 16px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: rgba(8, 14, 31, 0.6);
  color: #fff;
  padding: 25px 12px 20px;
  gap: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.01);
    border-radius: 16px;
    box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.16);
    border-radius: 16px;
  }
}

.label {
  display: none;
  position: absolute;
  text-align: center;
  top: 0;
  left: 0;
  width: 117px;
  font-size: 10px;
  font-weight: 500;
  line-height: 150%;
  border-radius: 0px 0px 8px 0px;
  background: linear-gradient(180deg, #67a069 0%, #446a46 100%);

  &::first-letter {
    text-transform: uppercase;
  }
}

.new {
  border: 1px solid #304d99;

  .label {
    display: block;
    background: linear-gradient(0deg, #2d4a96 0%, #5b7cd1 100%);
  }
}

.testnet {
  border: 1px solid #af6900;

  .label {
    display: block;
    background: linear-gradient(0deg, #af6900 100%, #e9984d 100%);
  }
}

.deprecated {
  border: 1px solid #4a2130;

  .label {
    display: block;
    background: linear-gradient(180deg, #8c4040 0%, #6b2424 100%);
  }
}

.open {
  background: url("@/assets/images/cauldrons/table-item-background.png");
}

.row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cauldron-info {
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 14px;
}

.icons-wrap {
  position: relative;
}

.cauldron-icon {
  width: 44px;
  height: 44px;
}

.chain-icon {
  position: absolute;
  top: -5px;
  right: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #0d1427;
}

.multiplier {
  padding: 6px 12px;
  background: linear-gradient(
      270deg,
      #ffe47c -3.8%,
      #ff43c3 50.8%,
      #4156e0 100%
    ),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
  border-radius: 10px;
}

.multiplier-title {
  font-size: 10px;
  font-weight: 500;
  text-align: center;
}

.multiplier-value {
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  text-align: center;
}

.apr {
  font-size: 14px;
  font-weight: 600;
  line-height: 150%;
  text-shadow: 0px 0px 16px #ab5de8;
}

.title {
  color: #99a0b2;
  font-size: 14px;
  font-weight: 500;
}

.value {
  font-size: 14px;
  font-weight: 400;
}
</style>
