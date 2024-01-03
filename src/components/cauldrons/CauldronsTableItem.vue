<template>
  <router-link
    :class="['cauldrons-table-link', cauldronLabel, { open: isOpenPosition }]"
    :to="goToPage(cauldron)"
  >
    <div class="label">{{ cauldronLabel }}</div>
    <div class="column">
      <div class="cauldron-info">
        <div class="icons-wrap">
          <img class="cauldron-icon" :src="cauldron.config.icon" alt="" />
          <img
            class="chain-icon"
            :src="getChainIcon(cauldron.config.chainId)"
            alt=""
          />
        </div>
        {{ cauldron.config.name }}
      </div>
    </div>

    <div class="column">${{ formatLargeSum(cauldron.mainParams.tvl) }}</div>

    <div class="column">
      {{ formatLargeSum(cauldron.mainParams.totalBorrowed) }}
    </div>

    <div class="column">
      {{ formatLargeSum(cauldron.mainParams.mimLeftToBorrow) }}
    </div>

    <div class="column">{{ cauldron.mainParams.interest }}%</div>

    <div class="column apr">
      {{ loopApr }}
    </div>
  </router-link>
</template>

<script lang="ts">
import { utils } from "ethers";
// @ts-ignore
import filters from "@/filters/index.js";
import { getChainIcon } from "@/helpers/chains/getChainIcon";

export default {
  props: {
    cauldron: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      collateralApy: "-",
    };
  },

  computed: {
    isOpenPosition() {
      return (
        this.cauldron.userPosition.collateralInfo.userCollateralShare.gt(0) ||
        this.cauldron.userPosition.borrowInfo.userBorrowPart.gt(0)
      );
    },

    cauldronLabel() {
      if (this.cauldron.config.cauldronSettings?.isNew) return "new";
      if (this.cauldron.config.cauldronSettings?.isDepreciated)
        return "deprecated";
      return "";
    },

    loopApr() {
      if (this.cauldron.apr.value) {
        return `${this.cauldron.apr.value}% - ${filters.formatToFixed(
          this.cauldron.apr.value * this.cauldron.apr.multiplier,
          2
        )}%`;
      }
      return "-";
    },
  },

  methods: {
    goToPage(cauldron: any) {
      const { chainId, id } = cauldron.config;
      return {
        name: "Market",
        params: { chainId, cauldronId: id },
      };
    },

    getChainIcon,
    formatUnits(value: string) {
      return utils.formatUnits(value);
    },

    formatLargeSum(value: string) {
      return filters.formatLargeSum(utils.formatUnits(value));
    },
  },
};
</script>

<style lang="scss" scoped>
.cauldrons-table-link {
  border-radius: 16px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: rgba(8, 14, 31, 0.6);
  color: #fff;
  padding: 20px 32px;
  display: grid;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.new {
  border: 1px solid #304d99;

  .label {
    display: block;
    background: linear-gradient(0deg, #2d4a96 0%, #5b7cd1 100%);
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

.label {
  display: none;
  position: absolute;
  text-align: center;
  top: 50%;
  left: -43px;
  width: 100px;
  font-size: 10px;
  font-weight: 500;
  line-height: 16px;
  transform: translateY(-50%) rotate(-90deg);
  background: linear-gradient(180deg, #67a069 0%, #446a46 100%);

  &::first-letter {
    text-transform: uppercase;
  }
}

.column {
  max-width: 180px;
  width: 100%;
}

.cauldron-info {
  display: flex;
  gap: 20px;
  align-items: center;
}

.icons-wrap {
  position: relative;
  width: 44px;
}

.cauldron-icon {
  width: 44px;
  height: 44px;
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

.apr {
  text-shadow: 0px 0px 16px #ab5de8;
  font-weight: 600;
  line-height: 150%;
}

@media screen and (max-width: 1024px) {
  .cauldrons-table-link {
    width: 930px;
  }
}
</style>
