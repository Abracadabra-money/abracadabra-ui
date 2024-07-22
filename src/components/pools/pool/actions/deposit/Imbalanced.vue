<template>
  <div class="pool-action-block">
    <div class="inputs-wrap">
      <BaseTokenInput
        class="base-input"
        :name="baseToken.config.name"
        :icon="baseToken.config.icon"
        :decimals="baseToken.config.decimals"
        :max="baseToken.userInfo.balance"
        :value="baseInputValue"
        :tokenPrice="baseToken.price"
        @updateInputValue="updateValue($event, true)"
      />

      <BaseTokenInput
        class="quote-input"
        :name="quoteToken.config.name"
        :icon="quoteToken.config.icon"
        :decimals="quoteToken.config.decimals"
        :max="quoteToken.userInfo.balance"
        :value="quoteInputValue"
        :tokenPrice="quoteToken.price"
        @updateInputValue="updateValue($event)"
      />

      <IconButton
        class="plus-icon"
        plus
        active
        disable
        :width="44"
        :height="44"
        borderRadius="16px"
      />
    </div>

    <PreviewAddLiquidity
      :pool="pool"
      :slippage="slippage"
      :baseInputAmount="baseInputAmount"
      :expectedOptimal="expectedOptimal"
      :quoteInputAmount="quoteInputAmount"
      :isExpectedOptimalCalculating="isExpectedOptimalCalculating"
    />

    <BaseButton primary @click="actionHandler" :disabled="isButtonDisabled">
      {{ buttonText }}
    </BaseButton>

    <PreviewAddLiquidityPopup
      v-if="isPreviewPopupOpened"
      :pool="pool"
      :previewInfo="previewPopupInfo"
      :isActionProcessing="isActionProcessing"
      :transactionStatus="transactionStatus"
      @approve="approveHandler"
      @deposit="imbalanceHandler"
      @close="closePreviewPopup"
    />
  </div>
</template>

<script>
import moment from "moment";
import { formatUnits } from "viem";
import debounce from "lodash.debounce";
import { defineAsyncComponent } from "vue";
import { trimZeroDecimals } from "@/helpers/numbers";
import { approveTokenViem } from "@/helpers/approval";
import { mapActions, mapGetters, mapMutations } from "vuex";
import notification from "@/helpers/notification/notification";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { actionStatus } from "@/components/pools/pool/PoolActionBlock.vue";
import { applySlippageToMinOutBigInt } from "@/helpers/gm/applySlippageToMinOut";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import { addLiquidityImbalanced } from "@/helpers/pools/swap/actions/addLiquidityImbalanced";
import { addLiquidityImbalancedOptimal } from "@/helpers/pools/swap/addLiquidityImbalancedOptimal";

