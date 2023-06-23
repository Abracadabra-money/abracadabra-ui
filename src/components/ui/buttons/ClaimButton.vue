<template>
  <button class="claim-btn" v-if="+reward" @click.stop="handleClaimCrvReward">
    <img
      class="claim-btn-icon"
      src="@/assets/images/deposit.svg"
      alt="Deposit"
    />
    Claim
  </button>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    cauldron: { type: Object, require: true },
  },

  data() {
    return {
      reward: null,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),
  },

  watch: {
    async account() {
      this.reward = await this.getClaimableReward(
        this.cauldron.collateralToken.contract,
        this.cauldron.collateralToken.decimals
      );
    },
  },

  methods: {
    async getClaimableReward(contractInstance, decimals) {
      if (!contractInstance.cvx_claimable_reward) return null;

      try {
        const reward = await contractInstance.cvx_claimable_reward(
          this.account
        );

        return this.$ethers.utils.formatUnits(reward, decimals);
      } catch (error) {
        console.log("Get Claimable Reward Error: ", error);
      }
    },

    async handleClaimCrvReward() {
      try {
        const estimateGas =
          await this.cauldron.collateralToken.contract.estimateGas.getReward(
            this.account
          );

        const gasLimit = 1000 + +estimateGas.toString();

        await await this.cauldron.collateralToken.contract.getReward(
          this.account,
          {
            gasLimit,
          }
        );
      } catch (error) {
        console.log("Handle Claim Crv Reward Error:", error);
      }
    },
  },

  async created() {
    this.reward = await this.getClaimableReward(
      this.cauldron.collateralToken.contract,
      this.cauldron.collateralToken.decimals
    );
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
  cursor: pointer;
}

.claim-btn-icon {
  margin-right: 5px;
}
</style>
