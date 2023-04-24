<template>
  <div class="farm-positions">
    <div class="position-header">
      <PositionTokensInfo :position="pool" />
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
    pool: { type: Object, required: true },
  },

  computed: {
    positionActions() {
      return [
        {
          title: "Stake",
          icon: this.$image("assets/images/myposition/Stake.png"),
          name: "FarmPool",
          id: this.pool.id,
        },
        {
          title: "Untake",
          icon: this.$image("assets/images/myposition/Unstake.png"),
          name: "FarmPool",
          id: this.pool.id,
        },
      ];
    },

    assetsInfo() {
      return [
        {
          title: "Earned",
          symbol: this.pool.tokenName,
          icon: spellIcon,
          amount: filters.formatTokenBalance(this.earnedData.balance),
          amountlUsd: filters.formatUSD(this.earnedData.usd),
          actions: {
            visibility: this.pool.accountInfo,
            disabled: !+this.earnedData.balance,
            event: "harvest",
          },
        },
        {
          title: `${this.pool.stakingTokenType} deposited`,
          symbol: this.pool.name,
          icon: this.pool.icon,
          amount: filters.formatTokenBalance(this.depositedData.balance),
          amountlUsd: filters.formatUSD(this.depositedData.usd),
          tokensList: this.tokensList,
          actions: {
            link: "FarmPool",
            id: this.pool.id,
            visibility: this.pool.accountInfo,
            disabled: !+this.depositedData.balance,
            event: "withdraw",
          },
        },
      ];
    },

    tokensList() {
      const tokensList = [
        {
          symbol: this.pool.depositedBalance?.token0.name,
          icon: this.pool.depositedBalance?.token0.icon,
          amount: filters.formatTokenBalance(
            this.pool.accountInfo?.tokensBalanceInfo?.token0.amount
          ),
          amountlUsd: filters.formatUSD(
            this.pool.accountInfo?.tokensBalanceInfo?.token0.amountInUsd
          ),
        },
        {
          symbol: this.pool.depositedBalance?.token1.name,
          icon: this.pool.depositedBalance?.token1.icon,
          amount: filters.formatTokenBalance(
            this.pool.accountInfo?.tokensBalanceInfo?.token1.amount
          ),
          amountlUsd: filters.formatUSD(
            this.pool.accountInfo?.tokensBalanceInfo?.token1.amountInUsd
          ),
        },
      ].filter((e) => e.symbol && e.amount);

      return tokensList.length ? tokensList : false;
    },

    earnedData() {
      return this.prepBalanceData(
        this.pool.accountInfo?.userReward,
        this.pool.tokenPrice
      );
    },

    depositedData() {
      return this.prepBalanceData(
        this.pool.accountInfo?.userInfo.amount,
        this.pool.lpPrice
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
        const tx = await this.pool.contractInstance.withdraw(
          this.pool.poolId,
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
