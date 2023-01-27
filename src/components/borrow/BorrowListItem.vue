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
          <MiniStatusTag v-if="isGlp" text="Leverage" />
        </div>
      </div>
      <div class="pool-balance">
        <p>{{ userBalance | formatTokenBalance }}</p>
        <p v-if="+userBalance">
          {{ userBalanceUsd | formatUSD }}
        </p>
      </div>
    </button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");
const StatusBar = () => import("@/components/ui/StatusBar");
const MiniStatusTag = () => import("@/components/ui/MiniStatusTag");

export default {
  props: {
    pool: {
      type: Object,
      require: true,
    },
  },
  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    userBalance() {
      if (this.pool?.lpLogic && this.pool.userInfo)
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
      if (this.pool?.lpLogic) return this.pool.userInfo.lpInfo.balanceUsd;

      return this.pool.userInfo.balanceUsd;
    },

    isMigrated() {
      if (this.pool?.cauldronSettings)
        return this.pool.cauldronSettings.isMigrated;

      return this.pool.isMigrated;
    },

    isGlp() {
      return this.chainId === 42161 && this.pool?.id === 3;
    },
  },

  methods: {
    enterPool(pool) {
      this.$emit("enterPool", pool);
    },
  },
  components: { BaseTokenIcon, StatusBar, MiniStatusTag },
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
