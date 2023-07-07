<template>
  <div class="wrap">
    <h3 class="title">Your Wallet Balances</h3>
    <div
      class="balance-item"
      v-if="pool.config.cauldronSettings.acceptUseDefaultBalance"
    >
      <div class="balance-name">
        <BaseTokenIcon :icon="networkInfo.icon" :name="pool.name" />
        <p>{{ networkInfo.symbol }}</p>
      </div>
      <div class="balance">
        <p>{{ formatTokenBalance(networkBalance) }}</p>
      </div>
    </div>

    <div class="balance-item">
      <div class="balance-name">
        <BaseTokenIcon :icon="mimIcon" :name="pool.name" />
        <p>{{ pool.config.mimInfo.name }}</p>
      </div>
      <div class="balance">
        <p>{{ formatTokenBalance(userMimBalance) }}</p>
      </div>
    </div>

    <div class="balance-item">
      <div class="balance-name">
        <BaseTokenIcon
          :icon="pool.config.icon"
          :name="pool.config.collateralInfo.name"
        />
        <p>{{ pool.config.collateralInfo.name }}</p>
      </div>
      <div class="balance">
        <p>{{ formatTokenBalance(userBalance) }}</p>
        <!-- todo <p v-if="+userBalance">
          {{ formatUSD(pool.userInfo.balanceUsd) }}
        </p> -->
      </div>
    </div>

    <div class="balance-item" v-if="isUnWrapToken">
      <div class="balance-name">
        <BaseTokenIcon
          :icon="pool.config.wrapInfo.unwrappedToken.icon"
          :name="pool.config.wrapInfo.unwrappedToken.name"
        />
        <p>{{ pool.config.wrapInfo.unwrappedToken.name }}</p>
      </div>
      <div class="balance">
        <p>{{ formatTokenBalance(unWrapTokenBalance) }}</p>
        <!-- todo <p v-if="+unWrapTokenBalance">
          {{ formatUSD(pool.userInfo.balanceUsd) }}
        </p> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import { useImage } from "@/helpers/useImage";
import { getChainInfo } from "@/helpers/chain/getChainInfo.ts";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
export default {
  props: {
    pool: {
      type: Object,
      require: true,
    },
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    mimIcon() {
      return useImage("assets/images/tokens/MIM.png");
    },

    networkInfo() {
      return getChainInfo(this.chainId);
    },

    networkBalance() {
      return this.$ethers.utils.formatUnits(
        this.pool.userTokensInfo.nativeTokenBalance
      );
    },

    userMimBalance() {
      return this.$ethers.utils.formatUnits(
        this.pool.userTokensInfo.mimBalance
      );
    },

    userBalance() {
      return this.$ethers.utils.formatUnits(
        this.pool.userTokensInfo.collateralBalance,
        this.pool.config.collateralInfo.decimals
      );
    },

    userBalanceUsd() {
      return (
        +this.userBalance /
        +this.$ethers.utils.formatUnits(
          this.pool.mainParams.oracleExchangeRate,
          this.pool.config.collateralInfo.decimals
        )
      );
    },

    isUnWrapToken() {
      return this.pool.config.wrapInfo;
    },

    unWrapTokenBalance() {
      return this.$ethers.utils.formatUnits(
        this.pool.userTokensInfo.unwrappedTokenBalance,
        this.pool.config.collateralInfo.decimals
      );
    },
    unWrapTokenBalanceUsd() {
      return (
        +this.unWrapTokenBalance /
        +this.$ethers.utils.formatUnits(
          this.pool.mainParams.oracleExchangeRate,
          this.pool.config.collateralInfo.decimals
        )
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
  },

  components: {
    BaseTokenIcon,
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  background: #2b2b3c;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.05);
  backdrop-filter: blur(100px);
  border-radius: 30px;
  padding: 15px;
}

.title {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  margin-bottom: 15px;
}

.balance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.balance-item:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.balance-name {
  display: flex;
  align-items: center;
}

.balance {
  text-align: right;
}

@media (max-width: 600px) {
  .title {
    font-size: 16px;
  }
}
</style>
