<template>
  <div class="farm-position">
    <div class="position-header">
      <PositionTokensInfo :position="farmConfig" />
      <PositionLinks :actions="positionActions" />
    </div>
    <MultiRewardAssets
      v-if="farmConfig.isMultiReward"
      :assetsInfo="assetsInfo"
      :farmInfo="farmConfig"
      @harvest="getReward"
    />
    <PositionAssets v-else :assetsInfo="assetsInfo" @harvest="harvest" />
  </div>
</template>

<script>
import { utils } from "ethers";
import filters from "@/filters/index.js";
import spellIcon from "@/assets/images/tokens/SPELL.png";
import PositionTokensInfo from "@/components/myPositions/PositionTokensInfo.vue";
import PositionLinks from "@/components/myPositions/PositionLinks.vue";
import PositionAssets from "@/components/myPositions/PositionAssets.vue";
import MultiRewardAssets from "@/components/myPositions/MultiRewardAssets.vue";

import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";

export default {
  props: {
    farmConfig: { type: Object, required: true },
  },

  computed: {
    positionActions() {
      const actions = [
        {
          title: "Unstake",
          icon: this.$image("assets/images/myposition/Unstake.png"),
          name: "Farm",
          id: this.farmConfig.id,
        },
      ];

      if (!this.farmConfig.isDepreciated)
        actions.unshift({
          title: "Stake",
          icon: this.$image("assets/images/myposition/Stake.png"),
          name: "Farm",
          id: this.farmConfig.id,
        });

      return actions;
    },

    assetsInfo() {
      const disableEarnedButton = this.farmConfig.isMultiReward
        ? this.multiRewardsTokens?.filter((tokenInfo) => +tokenInfo.amount > 0)
            .length === 0
        : !+this.earnedData.balance;

      return [
        {
          title: "Earned",
          symbol: "SPELL",
          icon: spellIcon,
          amount: filters.formatTokenBalance(this.earnedData.balance),
          amountUsd: filters.formatUSD(this.earnedData.usd),
          tokensList: this.farmConfig.isMultiReward
            ? this.multiRewardsTokens
            : false,
          actions: {
            visibility: this.farmConfig.accountInfo,
            disabled: disableEarnedButton,
            event: "harvest",
          },
        },
        {
          title: `${this.farmConfig.stakingToken.type} deposited`,
          type: this.farmConfig.stakingToken.type,
          symbol: this.farmConfig.stakingToken.name,
          icon: this.farmConfig.icon,
          lpLink: this.farmConfig.stakingToken.link,
          isDepreciated: this.farmConfig.isDepreciated,
          amount: filters.formatTokenBalance(this.depositedData.balance),
          amountUsd: filters.formatUSD(this.depositedData.usd),
          tokensList: this.tokensList,
          actions: {
            link: "Farm",
            id: this.farmConfig.id,
            disabled: !+this.depositedData.balance,
          },
        },
      ];
    },

    multiRewardsTokens() {
      if(!this.farmConfig.isMultiReward) return false;

      const { rewardTokensInfo } = this.farmConfig.accountInfo;

      const tokensList = rewardTokensInfo.map((tokenInfo) => {
        return {
          symbol: tokenInfo.name,
          icon: tokenInfo.icon,
          amount: filters.formatTokenBalance(tokenInfo.earned),
          amountUsd: filters.formatUSD(tokenInfo.earned * tokenInfo.price),
        };
      });

      return tokensList.filter((e) => e.symbol && e.amount);
    },

    tokensList() {
      const tokensList = [
        {
          symbol: this.farmConfig.depositedBalance?.token0.name,
          icon: this.farmConfig.depositedBalance?.token0.icon,
          amount: filters.formatTokenBalance(
            this.farmConfig.accountInfo?.tokensBalanceInfo?.token0.amount
          ),
          amountUsd: filters.formatUSD(
            this.farmConfig.accountInfo?.tokensBalanceInfo?.token0.amountInUsd
          ),
        },
        {
          symbol: this.farmConfig.depositedBalance?.token1.name,
          icon: this.farmConfig.depositedBalance?.token1.icon,
          amount: filters.formatTokenBalance(
            this.farmConfig.accountInfo?.tokensBalanceInfo?.token1.amount
          ),
          amountUsd: filters.formatUSD(
            this.farmConfig.accountInfo?.tokensBalanceInfo?.token1.amountInUsd
          ),
        },
      ].filter((e) => e.symbol && e.amount);

      return tokensList.length ? tokensList : false;
    },

    earnedData() {
      return this.prepBalanceData(
        this.farmConfig.accountInfo?.userReward,
        this.farmConfig.earnedTokenPrice
      );
    },

    depositedData() {
      return this.prepBalanceData(
        this.farmConfig.accountInfo?.userInfo.amount,
        this.farmConfig.lpPrice / 1e18
      );
    },
  },

  methods: {
    prepBalanceData(tokenValue, priceValue) {
      const price = tokenValue * priceValue;

      return {
        usd: price,
        balance: tokenValue,
      };
    },

    async getReward() {
      try {
        const config = await prepareWriteContract({
          ...this.farmConfig.contractInfo,
          functionName: "getRewards",
          args: [],
        });

        const { hash } = await writeContract(config);

        await waitForTransaction({ hash });
      } catch (error) {
        console.log("harvest err:", error);
      }
    },

    async harvest() {
      try {
        const config = await prepareWriteContract({
          ...this.farmConfig.contractInfo,
          functionName: "withdraw",
          args: [this.farmConfig.poolId, 0],
        });

        const { hash } = await writeContract(config);

        await waitForTransaction({ hash });
      } catch (error) {
        console.log("harvest err:", error);
      }
    },
  },

  components: {
    PositionTokensInfo,
    PositionLinks,
    PositionAssets,
    MultiRewardAssets,
  },
};
</script>

<style lang="scss" scoped>
.farm-position {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.position-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media screen and (max-width: 600px) {
  .farm-positions {
    padding: 20px 10px;
  }
}

@media screen and (max-width: 400px) {
  .position-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media screen and (max-width: 600px) {
  .farm-position {
    padding: 20px 10px;
  }
}
</style>
