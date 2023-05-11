<template>
  <div class="popup-item-wrap">
    <div class="status-bar-wrap">
      <StatusBar :pool="pool" :small="true" />
    </div>
    <button @click="enterPool(pool)" class="pool-item">
      <div class="pool-name">
        <BaseTokenIcon :icon="pool.icon" :name="pool.name" />
        <div class="name-wrap">
          <p>
            {{ pool.name }}
            <span v-tooltip="'Interest'">{{ pool.interest }}%</span>
          </p>
          <MiniStatusTag v-if="isMigrated" />
          <MiniStatusTag v-if="isMagicPool" text="Leverage" />
        </div>
      </div>
      <div class="pool-balance" v-if="isMagicPool">
        <p>{{ formatTokenBalance(userBalance) }} {{ pool.name }}</p>
        <p>{{ formatTokenBalance(userLpBalance) }} {{ pool.lpLogic.name }}</p>
        <p v-if="+userTotalBalance" class="price">
          Total amount: {{ formatUSD(userTotalBalance) }}
        </p>
      </div>
      <div class="pool-balance" v-else>
        <p>{{ formatTokenBalance(userBalance) }}</p>
        <p v-if="+userBalance" class="price">
          {{ formatUSD(userBalanceUsd) }}
        </p>
      </div>
    </button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import filters from "@/filters/index.js";

export default {
  props: {
    pool: {
      type: Object,
      require: true,
    },
  },
  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    isLpInfo() {
      return (
        (this.chainId === 42161 && this.pool.id === 2 && this.pool.userInfo) ||
        (this.chainId === 1 && this.pool.id === 41 && this.pool.userInfo)
      );
    },

    userBalance() {
      if (this.isLpInfo)
        return this.$ethers.utils.formatUnits(
          this.pool.userInfo.lpInfo.balance,
          this.pool.lpLogic.lpDecimals
        );

      if (this.pool.userInfo)
        return this.$ethers.utils.formatUnits(
          this.pool.userInfo.userBalance,
          this.pool.collateralToken.decimals
        );

      return 0;
    },

    userBalanceUsd() {
      if (this.isLpInfo) return this.pool.userInfo?.lpInfo.balanceUsd;
      return this.pool.userInfo?.balanceUsd;
    },

    userLpBalance() {
      if (this.isMagicPool && this.pool.userInfo)
        return this.$ethers.utils.formatUnits(
          this.pool.userInfo.lpInfo.balance,
          this.pool.lpLogic.lpDecimals
        );

      return 0;
    },

    userLpBalanceUsd() {
      return this.pool.userInfo?.lpInfo.balanceUsd;
    },

    userTotalBalance() {
      return +this.userBalanceUsd + this.userLpBalanceUsd;
    },

    isMigrated() {
      if (this.pool?.cauldronSettings)
        return this.pool.cauldronSettings.isMigrated;

      return this.pool.isMigrated;
    },

    isMagicPool() {
      return (
        (this.chainId === 42161 && this.pool?.id === 3) ||
        (this.chainId === 1 && this.pool?.id === 39)
      );
    },
  },

  methods: {
    formatUSD(value) {
      return filters.formatUSD(value);
    },
    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },
    enterPool(pool) {
      this.$emit("enterPool", pool);
    },
  },
  components: {
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
    StatusBar: defineAsyncComponent(() =>
      import("@/components/ui/StatusBar.vue")
    ),
    MiniStatusTag: defineAsyncComponent(() =>
      import("@/components/ui/MiniStatusTag.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.price {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 21px;
}

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
