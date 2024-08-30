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

    <h3 class="title">Step 3: Migrate to Arbitrum</h3>
  </div>

  <Steps :step="3" />

  <p class="subtitle">
    Migrate your MLP Tokens to Arbitrum, and receive MIM and USDT to join the
    ARB MIMswap incentive campaign and be eligible for future SPELL rewards
  </p>

  <div class="popup-content">
    <div class="migrate-wrap">
      <div>
        <div class="chain-wrap" :class="{ active: isActionProcessing }">
          <img
            class="chain-icon"
            src="@/assets/images/blastLpMigration/blast-icon.png"
            alt=""
          />
        </div>
        <div
          :class="['from-address', { 'address-active': isActionProcessing }]"
        >
          Blast L2
        </div>
      </div>

      <img
        v-show="isActionProcessing"
        class="anim"
        src="@/assets/images/blastLpMigration/animation.gif"
        alt=""
      />

      <div>
        <div class="chain-wrap">
          <img
            class="chain-icon"
            src="@/assets/images/blastLpMigration/arbitrum-icon.png"
            alt=""
          />
        </div>
        <div class="to-address">Arbitrum</div>
      </div>
    </div>

    <div class="tokens-info-wrap">
      <p class="tokens-info-title">Your tokens will be migrated as follows</p>

      <div class="row">
        <div class="token-info">
          <img class="token-icon" :src="baseToken.icon" :alt="baseToken.name" />
          <span class="token-amount">
            {{ formattedTokenExpecteds.base.value }}</span
          >
        </div>

        <div class="dotted-line-wrap">
          <div class="dotted-line"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="15"
            viewBox="0 0 5 8"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M1.25394 0.446251L4.43592 3.62823C4.63119 3.82349 4.63119 4.14008 4.43592 4.33534L1.25394 7.51732C1.05868 7.71258 0.742099 7.71258 0.546837 7.51732C0.351575 7.32206 0.351575 7.00547 0.546837 6.81021L3.08237 4.27468V3.68889L0.546837 1.15336C0.351575 0.958096 0.351575 0.641514 0.546837 0.446251C0.742099 0.250989 1.05868 0.250989 1.25394 0.446251ZM3.33237 3.93889V4.02468L3.37526 3.98179L3.33237 3.93889Z"
              fill="#7088CC"
            />
          </svg>
        </div>

        <div class="token-info">
          <img class="token-icon" :src="baseToken.icon" :alt="baseToken.name" />
          <span class="token-amount">
            {{ formattedTokenExpecteds.base.value }}</span
          >
        </div>
      </div>

      <div class="row">
        <div class="token-info">
          <img
            class="token-icon"
            :src="quoteToken.fromIcon"
            :alt="quoteToken.name"
          />
          <span class="token-amount">
            {{ formattedTokenExpecteds.quote.value }}</span
          >
        </div>

        <div class="dotted-line-wrap">
          <div class="dotted-line"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="15"
            viewBox="0 0 5 8"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M1.25394 0.446251L4.43592 3.62823C4.63119 3.82349 4.63119 4.14008 4.43592 4.33534L1.25394 7.51732C1.05868 7.71258 0.742099 7.71258 0.546837 7.51732C0.351575 7.32206 0.351575 7.00547 0.546837 6.81021L3.08237 4.27468V3.68889L0.546837 1.15336C0.351575 0.958096 0.351575 0.641514 0.546837 0.446251C0.742099 0.250989 1.05868 0.250989 1.25394 0.446251ZM3.33237 3.93889V4.02468L3.37526 3.98179L3.33237 3.93889Z"
              fill="#7088CC"
            />
          </svg>
        </div>

        <div class="token-info">
          <img
            class="token-icon"
            :src="quoteToken.toIcon"
            :alt="quoteToken.name"
          />
          <span class="token-amount">
            {{ formattedTokenExpecteds.quote.value }}</span
          >
        </div>
      </div>
    </div>
  </div>

  <div class="warning" v-if="isDisabledButton">
    <svg
      class="warning-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M29.6004 23.5113L18.6691 4.52758C18.396 4.06249 18.006 3.67686 17.5379 3.40891C17.0698 3.14096 16.5397 3 16.0004 3C15.461 3 14.931 3.14096 14.4629 3.40891C13.9947 3.67686 13.6048 4.06249 13.3316 4.52758L2.40036 23.5113C2.13753 23.9612 1.99902 24.4728 1.99902 24.9938C1.99902 25.5148 2.13753 26.0265 2.40036 26.4763C2.67003 26.9442 3.05933 27.332 3.52832 27.5997C3.9973 27.8675 4.52909 28.0057 5.06911 28.0001H26.9316C27.4712 28.0052 28.0025 27.8669 28.471 27.5991C28.9395 27.3314 29.3284 26.9439 29.5979 26.4763C29.8611 26.0267 30 25.5152 30.0005 24.9942C30.0009 24.4732 29.8628 23.9614 29.6004 23.5113ZM27.8666 25.4751C27.7713 25.6376 27.6345 25.7719 27.4702 25.8642C27.3059 25.9564 27.12 26.0033 26.9316 26.0001H5.06911C4.88071 26.0033 4.69483 25.9564 4.53053 25.8642C4.36622 25.7719 4.22941 25.6376 4.13411 25.4751C4.04779 25.3289 4.00226 25.1623 4.00226 24.9926C4.00226 24.8228 4.04779 24.6562 4.13411 24.5101L15.0654 5.52633C15.1626 5.36455 15.3 5.23068 15.4643 5.13774C15.6286 5.04479 15.8141 4.99595 16.0029 4.99595C16.1916 4.99595 16.3771 5.04479 16.5414 5.13774C16.7057 5.23068 16.8431 5.36455 16.9404 5.52633L27.8716 24.5101C27.9572 24.6567 28.0018 24.8235 28.001 24.9933C28.0001 25.163 27.9537 25.3294 27.8666 25.4751ZM15.0004 18.0001V13.0001C15.0004 12.7349 15.1057 12.4805 15.2933 12.293C15.4808 12.1054 15.7351 12.0001 16.0004 12.0001C16.2656 12.0001 16.5199 12.1054 16.7075 12.293C16.895 12.4805 17.0004 12.7349 17.0004 13.0001V18.0001C17.0004 18.2653 16.895 18.5197 16.7075 18.7072C16.5199 18.8947 16.2656 19.0001 16.0004 19.0001C15.7351 19.0001 15.4808 18.8947 15.2933 18.7072C15.1057 18.5197 15.0004 18.2653 15.0004 18.0001ZM17.5004 22.5001C17.5004 22.7968 17.4124 23.0868 17.2476 23.3334C17.0827 23.5801 16.8485 23.7724 16.5744 23.8859C16.3003 23.9994 15.9987 24.0291 15.7077 23.9713C15.4168 23.9134 15.1495 23.7705 14.9397 23.5607C14.7299 23.351 14.5871 23.0837 14.5292 22.7927C14.4713 22.5017 14.501 22.2001 14.6145 21.9261C14.7281 21.652 14.9203 21.4177 15.167 21.2529C15.4137 21.0881 15.7037 21.0001 16.0004 21.0001C16.3982 21.0001 16.7797 21.1581 17.061 21.4394C17.3423 21.7207 17.5004 22.1023 17.5004 22.5001Z"
        fill="#FED84F"
      />
    </svg>

    <div>
      USDT funds on Arbitrum have depleted. A new Top up is coming soon, thank
      you for your patience
    </div>
  </div>

  <div class="btn-wrap">
    <BaseButton
      :disabled="isActionProcessing || isDisabledButton"
      @click="actionHandler"
      primary
      >{{ buttonText }}</BaseButton
    >

    <p class="caption">
      <span class="caption-text">Powered By</span
      ><img
        class="caption-icon"
        src="@/assets/images/beam/layer-zero.svg"
        alt=""
      />
    </p>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { useImage } from "@/helpers/useImage";
