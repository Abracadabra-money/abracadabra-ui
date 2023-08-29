<template>
  <div class="select-wrap">
    <button class="select" @click="$emit('openFarmsPopup')">
      <BaseTokenIcon
        v-if="selectedFarm"
        :name="selectedFarm.name"
        :icon="selectedFarm.icon"
      />
      <BaseTokenIcon v-else type="select" />
      <span class="select-text">
        {{ selectedFarm ? selectedFarm.name : "Select Farm" }}
      </span>
      <img class="select-arrow" src="@/assets/images/arrow.svg" alt="Arrow" />
    </button>
  </div>
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
.select-wrap {
  padding-bottom: 15px;
  margin-bottom: 30px;
}

.select {
  width: 100%;
  height: 70px;
  outline: transparent;
  background: rgba(129, 126, 166, 0.2);
  border: 1px solid #494661;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.select:disabled {
  cursor: default;
}

.select-text {
  margin-right: 10px;
}

.select-arrow {
  width: 16px;
  height: 16px;
}
</style>
