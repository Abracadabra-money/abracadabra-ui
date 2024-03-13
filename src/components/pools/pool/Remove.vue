<template>
  <div class="pool-action-block">
    <div class="inputs-wrap">
      <BaseTokenInput
        :name="pool.name"
        :icon="pool.icon"
        :decimals="pool.decimals"
        :max="pool.userInfo.balance"
        :value="inputValue"
        @updateInputValue="updateValue($event)"
      />
    </div>

    <div class="info-blocks">
      <div class="info-block base">
        <div class="tag">
          <span class="title">
            {{ this.pool.tokens.baseToken.config.name }}
          </span>
          <span class="value">
            <BaseTokenIcon
              :name="this.pool.tokens.baseToken.config.name"
              :icon="this.pool.tokens.baseToken.config.icon"
              size="24px"
            />
            {{
              formatTokenBalance(
                previewRemoveLiquidityResult.baseAmountOut,
                this.pool.tokens.baseToken.config.decimals
              )
            }}
          </span>
        </div>

        <div class="tag">
          <span class="title">
            {{ this.pool.tokens.quoteToken.config.name }}
          </span>
          <span class="value">
            <BaseTokenIcon
              :name="this.pool.tokens.quoteToken.config.name"
              :icon="this.pool.tokens.quoteToken.config.icon"
              size="24px"
            />
            {{
              formatTokenBalance(
                previewRemoveLiquidityResult.quoteAmountOut,
                this.pool.tokens.quoteToken.decimals
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
          <span class="value">
            <img
              class="switch-chain-image"
              src="@/assets/images/beam/switch-button.svg"
              alt="Switch network"
            />
            1 MIM = 1,636.39 USDT
            <span class="usd-equivalent"> ($1,687.87) </span>
          </span>
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
import { previewRemoveLiquidity } from "@/helpers/pools/swap/liquidity";
import { applySlippageToMinOutBigInt } from "@/helpers/gm/applySlippageToMinOut";
import { removeLiquidity } from "@/helpers/pools/swap/actions/removeLiquidity";
import { formatTokenBalance } from "@/helpers/filters";

export default {
  props: {
    pool: { type: Object },
    slippage: { type: BigInt, default: 100n },
    deadline: { type: BigInt, default: 30n },
  },

  emits: ["updatePoolInfo"],

  data() {
    return {
      inputAmount: 0n,
      inputValue: "",
      isActionProcessing: false,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

    isAllowed() {
      return this.pool.userInfo.allowance >= this.inputAmount;
    },

    previewRemoveLiquidityResult() {
      const previewRemoveLiquidityResult = previewRemoveLiquidity(
        this.inputAmount,
        this.pool
      );

      previewRemoveLiquidityResult.baseAmountOut = applySlippageToMinOutBigInt(
        this.slippage,
        previewRemoveLiquidityResult.baseAmountOut
      );

      previewRemoveLiquidityResult.quoteAmountOut = applySlippageToMinOutBigInt(
        this.slippage,
        previewRemoveLiquidityResult.quoteAmountOut
      );

      return previewRemoveLiquidityResult;
    },

    isValid() {
      return !!this.inputAmount;
    },

    error() {
      if (this.inputAmount > this.pool.userInfo.balance)
        return "Insufficient balance";

      return null;
    },

    buttonText() {
      if (!this.isProperNetwork) return "Switch network";
      if (!this.account) return "Connect wallet";
      if (this.error) return this.error;
      if (this.inputValue == "") return "Enter amount";

      if (this.isActionProcessing) return "Processing...";
      if (!this.isAllowed) return "Approve";

      return "Remove";
    },

    isButtonDisabled() {
      return (
        !this.isValid ||
        !!this.error ||
        this.isActionProcessing ||
        !this.account ||
        !this.isProperNetwork
      );
    },

    isProperNetwork() {
      return this.chainId == 168587773;
    },
  },

  watch: {
    inputAmount(value) {
      if (value == 0) {
        this.inputValue = "";
        return false;
      }

      this.inputValue = trimZeroDecimals(formatUnits(value, 18));
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    updateValue(value) {
      if (value === null) return (this.inputAmount = 0n);
      this.inputAmount = value;
    },

    resetInput() {
      this.inputValue = "";
      this.inputAmount = 0n;
    },

    createRemovePayload() {
      const { baseAmountOut, quoteAmountOut } =
        this.previewRemoveLiquidityResult;

      const deadline = moment().unix() + Number(this.deadline);

      return {
        lp: this.pool.contract.address,
        to: this.account,
        sharesIn: this.inputAmount,
        minimumBaseAmount: baseAmountOut,
        minimumQuoteAmount: quoteAmountOut,
        deadline: deadline,
      };
    },

    async approveHandler() {
      const notificationId = await this.createNotification(
        notification.approvePending
      );

      try {
        await approveTokenViem(this.pool.contract, this.pool.swapRouter);
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

    async removeHandler() {
      const notificationId = await this.createNotification(
        notification.pending
      );

      try {
        const payload = this.createRemovePayload();

        const { error, result } = await removeLiquidity(
          this.pool.swapRouter,
          payload
        );

        await this.$emit("updatePoolInfo");

        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
        this.resetInput();
      } catch (error) {
        console.log("remove liquidity err:", error);

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
      if (!this.account) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      this.isActionProcessing = true;

      if (!this.isAllowed) await this.approveHandler();

      await this.removeHandler();

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
