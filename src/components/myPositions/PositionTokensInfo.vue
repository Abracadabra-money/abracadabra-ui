<template>
  <div class="token-info">
    <BaseTokenIcon :name="tokenSymbol" :icon="position.icon" size="80px" />
    <div>
      <p class="token-name">{{ tokenSymbol }}</p>
      <p class="token-rate" v-if="tokenName">{{ tokensRate }}</p>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
export default {
  props: {
    position: {
      type: Object,
      required: true,
    },
    tokenName: {
      type: String,
    },
  },

  computed: {
    tokenSymbol() {
      if (this.tokenName) return this.tokenName;
      return this.position?.collateralToken?.name || this.position?.name;
    },

    tokenToMim() {
      return filters.formatToFixed(
        1 / this.position.borrowToken.exchangeRate,
        4
      );
    },

    tokensRate() {
      return `1 ${this.tokenName} = ${this.tokenToMim}${this.position.borrowToken.name}`;
    },
  },

  components: {
    BaseTokenIcon,
  },
};
</script>

<style lang="scss" scoped>
.token-info {
  display: flex;
  align-items: center;
}

.token-name {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
}

.token-rate {
  font-size: 14px;
  line-height: 21px;
  color: rgba(255, 255, 255, 0.8);
}
</style>