import { approveTokenViem } from "@/helpers/approval";
import { defineAsyncComponent, type PropType } from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import notification from "@/helpers/notification/notification";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { getMessagesBySrcTxHash } from "@layerzerolabs/scan-client";
import { BLAST_BRIDGE_ADDRESS } from "@/constants/blastLpMigration";
import { previewRemoveLiquidity } from "@/helpers/pools/swap/liquidity";
import { notificationErrorMsg } from "@/helpers/notification/notificationError";
import { applySlippageToMinOutBigInt } from "@/helpers/gm/applySlippageToMinOut";
import { bridgeWithProofs } from "@/helpers/blastLpMigration/actions/bridgeWithProofs";

const BLAST_LZ_CHAIN_ID = 243;

export default {
  emits: ["changeSteap", "updateAmounts", "updatelzTxInfo"],

  props: {
    userInfo: {
      type: Object as any,
      required: true,
    },
    poolInfo: {
      type: Object as PropType<any>,
      required: true,
    },
    availableAmount: {
      default: 0n,
    },
    arbBridgeBalanceUsdt: {
      default: 0n,
    },
  },

  data() {
    return {
      slippage: 100n,
      usePermit: true,
      isActionProcessing: false,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

    amountToMigrate() {
      const balance = this.userInfo.balance;

      if (balance < this.availableAmount) return balance;
      return this.availableAmount;
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
      return {
        name: "USDT",
        toIcon: useImage("assets/images/tokens/USDT.png"),
        fromIcon: useImage("assets/images/tokens/USDB.png"),
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
      if (this.isDisabledButton) return "Pending Top Up";
      if (!this.usePermit && !this.isLpApprove) return "Approve";
      if (this.isActionProcessing) return "Processing...";
      return "Sign Transaction and Migrate";
    },

    previewRemoveLiquidityResult() {
      if (!this.poolInfo || !this.userInfo)
        return { baseAmountOut: 0n, quoteAmountOut: 0n };

      const previewRemoveLiquidityResult = previewRemoveLiquidity(
        this.amountToMigrate,
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

    isLpApprove() {
      return this.amountToMigrate <= this.userInfo.allowance;
    },

    isDisabledButton() {
      const arbBridgeBalanceUsdt = Number(
        formatUnits((this.arbBridgeBalanceUsdt / 100n) * 90n, 6)
      );

      const usdbAmountToMigrate = Number(
        formatUnits(this.previewRemoveLiquidityResult.quoteAmountOut, 18)
      );

      return usdbAmountToMigrate > arbBridgeBalanceUsdt;
    },
  },

  methods: {
    formatTokenBalance,

    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    async actionHandler() {
      if (!this.usePermit && !this.isLpApprove) {
        await this.approveAction();
      } else {
        await this.bridgeAction();
      }
    },

    async approveAction() {
      const notificationId = await this.createNotification(
        notification.approvePending
      );

      try {
        this.isLpApprove = await approveTokenViem(
          this.poolInfo.contract,
          BLAST_BRIDGE_ADDRESS
        );

        await this.deleteNotification(notificationId);
      } catch (error) {
        console.log("Approve Error:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
    },

    async bridgeAction() {
      if (this.isDisabledButton) {
        const errorNotification = {
          msg: "Pending Top Up",
          type: "error",
        };

        await this.createNotification(errorNotification);
        return;
      }

      this.isActionProcessing = true;

      const notificationId = await this.createNotification(
        notification.pending
      );

      this.$emit("updateAmounts", {
        MIMAmount: this.previewRemoveLiquidityResult.baseAmountOut,
        USDBAmount: this.previewRemoveLiquidityResult.quoteAmountOut,
      });

      const payload = {
        lpAmount: this.amountToMigrate,
        minMIMAmount: this.previewRemoveLiquidityResult.baseAmountOut,
        minUSDBAmount: this.previewRemoveLiquidityResult.quoteAmountOut,
      };

      const { initialized } = this.userInfo.amountAllowed;

      try {
        const hash = await bridgeWithProofs(
          this.account,
          payload,
          this.usePermit,
          initialized
        );

        if (!hash) {
          const errorNotification = {
            msg: "user rejected transaction",
            type: "error",
          };

          await this.deleteNotification(notificationId);
          await this.createNotification(errorNotification);
          this.isActionProcessing = false;

          return;
        }

        const lzTxInfo = await this.waitTxDelivered(hash);

        this.$emit("updatelzTxInfo", lzTxInfo);

        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);

        this.$emit("changeSteap", 5);

        // HERE: handle the hash - watch lz tx
      } catch (error: any) {
        // Add notification
        if (error.message === "Permit: something went wrong!") {
          this.usePermit = false;

          const errorNotification = {
            msg: "Permit: something went wrong! Please approve.",
            type: "error",
          };

          await this.deleteNotification(notificationId);
          await this.createNotification(errorNotification);
        } else {
          const errorNotification = {
            msg: await notificationErrorMsg(error),
            type: "error",
          };

          await this.deleteNotification(notificationId);
          await this.createNotification(errorNotification);
        }
      }

      this.isActionProcessing = false;
    },

    async waitTxDelivered(hash: string) {
      return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
          try {
            const { messages } = await getMessagesBySrcTxHash(
              BLAST_LZ_CHAIN_ID,
              hash
            );

            if (messages.length) {
              clearInterval(interval);
              resolve(messages[0]);
            }
          } catch (error) {
            console.log("waitTxDelivered error:", error);
            clearInterval(interval);
            reject(error);
          }
        }, 1000);
      });
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

.row {
  width: 100%;
  gap: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  gap: 24px;
  display: flex;
  flex-direction: column;
}

.chain-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 94px;
  height: 94px;
  padding: 12px;
  border-radius: 50%;
  border: 1px solid #745cd2;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.2) 0%,
    rgba(116, 92, 210, 0.2) 100%
  );
  box-shadow: 0px 4px 29.4px 0px rgba(85, 82, 253, 0.24);
  margin-bottom: 4px;
}

.active {
  border: 1px solid #67a069;
  box-shadow: 0px 4px 29.4px 0px rgba(103, 160, 105, 0.24);
}

.chain-icon {
  width: 70px;
  height: 70px;
}

.migrate-wrap {
  gap: 187px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
}

.anim {
  max-width: 300px;
  position: absolute;
  top: 0;
}

.from-address {
  text-align: center;

  font-weight: 500;
  line-height: normal;
}

.address-active {
  color: #67a069;
}

.to-address {
  text-align: center;
  font-weight: 500;
  line-height: normal;
}

.tokens-info-wrap {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.tokens-info-title {
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
}

.token-info {
  gap: 4px;
  display: flex;
  align-items: center;
}

.token-icon {
  width: 24px;
  height: 24px;
}

.token-amount {
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
}

.dotted-line-wrap {
  display: flex;
  align-items: center;
  width: 100%;
}

.dotted-line {
  width: 100%;
  height: 1px;
  background-image: linear-gradient(
    90deg,
    #7088cc,
    #7088cc 75%,
    transparent 75%,
    transparent 100%
  );
  background-size: 5px 5px;
  border: none;
}

.warning {
  gap: 8px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
}

.warning-icon {
  min-width: 32px;
  height: 32px;
}

.btn-wrap {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.caption {
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
  gap: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.caption-text {
  margin-top: 2px;
}

.caption-icon {
  max-width: 85px;
}

@media screen and (max-width: 600px) {
  .title {
    font-size: 18px;
  }

  .subtitle {
    font-size: 14px;
  }

  .migrate-wrap {
    gap: 120px;
  }

  .chain-wrap {
    width: 70px;
    height: 70px;
  }

  .chain-icon {
    width: 50px;
    height: 50px;
  }

  .anim {
    max-width: 200px;
  }

  .from-address,
  .to-address {
    font-size: 14px;
  }

  .token-info {
    gap: 8px;
  }

  .token-amount {
    font-size: 20px;
  }
}
</style>
