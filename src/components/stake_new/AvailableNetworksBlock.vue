<template>
  <div class="networks-wrap">
    <h4 class="title">Available on:</h4>
    <div class="networks-list">
      <button
        class="network-button"
        :key="networkId"
        v-for="networkId in (availableNetworks as number[])"
        @click="changeNetwork(networkId)"
      >
        <img
          :class="['network-icon', { active: networkId === selectedNetwork }]"
          :src="getChainIcon(networkId)"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { getChainIcon } from "@/helpers/chains/getChainIcon";

export default {
  props: {
    availableNetworks: {
      type: Array,
      default: () => [],
    },
    selectedNetwork: {
      type: Number,
    },
  },

  methods: {
    getChainIcon,

    changeNetwork(networkId: number) {
      this.$emit("changeNetwork", networkId);
    },
  },
};
</script>

<style lang="scss" scoped>
.networks-wrap {
  gap: 20px;
  display: flex;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: 0.45px;
}

.networks-list {
  gap: 12px;
  display: flex;
  align-items: center;
}

.network-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  background: transparent;
  outline: transparent;
  cursor: pointer;
}

.network-icon {
  width: 32px;
  height: 32px;
}

.active {
  border-radius: 50px;
  border: 1px solid #fff;
  background: #2e6a95;
  box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 0.38);
}
</style>
