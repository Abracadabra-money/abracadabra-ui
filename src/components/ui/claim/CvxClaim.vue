<template>
  <button class="claim-btn" v-if="isShowClaim" @click.stop="claimCvxReward">
    <img src="@/assets/images/deposit.svg" alt="Deposit" />
    <span>Claim</span>
    <template v-if="rewardArrInfo">
      <span
        class="claim-amount"
        v-for="info in rewardArrInfo"
        :key="info.symbol"
        >{{ info.symbol }} {{ formatAmount(info.amount) }}</span
      >
    </template>
    <span v-else>{{ formatAmount(rewardInfo) }}</span>
  </button>
</template>

<script>
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
export default {
  props: {
    id: {
      type: Number,
      require: true,
    },
    contract: {
      type: Object,
      require: true,
    },
  },

  data() {
    return {
      config: {
        15: {
          methods: "cvx_claimable_reward",
          decimals: 18,
        },
        16: {
          methods: "cvx_claimable_reward",
          decimals: 18,
        },
        24: {
          methods: "cvx_claimable_reward",
          decimals: 18,
        },
        25: {
          methods: "cvx_claimable_reward",
          decimals: 18,
        },
        41: {
          methods: "earned",
          rewardTokens: [
            {
              name: "CRV",
              address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
              decimals: 18,
            },
            {
              name: "CVX",
              address: "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B",
              decimals: 18,
            },
          ],
        },
      },
      rewardArrInfo: null,
      rewardInfo: null,
      rewardsAmount: 0,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

    isShowClaim() {
      return (
        this.chainId === 1 && (this.rewardInfo > 0 || this.rewardsAmount > 0)
      );
    },
  },

  watch: {
    async id() {
      await this.getEarnedReward(this.contract);
    },
  },

  methods: {
    async getEarnedReward(contract) {
      try {
        if (!this.id) return false;
        this.rewardArrInfo = null;
        this.rewardInfo = null;
        this.rewardsAmount = 0;

        const rewards = await contract[this.config[this.id].methods](
          this.account
        );

        if (Array.isArray(rewards)) {
          this.rewardArrInfo = rewards.map((reward) => {
            const rewardTokenConfig = this.config[this.id].rewardTokens.find(
              (config) => config.address === reward.token
            );

            const amount = this.$ethers.utils.formatUnits(
              reward.amount,
              rewardTokenConfig.decimals
            );

            this.rewardsAmount = this.rewardsAmount + +amount;

            return {
              symbol: rewardTokenConfig.name,
              amount,
            };
          });
        } else {
          this.rewardInfo = this.$ethers.utils.formatUnits(
            rewards,
            this.config[this.id].decimals
          );
        }
      } catch (error) {
        console.log("Get Earned Reward Error: ", error);
      }
    },

    formatAmount(amount) {
      if (amount >= 0.01) return filters.formatToFixed(amount, 2);
      return "> 0.01";
    },

    async claimCvxReward() {
      try {
        const method = "getReward(address)";
        const estimateGas = await this.contract.estimateGas[method](
          this.account
        );

        const gasLimit = 1000 + +estimateGas.toString();

        await await this.contract[method](this.account, {
          gasLimit,
        });
      } catch (error) {
        console.log("Claim Cvx Reward Error:", error);
      }
    },
  },

  async created() {
    await this.getEarnedReward(this.contract);
  },
};
</script>

<style lang="scss" scoped>
.claim-btn {
  background: rgba(157, 244, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  padding: 3px 8px;
  color: #63caf8;
  display: flex;
  align-items: center;
  margin-right: 15px;
  gap: 5px;
  cursor: pointer;
}

.claim-amount {
  font-size: 14px;
}
</style>
