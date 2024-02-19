<template>
  <div class="farm-position">
    <div class="deposited">
      <h4 class="subtitle">Deposited</h4>

      <div class="deposited-token">
        <span class="token-name">
          <BaseTokenIcon
            :icon="selectedFarm.icon"
            :name="selectedFarm.stakingToken.name"
            size="44px"
          />
          {{ selectedFarm.stakingToken.name }}</span
        >
        <div class="token-amount">
          <span class="value">{{ depositedTokenInfo.earned }}</span>
          <span class="usd">{{ depositedTokenInfo.usd }}</span>
        </div>
      </div>

      <ul class="deposited-token-parts token-list">
        <li
          class="deposited-token-part list-item"
          v-for="token in tokensList"
          :key="token.name"
        >
          <span class="token-name">
            <BaseTokenIcon :icon="token.icon" :name="token.name" size="28px" />
            {{ token.name }}</span
          >
          <div class="token-amount">
            <span class="value">{{ token.amount }}</span>
            <span class="usd">{{ token.amountUsd }}</span>
          </div>
        </li>
      </ul>
    </div>

    <div class="reward">
      <h4 class="subtitle">Reward</h4>

      <ul class="reward-tokens token-list">
        <li
          class="reward-token list-item"
          v-for="token in rewardTokensInfo"
          :key="token"
        >
          <span class="token-name">
            <BaseTokenIcon :name="token.name" :icon="token.icon" size="28px" />
            {{ token.name }}</span
          >
          <div class="token-amount">
            <span class="value">{{ token.earned }}</span>
            <span class="usd">{{ token.usd }}</span>
          </div>
        </li>
      </ul>
    </div>

    <BaseButton primary @click="harvest" :disabled="disableEarnedButton">
      Harvest
    </BaseButton>
  </div>
</template>

<script>
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import { getChainById } from "@/helpers/chains/index";
import spellIcon from "@/assets/images/tokens/SPELL.png";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";

export default {
  props: {
    selectedFarm: { type: Object },
    isProperNetwork: { type: Boolean },
  },

  computed: {
    chainIcon() {
      return getChainById(this.selectedFarm.chainId).icon;
    },

    depositedTokenInfo() {
      return this.prepBalanceData(
        this.selectedFarm.accountInfo.userInfo.amount,
        this.selectedFarm.lpPrice
      );
    },

    rewardTokensInfo() {
      if (this.selectedFarm.isMultiReward) {
        return this.selectedFarm.accountInfo?.rewardTokensInfo;
      }
      return [
        {
          ...this.prepBalanceData(
            this.selectedFarm.accountInfo.userReward,
            this.selectedFarm.earnedTokenPrice
          ),
          icon: spellIcon,
          name: "Spell",
        },
      ];
    },

    tokensList() {
      const tokensList = [
        {
          name: this.selectedFarm.depositedBalance?.token0.name,
          icon: this.selectedFarm.depositedBalance?.token0.icon,
          amount: formatTokenBalance(
            this.selectedFarm.accountInfo?.tokensBalanceInfo?.token0.amount
          ),
          amountUsd: formatUSD(
            this.selectedFarm.accountInfo?.tokensBalanceInfo?.token0.amountInUsd
          ),
        },
        {
          name: this.selectedFarm.depositedBalance?.token1.name,
          icon: this.selectedFarm.depositedBalance?.token1.icon,
          amount: formatTokenBalance(
            this.selectedFarm.accountInfo?.tokensBalanceInfo?.token1.amount
          ),
          amountUsd: formatUSD(
            this.selectedFarm.accountInfo?.tokensBalanceInfo?.token1.amountInUsd
          ),
        },
      ].filter((e) => e.name && e.amount);

      return tokensList.length ? tokensList : false;
    },

    disableEarnedButton() {
      const isInsufficientReward = this.selectedFarm.isMultiReward
        ? this.selectedFarm.accountInfo?.rewardTokensInfo?.filter(
            (tokenInfo) => +tokenInfo.earned > 0
          ).length === 0
        : !+this.selectedFarm.accountInfo.userReward;

      return isInsufficientReward || !this.isProperNetwork;
    },
  },

  methods: {
    formatUSD,
    formatTokenBalance,

    prepBalanceData(tokenValue, priceValue) {
      const usd = formatUSD(tokenValue * priceValue);
      const earned = formatTokenBalance(tokenValue);
      return {
        earned,
        usd,
      };
    },

    async harvest() {
      if (this.disableEarnedButton) return;
      try {
        const config = await prepareWriteContract({
          ...this.selectedFarm.contractInfo,
          functionName: this.selectedFarm.isMultiReward
            ? "getRewards"
            : "withdraw",
          args: this.selectedFarm.isMultiReward
            ? []
            : [this.selectedFarm.poolId, 0],
        });

        const { hash } = await writeContract(config);

        await waitForTransaction({ hash });
      } catch (error) {
        console.log("harvest err:", error);
      }
    },
  },

  components: { BaseTokenIcon, BaseButton },
};
</script>

<style lang="scss" scoped>
.farm-position {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 16px;
  gap: 16px;

  border-radius: 20px;
  border: 1px solid rgba(45, 74, 150, 0);
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
}

.subtitle {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.45px;
  margin-bottom: 12px;
}

.deposited-token {
  margin-bottom: 15.5px;
}

.deposited-token .token-name {
  font-size: 20px;
}

.deposited-token .token-amount .value {
  font-size: 16px;
}

.token-list {
  display: flex;
  flex-direction: column;
  gap: 11px;
  list-style: none;
}

.list-item,
.deposited-token {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.token-name {
  display: flex;
  align-items: center;
  max-width: 60%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.token-amount {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: end;
}

.value {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.usd {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 400;
}
</style>
