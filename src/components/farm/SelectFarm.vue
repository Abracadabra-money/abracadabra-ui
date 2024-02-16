<template>
  <button class="select" @click="$emit('openFarmsPopup')">
    <div class="icon-text">
      <TokenChainIcon
        :icon="selectedFarm?.icon"
        :name="selectedFarm?.name"
        :chainId="selectedFarm?.chainId"
        size="38px"
      />
      <span class="select-text">
        {{ selectedFarm ? selectedFarm.name : "Select Farm" }}
      </span>
    </div>
    <img class="select-arrow" src="@/assets/images/arrow.svg" alt="Arrow" />
  </button>
</template>

<script>
import TokenChainIcon from "@/components/ui/icons/TokenChainIcon.vue";

export default {
  props: {
    selectedFarm: { type: Object },
  },

  components: { TokenChainIcon },
};
</script>

<style lang="scss" scoped>
.select {
  flex-grow: 1;
  width: 100%;
  height: 54px;
  border-radius: 16px;
  border: 1px solid rgba(73, 70, 97, 0.4);
  background: rgba(8, 14, 31, 0.6);
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
}

.select:disabled {
  cursor: default;
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
