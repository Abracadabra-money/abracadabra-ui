<template>
  <div class="swap-view">
    <div class="swap-wrapper">
      <div class="swap-head">
        <h3 class="title">MIM SWAP</h3>

        <SwapSettingsPopup
          :slippage="100n"
          :defaultSlippage="100n"
          :deadline="3000n"
          @updateSlippageValue="updateSlippageValue"
          @updateDeadlineValue="updateDeadlineValue"
        />
      </div>

      <div class="swap-body">
        <SwapForm
          :fromToken="actionConfig.fromToken"
          :toToken="actionConfig.toToken"
          :toTokenAmount="actionConfig.toInputValue"
          @onToogleTokens="toogleTokens"
          @openTokensPopup="openTokensPopup"
          @updateFromInputValue="updateFromValue"
        />

        <SwapInfoBlock
          :fromToken="actionConfig.fromToken"
          :toToken="actionConfig.toToken"
          :minAmount="swapInfo.outputAmountWithSlippage"
        />

        <SwapRouterInfoBlock
          :routes="swapInfo.routes"
          :fromTokenIcon="actionConfig.fromToken.config.icon"
          :toTokenIcon="actionConfig.toToken.config.icon"
          :tokensList="tokensList"
        />

        <BaseButton
          :primary="true"
          :disabled="!actionValidationData.isAllowed"
          @click="actionHandler"
          >{{ actionValidationData.btnText }}</BaseButton
        >
      </div>
    </div>

    <LocalPopupWrap
      isSwapPopup
      :isOpened="isTokensPopupOpened"
      @closePopup="isTokensPopupOpened = false"
    >
      <SwapListPopup
        :tokensList="tokensList"
        :popularTokens="tokensList"
        :selectedToken="selectedToken"
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
        @confirm="swapHandler"
      />
    </LocalPopupWrap>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { defineAsyncComponent } from "vue";
