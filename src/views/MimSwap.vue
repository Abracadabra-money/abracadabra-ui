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
        />

        <SwapRouterInfoBlock />

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
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import poolsConfig from "@/configs/pools/pools";
import { approveTokenViem } from "@/helpers/approval";
import { mapActions, mapGetters, mapMutations } from "vuex";
// import { getCoinsPrices } from "@/helpers/prices/defiLlama";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import notification from "@/helpers/notification/notification";
import { emptyTokenInfo } from "@/configs/swap/emptyTokenInfo";
// import { getAllUniqueTokens } from "@/helpers/pools/swap/tokens";
import { getTokenListByPools } from "@/helpers/pools/swap/tokens";
import { validationActions } from "@/helpers/validators/swap/validationActions";

export default {
  data() {
    return {
      tokensList: null as any,
      tokenType: "from",
      isTokensPopupOpened: false,
      actionConfig: {
        fromToken: emptyTokenInfo as any,
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

    isSelectedTokens() {
      if (!this.actionConfig.toToken || !this.actionConfig.fromToken)
        return false;
      const { name: toTokenName } = this.actionConfig.toToken.config;
      const { name: fromTokenName } = this.actionConfig.fromToken.config;
      return ![toTokenName, fromTokenName].includes("Select Token");
    },

    selectedToken() {
      return this.tokenType === "from"
        ? this.actionConfig.fromToken
        : this.actionConfig.toToken;
    },

    actionValidationData() {
      return validationActions(this.actionConfig, this.chainId);
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    updateFromValue(value: bigint) {
      // const { rate } = this.actionConfig.toToken;

      if (value === null) {
        this.actionConfig.fromInputValue = 0n;
        this.actionConfig.toInputValue = 0n;
      } else {
        this.actionConfig.fromInputValue = value;
        // this.actionConfig.toInputValue = (value * BigInt(10 ** 18)) / rate;
        this.actionConfig.toInputValue = value;
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
        "0xdFE08DAfceDF428932336fBfE7BfBF0403Ad58e5" //todo
      );

      // if (approve) await this.createStakeInfo(); //todo updated config
      await this.deleteNotification(notificationId);
      if (!approve) await this.createNotification(notification.approveError);
      return false;
    },

    actionHandler() {
      if (!this.actionValidationData.isAllowed) return false;

      switch (this.actionValidationData?.method) {
        case "connectWallet":
          // @ts-ignore
          return this.$openWeb3modal();
        case "switchNetwork":
          return switchNetwork(168587773); //todo
        case "approvefromToken":
          return this.approveTokenHandler(this.actionConfig.fromToken.contract);
        case "approveToToken":
          return this.approveTokenHandler(
            this.actionConfig.toToken.config.contract
          );
        default:
          console.log("Swap", this.actionConfig);
      }
    },
  },

  async created() {
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
    ];

    this.tokensList = await getTokenListByPools(
      poolsConfig,
      168587773,
      prices,
      this.account
    );

    this.actionConfig.fromToken = this.tokensList.find(
      (token: any) => token.config.name === "MIM"
    );
  },

  components: {
    SwapSettingsPopup: defineAsyncComponent(
      () => import("@/components/popups/SwapSettingsPopup.vue")
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
      () => import("@/components/popups/SwapListPopup.vue")
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
