<template>
  <button class="claim-button" v-if="reward" @click.stop="actionHandler">
    <span class="inner-wrap">
      Claim
      <ArrowTopRight />
    </span>
  </button>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { handleClaimCrvReward } from "@/helpers/cauldron/handleClaimCrvReward";
import { getCvxClaimableReward } from "@/helpers/cauldron/getCvxClaimableReward";
import { defineAsyncComponent } from "vue";

export default {
  props: {
    cauldron: { type: Object as any, require: true },
  },

  data() {
    return {
      reward: null as null | number,
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

  components: {
    ArrowTopRight: defineAsyncComponent(
      () => import("@/components/ui/icons/ArrowTopRightIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.claim-button {
  padding: 1px;
  background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
  border-radius: 8px;
  border: transparent;
}

.inner-wrap {
  height: 30px;
  padding: 5px 8px;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #303557;
  color: #7088cc;
  font-size: 12px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: 0.36px;
  cursor: pointer;
}
</style>
