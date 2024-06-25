<template>
  <div class="popup-header">
    <h3 class="title">Unstake your MLP</h3>
    <div class="step">Step 1</div>
  </div>

  <p class="sub-title">
    Lock your MagicLP for 3 months to obtain the Founder Boost, a permanent
    reward boost exclusive to Phase 3.
  </p>

  <div class="popup-content">
    <div class="mlp-info">
      <div class="mlp-icon-wrap">
        <img clas="mlp-icon" src="@/assets/images/tokens/MIM-USDB.png" alt="" />
        <span>MLP</span>
      </div>

      <div class="balance-wrap">
        <div class="mlp-balance">
          {{ formatTokenBalance(parseAvailableAmount) }}
        </div>
        <div class="mlp-balance-usd">{{ availableAmountUsd }}</div>
      </div>
    </div>

    <div class="line"></div>

    <div class="row">
      <div class="token-info">
        <img class="token-icon" :src="baseToken.icon" :alt="baseToken.name" />
        <span class="token-name"> {{ baseToken.name }}</span>
      </div>
      <div class="token-balance">{{ formattedTokenExpecteds.base.value }}</div>
    </div>

    <div class="row">
      <div class="token-info">
        <img class="token-icon" :src="quoteToken.icon" :alt="quoteToken.name" />
        <span class="token-name"> {{ quoteToken.name }}</span>
      </div>
      <div class="token-balance">{{ formattedTokenExpecteds.quote.value }}</div>
    </div>
  </div>

  <BaseButton :disabled="isActionProcessing" @click="unstakeHandler" primary>{{
    buttonText
  }}</BaseButton>
</template>

<script lang="ts">
import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import { formatUnits } from "viem";
import { useImage } from "@/helpers/useImage";
import { mapActions, mapMutations } from "vuex";
import { defineAsyncComponent, type PropType } from "vue";
import notification from "@/helpers/notification/notification";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { previewRemoveLiquidity } from "@/helpers/pools/swap/liquidity";
import { notificationErrorMsg } from "@/helpers/notification/notificationError";
import { applySlippageToMinOutBigInt } from "@/helpers/gm/applySlippageToMinOut";

export default {
  emits: ["changeSteap", "updateInfo"],

  props: {
    poolInfo: {
      type: Object as PropType<any>,
      required: true,
    },
    userInfo: {
      type: Object as PropType<any>,
      required: true,
    },
  },

  data() {
    return {
      slippage: 100n,
      isActionProcessing: false,
    };
  },

  computed: {
    previewRemoveLiquidityResult() {
      if (!this.poolInfo || !this.userInfo)
        return { baseAmountOut: 0n, quoteAmountOut: 0n };

      const previewRemoveLiquidityResult = previewRemoveLiquidity(
        this.userInfo.balances.unlocked,
        this.poolInfo
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

    parseAvailableAmount() {
      return formatUnits(
        this.userInfo.balances.unlocked,
        this.poolInfo.decimals || 18
      );
    },

    availableAmountUsd() {
      if (!this.poolInfo) return formatUSD(0);
      return formatUSD(Number(this.parseAvailableAmount) * this.poolInfo.price);
    },

    baseToken() {
      if (!this.poolInfo)
        return { name: "MIM", icon: useImage("assets/images/tokens/MIM.png") };

      return {
        name: this.poolInfo.tokens.baseToken.config.name,
        icon: this.poolInfo.tokens.baseToken.config.icon,
      };
    },

    quoteToken() {
      if (!this.poolInfo)
        return {
          name: "USDB",
          icon: useImage("assets/images/tokens/USDB.png"),
        };

      return {
        name: this.poolInfo.tokens.quoteToken.config.name,
        icon: this.poolInfo.tokens.quoteToken.config.icon,
      };
    },

    formattedTokenExpecteds() {
      if (!this.previewRemoveLiquidityResult || !this.poolInfo)
        return {
          base: { value: "0.0", usd: "$ 0.0" },
          quote: { value: "0.0", usd: "$ 0.0" },
        };

      const formattedBaseValue = Number(
        formatUnits(
          this.previewRemoveLiquidityResult.baseAmountOut,
          this.poolInfo.tokens.baseToken.config.decimals
        )
      );
      const formattedQuoteValue = Number(
        formatUnits(
          this.previewRemoveLiquidityResult.quoteAmountOut,
          this.poolInfo.tokens.quoteToken.config.decimals
        )
      );

      const baseValueUsdEquivalent =
        formattedBaseValue * this.poolInfo.tokens.baseToken.price;
      const quoteValueUsdEquivalent =
        formattedQuoteValue * this.poolInfo.tokens.quoteToken.price;

      return {
        base: {
          value: formatTokenBalance(formattedBaseValue),
          usd: formatUSD(baseValueUsdEquivalent),
        },
        quote: {
          value: formatTokenBalance(formattedQuoteValue),
          usd: formatUSD(quoteValueUsdEquivalent),
        },
      };
    },

    buttonText() {
      if (this.isActionProcessing) return "Processing...";
      return "Unstake ";
    },
  },

  methods: {
    formatTokenBalance,

    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    async unstakeHandler() {
      this.isActionProcessing = true;
      const notificationId = await this.createNotification(
        notification.pending
      );

      try {
        const { request } = await simulateContractHelper({
          address: this.poolInfo.lockContract.address,
          abi: this.poolInfo.lockContract.abi,
          functionName: "withdraw",
          args: [this.userInfo.balances.unlocked],
        });

        const hash = await writeContractHelper(request);

        await waitForTransactionReceiptHelper({
          hash,
        });

        this.$emit("updateInfo");

        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);

        this.$emit("changeSteap", 4);
      } catch (error) {
        console.log("unstake lp err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }

      this.isActionProcessing = false;
    },
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 24px;
  font-weight: 500;
  line-height: normal;
}

.step {
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  color: #878b93;
}

.sub-title {
  font-weight: 500;
  line-height: normal;
}

.popup-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.mlp-info {
  width: 100%;
  gap: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mlp-icon-wrap {
  gap: 8px;
  display: flex;
  align-items: center;
}

.mlp-icon {
  width: 28px;
  height: 28px;
}

.balance-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.mlp-balance {
  font-weight: 500;
  line-height: normal;
}

.mlp-balance-usd {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
}

.line {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.12) 50.5%,
    rgba(255, 255, 255, 0) 100%
  );
}

.row {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.token-info {
  gap: 8px;
  display: flex;
  align-items: center;
}

.token-icon {
  width: 24px;
  height: 24px;
}

.token-name {
  color: #878b93;
  font-weight: 400;
  line-height: normal;
}

.token-balance {
  color: #878b93;
  font-weight: 500;
  line-height: normal;
}
</style>
