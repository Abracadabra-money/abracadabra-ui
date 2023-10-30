<template>
  <div class="balance-block">
    <h3 class="title">Your Wallet Balances</h3>
    <div class="balance-item" v-if="nativeToken">
      <div class="token-description">
        <BaseTokenIcon :icon="nativeToken.icon" :name="nativeToken.name" />
        <p>{{ nativeToken.name }}</p>
      </div>
      <div class="token-balance">
        <p>{{ formatTokenBalance(nativeToken.balance) }}</p>
        <p v-if="nativeToken.balanceUsd">
          {{ formatUSD(nativeToken.balanceUsd) }}
        </p>
      </div>
    </div>

    <div class="balance-item">
      <div class="token-description">
        <BaseTokenIcon :icon="borrowToken.icon" :name="borrowToken.name" />
        <p>{{ borrowToken.name }}</p>
        <p>{{ borrowToken.price }}</p>
      </div>
      <div class="token-balance">
        <p>{{ formatTokenBalance(borrowToken.balance) }}</p>
        <p v-if="borrowToken.balanceUsd">
          {{ formatUSD(borrowToken.balanceUsd) }}
        </p>
      </div>
    </div>

    <div class="balance-item" v-if="collateralToken">
      <div class="token-description">
        <BaseTokenIcon
          :icon="collateralToken.icon"
          :name="collateralToken.name"
        />
        <p>{{ collateralToken.name }}</p>
      </div>
      <div class="token-balance">
        <p>{{ formatTokenBalance(collateralToken.balance) }}</p>
        <p v-if="collateralToken.balanceUsd">
          {{ formatUSD(collateralToken.balanceUsd) }}
        </p>
      </div>
    </div>

    <div class="balance-item" v-if="unwrappedToken">
      <div class="token-description">
        <BaseTokenIcon
          :icon="unwrappedToken.icon"
          :name="unwrappedToken.name"
        />
        <p>{{ unwrappedToken.name }}</p>
      </div>
      <div class="token-balance">
        <p>{{ formatTokenBalance(unwrappedToken?.balance) }}</p>
        <p v-if="unwrappedToken.balanceUsd">
          {{ formatUSD(unwrappedToken.balanceUsd) }}
        </p>
      </div>
    </div>
  </div>
</template>

<!-- todo ts props -->
<script lang="ts">
import { mapGetters } from "vuex";
import { defineComponent } from "vue";
import { formatUnits, parseUnits } from "viem";
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
import { getMimPrice } from "@/helpers/prices/getMimPrice";
import { getNativeTokenPrice } from "@/helpers/priceHelper";
import { readContract } from "@wagmi/core";
export default defineComponent({
  props: {
    cauldron: {
      type: Object,
      require: true,
    },
  },

  data() {
    return {
      tokensRate: 1,
      nativeTokenPrice: null,
      mimPrice: 1,
    };
  },

  computed: {
    ...mapGetters({ chainId: "getChainId", getChainById: "getChainById" }),

    precision() {
      const { decimals } = this.cauldron.userTokensInfo.collateralToken;
      return parseUnits("1", decimals);
    },

    nativeToken() {
      const { nativeToken } = this.cauldron.userTokensInfo;
      const { balance, decimals } = nativeToken;
      const { acceptUseDefaultBalance } = this.cauldron.config.cauldronSettings;

      if (!acceptUseDefaultBalance) return null;

      const formatBalance = Number(formatUnits(balance, decimals));
      const balanceUsd = Number(this.nativeTokenPrice) * formatBalance;

      return { ...nativeToken, balanceUsd, balance: formatBalance };
    },

    borrowToken() {
      const { borrowToken } = this.cauldron.userTokensInfo;
      const { balance, decimals } = borrowToken;

      const formatBalance = Number(formatUnits(balance, decimals));
      const balanceUsd = Number(this.mimPrice) * formatBalance;

      return {
        ...borrowToken,
        balanceUsd,
        balance: formatBalance,
      };
    },

    collateralToken() {
      const { collateralToken } = this.cauldron.userTokensInfo;
      const { balance, decimals } = collateralToken;
      const { oracleExchangeRate } = this.cauldron.mainParams;

      if (collateralToken.isHiddenWrap) return null;

      const balanceUsd = (balance * this.precision) / oracleExchangeRate;

      return {
        ...collateralToken,
        balance: formatUnits(balance, decimals),
        balanceUsd: formatUnits(balanceUsd, decimals),
      };
    },

    unwrappedToken() {
      const { unwrappedToken } = this.cauldron.userTokensInfo;
      const { balance, decimals } = unwrappedToken;
      const { oracleExchangeRate } = this.cauldron.mainParams;

      if (!this.cauldron.config?.wrapInfo) return null;

      const formatBalance = formatUnits(balance, decimals);
      const tokensRate = (balance * this.precision) / this.tokensRate;
      const balanceUsd = (tokensRate * this.precision) / oracleExchangeRate;

      return {
        ...unwrappedToken,
        balance: formatBalance,
        balanceUsd: formatUnits(balanceUsd, decimals),
      };
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
      const { address, abi } = this.cauldron.config.collateralInfo;

      this.tokensRate = await readContract({
        address,
        abi,
        functionName: "convertToAssets",
        args: [this.precision],
      });
    },
  },

  async created() {
    this.mimPrice = await getMimPrice();
    this.nativeTokenPrice = await getNativeTokenPrice(this.chainId);
    if (this.cauldron.config?.wrapInfo) await this.getTokensRate();
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
  },
});
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
