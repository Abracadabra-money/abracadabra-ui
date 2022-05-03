<template>
  <div class="popup-item">
    <StatusBar :pool="pool" />
    <button @click="enterPool(pool)" class="pool-item">
      <div class="pool-name">
        <BaseTokenIcon :icon="pool.icon" :name="pool.name" />
        <p>{{ pool.name }}</p>
      </div>
      <div class="pool-balance">
        <p>{{ userBalance | formatTokenBalance }}</p>
        <p v-if="+userBalance">
          {{ pool.userInfo.balanceUsd | formatUSD }}
        </p>
      </div>
    </button>
  </div>
</template>

<script>
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");
const StatusBar = () => import("@/components/ui/StatusBar");
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
        return this.$ethers.utils.formatUnits(this.pool.userInfo.userBalance);

      return 0;
    },

    // priceUsd() {
    //   if (this.pool.userInfo) {
    //     // if (this.pool.price) {
    //     //   return parseFloat(
    //     //     this.$ethers.utils.formatUnits(this.pool.userInfo.userBalance) *
    //     //       this.pool.price
    //     //   ).toFixed(2);
    //     // } else {
    //     return parseFloat(
    //       this.$ethers.utils.formatUnits(this.pool.userInfo.userBalance) /
    //         this.pool.tokenPrice
    //     ).toFixed(2);
    //     // }

    //     //   return parseFloat(
    //     //     // this.$ethers.utils.formatUnits(this.pool.userInfo.userBalance) *
    //     //     //   this.pool.price ||
    //     //     this.$ethers.utils.formatUnits(this.pool.userInfo.userBalance) /
    //     //       this.pool.tokenPrice
    //     //   ).toFixed(2);
    //   }

    //   return 0;
    // },
  },

  methods: {
    enterPool(pool) {
      this.$emit("enterPool", pool);
    },
  },
  components: { BaseTokenIcon, StatusBar },
};
</script>

<style lang="scss" scoped>
.popup-item {
  padding: 8px 10px 0 0;
}
.pool-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5px 0 14px;
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
