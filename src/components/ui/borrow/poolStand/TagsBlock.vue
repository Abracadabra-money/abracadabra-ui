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

import LockedTimer from "@/components/stake/LockedTimer.vue";
import MiniStatusTag from "@/components/ui/MiniStatusTag.vue";
import StrategyLink from "@/components/ui/links/StrategyLink.vue";
import DepositButton from "@/components/ui/buttons/DepositButton.vue";
import ClaimButton from "@/components/ui/buttons/ClaimButton.vue";
import GetTokenLink from "@/components/ui/links/GetTokenLink.vue";
export default {
  props: {
    cauldron: { type: Object, required: true },
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
    }),

    isLockedTimer() {
      if (this.cauldron?.userInfo?.userLockedTimestamp)
        return this.cauldron.userInfo.userLockedTimestamp;

      return 0;
    },

    isLeverageTag() {
      return this.cauldron?.isSwappersActive;
    },

    isMigrated() {
      if (this.cauldron?.cauldronSettings)
        return this.cauldron.cauldronSettings.isMigrated;

      return this.cauldron?.isMigrated;
    },

    tokenLinkData() {
      return getTokenLinkData(this.cauldron.id, this.chainId);
    },
  },

  components: {
    LockedTimer,
    MiniStatusTag,
    StrategyLink,
    DepositButton,
    ClaimButton,
    GetTokenLink,
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
