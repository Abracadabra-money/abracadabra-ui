<template>
  <div class="info-bar">
    <img
      class="info-bar-icon"
      src="@/assets/images/info-bar/strategy.png"
      alt="Strategy"
      v-if="pool.hasStrategy"
      v-tooltip="'Strategy'"
    />
    <img
      class="info-bar-icon"
      src="@/assets/images/info-bar/spirit.png"
      alt="Spirit"
      v-if="false"
      v-tooltip="'Spirit'"
    />
    <img
      class="info-bar-icon"
      src="@/assets/images/info-bar/new.png"
      alt="New"
      v-if="false"
      v-tooltip="'New'"
    />
    <img
      class="info-bar-icon"
      src="@/assets/images/info-bar/depreciated.png"
      alt="Deprecated"
      v-if="pool.isDepreciated"
      v-tooltip="'Deprecated'"
    />
  </div>
</template>

<script>
export default {
  props: {
    pool: {
      type: Object,
      require: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.info-bar {
  display: flex;
  justify-content: flex-end;
}

.info-bar-icon {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.info-bar-icon:not(:last-child) {
  margin-right: 10px;
}
</style>
