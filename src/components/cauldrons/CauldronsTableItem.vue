<template>
  <router-link
    :class="['cauldrons-table-link', cauldronLabel, { open: isOpenPosition }]"
    :to="goToPage(cauldron)"
  >
    <div class="cauldrons-table-item">
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
    </div>
  </router-link>
</template>

<script>
import { utils } from "ethers";
import filters from "@/filters/index.js";
import { getChainIcon } from "@/helpers/chains/getChainIcon.ts";

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
    goToPage(cauldron) {
      const { chainId, id } = cauldron.config;
      return {
        name: "Market",
        params: { chainId, cauldronId: id },
      };
    },

    getChainIcon,
    formatUnits(value) {
      return utils.formatUnits(value);
    },

    formatLargeSum(value) {
      return filters.formatLargeSum(utils.formatUnits(value));
    },
  },
};
</script>

<style lang="scss" scoped>
.cauldrons-table-link {
  padding: 1px;
  border-radius: 16px;
  color: inherit;
}

.new {
  background: linear-gradient(
    90deg,
    rgba(100, 156, 102, 1) 0%,
    rgba(72, 111, 73, 0) 60%
  );

  .label {
    display: block;
    background: linear-gradient(180deg, #67a069 0%, #446a46 100%);
  }
}

.deprecated {
  background: linear-gradient(
    90deg,
    rgba(123, 25, 24, 1) 0%,
    rgba(56, 12, 13, 0) 60%
  );

  .label {
    display: block;
    background: linear-gradient(180deg, #320a0a 0%, #871d1f 100%),
      linear-gradient(180deg, #67a069 0%, #446a46 100%);
  }
}

.open {
  .cauldrons-table-item {
    background: url("@/assets/images/cauldrons/table-item-background.png");
  }
}

.cauldrons-table-item {
  border-radius: 16px;
  background: rgba(8, 14, 31, 1);
  padding: 20px 32px;
  display: grid;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.label {
  display: none;
  position: absolute;
  text-align: center;
  top: 50%;
  left: -43px;
  width: 100px;
  font-size: 9px;
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
</style>
