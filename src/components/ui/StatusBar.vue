<template>
  <div class="info-bar" v-if="hasSomething">
    <img
      class="info-bar-icon"
      :class="{ small }"
      src="@/assets/images/info-bar/strategy.png"
      alt="Strategy"
      v-if="hasStrategy"
      v-tooltip="'Strategy'"
    />
    <img
      class="info-bar-icon"
      :class="{ small }"
      src="@/assets/images/info-bar/spirit.png"
      alt="Spirit"
      v-if="isSpiritSwap"
      v-tooltip="'SpiritSwap'"
    />
    <img
      class="info-bar-icon"
      :class="{ small }"
      src="@/assets/images/info-bar/spooky.png"
      alt="Spooky"
      v-if="isSpookySwap"
      v-tooltip="'SpookySwap'"
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
      v-if="isDeprecated"
      v-tooltip="'Deprecated'"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    hasSomething() {
      return this.hasStrategy || this.isDeprecated;
    },
    hasStrategy() {
      return this.pool.strategyLink;
    },
    isDeprecated() {
      return this.isFarm ? +this.pool.poolRoi === 0 : this.pool.isDepreciated;
    },

    isSpookySwap() {
      if (this.chainId === 250 && this.pool.id === 8) return true;
      return false;
    },

    isSpiritSwap() {
      if (this.chainId === 250 && this.pool.id === 7) return true;
      return false;
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
