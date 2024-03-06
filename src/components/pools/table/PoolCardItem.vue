<template>
  <router-link
    :class="['pool-table-link', poolLabel, { open: isOpenPosition }]"
    :to="goToPage"
  >
    <div class="label">{{ poolLabel }}</div>

    <div class="row">
      <div class="pool-info">
        <div class="icons-wrap">
          <img class="pool-icon" :src="pool.config.icon" alt="" />
        </div>
        {{ pool.config.name }}
      </div>
      <div>
        <h3 class="title">APR</h3>
        <div class="value apr">${{ formatLargeSum(pool.mainParams.tvl) }}</div>
      </div>
    </div>

    <div class="row">
      <div>
        <h3 class="title">TVL</h3>
        <div class="value">${{ formatLargeSum(pool.mainParams.tvl) }}</div>
      </div>

      <div>
        <h3 class="title">Fees 1d</h3>
        <div class="value">${{ formatLargeSum(pool.mainParams.dayFees) }}</div>
      </div>

      <div>
        <h3 class="title">Volume 1d</h3>
        <div class="value">
          ${{ formatLargeSum(pool.mainParams.dayVolume) }}
        </div>
      </div>

      <div>
        <h3 class="title">Fees 7d</h3>
        <div class="value">${{ formatLargeSum(pool.mainParams.weekFees) }}</div>
      </div>

      <div>
        <h3 class="title">Volume 7d</h3>
        <div class="value">
          ${{ formatLargeSum(pool.mainParams.weekVolume) }}
        </div>
      </div>
    </div>
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
.pool-table-link {
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
  gap: 8px;
  flex-wrap: wrap;
}

.pool-info {
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 14px;
}

.icons-wrap {
  position: relative;
}

.pool-icon {
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
