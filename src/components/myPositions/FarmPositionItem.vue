<template>
  <div class="farm-positions">
    <div class="position-header">
      <PositionTokensInfo :position="farmConfig" />
      <PositionLinks :actions="positionActions" />
    </div>
    <PositionAssets :assetsInfo="assetsInfo" />
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import spellIcon from "@/assets/images/tokens/SPELL.png";
import PositionTokensInfo from "@/components/myPositions/PositionTokensInfo.vue";
import PositionLinks from "@/components/myPositions/PositionLinks.vue";
import PositionAssets from "@/components/myPositions/PositionAssets.vue";

export default {
  props: {
    farmConfig: { type: Object, required: true },
  },

  computed: {
    positionActions() {
      return [
        {
          title: "Stake",
          icon: this.$image("assets/images/myposition/Stake.png"),
          name: "FarmPool",
          id: this.farmConfig.id,
        },
        {
          title: "Untake",
          icon: this.$image("assets/images/myposition/Unstake.png"),
          name: "FarmPool",
          id: this.farmConfig.id,
        },
      ];
    },

    assetsInfo() {
      return [
        {
          title: "Earned",
          symbol: this.farmConfig.tokenName,
          icon: spellIcon,
          amount: filters.formatTokenBalance(this.earnedData.balance),
          amountUsd: filters.formatUSD(this.earnedData.usd),
          actions: {
            visibility: this.farmConfig.accountInfo,
            disabled: !+this.earnedData.balance,
            event: "harvest",
          },
        },
        {
          title: `${this.farmConfig.stakingToken.type} deposited`,
          symbol: this.farmConfig.name,
          icon: this.farmConfig.icon,
          amount: filters.formatTokenBalance(this.depositedData.balance),
          amountUsd: filters.formatUSD(this.depositedData.usd),
          tokensList: this.tokensList,
          actions: {
            link: "FarmPool",
            id: this.farmConfig.id,
            visibility: this.farmConfig.accountInfo,
            disabled: !+this.depositedData.balance,
            event: "withdraw",
          },
        },
      ];
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
        this.farmConfig.tokenPrice
      );
    },

    depositedData() {
      return this.prepBalanceData(
        this.farmConfig.accountInfo?.userInfo.amount,
        this.farmConfig.lpPrice
      );
    },
  },

  methods: {
    prepBalanceData(tokenValue, priceValue) {
      const tokenValueParsed = this.$ethers.utils.formatEther(tokenValue);

      const price = tokenValueParsed * priceValue;

      return {
        usd: price,
        balance: tokenValueParsed,
      };
    },

    async harvest() {
      try {
        const tx = await this.farmConfig.contractInstance.withdraw(
          this.farmConfig.poolId,
          0
        );

        await tx.wait();
      } catch (error) {
        console.log("harvest err:", error);
      }
    },
  },

  components: {
    PositionTokensInfo,
    PositionLinks,
    PositionAssets,
  },
};
</script>

<style lang="scss" scoped>
.farm-positions {
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
  display: grid;
  grid-template-columns: 1fr auto;
  grid-row-gap: 20px;
  justify-content: space-between;
  align-items: center;
}

@media screen and (max-width: 600px) {
  .farm-positions {
    padding: 20px 10px;
  }
}
</style>
