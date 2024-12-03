<template>
  <div class="swap-view">
    <div class="swap-wrapper">
      <div class="swap-head">
        <h3 class="title">
          MIM Swap
          <AvailableNetworksBlock
            :selectedNetwork="selectedNetwork"
            :availableNetworks="availableNetworks"
            @changeNetwork="changeNetwork"
          />
        </h3>

        <SwapSettingsPopup
          :slippage="actionConfig.slippage"
          :defaultSlippage="20n"
          :deadline="actionConfig.deadline"
          @updateSlippageValue="updateSlippageValue"
          @updateDeadlineValue="updateDeadlineValue"
        />
      </div>

      <div class="swap-body">
        <SwapForm
          :fromTokenPrice="fromTokenPrice"
          :toTokenPrice="toTokenPrice"
          :fromToken="actionConfig.fromToken"
          :toToken="actionConfig.toToken"
          :toTokenAmount="actionConfig.toInputValue"
          :differencePrice="differencePrice"
          :isLoading="isLoading"
          @onToogleTokens="toogleTokens"
          @openTokensPopup="openTokensPopup"
          @updateFromInputValue="updateFromValue"
        />

        <div>
          <CurrentPrice
            :fromToken="actionConfig?.fromToken"
            :toToken="actionConfig?.toToken"
            :currentPriceInfo="currentPriceInfo"
            :isLoading="isLoading"
          />
        </div>

        <SwapInfoBlock
          :swapInfo="swapInfo"
          :actionConfig="actionConfig"
          :priceImpact="priceImpactPair"
          :selectedNetwork="selectedNetwork"
          :nativeTokenPrice="nativeTokenPrice"
          :isLoading="isLoading"
        />

        <SwapRouterInfoBlock
          :routes="swapInfo.routes"
          :fromTokenIcon="actionConfig.fromToken.config.icon"
          :toTokenIcon="actionConfig.toToken.config.icon"
          :tokensList="tokensList"
        />

        <BaseButton
          :primary="!isWarningBtn"
          :disabled="
            !actionValidationData.isAllowed || isFetchSwapInfo || isLoading
          "
          :warning="isWarningBtn"
          @click="actionHandler"
          :loading="isApproving"
          >{{ actionValidationData.btnText }}</BaseButton
        >
      </div>
    </div>

    <LocalPopupWrap
      isFarm
      :isOpened="isTokensPopupOpened"
      @closePopup="isTokensPopupOpened = false"
    >
      <SwapListPopup
        :tokensList="filterTokensList"
        :popularTokens="filterTokensList"
        :tokenType="tokenType"
        :fromTokenAddress="actionConfig.fromToken.config.contract.address"
        :toTokenAddress="actionConfig.toToken.config.contract.address"
        @updateSelectedToken="updateSelectedToken"
      />
    </LocalPopupWrap>

    <LocalPopupWrap
      isFarm
      :isOpened="isConfirmationPopupOpened"
      @closePopup="isConfirmationPopupOpened = false"
    >
      <ConfirmationPopup
        :actionConfig="actionConfig"
        :swapInfo="swapInfo"
        :priceImpact="priceImpactPair"
        :currentPriceInfo="currentPriceInfo"
        @confirm="closeConfirmationPopup"
      />
    </LocalPopupWrap>
  </div>
</template>

<script lang="ts">
import {
  KAVA_CHAIN_ID,
  BLAST_CHAIN_ID,
  ARBITRUM_CHAIN_ID,
  MAINNET_CHAIN_ID,
} from "@/constants/global";
import {
  getSwapInfo,
  getSwapInfoEmptyState,
} from "@/helpers/pools/swap/getSwapInfo";
import {
  getCoinsPrices,
  getNativeTokensPrice,
} from "@/helpers/prices/defiLlama";
import { defineAsyncComponent } from "vue";
import type { ContractInfo } from "@/types/global";
import { approveTokenViem } from "@/helpers/approval";
import type { PoolConfig } from "@/configs/pools/types";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { formatUnits, parseUnits, type Address } from "viem";
import type { TokenInfo } from "@/helpers/pools/swap/tokens";
import type { TokenPrice } from "@/helpers/prices/defiLlama";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import notification from "@/helpers/notification/notification";
import { getAllUniqueTokens } from "@/helpers/pools/swap/tokens";
import { getTokenListByPools } from "@/helpers/pools/swap/tokens";
import { getAllPoolsByChain } from "@/helpers/pools/swap/magicLp";
import type { ActionConfig, RouteInfo } from "@/helpers/pools/swap/getSwapInfo";
import { validationActions } from "@/helpers/validators/swap/validationActions";
import { getPoolConfigsByChains } from "@/helpers/pools/configs/getOrCreatePairsConfigs";

