<template>
  <div class="wrap">
    <h3 class="title">Your Wallet Balances</h3>
    <div
      class="balance-item"
      v-if="pool.cauldronSettings.acceptUseDefaultBalance"
    >
      <div class="balance-name">
        <BaseTokenIcon :icon="networkInfo.icon" :name="pool.name" />
        <p>{{ networkInfo.name }}</p>
      </div>
      <div class="balance">
        <p>{{ networkBalance | formatTokenBalance }}</p>
      </div>
    </div>

    <div class="balance-item">
      <div class="balance-name">
        <BaseTokenIcon :icon="mimIcon" :name="pool.name" />
        <p>{{ pool.borrowToken.name }}</p>
      </div>
      <div class="balance">
        <p>{{ userMimBalance | formatTokenBalance }}</p>
      </div>
    </div>

    <div class="balance-item" v-if="!isLpLogic">
      <div class="balance-name">
        <BaseTokenIcon :icon="pool.icon" :name="pool.collateralToken.name" />
        <p>{{ pool.collateralToken.name }}</p>
      </div>
      <div class="balance">
        <p>{{ userBalance | formatTokenBalance }}</p>
        <p v-if="+userBalance">
          {{ pool.userInfo.balanceUsd | formatUSD }}
        </p>
      </div>
    </div>

    <div class="balance-item" v-else>
      <div class="balance-name">
        <BaseTokenIcon :icon="pool.icon" :name="pool.lpLogic.name" />
        <p>{{ pool.lpLogic.name }}</p>
      </div>
      <div class="balance">
        <p>{{ lpBalance | formatTokenBalance }}</p>
        <p v-if="+lpBalance">
          {{ pool.userInfo.lpInfo.balanceUsd | formatUSD }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import mimIcon from "@/assets/images/tokens/MIM.png";
import { mapGetters } from "vuex";
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
    ...mapGetters({ chainId: "getChainId" }),

    networkInfo() {
      let name = "ETH";
      let icon = require("@/assets/images/tokens/ETH.png");

      if (this.chainId === 56) {
        name = "BSC";
        icon = require("@/assets/images/tokens/BNB.png");
      }

      if (this.chainId === 250) {
        name = "FTM";
        icon = require("@/assets/images/tokens/FTM2.png");
      }
      if (this.chainId === 43114) {
        name = "AVAX";
        icon = require("@/assets/images/tokens/AVAX.png");
      }
      if (this.chainId === 137) {
        name = "MATIC";
        icon = require("@/assets/images/tokens/MATIC.png");
      }

      return { name, icon };
    },

    networkBalance() {
      if (this.pool.userInfo)
        return this.$ethers.utils.formatUnits(
          this.pool.userInfo.networkBalance,
          18
        );

      return 0;
    },

    userMimBalance() {
      if (this.pool.userInfo)
        return this.$ethers.utils.formatUnits(
          this.pool.userInfo.userPairBalance,
          this.pool.borrowToken.decimals
        );

      return 0;
    },

    userBalance() {
      if (this.pool.userInfo)
        return this.$ethers.utils.formatUnits(
          this.pool.userInfo.userBalance,
          this.pool.collateralToken.decimals
        );

      return 0;
    },

    isLpLogic() {
      return !!this.pool.lpLogic;
    },

    lpBalance() {
      if (this.pool.userInfo) {
        return this.pool.userInfo.lpInfo
          ? this.$ethers.utils.formatUnits(
              this.pool.userInfo.lpInfo.balance,
              this.pool.lpLogic.lpDecimals
            )
          : 0;
      }
      return 0;
    },
  },

  components: { BaseTokenIcon: defineAsyncComponent(() => import("@/components/base/BaseTokenIcon.vue")) },
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
