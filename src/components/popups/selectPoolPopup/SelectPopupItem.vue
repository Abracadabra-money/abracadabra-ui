<template>
  <button @click="enterPool(pool)" class="pool-item">
    <div class="pool-name">
      <TokenIcon :token="pool.name" />
      <p>{{ pool.name }}</p>
    </div>
    <div class="pool-balance">
      <p>{{ userBalance }}</p>
      <p v-if="pool.userInfo">$ {{ priceUsd }}</p>
    </div>
  </button>
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
      if (this.pool.userInfo)
        return parseFloat(
          this.$ethers.utils.formatUnits(this.pool.userInfo.userBalance)
        ).toFixed(4);

      return 0;
    },

    priceUsd() {
      if (this.pool.userInfo)
        return parseFloat(
          this.$ethers.utils.formatUnits(this.pool.userInfo.userBalance) *
            this.pool.price || 1 / this.pool.tokenPrice
        ).toFixed(2);

      return 0;
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
.pool-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 10px 14px 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: white;
  position: relative;
}

.pool-item::after {
  content: "";
  position: absolute;
  width: calc(100% - 42px);
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  bottom: 0;
  left: 42px;
}

.pool-name {
  display: flex;
  align-items: center;
}

.pool-balance {
  text-align: right;
}
</style>
