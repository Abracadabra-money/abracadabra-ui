<template>
  <button class="claim-button" v-if="reward" @click.stop="actionHandler">
    <span class="inner-wrap">
      Claim
      <ArrowTopRight />
    </span>
  </button>
</template>

<script lang="ts">
import {
  writeContractHelper,
  simulateContractHelper,
} from "@/helpers/walletClienHelper";
import { mapGetters } from "vuex";
import { formatUnits } from "viem";
import { defineAsyncComponent, type PropType } from "vue";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

const cvxClaimableRewardAbi = [
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "cvx_claimable_reward",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export default {
  props: {
    cauldron: {
      type: Object as PropType<CauldronInfo>,
      required: true,
    },
  },

  data() {
    return {
      reward: 0,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
    }),
  },

  watch: {
    async account() {
      this.reward = await this.getCvxClaimableReward();
    },
  },

  methods: {
    async getCvxClaimableReward() {
      if (!this.cauldron.config.cauldronSettings.hasCrvClaimLogic) return 0;

      const { chainId, collateralInfo } = this.cauldron.config;
      const publicClient = getPublicClient(chainId);

      try {
        return Number(
          formatUnits(
            await publicClient.readContract({
              address: collateralInfo.address,
              abi: cvxClaimableRewardAbi,
              functionName: "cvx_claimable_reward",
              args: [this.account],
            }),
            collateralInfo.decimals
          )
        );
      } catch (error) {
        console.log("Get Cvx Claimable Reward Error:", error);
        return 0;
      }
    },

    async actionHandler() {
      try {
        const { collateralInfo } = this.cauldron.config;
        const { address, abi } = collateralInfo;

        const { request } = await simulateContractHelper({
          address,
          abi,
          functionName: "getReward",
          args: [this.account],
        });

        await writeContractHelper(request);
      } catch (error) {
        console.log("Handle Claim Crv Reward Error:", error);
      }
    },
  },

  async created() {
    this.reward = await this.getCvxClaimableReward();
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
  background: #1a1f3d;
  color: #7088cc;
  font-size: 12px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: 0.36px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #191f2f;
    box-shadow: 0px 0px 4px 0px rgba(255, 255, 255, 0.13);
    color: #86a2f1;
  }
}
</style>
