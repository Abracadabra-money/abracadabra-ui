<template>
  <div class="pool-creation-view">
    <div class="pool-creation-wrap">
      <div class="actions-block">
        <h3 class="pool-creation-title">Pool Creation</h3>

        <div class="action-form">
          <TokensSelector
            :baseToken="actionConfig.baseToken"
            :quoteToken="actionConfig.quoteToken"
            :baseTokenAmount="actionConfig.baseInputAmount"
            :quoteTokenAmount="actionConfig.quoteInputAmount"
            :isAutoPricingEnabled="actionConfig.isAutoPricingEnabled"
            @updateTokenInputAmount="updateTokenInputAmount"
            @openTokensPopup="openTokensPopup"
          />

          <PriceSelector
            :baseToken="actionConfig.baseToken"
            :quoteToken="actionConfig.quoteToken"
            :isAutoPricingEnabled="actionConfig.isAutoPricingEnabled"
            @updateTokensRate="updateTokensRate"
            @toggleAutopricing="toggleAutopricing"
          />

          <FeeTierSelector
            :poolType="actionConfig.poolType"
            @selectFeeTier="selectFeeTier"
            v-if="actionConfig.poolType"
          />
          <EmptyState v-else>
            <span class="empty-state-main-text">Select Pool Type</span>
          </EmptyState>

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
          :poolType="actionConfig.poolType"
          @selectPoolType="selectPoolType"
        />
        <PoolCreationInfo
          :tokensSelected="tokensSelected"
          :poolType="actionConfig.poolType"
          :kValue="actionConfig.K"
          @openSlippagePopup="isSlippagePopupOpened = true"
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
        :baseTokenAddress="actionConfig.baseToken.config.contract.address"
        :quoteTokenAddress="actionConfig.quoteToken.config.contract.address"
        @updateSelectedToken="updateSelectedToken"
      />
    </LocalPopupWrap>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { parseUnits } from "viem";
import { getTokenList } from "@/helpers/pools/poolCreation/getTokenList";
import { validationActions } from "@/helpers/pools/poolCreation/validationActions";
import { createPool } from "@/helpers/pools/poolCreation/actions/createPool";
import type { PoolCreationTokenInfo } from "@/configs/pools/poolCreation/types";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { approveTokenViem } from "@/helpers/approval";
import notification from "@/helpers/notification/notification";
import { notificationErrorMsg } from "@/helpers/notification/notificationError";
import type { ContractInfo } from "@/types/global";
import { getSwapRouterByChain } from "@/configs/pools/routers";

