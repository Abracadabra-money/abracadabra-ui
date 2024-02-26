<template>
  <div class="action-block">
    <div class="common-info">
      <AvailableNetworksBlock
        :selectedNetwork="42161"
        :availableNetworks="[42161]"
      />
      <span class="apr">APR: 101.82%</span>
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
      />
      <Claim
        v-if="activeAction == 'Claim'"
        :mimSavingRateInfo="mimSavingRateInfo"
      />
    </div>
  </div>
</template>

<script>
import Stake from "@/components/msr/actions/Stake.vue";
import Lock from "@/components/msr/actions/Lock.vue";
import Claim from "@/components/msr/actions/Claim.vue";

import AvailableNetworksBlock from "@/components/stake/AvailableNetworksBlock.vue";

export default {
  emits: ["chooseLockAction", "updateMimSavingRateInfo"],

  props: {
    activeAction: { type: String },
    mimSavingRateInfo: { type: Object, required: true },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  components: {
    Stake,
    Lock,
    Claim,
    AvailableNetworksBlock,
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
  height: 100%;
  height: 762px;
  max-width: 533px;
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

.actions-wrapper::v-deep(.action) {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.actions-wrapper::v-deep(.action-title) {
  font-size: 24px;
  font-weight: 500;
}

.actions-wrapper::v-deep(.action-button) {
  margin-top: 24px;
}
</style>
