<template>
  <button class="select" @click="$emit('openFarmsPopup')">
    <div class="icon-text">
      <div class="token-info-icon">
        <BaseTokenIcon
          :icon="selectedFarm?.icon"
          :name="selectedFarm?.name"
          size="32px"
        />
        <img
          class="token-chain"
          :src="getChainIcon(selectedFarm?.chainId)"
          v-if="selectedFarm"
        />
      </div>
      <span class="select-text">
        {{ selectedFarm ? selectedFarm.name : "Select Farm" }}
      </span>
    </div>
    <img class="select-arrow" src="@/assets/images/arrow.svg" alt="Arrow" />
  </button>
</template>

<script>
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import { useImage } from "@/helpers/useImage";
import { getChainIcon } from "@/helpers/chains/getChainIcon";

export default {
  props: {
    selectedFarm: { type: Object },
  },

  methods: { getChainIcon },

  components: { BaseTokenIcon },
};
</script>

<style lang="scss" scoped>
.select {
  flex-grow: 1;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  border: 1px solid rgba(73, 70, 97, 0.4);
  background: rgba(8, 14, 31, 0.6);
  padding: 8px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
}

.select:disabled {
  cursor: default;
}

.token-info-icon {
  position: relative;
}

.token-chain {
  position: absolute;
  top: -4px;
  right: 4px;
  width: 15px;
  height: 15px;
}

.icon-text {
  display: flex;
  align-items: center;
}

.select-arrow {
  width: 16px;
  height: 16px;
}
</style>
