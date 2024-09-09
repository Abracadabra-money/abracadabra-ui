<template>
  <div class="action-info">
    <PromoCard
      :mimSavingRateInfo="mimSavingRateInfo"
      :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
    />

    <LockInfo
      :mimSavingRateInfo="mimSavingRateInfo"
      :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
    />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import { formatPercent } from "@/helpers/filters";
import mimIcon from "@/assets/images/tokens/MIM.png";
import type { MimSavingRateInfo } from "@/helpers/mimSavingRate/getMimSavingRateInfo";
import { formatTimestampToUnix } from "@/helpers/time";

export default {
  props: {
    mimSavingRateInfo: {
      type: Object as PropType<MimSavingRateInfo | null>,
    },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  data() {
    return {
      mimIcon,
    };
  },

  computed: {},

  methods: {
    formatPercent,
    formatTimestampToUnix,
  },

  components: {
    PromoCard: defineAsyncComponent(
      () => import("@/components/msr/PromoCard.vue")
    ),
    LockInfo: defineAsyncComponent(
      () => import("@/components/msr/LockInfo.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.action-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.lock-info {
  @include block-wrap;
}
</style>
