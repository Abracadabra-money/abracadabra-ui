<template>
  <div class="msr-view">
    <MSRCarousel
      :mimSavingRateInfo="mimSavingRateInfo"
      :actions="actions"
      :activeIndex="activeIndex"
      :isCarouselMode="isCarouselMode"
      @selectAction="selectAction"
      @next="next"
      @prev="prev"
    />

    <ActionBlock
      :activeAction="activeAction"
      :mimSavingRateInfo="mimSavingRateInfo"
      :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
      @chooseLockAction="selectAction(1)"
      @updateMimSavingRateInfo="createMimSavingRateInfo"
      v-if="isCarouselMode"
    />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { getMimSavingRateInfo } from "@/helpers/mimSavingRate/getMimSavingRateInfo";
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
          image: useImage("assets/gifs/msr/stake.gif"),
          name: "Stake",
        },
        {
          id: 1,
          image: useImage("assets/gifs/msr/lock.gif"),
          name: "Lock",
        },
        {
          id: 2,
          image: useImage("assets/gifs/msr/claim.gif"),
          name: "Claim",
        },
      ] as MSRAction[],
      activeIndex: 1 as number | null,
      itemWidth: 200,
      mimSavingRateInfo: null as any,
      isMimSavingRateInfoLoading: true,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      getChainById: "getChainById",
    }),

    translateOffset(): number {
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

    activeAction(): MSRActionName | null {
      if (this.activeIndex === null) return null;
      return this.actions[this.activeIndex].name;
    },

    isCarouselMode(): boolean {
      return this.activeIndex !== null;
    },
  },

  watch: {
    async account() {
      await this.createMimSavingRateInfo();
    },
  },

  methods: {
    selectAction(index: number) {
      this.activeIndex = index;
    },

    prev() {
      switch (this.activeIndex) {
        case null:
          break;
        case 0:
          this.activeIndex = this.actions.length - 1;
          break;
        default:
          this.activeIndex = this.activeIndex - 1;
          break;
      }
    },

    next() {
      switch (this.activeIndex) {
        case null:
          break;
        case this.actions.length - 1:
          this.activeIndex = 0;
          break;
        default:
          this.activeIndex = this.activeIndex + 1;
          break;
      }
    },

    async createMimSavingRateInfo() {
      const publicClient = this.getChainById(ARBITRUM_CHAIN_ID).publicClient;

      this.isMimSavingRateInfoLoading = true;

      this.mimSavingRateInfo = await getMimSavingRateInfo(
        this.account,
        publicClient
      );

      this.isMimSavingRateInfoLoading = false;

      console.log(this.mimSavingRateInfo);
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

@media (max-width: 760px) {
  .msr-view {
    padding: 106px 15px 50px 15px;
  }
}
</style>
