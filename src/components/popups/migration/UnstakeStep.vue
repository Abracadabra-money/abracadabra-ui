<template>
  <div class="popup-header">
    <svg
      class="back-button"
      @click="$emit('changeSteap', 2)"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M11.0302 4.71945C11.1 4.7891 11.1553 4.87182 11.193 4.96287C11.2308 5.05392 11.2502 5.15151 11.2502 5.25007C11.2502 5.34863 11.2308 5.44623 11.193 5.53728C11.1553 5.62833 11.1 5.71104 11.0302 5.7807L5.55993 11.2501L20.2496 11.2501C20.4485 11.2501 20.6393 11.3291 20.7799 11.4697C20.9206 11.6104 20.9996 11.8012 20.9996 12.0001C20.9996 12.199 20.9206 12.3897 20.7799 12.5304C20.6393 12.6711 20.4485 12.7501 20.2496 12.7501L5.55993 12.7501L11.0302 18.2194C11.171 18.3602 11.25 18.551 11.25 18.7501C11.25 18.9491 11.171 19.14 11.0302 19.2807C10.8895 19.4214 10.6986 19.5005 10.4996 19.5005C10.3006 19.5005 10.1097 19.4214 9.96899 19.2807L3.21899 12.5307C3.14926 12.461 3.09394 12.3783 3.05619 12.2873C3.01845 12.1962 2.99902 12.0986 2.99902 12.0001C2.99902 11.9015 3.01845 11.8039 3.05619 11.7129C3.09394 11.6218 3.14926 11.5391 3.21899 11.4694L9.96899 4.71945C10.0386 4.64971 10.1214 4.59439 10.2124 4.55665C10.3035 4.51891 10.4011 4.49948 10.4996 4.49948C10.5982 4.49948 10.6958 4.51891 10.7868 4.55665C10.8779 4.59439 10.9606 4.64971 11.0302 4.71945Z"
        fill="white"
      />
    </svg>

    <h3 class="title">Step 2: Unstake your MLP</h3>
  </div>

  <Steps :step="2" />

  <p class="subtitle">
    Unstake your staked MLP to prepare for the tokens migration to Arbitrum
  </p>

  <div class="popup-content">
    <div class="mlp-info">
      <div class="mlp-icon-wrap">
        <img
          class="mlp-icon"
          src="@/assets/images/tokens/MIM-USDB.png"
          alt=""
        />
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
      return "Unstake MLP";
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
    Steps: defineAsyncComponent(
      () => import("@/components/popups/migration/Steps.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.popup-header {
  gap: 4px;
  display: flex;
  align-items: center;
}

.back-button {
  cursor: pointer;
}

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

@media screen and (max-width: 600px) {
  .title {
    font-size: 18px;
  }

  .subtitle {
    font-size: 14px;
  }
}
</style>
