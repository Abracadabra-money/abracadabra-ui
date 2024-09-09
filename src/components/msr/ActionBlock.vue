<template>
  <div class="action-block">
    <Stake
      v-show="activeAction == 'Stake'"
      :mimSavingRateInfo="mimSavingRateInfo"
      :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
      @chooseLockAction="$emit('chooseLockAction')"
      @updateMimSavingRateInfo="$emit('updateMimSavingRateInfo')"
    />
    <Claim
      v-show="activeAction == 'Claim'"
      :mimSavingRateInfo="mimSavingRateInfo"
      :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
      @chooseLockAction="$emit('chooseLockAction')"
      @updateMimSavingRateInfo="$emit('updateMimSavingRateInfo')"
    />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import { formatPercent } from "@/helpers/filters";
import type { MSRActionName } from "@/views/stake/MSR.vue";
import type { MimSavingRateInfo } from "@/helpers/mimSavingRate/getMimSavingRateInfo";
export default {
  emits: ["chooseLockAction", "updateMimSavingRateInfo"],

  props: {
    activeAction: { type: String as PropType<MSRActionName> },
    mimSavingRateInfo: {
      type: Object as PropType<MimSavingRateInfo | null>,
    },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  computed: {
    apr(): string | number {
      const baseApr = this.mimSavingRateInfo?.baseApr || 0;
      switch (this.activeAction) {
        case "Stake":
          return baseApr;
        default:
          return "";
      }
    },
  },

  methods: {
    formatPercent,
  },

  components: {
    Stake: defineAsyncComponent(
      () => import("@/components/msr/actions/stake/Stake.vue")
    ),
    Claim: defineAsyncComponent(
      () => import("@/components/msr/actions/Claim.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.action-block {
  width: 100%;
}

.common-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 32px;
}

.apr {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #fff;
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 16px;
  font-weight: 600;
}

.actions-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.actions-wrapper::v-deep(.action) {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
}

.actions-wrapper::v-deep(.action-title) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
}

.actions-wrapper::v-deep(.action-button) {
  margin-top: 24px;
}

.row-skeleton {
  height: 24px !important;
}

@media (max-width: 760px) {
  .apr {
    display: none;
  }
}

@media (max-width: 500px) {
  .action-block {
    height: auto;
    border: none;
    border-radius: 0;
    background: none;
    box-shadow: none;
    backdrop-filter: none;
  }

  .actions-wrapper::v-deep(.action-title) {
    flex-wrap: wrap;
    font-size: 18px;
  }
}
</style>
