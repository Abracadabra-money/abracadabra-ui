<template>
  <div class="farms-info">
    <div class="title-desc">
      <h2 class="title">Farm Opportunities</h2>
      <p class="description">
        <span class="desc-line">
          Use your favourite assets as collateral to borrow
        </span>
        <span class="desc-line">
          <img src="@/assets/images/farm/symbol-MIM.png" class="mim-symbol" />
          Magic Internet Money, a leading decentralised and collateral-backed
          stablecoin.
        </span>
      </p>
    </div>

    <div class="reward-cards" v-if="account">
      <div class="reward-card spell">
        <h4 class="reward-title">Total Spell Rewards</h4>
        <div class="reward-values">
          <div class="token-amount">
            <img
              class="token-icon"
              src="@/assets/images/tokens/SPELL.png"
              alt="SPELL"
            />
            {{ formattedSpell.amount }}
          </div>
          <span class="token-usd-equivalent">{{ formattedSpell.usd }}</span>
        </div>
      </div>

      <div class="reward-card arbitrum">
        <h4 class="reward-title">Total Arbitrum Rewards</h4>
        <div class="reward-values">
          <div class="token-amount">
            <img
              class="token-icon"
              src="@/assets/images/tokens/AETH.png"
              alt="SPELL"
            />
            {{ formattedArbitrum.amount }}
          </div>
          <span class="token-usd-equivalent">{{ formattedArbitrum.usd }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index";
import { mapGetters } from "vuex";

export default {
  props: {
    farms: {
      type: Object,
    },
  },

  data() {
    return {
      spell: 0,
      arbitrum: 0,
      spellPrice: 0,
      arbitrumPrice: 0,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount" }),

    formattedSpell() {
      return {
        amount: filters.formatTokenBalance(this.spell.toString()),
        usd: filters.formatUSD(this.spell * this.spellPrice),
      };
    },

    formattedArbitrum() {
      return {
        amount: filters.formatTokenBalance(this.arbitrum.toString()),
        usd: filters.formatUSD(this.arbitrum * this.arbitrumPrice),
      };
    },
  },

  methods: {
    calculateRewards() {
      if (!this.account) return false;
      let spell = 0;
      let arbitrum = 0;
      this.farms?.forEach((farm) => {
        if (!farm.isMultiReward) {
          spell += Number(farm.accountInfo.userReward);
          this.spellPrice = farm.earnedTokenPrice;
        } else {
          spell += Number(farm.accountInfo.rewardTokensInfo[0].earned);
          arbitrum += Number(farm.accountInfo.rewardTokensInfo[1].earned);
          this.arbitrumPrice = Number(
            farm.accountInfo.rewardTokensInfo[1].price
          );
        }
      });
      this.spell = spell;
      this.arbitrum = arbitrum;
    },
  },

  watch: {
    farms() {
      this.calculateRewards();
    },
  },

  created() {
    this.calculateRewards();
  },
};
</script>

<style lang="scss" scoped>
.farms-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
}

.title {
  color: #fff;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 10px;
}

.description {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}

.desc-line {
  display: flex;
  align-items: center;
}

.mim-symbol {
  margin-right: 4px;
}

.reward-cards {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.reward-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 24px;
  width: 262px;
  height: 102px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: url("../../assets/images/farm/reward-card-background.png");
  background-repeat: no-repeat;
  background-position: 0 20px;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.reward-title {
  color: #99a0b2;
  font-size: 16px;
  font-weight: 500;
}

.reward-values {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.token-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  color: #fff;
  font-size: 28px;
  font-weight: 500;
}

.token-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
}

.token-usd-equivalent {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
}

.arbitrum {
  border: 1px solid #2d4a96;
  background: url("../../assets/images/farm/reward-arbitrum-background.png");
  background-position: -30px 0;
  background-repeat: no-repeat;
}

@media screen and (max-width: 1050px) {
  .farms-info {
    flex-direction: column;
    gap: 16px;
  }

  .reward-cards {
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media screen and (max-width: 620px) {
  .reward-card {
    width: 100%;
    height: 90px;
  }

  .arbitrum {
    background-size: 120%;
    background-position: -70px;
  }
}

@media screen and (max-width: 400px) {
  .arbitrum {
    background: linear-gradient(
        90deg,
        rgba(45, 74, 150, 0.32) 0%,
        rgba(116, 92, 210, 0.32) 100%
      ),
      url("../../assets/images/farm/reward-arbitrum-background-mobile.png");
    background-position: -7px 0;
  }
}
</style>
