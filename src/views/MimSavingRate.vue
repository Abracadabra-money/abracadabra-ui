<template>
  <div class="msr-view">
    <MSRCarousel
      :mimSavingRateInfo="mimSavingRateInfo"
      :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
      :actions="actions"
      :activeAction="activeAction"
      :isCarouselMode="isCarouselMode"
      @selectAction="selectAction"
    />

    <ActionBlock
      :activeAction="activeAction"
      :mimSavingRateInfo="mimSavingRateInfo"
      :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
      @chooseLockAction="selectAction('Lock', true)"
      @updateMimSavingRateInfo="createMimSavingRateInfo"
      v-if="isCarouselMode"
    />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import {
  getMimSavingRateInfo,
  type MimSavingRateInfo,
  emptyMimSavingRateInfo,
} from "@/helpers/mimSavingRate/getMimSavingRateInfo";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import { useImage } from "@/helpers/useImage";

export type MSRAction = {
  id: number;
  image: string;
  name: MSRActionName;
};
export type MSRActionName = "Stake" | "Lock" | "Claim";

export default {
  data() {
    return {
      actions: [
        {
          id: 0,
          image: useImage("assets/gifs/msr/stake.webp"),
          name: "Stake",
        },
        {
          id: 1,
          image: useImage("assets/gifs/msr/lock.webp"),
          name: "Lock",
        },
        {
          id: 2,
          image: useImage("assets/gifs/msr/claim.webp"),
          name: "Claim",
        },
      ] as MSRAction[],
      activeIndex: 1 as number,
      itemWidth: 200,
      mimSavingRateInfo: emptyMimSavingRateInfo as MimSavingRateInfo,
      isMimSavingRateInfoLoading: true,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      getChainById: "getChainById",
    }),

    translateOffset() {
      if (this.activeIndex === null) return 0;
      const middleIndex = Math.floor(this.actions.length / 2);
      let marginalElementsOffset = 0;
      switch (this.activeIndex) {
        case 0:
          marginalElementsOffset = -40;
          break;

        case 2:
          marginalElementsOffset = 40;
          break;

        default:
          break;
      }

      return (
        (middleIndex - this.activeIndex) * this.itemWidth -
        marginalElementsOffset
      );
    },

    activeAction() {
      return this.$route.query.action as MSRActionName;
    },

    isCarouselMode() {
      return this.activeAction !== null;
    },
  },

  watch: {
    async account() {
      await this.createMimSavingRateInfo();
    },

    async chainId() {
      await this.createMimSavingRateInfo();
    },
  },

  methods: {
    selectAction(action: MSRActionName, isPromo = false) {
      const query: { action: string; promo?: string } = {
        action: `${action}`,
      };
      if (isPromo) query.promo = "promo";

      this.$router.replace({
        name: "MSR",
        query,
      });
    },

    async createMimSavingRateInfo() {
      const publicClient = this.getChainById(ARBITRUM_CHAIN_ID).publicClient;

      this.isMimSavingRateInfoLoading = true;

      this.mimSavingRateInfo = await getMimSavingRateInfo(
        this.account,
        publicClient
      );

      this.isMimSavingRateInfoLoading = false;
    },
  },

  async created() {
    await this.createMimSavingRateInfo();
  },

  components: {
    MSRCarousel: defineAsyncComponent(
      () => import("@/components/msr/MSRCarousel.vue")
    ),
    ActionBlock: defineAsyncComponent(
      () => import("@/components/msr/ActionBlock.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.msr-view {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  min-height: 100vh;
  max-width: 1280px;
  margin: auto;
  padding: 106px 0 50px 0;
}

@media (max-width: 1300px) {
  .msr-view {
    padding: 106px 0 50px 0;
    gap: 32px;
  }
}
</style>
