<template>
  <div class="pool-action-block">
    <div class="inputs-wrap">
      <BaseTokenInput
        class="base-input"
        :name="baseToken.config.name"
        :icon="baseToken.config.icon"
        :decimals="baseToken.config.decimals"
        :max="baseToken.userInfo.balance"
        :value="base.inputValue"
        @updateInputValue="updateBaseValue($event)"
      />

      <BaseTokenInput
        class="quote-input"
        :name="quoteToken.config.name"
        :icon="quoteToken.config.icon"
        :decimals="quoteToken.config.decimals"
        :max="quoteToken.userInfo.balance"
        :value="quote.inputValue"
        @updateInputValue="updateQuoteValue($event)"
      />

      <IconButton
        class="plus-icon"
        plus
        active
        :width="44"
        :height="44"
        borderRadius="16px"
      />
    </div>

    <div class="info-blocks">
      <div class="info-block lp">
        <div class="tag">
          <span class="title">{{ this.pool.name }}</span>
          <span class="value">
            <BaseTokenIcon
              :name="this.pool.name"
              :icon="this.pool.icon"
              size="24px"
            />
            {{
              formatTokenBalance(
                previewAddLiquidityResult.shares,
                this.pool.decimals
              )
            }}
          </span>
        </div>

        <div class="tag">
          <span class="title">APR</span>
          <span class="value apr"> 102.21% </span>
        </div>
      </div>

      <div class="info-block swap">
        <div class="tag">
          <span class="title">Current Price</span>
          <CurrentPrice :fromToken="baseToken" :toToken="quoteToken" />
        </div>

        <div class="tag">
          <span class="title">Network Fee</span>

          <span class="value">
            <img class="gas-icon" src="@/assets/images/gas.svg" />
            $0.01
          </span>
        </div>
      </div>
    </div>

    <BaseButton primary @click="actionHandler" :disabled="isButtonDisabled">
      {{ buttonText }}
    </BaseButton>
  </div>
</template>

<script>
import moment from "moment";
import { defineAsyncComponent } from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { formatUnits } from "viem";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification";
import { approveTokenViem } from "@/helpers/approval";
import { trimZeroDecimals } from "@/helpers/numbers";
import { previewAddLiquidity } from "@/helpers/pools/swap/liquidity";
import { addLiquidity } from "@/helpers/pools/swap/actions/addLiquidity";
import { formatTokenBalance } from "@/helpers/filters";
import { applySlippageToMinOutBigInt } from "@/helpers/gm/applySlippageToMinOut";
import { switchNetwork } from "@/helpers/chains/switchNetwork";

