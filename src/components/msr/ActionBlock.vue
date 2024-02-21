<template>
  <div class="action-block">
    <div class="common-info">
      <AvailableNetworksBlock
        :selectedNetwork="1"
        :availableNetworks="[1, 10, 56, 250]"
      />
      <span class="apr">APR: 101.82%</span>
    </div>
    
    <div class="actions-wrapper">
      <Stake v-if="activeAction == 'Stake'" />
      <Lock v-if="activeAction == 'Lock'" />
      <Claim v-if="activeAction == 'Claim'" />
    </div>
  </div>
</template>

<script>
import Stake from "@/components/msr/actions/Stake.vue";
import Lock from "@/components/msr/actions/Lock.vue";
import Claim from "@/components/msr/actions/Claim.vue";

import AvailableNetworksBlock from "@/components/stake/AvailableNetworksBlock.vue";

export default {
  props: {
    activeAction: { type: String },
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

<style scoped>
.action-block {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 762px;
  min-width: 533px;
  padding: 24px;

  border-radius: 20px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.common-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}
</style>
