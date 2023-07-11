<template>
  <div class="balance-block">
    <h3 class="title">Your Wallet Balances</h3>

    <div class="balance-item" v-if="nativeTokenInfo">
      <div class="token-description">
        <BaseTokenIcon
          :icon="nativeTokenInfo.icon"
          :name="nativeTokenInfo.name"
        />
        <p>{{ nativeTokenInfo.name }}</p>
      </div>
      <div class="token-balance">
        <p>{{ formatTokenBalance(nativeTokenInfo.balance) }}</p>
      </div>
    </div>

    <div class="balance-item">
      <div class="token-description">
        <BaseTokenIcon :icon="mimInfo.icon" :name="mimInfo.name" />
        <p>{{ mimInfo.name }}</p>
      </div>
      <div class="token-balance">
        <p>{{ formatTokenBalance(mimInfo.balance) }}</p>
      </div>
    </div>

    <div class="balance-item">
      <div class="token-description">
        <BaseTokenIcon
          :icon="collateralTokenInfo.icon"
          :name="collateralTokenInfo.name"
        />
        <p>{{ collateralTokenInfo.name }}</p>
      </div>
      <div class="token-balance">
        <p>{{ formatTokenBalance(collateralTokenInfo.balance) }}</p>
        <p v-if="collateralTokenInfo.balanceUsd">
          {{ formatUSD(collateralTokenInfo.balanceUsd) }}
        </p>
      </div>
    </div>

    <div class="balance-item" v-if="unwrappedTokenInfo">
      <div class="token-description">
        <BaseTokenIcon
          :icon="unwrappedTokenInfo.icon"
          :name="unwrappedTokenInfo.name"
        />
        <p>{{ unwrappedTokenInfo.name }}</p>
      </div>
      <div class="token-balance">
        <p>{{ formatTokenBalance(unwrappedTokenInfo.balance) }}</p>
        <p v-if="unwrappedTokenInfo.balanceUsd">
          {{ formatUSD(unwrappedTokenInfo.balanceUsd) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { utils } from "ethers";
import filters from "@/filters/index.js";
import { useImage } from "@/helpers/useImage";
import { getChainInfo } from "@/helpers/chain/getChainInfo.ts";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
export default {
  props: {
    cauldron: {
      type: Object,
      require: true,
    },
  },

  data() {
    return {
      tokensRate: 1,
    };
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    nativeTokenInfo() {
      const { acceptUseDefaultBalance } = this.cauldron.config.cauldronSettings;
      if (!acceptUseDefaultBalance) return null;

      const { nativeTokenBalance } = this.cauldron.userTokensInfo;
      const { symbol, icon } = getChainInfo(this.chainId);
      const balance = utils.formatUnits(nativeTokenBalance);
      return { name: symbol, icon, balance };
    },

    mimInfo() {
      const { name } = this.cauldron.config.mimInfo;
      const { mimBalance } = this.cauldron.userTokensInfo;
      const balance = utils.formatUnits(mimBalance);
      return {
        name,
        icon: useImage("assets/images/tokens/MIM.png"),
        balance,
      };
    },

    collateralTokenInfo() {
      const { icon, collateralInfo } = this.cauldron.config;
      const { name, decimals } = collateralInfo;
      const { collateralBalance } = this.cauldron.userTokensInfo;
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const balance = +utils.formatUnits(collateralBalance, decimals);
      const exchangeRate = +utils.formatUnits(oracleExchangeRate, decimals);
      const balanceUsd = balance ? balance / exchangeRate : 0;
      return { name, icon, balance, balanceUsd };
    },

    unwrappedTokenInfo() {
      const { wrapInfo, collateralInfo } = this.cauldron.config;
      if (!wrapInfo) return null;

      const { decimals } = collateralInfo;
      const { icon, name } = this.cauldron.config.wrapInfo.unwrappedToken;
      const { unwrappedTokenBalance } = this.cauldron.userTokensInfo;
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const balance = +utils.formatUnits(unwrappedTokenBalance, decimals);
      const exchangeRate = +utils.formatUnits(oracleExchangeRate, decimals);
      const balanceUsd = balance / this.tokensRate / exchangeRate;
      return { icon, name, balance, balanceUsd };
    },
  },

  methods: {
    formatUSD(value) {
      return filters.formatUSD(value);
    },

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },

    async getTokensRate() {
      const { decimals } = this.cauldron.config.collateralInfo;
      const rate = await this.cauldron.contracts.collateral.convertToAssets(
        "1000000000000000000"
      );

      this.tokensRate = utils.formatUnits(rate, decimals);
    },
  },

  async created() {
    if (this.cauldron.config?.wrapInfo) await this.getTokensRate();
  },

  components: {
    BaseTokenIcon,
  },
};
</script>

<style lang="scss" scoped>
.balance-block {
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

.token-description {
  display: flex;
  align-items: center;
}

.token-balance {
  text-align: right;
}

@media (max-width: 600px) {
  .title {
    font-size: 16px;
  }
}
</style>
