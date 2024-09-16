<template>
  <div class="pool-creation-view">
    <div class="pool-creation-wrap">
      <div class="actions-block">
        <h3 class="pool-creation-title">Pool Creation</h3>

        <AvailableNetworksBlock
          :selectedNetwork="selectedNetwork"
          :availableNetworks="availableNetworks"
          @changeNetwork="changeNetwork"
        />

        <div class="action-form">
          <TokensSelector
            :baseToken="baseToken"
            :quoteToken="quoteToken"
            :baseTokenAmount="actionConfig.baseInAmount"
            :quoteTokenAmount="actionConfig.quoteInAmount"
            :isAutoPricingEnabled="isAutoPricingEnabled"
            @updateTokenInputAmount="updateTokenInputAmount"
            @openTokensPopup="openTokensPopup"
          />

          <PriceSelector
            :baseToken="baseToken"
            :quoteToken="quoteToken"
            :isAutoPricingEnabled="isAutoPricingEnabled"
            @updateTokensRate="updateTokensRate"
            @toggleAutopricing="toggleAutopricing"
          />

          <FeeTierSelector
            :poolType="poolType"
            @selectFeeTier="selectFeeTier"
          />

          <BaseButton
            primary
            :disabled="!validationData.isAllowed"
            @click="actionHandler"
          >
            {{ validationData.btnText }}
          </BaseButton>
        </div>
      </div>

      <div class="pool-creation-info-wrap">
        <CreationTypeTabs
          :poolType="poolType"
          @selectPoolType="selectPoolType"
        />
        <PoolCreationInfo
          :tokensSelected="tokensSelected"
          :poolType="poolType"
          :kValue="actionConfig.K"
          @openSlippagePopup="isSlippagePopupOpened = true"
        />
        <SimilarPools
          :tokens="{ baseToken, quoteToken }"
          :tokensSelected="tokensSelected"
          :actionConfig="actionConfig"
          :chainId="chainId"
        />
      </div>
    </div>

    <SlippageCoefficientPopup
      :kValue="actionConfig.K"
      @selectKValue="selectKValue"
      @close="isSlippagePopupOpened = !isSlippagePopupOpened"
      v-if="isSlippagePopupOpened"
    />

    <LocalPopupWrap
      isFarm
      :isOpened="isTokensPopupOpened"
      @closePopup="isTokensPopupOpened = false"
    >
      <TokenListPopup
        :tokensList="tokenList"
        :tokenType="tokenType"
        :baseTokenAddress="baseToken.config.address"
        :quoteTokenAddress="quoteToken.config.address"
        @updateSelectedToken="updateSelectedToken"
      />
    </LocalPopupWrap>

    <LocalPopupWrap
      isFarm
      :isOpened="isAutoPricingWarnPopupOpened"
      @closePopup="isAutoPricingWarnPopupOpened = false"
    >
      <AutoPricingWarnPopup
        @confirm="autoPricingPopupConfirmation"
        @cancel="isAutoPricingWarnPopupOpened = false"
      />
    </LocalPopupWrap>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { type Address, parseUnits } from "viem";
import {
  getTokenList,
  availableNetworks,
} from "@/helpers/pools/poolCreation/getTokenList";
import { validationActions } from "@/helpers/pools/poolCreation/validationActions";
import {
  type ActionConfig,
  createPool,
} from "@/helpers/pools/poolCreation/actions/createPool";
import type {
  PoolCreationTokenConfig,
  PoolCreationTokenInfo,
} from "@/configs/pools/poolCreation/types";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { approveTokenViem } from "@/helpers/approval";
import notification from "@/helpers/notification/notification";
import { notificationErrorMsg } from "@/helpers/notification/notificationError";
import type { ContractInfo } from "@/types/global";
import { getSwapRouterByChain } from "@/configs/pools/routers";
import {
  getTokenAllowance,
  getTokenUserInfo,
} from "@/helpers/pools/poolCreation/getPoolCreationTokenInfo";
import {
  PoolTypes,
  TokenTypes,
  STANDARD_K_VALUE,
  SAFE_PEGGED_K_VALUE,
  RATE_DECIMALS,
  RATE_PRECISION,
} from "@/constants/pools/poolCreation";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";