import { fetchFeeData } from "@wagmi/core";
import poolsConfig from "@/configs/pools/pools";
import { approveTokenViem } from "@/helpers/approval";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { getCoinsPrices } from "@/helpers/prices/defiLlama";
import type { TokenInfo } from "@/helpers/pools/swap/tokens";
import { getSwapInfo } from "@/helpers/pools/swap/getSwapInfo";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import notification from "@/helpers/notification/notification";
import { getAllUniqueTokens } from "@/helpers/pools/swap/tokens";
import { getTokenListByPools } from "@/helpers/pools/swap/tokens";
import { getAllPoolsByChain } from "@/helpers/pools/swap/magicLp";
import { validationActions } from "@/helpers/validators/swap/validationActions";
// @ts-ignore
import { notificationErrorMsg } from "@/helpers/notification/notificationError";
import { swapTokensForTokens } from "@/helpers/pools/swap/actions/swapTokensForTokens";
import { sellBaseTokensForTokens } from "@/helpers/pools/swap/actions/sellBaseTokensForTokens";
import { sellQuoteTokensForTokens } from "@/helpers/pools/swap/actions/sellQuoteTokensForTokens";

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
      actionConfig: {
        fromToken: emptyTokenInfo,
        toToken: emptyTokenInfo,
        fromInputValue: 0n,
        toInputValue: 0n,
        slippage: 100n, //todo
        deadline: 200n, //todo
      },
    };
  },

  computed: {
    ...mapGetters({ chainId: "getChainId", account: "getAccount" }),

    selectedToken() {
      return this.tokenType === "from"
        ? this.actionConfig.fromToken
        : this.actionConfig.toToken;
    },

    actionValidationData() {
      return validationActions(this.actionConfig, this.chainId);
    },

    swapInfo() {
      return getSwapInfo(
        this.poolsList,
        this.actionConfig,
        this.chainId,
        this.account
      );
    },
  },

  watch: {
    chainId() {
      this.createSwapInfo();
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    successNotification(notificationId: number) {
      this.deleteNotification(notificationId);
      this.createNotification(notification.success);
    },

    updateFromValue(value: bigint) {
      if (value === null) {
        this.actionConfig.fromInputValue = 0n;
        this.actionConfig.toInputValue = 0n;
      } else {
        this.actionConfig.fromInputValue = value;
        this.actionConfig.toInputValue = this.swapInfo.outputAmount;
      }
    },

    updateSelectedToken(token: any) {
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

      this.updateFromValue(this.actionConfig.fromInputValue);

      this.isTokensPopupOpened = false;
    },

    updateSlippageValue(value: bigint) {
      this.actionConfig.slippage = value;
    },

    updateDeadlineValue(value: bigint) {
      this.actionConfig.deadline = value;
    },

    resetActionCaonfig() {
      this.actionConfig = {
        fromToken: emptyTokenInfo as TokenInfo,
        toToken: emptyTokenInfo as TokenInfo,
        fromInputValue: 0n,
        toInputValue: 0n,
        slippage: 100n, //todo
        deadline: 200n, //todo
      };
    },

    openTokensPopup(type: string) {
      this.tokenType = type;
      this.isTokensPopupOpened = true;
    },

    toogleTokens() {
      const fromToken = this.actionConfig.fromToken;
      const toToken = this.actionConfig.toToken;

      this.actionConfig.fromToken = toToken;
      this.actionConfig.toToken = fromToken;

      this.updateFromValue(this.actionConfig.fromInputValue);
    },

    async approveTokenHandler(contract: any) {
      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveTokenViem(
        contract,
        // @ts-ignore
        this.swapInfo.transactionInfo.swapRouterAddress
      );

      // if (approve) await this.createStakeInfo(); //todo updated config
      await this.deleteNotification(notificationId);
      if (!approve) await this.createNotification(notification.approveError);
      return false;
    },

    async actionHandler() {
      if (!this.actionValidationData.isAllowed) return false;

      switch (this.actionValidationData?.method) {
        case "connectWallet":
          // @ts-ignore
          await this.$openWeb3modal();
          break;
        case "switchNetwork":
          await switchNetwork(81457); //todo
          break;
        case "approvefromToken":
          await this.approveTokenHandler(
            this.actionConfig.fromToken.config.contract
          );
          break;
        case "approveToToken":
          await this.approveTokenHandler(
            this.actionConfig.toToken.config.contract
          );
          break;
        default:
          this.isConfirmationPopupOpened = true;
          break;
      }

      await this.createSwapInfo();
    },

    async swapHandler() {
      const notificationId = await this.createNotification(
        notification.pending
      );

      try {
        const { methodName } = this.swapInfo.transactionInfo;

        // @ts-ignore
        this.swapInfo.transactionInfo.payload.deadline =
          moment().unix() + Number(this.actionConfig.deadline);

        switch (methodName) {
          case "sellBaseTokensForTokens":
            await sellBaseTokensForTokens(
              // @ts-ignore
              this.swapInfo.transactionInfo.swapRouterAddress,
              this.swapInfo.transactionInfo.payload
            );
            break;
          case "sellQuoteTokensForTokens":
            await sellQuoteTokensForTokens(
              // @ts-ignore
              this.swapInfo.transactionInfo.swapRouterAddress,
              this.swapInfo.transactionInfo.payload
            );
            break;
          case "swapTokensForTokens":
            await swapTokensForTokens(
              // @ts-ignore
              this.swapInfo.transactionInfo.swapRouterAddress,
              this.swapInfo.transactionInfo.payload
            );
            break;
        }

        this.successNotification(notificationId);
      } catch (error) {
        console.log("Swap Error", error);
        const errorNotification = {
          msg: notificationErrorMsg(error),
          type: "error",
        };
        this.deleteNotification(notificationId);
        this.createNotification(errorNotification);
      }
    },

    async createSwapInfo() {
      // const uniqueTokens = getAllUniqueTokens(poolsConfig);
      // const coins = uniqueTokens.map(({ contract }) => contract.address);
      // const prices = await getCoinsPrices(81457, coins);

      const prices = [
        {
          address: "0x0eb13D9C49C31B57e896c1637766E9EcDC1989CD",
          price: 0.990929,
        },
        {
          address: "0x4200000000000000000000000000000000000023",
          price: 4000.1,
        },
        {
          address: "0x76DA31D7C9CbEAE102aff34D3398bC450c8374c1",
          price: 0.984804,
        },
        {
          address: "0x4300000000000000000000000000000000000003",
          price: 1.019,
        },
      ];

      const filteredPoolsConfig = poolsConfig.filter(
        ({ chainId }) => chainId === this.chainId
      );

      if (!filteredPoolsConfig.length) {
        this.tokensList = [];
        this.poolsList = [];
        this.resetActionCaonfig();
        return;
      }

      this.tokensList = await getTokenListByPools(
        filteredPoolsConfig,
        this.chainId,
        prices,
        this.account
      );

      this.poolsList = await getAllPoolsByChain(this.chainId, this.account);
    },
  },

  async created() {
    await this.createSwapInfo();

    this.actionConfig.fromToken = this.tokensList.find(
      (token: any) => token.config.name === "MIM"
    );

    const feeData = await fetchFeeData();
    console.log("feeData", feeData);
  },

  components: {
    SwapSettingsPopup: defineAsyncComponent(
      () => import("@/components/popups/swap/SwapSettingsPopup.vue")
    ),
    SwapForm: defineAsyncComponent(
      () => import("@/components/swap/SwapForm.vue")
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
.swap-view {
  padding: 100px 0;
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
