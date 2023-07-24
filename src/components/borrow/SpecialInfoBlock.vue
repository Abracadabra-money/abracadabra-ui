<template>
  <div class="tags-wrap">
    <div class="wrap">
      <LockedTimer v-if="isLockedTimer" :finalTime="isLockedTimer" />
      <MiniStatusTag v-if="isLeverageTag" text="Leverage" :rounded="true" />
      <MiniStatusTag v-if="isMigrated" :rounded="true" />
      <StrategyLink :cauldron="cauldron" />
    </div>
    <div class="wrap">
      <DepositButton :cauldron="cauldron" />
      <ClaimButton :cauldron="cauldron" />
      <GetTokenLink v-if="tokenLinkData" :data="tokenLinkData" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getTokenLinkData } from "@/helpers/getTokenLinkData.ts";
import { defineAsyncComponent } from "vue";

export default {
  props: {
    cauldron: { type: Object, required: true },
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
    }),

    isLockedTimer() {
      const isCollateralLocked =
        this.cauldron.additionalInfo?.isCollateralLocked;
      if (!isCollateralLocked) return 0;
      return isCollateralLocked;
    },

    isLeverageTag() {
      return this.cauldron?.config.cauldronSettings.isSwappersActive;
    },

    isMigrated() {
      return !!this.cauldron.config.cauldronSettings?.isMigrated;
    },

    tokenLinkData() {
      return getTokenLinkData(this.cauldron.config.id, this.chainId);
    },
  },

  components: {
    LockedTimer: defineAsyncComponent(() =>
      import("@/components/stake/LockedTimer.vue")
    ),
    MiniStatusTag: defineAsyncComponent(() =>
      import("@/components/ui/MiniStatusTag.vue")
    ),
    StrategyLink: defineAsyncComponent(() =>
      import("@/components/ui/links/StrategyLinkNew.vue")
    ),
    DepositButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/DepositButton.vue")
    ),
    ClaimButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/ClaimButton.vue")
    ),
    GetTokenLink: defineAsyncComponent(() =>
      import("@/components/ui/links/GetTokenLink.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.tags-wrap {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.wrap {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