const emptyTokenInfo: TokenInfo = {
  config: {
    name: "Select Token",
    decimals: 18,
    icon: "",
    contract: { address: "0x", abi: "" },
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
      tokensList: null as any,
      poolsList: null as any,
      tokenType: "from",
      isTokensPopupOpened: false,
      isConfirmationPopupOpened: false,
      wethAddress: "0x4300000000000000000000000000000000000004" as Address,
      prices: [] as TokenPrice[],
      actionConfig: {
        fromToken: emptyTokenInfo,
        toToken: emptyTokenInfo,
        fromInputValue: 0n,
        toInputValue: 0n,
        slippage: 20n,
        deadline: 500n,
        fromInputAmount: "0",
      } as ActionConfig,
      updateInterval: null as any,
      isFetchSwapInfo: false,
      swapInfo: getSwapInfoEmptyState({
        fromToken: emptyTokenInfo,
        toToken: emptyTokenInfo,
        fromInputValue: 0n,
        toInputValue: 0n,
        slippage: 20n,
        deadline: 500n,
      } as ActionConfig),
      selectedNetwork: ARBITRUM_CHAIN_ID,
      availableNetworks: [
        ARBITRUM_CHAIN_ID,
        KAVA_CHAIN_ID,
        BLAST_CHAIN_ID,
        MAINNET_CHAIN_ID,
      ], // TODO: get from configs
      isApproving: false,
      nativeTokenPrice: [] as { chainId: number; price: number }[],
      poolConfigs: [] as PoolConfig[],
      isLoading: false,
    };
  },

  computed: {
    ...mapGetters({ chainId: "getChainId", account: "getAccount" }),

    isWarningBtn() {
      if (!this.priceImpactPair) return false;
      return +this.priceImpactPair <= -15;
    },

    actionValidationData() {
      return validationActions(
        this.actionConfig,
        this.selectedNetwork,
        this.chainId,
        this.account,
        this.isApproving
      );
    },

    feePayload(): Array<string | bigint | number> {
      const { payload }: any = this.swapInfo.transactionInfo;
      if (!Object.keys(payload).length) return [];
      return Object.values(payload);
    },

    fromTokenPrice() {
      const { fromToken } = this.actionConfig;

      return (
        this.prices.find(
          (price) => price.address === fromToken?.config.contract.address
        )?.price || 0
      );
    },

    toTokenPrice() {
      const { toToken } = this.actionConfig;

      return (
        this.prices.find(
          (price) => price.address === toToken?.config.contract.address
        )?.price || 0
      );
    },

    currentPriceInfo() {
      const amounts = {
        from: this.actionConfig.fromInputValue,
        to: this.actionConfig.toInputValue,
      };

      const routeInfo: RouteInfo =
        this.swapInfo.routes[this.swapInfo.routes.length - 1];

      if (!routeInfo) {
        return {
          midPrice: 0,
          amounts: amounts,
          fromBase: false,
        };
      }

      const midPrice = routeInfo.lpInfo.midPrice;
      const fromBase = routeInfo.lpInfo.baseToken === routeInfo.inputToken;

      return {
        midPrice,
        amounts,
        fromBase,
      };
    },

    // Alternative price impact calculation
    priceImpactPair(): string | number {
      const routeInfo: RouteInfo =
        this.swapInfo.routes[this.swapInfo.routes.length - 1];

      if (!routeInfo) return 0;

      const isBase = routeInfo.lpInfo.baseToken === routeInfo.inputToken;

      //@ts-ignore
      const { midPrice } = routeInfo.lpInfo;

      //@ts-ignore
      const tokenAmountIn = this.swapInfo.inputAmount;
      const tokenAmountOut = routeInfo.outputAmountWithoutFee;
      if (!tokenAmountIn || !tokenAmountOut) return 0;

      const parsedAmountIn = formatUnits(
        tokenAmountIn,
        this.actionConfig.fromToken.config.decimals
      );

      const parsedAmountOut = formatUnits(
        tokenAmountOut,
        this.actionConfig.toToken.config.decimals
      );

      const executionPrice = isBase
        ? Number(parsedAmountOut) / Number(parsedAmountIn)
        : Number(parsedAmountIn) / Number(parsedAmountOut);

      const priceImpact =
        Math.abs(midPrice - executionPrice) / Number(midPrice);

      return Number(priceImpact * 100).toFixed(2);
    },

    differencePrice() {
      const { fromToken, toToken, fromInputValue, toInputValue }: any =
        this.actionConfig;

      if (!fromInputValue || !toInputValue) return 0;

      const fromTokenAmountUsd =
        this.fromTokenPrice *
        +formatUnits(fromInputValue, fromToken?.config.decimals || 18);

      const toTokenAmountUsd =
        this.toTokenPrice *
        +formatUnits(toInputValue || 0n, toToken?.config.decimals || 18);

      const differencePrice = toTokenAmountUsd / fromTokenAmountUsd;

      if (!differencePrice) return differencePrice;
      return (differencePrice - 1) * 100;
    },

    isMIMToken() {
      return (
        (this.tokenType === "from" &&
          this.actionConfig.fromToken.config.name === "MIM") ||
        (this.tokenType === "to" &&
          this.actionConfig.toToken.config.name === "MIM")
      );
    },

    filterTokensList() {
      return this.tokensList.filter(
        (token: TokenInfo, index: number, self: TokenInfo[]) => {
          return (
            index ===
            self.findIndex(
              (t) =>
                t.config.contract.address.toLowerCase() ===
                token.config.contract.address.toLowerCase()
            )
          );
        }
      );
    },
  },

  watch: {
    chainId() {
      this.createSwapInfo();
    },

    async selectedNetwork() {
      this.isLoading = true;
      this.resetActionCaonfig();
      await this.createSwapInfo();
      this.selectBaseTokens();
      this.isLoading = false;
    },

    account() {
      this.createSwapInfo();
    },

    actionConfig: {
      async handler(value: ActionConfig) {
        const actionConfig = value;

        const { decimals } = this.actionConfig.fromToken.config;
        const { fromInputAmount } = this.actionConfig;
        const amount = parseUnits(fromInputAmount || "0", decimals);

        actionConfig.fromInputValue = amount;

        //@ts-ignore
        this.swapInfo = await getSwapInfo(
          this.poolsList,
          actionConfig,
          this.selectedNetwork,
          this.account
        );

        this.actionConfig.toInputValue = this.swapInfo.outputAmount;
      },
      deep: true,
    },

    "actionConfig.fromToken": {
      async handler() {
        // @ts-ignore
        this.swapInfo = await getSwapInfo(
          this.poolsList,
          this.actionConfig,
          this.selectedNetwork,
          this.account
        );

        this.actionConfig.toInputValue = this.swapInfo.outputAmount;
      },
      deep: true,
    },

    "actionConfig.toToken": {
      async handler() {
        // @ts-ignore
        this.swapInfo = await getSwapInfo(
          this.poolsList,
          this.actionConfig,
          this.selectedNetwork,
          this.account
        );

        this.actionConfig.toInputValue = this.swapInfo.outputAmount;
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    successNotification(notificationId: number) {
      this.deleteNotification(notificationId);
      this.createNotification(notification.success);
    },

    updateFromValue(value: bigint, fromInputAmount: string) {
      this.actionConfig.fromInputAmount = fromInputAmount;

      if (value === null) {
        this.actionConfig.fromInputValue = 0n;
        this.actionConfig.toInputValue = 0n;
      } else {
        this.actionConfig.fromInputValue = value;
        this.actionConfig.toInputValue = this.swapInfo.outputAmount;
      }
    },

    updateSelectedToken(token: TokenInfo) {
      if (this.tokenType === "to") {
        if (this.actionConfig.fromToken.config.name === token.config.name) {
          this.actionConfig.fromToken = this.actionConfig.toToken;
          this.actionConfig.toToken = token;
        } else {
          this.actionConfig.toToken = token;
        }
      }

      if (this.tokenType === "from") {
        if (this.actionConfig.toToken.config.name === token.config.name) {
          this.actionConfig.toToken = this.actionConfig.fromToken;
          this.actionConfig.fromToken = token;
        } else {
          this.actionConfig.fromToken = token;
        }
      }

      this.updateFromValue(
        this.actionConfig.fromInputValue,
        this.actionConfig.fromInputAmount || "0"
      );

      this.isTokensPopupOpened = false;
    },

    updateSlippageValue(value: bigint) {
      this.actionConfig.slippage = value;
    },

    updateDeadlineValue(value: bigint) {
      this.actionConfig.deadline = value;
    },

    resetActionCaonfig() {
      this.actionConfig.fromInputValue = 0n;
      this.actionConfig.toInputValue = 0n;
      this.actionConfig.slippage = 20n;
      this.actionConfig.deadline = 500n;
      this.actionConfig.fromInputAmount = "";
    },

    openTokensPopup(type: string) {
      this.tokenType = type;
      this.isTokensPopupOpened = true;
    },

    openConfirmationPopup() {
      this.isConfirmationPopupOpened = true;
    },

    closeConfirmationPopup() {
      this.actionConfig.fromInputValue = 0n;
      this.actionConfig.toInputValue = 0n;
      this.isConfirmationPopupOpened = false;
    },

    toogleTokens() {
      const fromToken = this.actionConfig.fromToken;
      const toToken = this.actionConfig.toToken;

      this.actionConfig.fromToken = toToken;
      this.actionConfig.toToken = fromToken;

      this.updateFromValue(
        this.actionConfig.fromInputValue,
        this.actionConfig.fromInputAmount || "0"
      );
    },

    async getTokensPrices(poolsConfig: PoolConfig[]) {
      const uniqueTokens = getAllUniqueTokens(poolsConfig);
      const coins = uniqueTokens.map(({ contract }) => contract.address);
      coins.push(this.wethAddress);
      return await getCoinsPrices(this.selectedNetwork, coins);
    },

    async approveTokenHandler(contract: ContractInfo, valueToApprove: bigint) {
      this.isApproving = true;
      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveTokenViem(
        contract,
        // @ts-ignore
        this.swapInfo.transactionInfo.swapRouterAddress,
        valueToApprove
      );

      await this.deleteNotification(notificationId);
      if (!approve) await this.createNotification(notification.approveError);
      this.isApproving = false;
      return false;
    },

    async actionHandler() {
      if (!this.actionValidationData.isAllowed || this.isFetchSwapInfo)
        return false;

      // @ts-ignore
      switch (this.actionValidationData && this.actionValidationData.method) {
        case "connectWallet":
          // @ts-ignore
          await this.$openWeb3modal();
          break;
        case "switchNetwork":
          await switchNetwork(this.selectedNetwork); //todo
          break;
        case "approvefromToken":
          await this.approveTokenHandler(
            this.actionConfig.fromToken.config.contract,
            this.actionConfig.fromInputValue
          );
          break;
        case "approveToToken":
          await this.approveTokenHandler(
            this.actionConfig.toToken.config.contract,
            this.actionConfig.toInputValue
          );
          break;
        default:
          this.openConfirmationPopup();
          break;
      }

      await this.createSwapInfo();
    },

    async createSwapInfo() {
      const filteredPoolsConfig = this.poolConfigs.filter(
        ({ chainId }) => chainId === this.selectedNetwork
      );

      if (!filteredPoolsConfig.length) {
        this.tokensList = [];
        this.poolsList = [];
        this.resetActionCaonfig();
        return;
      }

      this.prices = await this.getTokensPrices(filteredPoolsConfig);

      this.tokensList = await getTokenListByPools(
        filteredPoolsConfig,
        this.selectedNetwork,
        this.prices,
        this.account
      );

      this.updatedTokenInfo();

      this.poolsList = await getAllPoolsByChain(
        this.selectedNetwork,
        this.poolConfigs,
        this.account
      );
    },

    changeNetwork(network: number) {
      this.selectedNetwork = network;
    },

    selectBaseTokens() {
      this.actionConfig.fromToken = this.tokensList.find(
        (token: TokenInfo) => token.config.name !== "MIM"
      );

      this.actionConfig.toToken = this.tokensList.find(
        (token: TokenInfo) => token.config.name === "MIM"
      );
    },

    checkAndSetSelectedChain() {
      if (this.availableNetworks.includes(this.chainId)) {
        this.selectedNetwork = this.chainId;
      }
    },

    updatedTokenInfo() {
      if (this.actionConfig.fromToken.config.contract.address === "0x") return;
      if (this.actionConfig.toToken.config.contract.address === "0x") return;

      const fromToken = this.tokensList.find(
        (token: TokenInfo) =>
          this.actionConfig.fromToken.config.contract.address.toLowerCase() ===
          token.config.contract.address.toLowerCase()
      );

      if (fromToken) this.actionConfig.fromToken = fromToken;

      const toToken = this.tokensList.find(
        (token: TokenInfo) =>
          this.actionConfig.toToken.config.contract.address.toLowerCase() ===
          token.config.contract.address.toLowerCase()
      );

      if (toToken) this.actionConfig.toToken = toToken;
    },
  },

  async created() {
    this.isLoading = true;
    this.poolConfigs = await getPoolConfigsByChains();
    this.nativeTokenPrice = await getNativeTokensPrice(this.availableNetworks);
    this.checkAndSetSelectedChain();
    await this.createSwapInfo();
    this.selectBaseTokens();
    this.isLoading = false;

    this.updateInterval = setInterval(async () => {
      await this.createSwapInfo();
    }, 10000);
  },

  components: {
    SwapSettingsPopup: defineAsyncComponent(
      () => import("@/components/popups/swap/SwapSettingsPopup.vue")
    ),
    AvailableNetworksBlock: defineAsyncComponent(
      () => import("@/components/stake/AvailableNetworksBlock.vue")
    ),
    SwapForm: defineAsyncComponent(
      () => import("@/components/swap/SwapForm.vue")
    ),
    CurrentPrice: defineAsyncComponent(
      () => import("@/components/pools/CurrentPrice.vue")
    ),
    SwapInfoBlock: defineAsyncComponent(
      () => import("@/components/swap/SwapInfoBlock.vue")
    ),
    SwapRouterInfoBlock: defineAsyncComponent(
      () => import("@/components/swap/SwapRouterInfoBlock.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    LocalPopupWrap: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/popups/LocalPopupWrap.vue")
    ),
    SwapListPopup: defineAsyncComponent(
      () => import("@/components/popups/swap/SwapListPopup.vue")
    ),
    ConfirmationPopup: defineAsyncComponent(
      () => import("@/components/popups/swap/ConfirmationPopup.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.link-button {
  width: max-content !important;
  margin: 0 auto 0 12px;
}

.swap-view {
  padding: 120px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100vh;
  width: 100%;
}

.swap-wrapper {
  max-width: 550px;
  width: 100%;
  padding: 0 8px;
  margin: 0 auto;
}

.swap-head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;

  .title {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }
}

.title {
  font-size: 32px;
  font-weight: 600;
  line-height: normal;
}

.swap-body {
  @include block-wrap;
  gap: 24px;
  display: flex;
  flex-direction: column;
}

@media screen and (max-width: 600px) {
  .title {
    font-size: 24px;
  }

  .swap-body {
    padding: 16px;
    gap: 20px;
  }
}
</style>
