<template>
  <button class="claim-btn" v-if="reward" @click.stop="actionHandler">
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
import { getCvxClaimableReward } from "@/helpers/cauldron/getCvxClaimableReward.ts";
import { handleClaimCrvReward } from "@/helpers/cauldron/handleClaimCrvReward.ts";
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
      account: "getAccount",
    }),
  },

  watch: {
    async account() {
      await this.getReward();
    },
  },

  methods: {
    async actionHandler() {
      const { collateral } = this.cauldron.contracts;
      await handleClaimCrvReward(collateral, this.account);
    },

    async getReward() {
      const { collateral } = this.cauldron.contracts;
      const { decimals } = this.cauldron.config.collateralInfo;
      this.reward = await getCvxClaimableReward(
        collateral,
        this.account,
        decimals
      );
    },
  },

  async created() {
    await this.getReward();
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
