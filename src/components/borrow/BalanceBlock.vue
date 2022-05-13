<template>
  <div class="wrap">
    <h3>Your Balances</h3>
    <div class="balance-item">
      <div class="balance-name">
        <BaseTokenIcon :icon="pool.icon" :name="pool.name" />
        <p>{{ pool.name }}</p>
      </div>
      <div class="balance">
        <p>{{ userBalance | formatTokenBalance }}</p>
        <p v-if="+userBalance">
          {{ pool.userInfo.balanceUsd | formatUSD }}
        </p>
      </div>
    </div>
    <div class="balance-item">
      <div class="balance-name">
        <BaseTokenIcon :icon="mimIcon" :name="pool.name" />
        <p>{{ pool.pairToken.name }}</p>
      </div>
      <div class="balance">
        <p>{{ userPairBalance | formatTokenBalance }}</p>
      </div>
    </div>
  </div>
</template>

<script>
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");
import mimIcon from "@/assets/images/tokens/MIM.png";
export default {
  props: {
    pool: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      mimIcon,
    };
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
    userPairBalance() {
      if (this.pool.userInfo)
        return this.$ethers.utils.formatUnits(
          this.pool.userInfo.userPairBalance,
          this.pool.pairToken.decimals
        );

      return 0;
    },
  },

  created() {
    console.log(this.pool);
  },

  components: { BaseTokenIcon },
};
</script>

<style lang="scss" scoped>
.wrap {
  background: rgba(129, 126, 166, 0.2);
  border: 1px solid #494661;
  border-radius: 20px;
  padding: 10px;
}

.balance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5px 0;
}

.balance-name {
  display: flex;
  align-items: center;
}

.balance {
  text-align: right;
}
</style>