export default {
  props: {
    pool: { type: Object },
    slippage: { type: BigInt, default: 100n },
    deadline: { type: BigInt, default: 30n },
  },

  emits: ["updatePoolInfo"],

  data() {
    return {
      base: {
        inputAmount: 0n,
        inputValue: "",
      },

      quote: {
        inputAmount: 0n,
        inputValue: "",
      },

      isActionProcessing: false,
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

    isBaseAllowed() {
      return this.baseToken.userInfo.allowance >= this.base.inputAmount;
    },
    isQuoteAllowed() {
      return this.quoteToken.userInfo.allowance >= this.quote.inputAmount;
    },

    previewAddLiquidityResult() {
      const previewAddLiquidityResult = previewAddLiquidity(
        this.base.inputAmount,
        this.quote.inputAmount,
        this.pool
      );

      previewAddLiquidityResult.shares = applySlippageToMinOutBigInt(
        this.slippage,
        previewAddLiquidityResult.shares
      );

      return previewAddLiquidityResult;
    },

    isValid() {
      return !!this.base.inputAmount && !!this.quote.inputAmount;
    },

    error() {
      if (this.base.inputAmount > this.baseToken.userInfo?.balance)
        return "Insufficient base token balance";

      if (this.quote.inputAmount > this.quoteToken.userInfo?.balance)
        return "Insufficient quote token balance";

      return null;
    },

    buttonText() {
      if (!this.isProperNetwork) return "Switch network";
      if (!this.account) return "Connect wallet";
      if (this.error) return this.error;
      if (this.base.inputValue == "")
        return `Enter ${this.baseToken.config.name} token amount`;
      if (this.quote.inputValue == "")
        return `Enter ${this.quoteToken.config.name} token amount`;

      if (this.isActionProcessing) return "Processing...";
      if (!this.isBaseAllowed) return "Approve base token";
      if (!this.isQuoteAllowed) return "Approve quote token";

      return "Deposit";
    },

    isButtonDisabled() {
      return (
        (!this.isValid ||
          !!this.error ||
          this.isActionProcessing ||
          !this.account) &&
        this.isProperNetwork
      );
    },

    isProperNetwork() {
      return this.chainId == this.pool.chainId;
    },
  },

  watch: {
    async pool() {},

    base: {
      deep: true,
      handler(value) {
        if (value.inputAmount == 0) {
          this.base.inputValue = "";
          return false;
        }

        this.base.inputValue = trimZeroDecimals(
          formatUnits(value.inputAmount, this.baseToken.config.decimals)
        );
      },
    },

    quote: {
      deep: true,
      handler(value) {
        if (value.inputAmount == 0) {
          this.quote.inputValue = "";
          return false;
        }

        this.quote.inputValue = trimZeroDecimals(
          formatUnits(value.inputAmount, this.quoteToken.config.decimals)
        );
      },
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    updateBaseValue(value) {
      if (value === null) return (this.base.inputAmount = 0n);
      this.base.inputAmount = value;
      this.quote.inputAmount =
        (value * this.pool.midPrice) / this.pool.tokens.ratePrecision;
    },

    updateQuoteValue(value) {
      if (value === null) return (this.quote.inputAmount = 0n);
      this.quote.inputAmount = value;
      this.base.inputAmount =
        (value * this.pool.tokens.ratePrecision) / this.pool.midPrice;
    },

    resetInputs() {
      this.base.inputValue = "";
      this.base.inputAmount = 0n;
      this.quote.inputValue = "";
      this.quote.inputAmount = 0n;
    },

    createDepositPayload() {
      const { baseAdjustedInAmount, quoteAdjustedInAmount, shares } =
        this.previewAddLiquidityResult;
      const deadline = moment().unix() + Number(this.deadline);

      return {
        lp: this.pool?.contract?.address,
        to: this.account,
        baseInAmount: baseAdjustedInAmount,
        quoteInAmount: quoteAdjustedInAmount,
        minimumShares: shares,
        deadline,
      };
    },

    async approveHandler(token) {
      const notificationId = await this.createNotification(
        notification.approvePending
      );

      try {
        await approveTokenViem(token.contract, this.pool.swapRouter);
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
    },

    async depositHandler() {
      const notificationId = await this.createNotification(
        notification.pending
      );

      try {
        const payload = this.createDepositPayload();

        const { error, result } = await addLiquidity(
          this.pool?.swapRouter,
          payload
        );

        await this.$emit("updatePoolInfo");

        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
        this.resetInputs();
      } catch (error) {
        console.log("add liquidity err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
    },

    async actionHandler() {
      if (this.isButtonDisabled) return false;
      if (!this.isProperNetwork) return switchNetwork(this.pool.chainId);
      if (!this.account) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      this.isActionProcessing = true;
      if (!this.isBaseAllowed) await this.approveHandler(this.baseToken.config);
      if (!this.isQuoteAllowed)
        await this.approveHandler(this.quoteToken.config);

      await this.depositHandler();

      await this.$emit("updatePoolInfo");

      this.isActionProcessing = false;
    },

    formatTokenBalance(value, decimals) {
      return formatTokenBalance(formatUnits(value, decimals));
    },
  },

  components: {
    BaseTokenInput: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenInput.vue")
    ),
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    IconButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/IconButton.vue")
    ),
    CurrentPrice: defineAsyncComponent(() =>
      import("@/components/pools/CurrentPrice.vue")
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
  border-radius: 20px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  padding: 24px;
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

.info-blocks {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.tag {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  color: #878b93;
  font-size: 16px;
  font-weight: 500;
}

.value {
  display: flex;
  align-items: center;
  gap: 4px;
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
