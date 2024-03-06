<template>
  <router-link
    :class="['pools-table-link', poolLabel, { open: isOpenPosition }]"
    :to="goToPage"
  >
    <div class="label">{{ poolLabel }}</div>
    <div class="column">
      <div class="pool-info">
        <div class="icons-wrap">
          <img class="pool-icon" :src="pool.config.icon" />
        </div>
        {{ pool.config.name }}
      </div>
    </div>

    <div class="column">${{ formatLargeSum(pool.mainParams.tvl) }}</div>

    <div class="column">${{ formatLargeSum(pool.mainParams.dayFees) }}</div>

    <div class="column">${{ formatLargeSum(pool.mainParams.dayVolume) }}</div>

    <div class="column">${{ formatLargeSum(pool.mainParams.weekFees) }}</div>

    <div class="column">${{ formatLargeSum(pool.mainParams.weekVolume) }}</div>

    <div class="column apr">{{ pool.mainParams.apr }} %</div>
  </router-link>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { formatToFixed, formatLargeSum } from "@/helpers/filters";

export default {
  props: {
    pool: {
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
      return this.pool.userPosition;
    },

    poolLabel() {
      if (this.pool.config.chainId === 80085) return "testnet";
      if (this.pool.config.poolSettings?.isNew) return "new";
      if (this.pool.config.poolSettings?.isDeprecated) return "deprecated";
      return "";
    },

    goToPage() {
      return {
        name: "Pool",
        params: {
          id: this.pool.config.id,
          poolChainId: this.pool.config.chainId,
        },
      };
    },
  },

  methods: {
    formatUnits(value: bigInt) {
      return formatUnits(value);
    },

    formatLargeSum(value: bigInt) {
      return formatLargeSum(formatUnits(value, 0));
    },
  },
};
</script>

<style lang="scss" scoped>
.pools-table-link {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 1155px;
  border-radius: 16px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: rgba(8, 14, 31, 0.6);
  color: #fff;
  padding: 20px 32px;
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
  max-width: 140px;
  width: 100%;
  text-align: center;
}

.pool-info {
  width: 160px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.icons-wrap {
  position: relative;
  width: 44px;
}

.pool-icon {
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
  .pools-table-link {
    width: 930px;
  }
}
</style>
