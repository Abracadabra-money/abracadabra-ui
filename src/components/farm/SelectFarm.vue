<template>
  <button class="select" @click="$emit('openFarmsPopup')">
    <div class="icon-text">
      <BaseTokenIcon
        v-if="selectedFarm"
        :name="selectedFarm.name"
        :icon="selectedFarm.icon"
      />
      <BaseTokenIcon v-else type="select" />
      <span class="select-text">
        {{ selectedFarm ? selectedFarm.name : "Select Farm" }}
      </span>
    </div>
    <img class="select-arrow" src="@/assets/images/arrow.svg" alt="Arrow" />
  </button>
</template>

<script>
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";

export default {
  props: {
    selectedFarm: { type: Object },
  },
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

.icon-text {
  display: flex;
  align-items: center;
}

.select-arrow {
  width: 16px;
  height: 16px;
}
</style>
