<template>
  <router-link
    :class="['pool-table-link', poolLabel, { open: isOpenPosition }]"
    :to="goToPage"
  >
    <div class="label">{{ poolLabel }}</div>

    <div class="row">
      <TokenPair :pool="pool" chainIcon />
      <div v-if="!isMultiplierLabel">
        <h3 class="title">APR</h3>
        <div class="value apr">
          {{ poolApr }}
        </div>
      </div>
    </div>

    <div class="row">
      <div>
        <h3 class="title">TVL</h3>
        <div class="value">${{ tvl }}</div>
      </div>

      <div>
        <h3 class="title">To be distributed</h3>
        <div class="value">
          {{ toBeDistributed }}
        </div>
      </div>

      <div>
        <ElixirReward v-if="isMultiplierLabel" />
        <div class="token-icons" v-else>
          <BaseTokenIcon
            v-for="(token, index) in rewardTokens"
            :icon="token.icon"
            :name="token.name"
            :size="index === 0 ? '20px' : '24px'"
            :key="index"
          />
        </div>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { formatLargeSum, formatPercent } from "@/helpers/filters";
import { BERA_BARTIO_CHAIN_ID } from "@/constants/global";
import { defineAsyncComponent } from "vue";

export default {
  props: {
    pool: {
      type: Object,
      required: true,
    },
  },

  computed: {
    rewardTokens() {
      return this.pool.config.rewardTokens;
    },

    tvl() {
      return formatLargeSum(
        formatUnits(this.pool.stakedTotalSupply, this.decimals)
      );
    },

    toBeDistributed() {
      return "todo";
    },

    poolApr() {
      if (!this.pool.poolAPR || this.isMultiplierLabel) return "";
      return formatPercent(this.pool.poolAPR?.totalApr || 0);
    },

    decimals() {
      return this.pool.decimals;
    },

    isOpenPosition() {
      return this.pool.stakeInfo?.balance > 0n;
    },

    poolLabel() {
      if (this.pool.chainId === BERA_BARTIO_CHAIN_ID) return "testnet";
      if (this.pool.settings?.isNew) return "new";
      if (this.pool.settings?.isDeprecated) return "deprecated";
      return "";
    },

    isMultiplierLabel() {
      return this.pool.config.settings.isElixirPotions;
    },

    goToPage() {
      return {
        name: "PoolFarm",
        params: {
          id: this.pool.id,
          poolChainId: this.pool.chainId,
        },
      };
    },
  },

  components: {
    TokenPair: defineAsyncComponent(
      () => import("@/components/pools/pool/TokenPair.vue")
    ),
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    ElixirReward: defineAsyncComponent(
      () => import("@/components/pools/pool/ElixirReward.vue")
    ),
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

.title {
  color: #99a0b2;
  font-size: 14px;
  font-weight: 500;
}

.value {
  font-size: 14px;
  font-weight: 400;
  text-transform: capitalize;
}

.token-icons {
  display: flex;
  justify-content: center;
  align-items: center;
}

.token-icon:not(:first-child) {
  margin-left: -6px;
  border: 2px solid #0a1021;
  border-radius: 8px;
}

.token-icon {
  margin-right: 0 !important;
}

.apr {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  text-shadow: 0px 0px 16px #ab5de8;
  font-weight: 600;
  line-height: 150%;
}
</style>
