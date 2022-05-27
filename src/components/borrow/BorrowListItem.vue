<template>
  <div class="popup-item-wrap">
    <div class="status-bar-wrap">
      <StatusBar :pool="pool" :small="true" />
    </div>
    <button @click="enterPool(pool)" class="pool-item">
      <div class="pool-name">
        <BaseTokenIcon :icon="pool.icon" :name="pool.name" />
        <p>
          {{ pool.name }}
          <span v-tooltip="'Interest'">{{ pool.interest }}%</span>
        </p>
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
        return this.$ethers.utils.formatUnits(
          this.pool.userInfo.userBalance,
          this.pool.token.decimals
        );

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
.popup-item-wrap {
  padding: 10px 12px;

  border-radius: 20px;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  &::after {
    content: "";
    position: absolute;
    width: 90%;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    bottom: 0;
    left: 5%;
  }
}

.pool-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5px 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: white;
}

.pool-item .pool-name {
  display: flex;
  align-items: center;

  p span {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
  }
}

.pool-balance {
  text-align: right;
}
</style>