const emptyPoolCreationTokenInfo: PoolCreationTokenInfo = {
  config: {
    name: "Select Token",
    chainId: 1,
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

export const K_VALUE_DECIMALS = 18;
export const FEE_TIER_DECIMALS = 16;

const STANDARD_K_VALUE = parseUnits("1", K_VALUE_DECIMALS);
const STANDARD_FEE_TIER = parseUnits("0.03", FEE_TIER_DECIMALS);
const STANDARD_I_VALUE = 1000000n;

export enum TokenTypes {
  Base = "base",
  Quote = "quote",
}

export enum PoolTypes {
  Standard = "standard",
  Pegged = "pegged",
}

export type ActionConfig = {
  poolType: PoolTypes | null;
  baseToken: PoolCreationTokenInfo;
  quoteToken: PoolCreationTokenInfo;
  baseInputAmount: bigint;
  quoteInputAmount: bigint;
  feeTier: bigint;
  K: bigint;
  I: bigint;
  rate: number;
  isAutoPricingEnabled: boolean;
};

export default {
  data() {
    return {
      tokenList: [] as PoolCreationTokenInfo[],
      tokenType: "base",
      actionConfig: {
        poolType: null,
        baseToken: emptyPoolCreationTokenInfo,
        quoteToken: emptyPoolCreationTokenInfo,
        baseInputAmount: 0n,
        quoteInputAmount: 0n,
        feeTier: 0n,
        K: 0n,
        I: 0n,
        rate: 0,
        isAutoPricingEnabled: false,
      } as ActionConfig,
      isTokensPopupOpened: false,
      isSlippagePopupOpened: false,
      updateInterval: null as NodeJS.Timeout | null,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),

    tokensSelected() {
      const { baseToken, quoteToken } = this.actionConfig;
      const emptyTokenName = emptyPoolCreationTokenInfo.config.name;

      return (
        baseToken.config.name != emptyTokenName &&
        quoteToken.config.name != emptyTokenName
      );
    },

    validationData() {
      return validationActions(this.actionConfig, this.chainId);
    },

    routerAddress() {
      const router = getSwapRouterByChain(this.chainId);
      return router;
    },

    IValueDecimals() {
      return (
        18 +
        this.actionConfig.quoteToken.config.decimals -
        this.actionConfig.baseToken.config.decimals
      );
    },
  },

  watch: {
    async chainId() {
      await this.createTokenList();
    },

    async account() {
      await this.createTokenList();
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    updateTokenInputAmount(type: TokenTypes, amount: bigint) {
      const baseDecimals = this.actionConfig.baseToken.config.decimals;
      const quoteDecimals = this.actionConfig.quoteToken.config.decimals;

      const isBaseDecimalsGreater = baseDecimals > quoteDecimals;

      const tokenDecimalsDifference = isBaseDecimalsGreater
        ? baseDecimals - quoteDecimals
        : quoteDecimals - baseDecimals;

      if (type == TokenTypes.Base) {
        this.actionConfig.baseInputAmount = amount;
        this.actionConfig.quoteInputAmount = isBaseDecimalsGreater
          ? (amount * parseUnits("1", this.IValueDecimals)) /
            this.actionConfig.I /
            parseUnits("1", tokenDecimalsDifference)
          : (amount *
              parseUnits("1", this.IValueDecimals + tokenDecimalsDifference)) /
            this.actionConfig.I;
      } else {
        this.actionConfig.quoteInputAmount = amount;
        this.actionConfig.baseInputAmount = isBaseDecimalsGreater
          ? (amount *
              parseUnits("1", tokenDecimalsDifference) *
              this.actionConfig.I) /
            parseUnits("1", this.IValueDecimals)
          : (amount * this.actionConfig.I) /
            parseUnits("1", this.IValueDecimals + tokenDecimalsDifference);
      }

      console.log(this.actionConfig);
    },

    openTokensPopup(type: TokenTypes) {
      this.tokenType = type;
      this.isTokensPopupOpened = true;
    },

    updateSelectedToken(token: PoolCreationTokenInfo) {
      if (this.tokenType === "quote") {
        if (this.actionConfig.baseToken.config.name === token.config.name) {
          this.actionConfig.baseToken = this.actionConfig.quoteToken;
          this.actionConfig.quoteToken = token;
        } else {
          this.actionConfig.quoteToken = token;
        }
      }

      if (this.tokenType === "base") {
        if (this.actionConfig.quoteToken.config.name === token.config.name) {
          this.actionConfig.quoteToken = this.actionConfig.baseToken;
          this.actionConfig.baseToken = token;
        } else {
          this.actionConfig.baseToken = token;
        }
      }

      this.isTokensPopupOpened = false;
    },

    selectPoolType(poolType: PoolTypes) {
      this.actionConfig.poolType = poolType;
      this.actionConfig.K = STANDARD_K_VALUE;
    },

    selectFeeTier(feeTier: bigint) {
      this.actionConfig.feeTier = feeTier;
    },

    selectKValue(kValue: bigint) {
      this.actionConfig.K = kValue;
    },

    toggleAutopricing() {
      this.actionConfig.isAutoPricingEnabled =
        !this.actionConfig.isAutoPricingEnabled;
    },

    updateTokensRate(I: number) {
      this.actionConfig.I = parseUnits(I.toString(), this.IValueDecimals);
    },

    async approveTokenHandler(contract: ContractInfo, valueToApprove: bigint) {
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
      return false;
    },

    async createPoolHandler() {
      const notificationId = await this.createNotification(
        notification.pending
      );

      try {
        const payload = this.createPayload();
        await createPool(this.routerAddress, payload);
        await this.deleteNotification(notificationId);

        await this.createNotification(notification.success);
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
          // @ts-ignore
          await this.$openWeb3modal();
          break;
        case "switchNetwork":
          await switchNetwork(42161); //todo
          break;
        case "approveBaseToken":
          await this.approveTokenHandler(
            this.actionConfig.baseToken.config.contract,
            this.actionConfig.baseInputAmount
          );
          break;
        case "approveQuoteToken":
          await this.approveTokenHandler(
            this.actionConfig.quoteToken.config.contract,
            this.actionConfig.quoteInputAmount
          );
          break;
        default:
          await this.createPoolHandler();
          break;
      }

      await this.createTokenList();
    },

    createPayload() {
      const {
        baseToken,
        quoteToken,
        feeTier,
        I,
        K,
        baseInputAmount,
        quoteInputAmount,
      } = this.actionConfig;

      return {
        baseToken: baseToken.config.contract.address,
        quoteToken: quoteToken.config.contract.address,
        lpFeeRate: feeTier,
        i: I,
        k: K,
        to: this.account,
        baseInAmount: baseInputAmount,
        quoteInAmount: quoteInputAmount,
        protocolOwnedPool: false,
      };
    },

    async createTokenList() {
      this.tokenList = await getTokenList(this.chainId, this.account);
    },
  },

  async created() {
    await this.createTokenList();
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    EmptyState: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/PoolCreationEmptyState.vue")
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
  },
};
</script>

<style lang="scss" scoped>
.pool-creation-view {
  min-height: 100vh;
}

.pool-creation-wrap {
  position: relative;
  max-width: 1310px;
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
