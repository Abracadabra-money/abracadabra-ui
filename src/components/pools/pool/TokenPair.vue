<template>
  <div class="token-pair">
    <div class="token-icons">
      <BaseTokenIcon
        class="base"
        :icon="baseTokenConfig.icon"
        :name="baseTokenConfig.name"
        :size="baseIconSizePx"
      />
      <BaseTokenIcon
        :style="quoteIconStyles"
        class="quote"
        :icon="quoteTokenConfig.icon"
        :name="quoteTokenConfig.name"
        :size="quoteIconSizePx"
      />
      <img
        class="chain-icon"
        :src="getChainIcon(pool.chainId)"
        alt="Chain icon"
        v-if="chainIcon"
      />
    </div>

    <div class="pair-info">
      <p class="name">
        {{ pool.name }}
      </p>
    </div>
  </div>
</template>

<script>
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import { getChainIcon } from "@/helpers/chains/getChainIcon";

const quoteTokenOffsetCoefficient = 3.5;
const borderRadiusCoefficient = 2.5;

export default {
  props: {
    pool: { type: Object },
    chainIcon: Boolean,
    iconSize: { type: Number, default: 46 },
    borderThickness: { type: Number, default: 3 },
  },

  computed: {
    baseIconSize() {
      return this.iconSize - this.borderThickness * 2;
    },

    baseIconSizePx() {
      return `${this.baseIconSize}px`;
    },

    baseTokenConfig() {
      return this.pool.tokens.baseToken.config;
    },

    quoteIconSize() {
      return this.iconSize;
    },

    quoteIconSizePx() {
      return `${this.quoteIconSize}px`;
    },

    quoteIconStyles() {
      return `
              border: ${this.borderThickness}px solid #0d1527;
              border-radius: ${this.iconSize / borderRadiusCoefficient}px;
              margin-left: -${
                this.quoteIconSize / quoteTokenOffsetCoefficient
              }px;
              `;
    },

    quoteTokenConfig() {
      return this.pool.tokens.quoteToken.config;
    },
  },

  methods: { getChainIcon },

  components: { BaseTokenIcon },
};
</script>

<style scoped lang="scss">
.token-pair {
  display: flex;
  align-items: center;
}

.token-icon {
  margin-right: 0 !important;
}

.token-icons {
  position: relative;
  display: flex;
  align-items: center;
}

.pair-info {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.chain-icon {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #0d1427;
}

.title {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
}

.name {
  font-size: 18px;
  font-weight: 500;
  line-height: 22px;
}
</style>