export default {
  props: {
    pool: { type: Object },
    slippage: { type: BigInt, default: 100n },
    deadline: { type: BigInt, default: 100n },
  },

  emits: ["updatePoolInfo"],

  data() {
    return {
      baseInputAmount: 0n,
      baseInputValue: "",
      quoteInputAmount: 0n,
      quoteInputValue: "",
      expectedOptimal: {
        remainingAmountToSwap: 0n,
        shares: 0n,
        baseRefundAmount: 0n,
        quoteRefundAmount: 0n,
      },
      isExpectedOptimalCalculating: false,
      isActionProcessing: false,
      transactionStatus: actionStatus.WAITING,
      isPreviewPopupOpened: false,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

    baseToken() {
      return this.pool.tokens.baseToken;
    },
    quoteToken() {
      return this.pool.tokens.quoteToken;
    },

    previewPopupInfo() {
      const minimumShares = applySlippageToMinOutBigInt(
        this.slippage,
        this.expectedOptimal.shares
      );

      return {
        lpAmount: minimumShares,
        baseTokenAmount: this.baseInputAmount,
        quoteTokenAmount: this.quoteInputAmount,
      };
    },

    isBaseTokenApproved() {
      return (
        this.pool.tokens.baseToken.userInfo.allowance >= this.baseInputAmount
      );
    },

    isQuoteTokenApproved() {
      return (
        this.pool.tokens.quoteToken.userInfo.allowance >= this.quoteInputAmount
      );
    },

    isValid() {
      return !!this.baseInputAmount || !!this.quoteInputAmount;
    },

    error() {
      if (this.baseInputAmount > this.baseToken.userInfo?.balance)
        return `Insufficient ${this.baseToken.config.name} balance`;

      if (this.quoteInputAmount > this.quoteToken.userInfo?.balance)
        return `Insufficient ${this.quoteToken.config.name} balance`;

      return null;
    },

    buttonText() {
      if (!this.isProperNetwork) return "Switch network";
      if (!this.account) return "Connect wallet";
      if (this.error) return this.error;
      if (this.baseInputValue == "" && this.quoteInputValue == "")
        return `Enter amount`;

      if (this.isActionProcessing) return "Processing...";

      if (!this.isOneSide) return "Deposit";

      if (!this.isBaseTokenApproved)
        return `Approve ${this.baseToken.config.name}`;
      if (!this.isQuoteTokenApproved)
        return `Approve ${this.quoteToken.config.name}`;

      return "Deposit";
    },

    isButtonDisabled() {
      return (
        (!this.isValid || !!this.error || this.isActionProcessing) &&
        this.isProperNetwork &&
        !!this.account
      );
    },

    isProperNetwork() {
      return this.chainId == this.pool.chainId;
    },

    isOneSide() {
      return !this.baseInputAmount || !this.quoteInputAmount;
    },
  },

  watch: {
    slippage() {
      this.calculateExpectedOptimal();
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatUSD,

    clearData() {
      this.baseInputAmount = 0n;
      this.quoteInputAmount = 0n;
      this.baseInputValue = "";
      this.quoteInputValue = "";
      this.expectedOptimal = {
        remainingAmountToSwap: 0n,
        shares: 0n,
        baseRefundAmount: 0n,
        quoteRefundAmount: 0n,
      };
    },

    closePreviewPopup() {
      this.isPreviewPopupOpened = false;
      this.isActionProcessing = false;
      this.transactionStatus = actionStatus.WAITING;
    },

    updateValue(value, fromBase = false) {
      const tokenLabel = fromBase ? "base" : "quote";
      const decimals = fromBase
        ? this.baseToken.config.decimals
        : this.quoteToken.config.decimals;

      if (value === null) {
        this[`${tokenLabel}InputAmount`] = 0n;
        this[`${tokenLabel}InputValue`] = "";
      } else {
        this[`${tokenLabel}InputAmount`] = value;
        this[`${tokenLabel}InputValue`] = trimZeroDecimals(
          formatUnits(value, decimals)
        );
      }

      this.isExpectedOptimalCalculating = true;
      this.calculateExpectedOptimal();
    },

    calculateExpectedOptimal: debounce(
      async function calculateExpectedOptimal() {
        this.expectedOptimal = await addLiquidityImbalancedOptimal(
          this.pool,
          this.baseInputAmount,
          this.quoteInputAmount,
          100n
        );
        this.isExpectedOptimalCalculating = false;
      },
      500
    ),

    createImbalancedPayload() {
      const deadline = moment().unix() + Number(this.deadline);

      const minimumShares = applySlippageToMinOutBigInt(
        this.slippage,
        this.expectedOptimal.shares
      );

      return {
        lp: this.pool.contract.address,
        to: this.account,
        baseInAmount: this.baseInputAmount,
        quoteInAmount: this.quoteInputAmount,
        remainingAmountToSwapIsBase:
          this.expectedOptimal.remainingAmountToSwapIsBase,
        remainingAmountToSwap: this.expectedOptimal.remainingAmountToSwap,
        minimumShares,
        deadline,
      };
    },

    async approveHandler(token, valueToApprove) {
      this.isActionProcessing = true;
      const notificationId = await this.createNotification(
        notification.approvePending
      );

      try {
        await approveTokenViem(
          token.config.contract,
          this.pool.swapRouter,
          valueToApprove
        );
        await this.$emit("updatePoolInfo");

        await this.deleteNotification(notificationId);
      } catch (error) {
        console.log("approve err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
      this.isActionProcessing = false;
    },

    async imbalanceHandler() {
      this.isActionProcessing = true;
      this.transactionStatus = "pending";

      const notificationId = await this.createNotification(
        notification.pending
      );

      try {
        const payload = this.createImbalancedPayload();

        const { error, result } = await addLiquidityImbalanced(
          this.pool?.swapRouter,
          payload
        );

        this.transactionStatus = "success";
        await this.$emit("updatePoolInfo");
        await this.deleteNotification(notificationId);

        await this.createNotification(notification.success);

        this.clearData();
      } catch (error) {
        this.transactionStatus = "error";
        console.log("add liquidity err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
      this.isActionProcessing = false;
    },

    async actionHandler() {
      if (this.isButtonDisabled) return false;
      if (!this.isProperNetwork) return switchNetwork(this.pool.chainId);
      if (!this.account) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      if (!this.isOneSide) {
        this.isPreviewPopupOpened = true;
        return;
      }

      if (!this.isBaseTokenApproved)
        return await this.approveHandler(this.baseToken, this.baseInputAmount);
      if (!this.isQuoteTokenApproved)
        return await this.approveHandler(
          this.quoteToken,
          this.quoteInputAmount
        );

      this.imbalanceHandler();
    },

    formatTokenBalance(value, decimals) {
      return formatTokenBalance(formatUnits(value, decimals));
    },
  },

  components: {
    BaseTokenInput: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenInput.vue")
    ),
    PreviewAddLiquidity: defineAsyncComponent(() =>
      import("@/components/pools/pool/PreviewAddLiquidity.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    IconButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/IconButton.vue")
    ),
    PreviewAddLiquidityPopup: defineAsyncComponent(() =>
      import("@/components/pools/pool/popups/PreviewAddLiquidityPopup.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-action-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.inputs-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.plus-icon {
  position: absolute;
  top: calc(50% - 28px);
  left: calc(50% - 28px);
  width: 46px;
  height: 46px;
}

.apr {
  color: #fff;
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 16px;
  font-weight: 600;
}

.usd-equivalent {
  color: #575c62;
  font-size: 16px;
  font-weight: 400;
}
</style>
