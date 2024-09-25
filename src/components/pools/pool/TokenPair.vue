<template>
  <div class="token-pair">
    <div class="token-icons">
      <BaseTokenIcon
        class="base"
        :icon="baseTokenConfig.icon"
        :name="baseTokenConfig.name"
        size="40px"
      />
      <BaseTokenIcon
        class="quote"
        :icon="quoteTokenConfig.icon"
        :name="quoteTokenConfig.name"
        size="46px"
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

export default {
  props: {
    pool: { type: Object },
    chainIcon: Boolean,
  },

  computed: {
    baseTokenConfig() {
      return this.pool.tokens.baseToken.config;
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

.token-icons {
  position: relative;
  display: flex;
  align-items: center;
}

.quote {
  border-radius: 18px;
  border: 3px solid #0d1527;
  margin-left: -23px;
}

.pair-info {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.chain-icon {
  position: absolute;
  top: -5px;
  right: 5px;
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
