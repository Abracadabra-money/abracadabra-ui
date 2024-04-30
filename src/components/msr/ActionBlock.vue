<template>
  <div class="action-block">
    <div class="common-info">
      <AvailableNetworksBlock
        :selectedNetwork="42161"
        :availableNetworks="[42161]"
      />
      <span class="apr"
        ><Tooltip tooltip="APR" :width="20" :height="20" /> APR: 101.82%</span
      >
    </div>

    <div class="actions-wrapper">
      <Stake
        v-if="activeAction == 'Stake'"
        :mimSavingRateInfo="mimSavingRateInfo"
        @chooseLockAction="$emit('chooseLockAction')"
        @updateMimSavingRateInfo="$emit('updateMimSavingRateInfo')"
      />
      <Lock
        v-if="activeAction == 'Lock'"
        :mimSavingRateInfo="mimSavingRateInfo"
        @updateMimSavingRateInfo="$emit('updateMimSavingRateInfo')"
      />
      <Claim
        v-if="activeAction == 'Claim'"
        :mimSavingRateInfo="mimSavingRateInfo"
        @updateMimSavingRateInfo="$emit('updateMimSavingRateInfo')"
      />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  emits: ["chooseLockAction", "updateMimSavingRateInfo"],

  props: {
    activeAction: { type: String },
    mimSavingRateInfo: { type: Object, required: true },
  },

  components: {
    Stake: defineAsyncComponent(() =>
      import("@/components/msr/actions/Stake.vue")
    ),
    Lock: defineAsyncComponent(() =>
      import("@/components/msr/actions/Lock.vue")
    ),
    Claim: defineAsyncComponent(() =>
      import("@/components/msr/actions/Claim.vue")
    ),
    AvailableNetworksBlock: defineAsyncComponent(() =>
      import("@/components/stake/AvailableNetworksBlock.vue")
    ),
    Tooltip: defineAsyncComponent(() =>
      import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.action-block {
  position: relative;
  top: 110px;
  right: 80px;
  display: flex;
  flex-direction: column;
  height: 762px;
  max-width: 557px;
  width: 100%;
  padding: 24px;

  border-radius: 20px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(50px);
}

.common-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
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
  font-size: 24px;
  font-weight: 500;
}

.actions-wrapper::v-deep(.action-button) {
  margin-top: 24px;
}
</style>