const emptyPoolCreationTokenInfo: PoolCreationTokenInfo = {
  config: {
    name: "Select Token",
    symbol: "Select Token",
    chainId: 1,
    decimals: 18,
    icon: "",
    address: "0x",
    abi: "",
  },
  price: 0,
  userInfo: {
    balance: 0n,
    allowance: 0n,
  },
};

export default {
  data() {
    return {
      tokenList: [] as PoolCreationTokenInfo[],
      tokenType: "base",
      poolType: null as PoolTypes | null,
      baseToken: emptyPoolCreationTokenInfo,
      quoteToken: emptyPoolCreationTokenInfo,
      actionConfig: {
        baseToken: "0x",
        quoteToken: "0x",
        lpFeeRate: 0n,
        K: 0n,
        I: 0n,
        to: "0x",
        baseInAmount: 0n,
        quoteInAmount: 0n,
        protocolOwnedPool: false,
      } as ActionConfig,
      IforCalc: 0n,
      selectedNetwork: ARBITRUM_CHAIN_ID,
      availableNetworks,
      isAutoPricingEnabled: false,
      isTokensPopupOpened: false,
      isSlippagePopupOpened: false,
      isAutoPricingWarnPopupOpened: false,
      isActionProcessing: false,
      updateInterval: null as NodeJS.Timeout | null,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),

    tokensSelected() {
      const emptyTokenName = emptyPoolCreationTokenInfo.config.name;

      return (
        this.baseToken.config.name != emptyTokenName &&
        this.quoteToken.config.name != emptyTokenName
      );
    },

    validationData() {
      return validationActions(
        this.baseToken,
        this.quoteToken,
        this.actionConfig,
        this.poolType,
        this.chainId,
        this.account,
        this.isActionProcessing
      );
    },

    routerAddress() {
      return getSwapRouterByChain(this.chainId);
    },

    IValueDecimals() {
      return (
        18 + this.quoteToken.config.decimals - this.baseToken.config.decimals
      );
    },
  },

  watch: {
    //for tests. remove before live : todo
    actionConfig: {
      handler() {},
      deep: true,
    },
    //
    baseToken: {
      handler(newValue: PoolCreationTokenInfo) {
        this.actionConfig.baseToken = newValue.config.address;
        this.resetInputs();
      },
      deep: true,
    },

    quoteToken: {
      handler(newValue: PoolCreationTokenInfo) {
        this.actionConfig.quoteToken = newValue.config.address;
        this.resetInputs();
      },
      deep: true,
    },

    async selectedNetwork() {
      await this.createTokenList();
    },

    IValueDecimals(newDecimals: number, oldDecimals: number) {
      const currentI = this.actionConfig.I;
      this.actionConfig.I =
        (currentI * parseUnits("1", newDecimals)) /
        parseUnits("1", oldDecimals);
    },

    async chainId() {
      await this.createTokenList();
    },

    async account(address: Address) {
      this.actionConfig.to = address;
      await this.createTokenList();
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    updateTokenInputAmount(type: TokenTypes, amount: bigint) {
      if (!this.actionConfig.I) return;

      const baseDecimals = this.baseToken.config.decimals;
      const quoteDecimals = this.quoteToken.config.decimals;

      const isBaseDecimalsGreater = baseDecimals > quoteDecimals;

      const tokenDecimalsDifference = Math.abs(baseDecimals - quoteDecimals);
      const tokensDecimalsDifferencePrecision = parseUnits(
        "1",
        tokenDecimalsDifference
      );

      if (type == TokenTypes.Base) {
        this.actionConfig.baseInAmount = amount;

        const baseAdjustedRatePrecision = isBaseDecimalsGreater
          ? RATE_PRECISION / tokensDecimalsDifferencePrecision
          : RATE_PRECISION * tokensDecimalsDifferencePrecision;

        this.actionConfig.quoteInAmount =
          (amount * baseAdjustedRatePrecision) / this.IforCalc;
      } else {
        this.actionConfig.quoteInAmount = amount;

        const baseAmountWithPrecision = isBaseDecimalsGreater
          ? RATE_PRECISION / tokensDecimalsDifferencePrecision
          : RATE_PRECISION * tokensDecimalsDifferencePrecision;

        this.actionConfig.baseInAmount = amount
          ? (amount * this.IforCalc + baseAmountWithPrecision) /
            baseAmountWithPrecision
          : 0n;
      }
    },

    openTokensPopup(type: TokenTypes) {
      this.tokenType = type;
      this.isTokensPopupOpened = true;
    },

    updateSelectedToken(token: PoolCreationTokenInfo) {
      if (
        !this.tokenList.some(
          ({ config }) => config.address == token.config.address
        )
      )
        this.tokenList.push(token);

      if (this.tokenType === "quote") {
        if (this.baseToken.config.name === token.config.name) {
          this.baseToken = this.quoteToken;
          this.quoteToken = token;
        } else {
          this.quoteToken = token;
        }
      }

      if (this.tokenType === "base") {
        if (this.quoteToken.config.name === token.config.name) {
          this.quoteToken = this.baseToken;
          this.baseToken = token;
        } else {
          this.baseToken = token;
        }
      }

      this.isTokensPopupOpened = false;
    },

    selectPoolType(poolType: PoolTypes) {
      this.poolType = poolType;
      switch (poolType) {
        case PoolTypes.Standard:
          this.actionConfig.K = STANDARD_K_VALUE;
          break;
        case PoolTypes.Pegged:
          this.actionConfig.K = SAFE_PEGGED_K_VALUE;
          break;
      }
    },

    selectFeeTier(feeTier: bigint) {
      this.actionConfig.lpFeeRate = feeTier;
    },

    selectKValue(kValue: bigint) {
      this.actionConfig.K = kValue;
    },

    toggleAutopricing() {
      if (this.isAutoPricingEnabled) {
        this.isAutoPricingWarnPopupOpened = true;
        return;
      }
      this.isAutoPricingEnabled = !this.isAutoPricingEnabled;
    },

    autoPricingPopupConfirmation() {
      this.isAutoPricingEnabled = false;
      this.isAutoPricingWarnPopupOpened = false;
    },

    updateTokensRate(I: bigint) {
      this.IforCalc = I;
      const decimalsDifferense = Math.abs(RATE_DECIMALS - this.IValueDecimals);
      const differencePrecision = parseUnits("1", decimalsDifferense);
      this.actionConfig.I =
        this.IValueDecimals < RATE_DECIMALS
          ? I / differencePrecision
          : I * differencePrecision;

      this.updateTokenInputAmount(
        TokenTypes.Base,
        this.actionConfig.baseInAmount
      );
    },

    async updateTokenAllowance(contract: ContractInfo) {
      const isBaseToken = (this.baseToken.config.address = contract.address);

      this[`${isBaseToken ? "base" : "quote"}Token`].userInfo.allowance =
        await getTokenAllowance(contract, this.chainId, this.account);
    },

    async updateTokenUserInfo(tokenConfig: PoolCreationTokenConfig) {
      const isBaseToken = (this.baseToken.config.address = tokenConfig.address);

      this[`${isBaseToken ? "base" : "quote"}Token`].userInfo =
        await getTokenUserInfo(tokenConfig, this.account);
    },

    async updateTokensUserInfo() {
      await Promise.all([
        this.updateTokenUserInfo(this.baseToken.config),
        this.updateTokenUserInfo(this.quoteToken.config),
      ]);
    },

    resetInputs() {
      this.actionConfig.baseInAmount = 0n;
      this.actionConfig.quoteInAmount = 0n;
    },

    changeNetwork(network: number) {
      this.selectedNetwork = network;
    },

    async approveTokenHandler(contract: ContractInfo, valueToApprove: bigint) {
      this.isActionProcessing = true;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveTokenViem(
        contract,
        this.routerAddress,
        valueToApprove
      );

      await this.deleteNotification(notificationId);
      if (!approve) await this.createNotification(notification.approveError);
      await this.updateTokenAllowance(contract);
      await this.createTokenList();
    },

    async createPoolHandler() {
      this.isActionProcessing = true;

      const notificationId = await this.createNotification(
        notification.pending
      );

      try {
        const result = await createPool(this.routerAddress, this.actionConfig);
        console.log(result);

        await this.deleteNotification(notificationId);

        await this.updateTokensUserInfo();
        await this.createTokenList();

        await this.createNotification(notification.success);

        this.resetInputs();
      } catch (error) {
        console.log("create pool err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
    },

    async actionHandler() {
      if (!this.validationData.isAllowed) return false;

      switch (this.validationData.method) {
        case "connectWallet":
          this.isActionProcessing = true;
          // @ts-ignore
          await this.$openWeb3modal();
          this.isActionProcessing = true;
          break;
        case "switchNetwork":
          this.isActionProcessing = true;
          await switchNetwork(42161); //todo
          this.isActionProcessing = true;
          break;
        case "approveBaseToken":
          await this.approveTokenHandler(
            {
              address: this.baseToken.config.address,
              abi: this.baseToken.config.abi,
            },
            this.actionConfig.baseInAmount
          );
          break;
        case "approveQuoteToken":
          await this.approveTokenHandler(
            {
              address: this.quoteToken.config.address,
              abi: this.quoteToken.config.abi,
            },
            this.actionConfig.quoteInAmount
          );
          break;
        default:
          await this.createPoolHandler();
          break;
      }

      this.isActionProcessing = false;
    },

    async createTokenList() {
      this.tokenList = await getTokenList(this.selectedNetwork, this.account);
    },
  },

  async created() {
    await this.createTokenList();
    this.actionConfig.to = this.account || "0x";

    this.updateInterval = setInterval(async () => {
      await this.createTokenList();
    }, 60000);
  },

  beforeUnmount() {
    if (this.updateInterval) clearInterval(this.updateInterval);
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    TokensSelector: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/TokensSelector.vue")
    ),
    PriceSelector: defineAsyncComponent(
      () =>
        import(
          "@/components/pools/poolCreation/priceSelector/PriceSelector.vue"
        )
    ),
    FeeTierSelector: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/FeeTierSelector.vue")
    ),
    CreationTypeTabs: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/CreationTypeTabs.vue")
    ),
    PoolCreationInfo: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/PoolCreationInfo.vue")
    ),
    SimilarPools: defineAsyncComponent(
      () =>
        import("@/components/pools/poolCreation/similarPools/SimilarPools.vue")
    ),
    SlippageCoefficientPopup: defineAsyncComponent(
      () =>
        import(
          "@/components/pools/poolCreation/popups/SlippageCoefficientPopup.vue"
        )
    ),
    LocalPopupWrap: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/popups/LocalPopupWrap.vue")
    ),
    TokenListPopup: defineAsyncComponent(
      () =>
        import(
          "@/components/pools/poolCreation/popups/PoolCreationTokenListPopup.vue"
        )
    ),
    AutoPricingWarnPopup: defineAsyncComponent(
      () =>
        import(
          "@/components/pools/poolCreation/popups/AutoPricingWarnPopup.vue"
        )
    ),
    AvailableNetworksBlock: defineAsyncComponent(
      () => import("@/components/stake/AvailableNetworksBlock.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-creation-view {
  min-height: 100vh;
}

.pool-creation-wrap {
  position: relative;
  max-width: 1311px;
  width: 100%;
  padding: 124px 15px 90px;
  display: grid;
  grid-template-columns: 520px 1fr;
  grid-gap: 24px;
  margin: 0 auto;
}

.pool-creation-title {
  font-size: 32px;
  font-weight: 600;
}

.actions-block {
  gap: 20px;
  display: flex;
  flex-direction: column;
}

.action-form {
  @include block-wrap;
  gap: 40px;
  display: flex;
  flex-direction: column;
}

.action-form::v-deep(.action-title) {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 500;
}

.pool-creation-info-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state-main-text {
  font-size: 18px;
  font-weight: 500;
}

@media screen and (max-width: 1200px) {
  .pool-creation-wrap {
    grid-template-columns: 400px 1fr;
  }
}

@media screen and (max-width: 1024px) {
  .pool-creation-wrap {
    grid-template-columns: 100%;
    grid-template-rows: auto;
  }
}

@media screen and (max-width: 600px) {
  .action-form {
    padding: 16px;
  }

  .empty-state-main-text {
    font-size: 16px;
  }
}
</style>
