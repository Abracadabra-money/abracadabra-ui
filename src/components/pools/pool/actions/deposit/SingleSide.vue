<template>
  <div class="pool-action-block">
    <div class="inputs-wrap">
      <BaseTokenInput
        :name="activeToken.config.name"
        :icon="activeToken.config.icon"
        :decimals="activeToken.config.decimals"
        :max="activeToken.userInfo.balance"
        :value="inputValue"
        :tokenPrice="activeToken.price"
        allowSelectToken
        @onSelectClick="isDropdownOpened = !isDropdownOpened"
        @updateInputValue="updateInput($event)"
      />

      <SingleTokenDropdown
        v-if="isDropdownOpened"
        :activeToken="activeToken"
        :tokensList="[this.pool.tokens.baseToken, this.pool.tokens.quoteToken]"
        @chooseActiveToken="chooseActiveToken($event)"
        @closeDropdown="isDropdownOpened = false"
      />
    </div>

    <div class="info-blocks">
      <div class="info-block lp">
        <div class="tag">
          <span class="title">
            <BaseTokenIcon
              :name="this.pool.name"
              :icon="this.pool.icon"
              size="24px"
            />
            {{ this.pool.name }}
          </span>
          <div class="token-amount">
            <span class="value">
              {{ formattedLpTokenExpected.value }}
            </span>
            <span class="usd">
              {{ formattedLpTokenExpected.usd }}
            </span>
          </div>
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
import { formatUnits, parseUnits } from "viem";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification";
import { approveTokenViem } from "@/helpers/approval";
import { trimZeroDecimals } from "@/helpers/numbers";
import { addLiquidity } from "@/helpers/pools/swap/actions/addLiquidity";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { applySlippageToMinOutBigInt } from "@/helpers/gm/applySlippageToMinOut";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { actionStatus } from "@/components/pools/pool/PoolActionBlock.vue";

//
import { addLiquidityOneSideOptimal } from "@/helpers/pools/pool/addLiquidityOneSide";
import { addLiquidityOneSide } from "@/helpers/pools/pool/actions/addLiquidityOneSide";

export default {
  props: {
    pool: { type: Object },
    slippage: { type: BigInt, default: 100n },
    deadline: { type: BigInt, default: 100n },
  },

  emits: ["updatePoolInfo"],

  data() {
    return {
      inputAmount: 0n,
      inputValue: "",
      expectedOptimal: { inAmountToSwap: 0n, shares: 0n },
      isExpectedOptimalCalculating: false,
      isBase: true,
      isActionProcessing: false,
      transactionStatus: actionStatus.WAITING,
      isPreviewPopupOpened: false,
      isDropdownOpened: false,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

    activeToken() {
      return this.isBase
        ? this.pool.tokens.baseToken
        : this.pool.tokens.quoteToken;
    },

    isValid() {
      return !!this.inputAmount && !!this.inputAmount;
    },

    error() {
      if (this.inputAmount > this.activeToken.userInfo?.balance)
        return `Insufficient ${this.activeToken.config.name} balance`;
      return null;
    },

    buttonText() {
      if (!this.isProperNetwork) return "Switch network";
      if (!this.account) return "Connect wallet";
      if (this.error) return this.error;
      if (this.inputValue == "") return `Enter amount`;

      if (this.isExpectedOptimalCalculating) return "Calculating...";
      if (this.isActionProcessing) return "Processing...";

      return "Deposit";
    },

    isButtonDisabled() {
      return (
        (!this.isValid ||
          !!this.error ||
          this.isActionProcessing ||
          this.isExpectedOptimalCalculating) &&
        this.isProperNetwork &&
        !!this.account
      );
    },

    isProperNetwork() {
      return this.chainId == this.pool.chainId;
    },

    formattedLpTokenExpected() {
      if (this.isExpectedOptimalCalculating) return { value: "-", usd: "-" };
      const formattedLpTokenValue = Number(
        formatUnits(this.expectedOptimal.shares, this.pool.decimals)
      );
      const lpTokenValueUsdEquivalent = formattedLpTokenValue * this.pool.price;

      return {
        value: formatTokenBalance(formattedLpTokenValue),
        usd: formatUSD(lpTokenValueUsdEquivalent),
      };
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatUSD,

    clearData() {
      this.inputAmount = 0n;
      this.inputValue = "";
    },

    updateInput(value) {
      if (value === null) {
        this.clearData();
        return false;
      }

      this.inputAmount = value;
      this.inputValue = trimZeroDecimals(
        formatUnits(value, this.activeToken.config.decimals)
      );

      this.calculateExpectedOptimal();
    },

    async calculateExpectedOptimal() {
      this.isExpectedOptimalCalculating = true;

      this.expectedOptimal = await addLiquidityOneSideOptimal(
        this.account,
        this.chainId,
        this.pool.contract.address,
        this.inputAmount,
        this.isBase,
        //default step 100n == 1%
        100n
      );

      this.isExpectedOptimalCalculating = false;
    },

    createAddLiquidityOneSidePayload() {
      const deadline = moment().unix() + Number(this.deadline);

      const minimumShares = applySlippageToMinOutBigInt(
        this.slippage,
        this.expectedOptimal.shares
      );

      return {
        lp: this.pool.contract.address,
        to: this.account,
        inAmountIsBase: this.isBase,
        inAmount: this.inputAmount,
        inAmountToSwap: this.expectedOptimal.inAmountToSwap,
        minimumShares,
        deadline,
      };
    },

    chooseActiveToken(isBase) {
      this.clearData();
      this.isBase = isBase;
    },

    async approveHandler(token) {
      this.isActionProcessing = true;
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
      this.isActionProcessing = false;
    },

    async depositOneSideHandler() {
      this.isActionProcessing = true;
      this.transactionStatus = "pending";
      const notificationId = await this.createNotification(
        notification.pending
      );

      try {
        const payload = this.createAddLiquidityOneSidePayload();
        const { error, result } = await addLiquidityOneSide(
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

      this.depositOneSideHandler();
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
    SingleTokenDropdown: defineAsyncComponent(() =>
      import("@/components/pools/pool/SingleTokenDropdown.vue")
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

.token-amount {
  display: flex;
  flex-direction: column;
  align-items: end;
}

.value {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.value,
.title {
  display: flex;
  align-items: center;
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
