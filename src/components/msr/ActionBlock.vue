<template>
  <div class="action-block">
    <AvailableNetworksBlock
      :selectedNetwork="42161"
      :availableNetworks="[42161]"
    />

    <div class="actions-wrapper">
      <Stake
        v-if="activeAction == 'Stake'"
        :mimSavingRateInfo="mimSavingRateInfo"
        :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
        @chooseLockAction="$emit('chooseLockAction')"
        @updateMimSavingRateInfo="$emit('updateMimSavingRateInfo')"
      />
      <Lock
        v-if="activeAction == 'Lock'"
        :mimSavingRateInfo="mimSavingRateInfo"
        :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
        @updateMimSavingRateInfo="$emit('updateMimSavingRateInfo')"
      />
      <Claim
        v-if="activeAction == 'Claim'"
        :mimSavingRateInfo="mimSavingRateInfo"
        :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
        @chooseLockAction="$emit('chooseLockAction')"
        @updateMimSavingRateInfo="$emit('updateMimSavingRateInfo')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import { formatPercent } from "@/helpers/filters";
import type { MSRActionName } from "@/views/MimSavingRate.vue";
export default {
  emits: ["chooseLockAction", "updateMimSavingRateInfo"],

  props: {
    activeAction: { type: String as PropType<MSRActionName> },
    mimSavingRateInfo: {
      type: null as any,
      default: null,
      required: false,
    },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  methods: {
    formatPercent,
  },

  components: {
    Stake: defineAsyncComponent(
      () => import("@/components/msr/actions/Stake.vue")
    ),
    Lock: defineAsyncComponent(
      () => import("@/components/msr/actions/Lock.vue")
    ),
    Claim: defineAsyncComponent(
      () => import("@/components/msr/actions/Claim.vue")
    ),
    AvailableNetworksBlock: defineAsyncComponent(
      () => import("@/components/stake/AvailableNetworksBlock.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.action-block {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 770px;
  width: 550px;
  padding: 24px;
  margin: 0 auto;
  border-radius: 20px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(50px);
  overflow: auto;
}

.networks-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 32px;
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

@media (max-width: 500px) {
  .action-block {
    min-height: auto;
    padding: 16px;
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
