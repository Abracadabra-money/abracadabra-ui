<template>
  <div class="info-bar">
    <img
      class="info-bar-icon"
      :class="{ small }"
      src="@/assets/images/info-bar/strategy.png"
      alt="Strategy"
      v-if="pool.strategyLink"
      v-tooltip="'Strategy'"
    />
    <img
      class="info-bar-icon"
      :class="{ small }"
      src="@/assets/images/info-bar/spirit.png"
      alt="Spirit"
      v-if="false"
      v-tooltip="'Spirit'"
    />
    <img
      class="info-bar-icon"
      :class="{ small }"
      src="@/assets/images/info-bar/new.png"
      alt="New"
      v-if="false"
      v-tooltip="'New'"
    />
    <img
      class="info-bar-icon"
      :class="{ small }"
      src="@/assets/images/info-bar/depreciated.png"
      alt="Deprecated"
      v-if="isFarm ? +pool.poolRoi === 0 : pool.isDepreciated"
      v-tooltip="'Deprecated'"
    />
  </div>
</template>

<script>
export default {
  props: {
    isFarm: {
      type: Boolean,
      default: false,
    },
    pool: {
      type: Object,
      require: true,
    },

    small: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.info-bar {
  display: flex;
  justify-content: flex-end;
  height: 24px;
}

.info-bar-icon {
  cursor: pointer;
  width: 24px;
  height: 24px;

  &.small {
    width: 18px;
    height: 18px;
  }
}

.info-bar-icon:not(:last-child) {
  margin-right: 10px;
}

@media (max-width: 1024px) {
  .info-bar {
    height: 18px;
  }
  .info-bar-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
