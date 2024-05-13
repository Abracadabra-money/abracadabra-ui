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
        size="40px"
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

export default {
  props: {
    pool: { type: Object },
  },

  computed: {
    baseTokenConfig() {
      return this.pool.tokens.baseToken.config;
    },

    quoteTokenConfig() {
      return this.pool.tokens.quoteToken.config;
    },
  },

  methods: {},

  components: { BaseTokenIcon },
};
</script>

<style scoped lang="scss">
.token-pair {
  display: flex;
  align-items: center;
}

.token-icons {
  display: flex;
  align-items: center;
}

.quote {
  border-radius: 14px;
  border: 3px solid #0d1527;
  margin-left: -23px;
}

.pair-info {
  display: flex;
  flex-direction: column;
  align-items: start;
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
