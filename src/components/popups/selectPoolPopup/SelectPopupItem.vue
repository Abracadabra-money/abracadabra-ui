<template>
  <div class="tokens-list">
    <button @click="enterPool(pool)" class="token-wrap">
      <div class="token-data">
        <TokenIcon :token="pool.name" />
        <p>{{ pool.name }}</p>
      </div>
      <div class="token-value">
        <p>{{ userBalance }}</p>
        <p v-if="pool.userInfo.userBalance > 0">$ {{ priceUsd }}</p>
      </div>
    </button>
    <div class="token-spacer-wrap" :key="`spacer-${pool.id}`">
      <div class="token-spacer"></div>
    </div>
  </div>
</template>

<script>
const TokenIcon = () => import("@/components/ui/TokenIcon");
export default {
  props: {
    pool: {
      type: Object,
      require: true,
    },
  },
  computed: {
    userBalance() {
      return this.pool.userInfo?.userBalance
        ? this.$ethers.utils.formatUnits(this.pool.userInfo.userBalance)
        : 0;
    },

    priceUsd() {
      return this.pool.userInfo?.userBalance
        ? (
            this.$ethers.utils.formatUnits(this.pool.userInfo.userBalance) *
              this.pool.price || 1 / this.pool.tokenPrice
          ).toFixed(4)
        : 0;
    },
  },

  methods: {
    enterPool(pool) {
      this.$emit("enterPool", pool);
    },
  },
  components: { TokenIcon },
};
</script>

<style lang="scss" scoped>
.tokens-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.token-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 10px 14px 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: white;
}

.token-data {
  display: flex;
  align-items: center;
}

.token-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  background-color: white;
  border-radius: 10px;
  margin-right: 10px;
}

.token-value {
  text-align: right;
}

.token-spacer-wrap {
  display: flex;
  justify-content: flex-end;
  flex: 0 0 1px;
}

.token-spacer {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.1);
  height: 1px;
  width: calc(100% - 42px);
}
</style>
