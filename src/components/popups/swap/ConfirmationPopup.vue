<template>
  <div class="content-wrap">
    <h3 class="title">Confirmation</h3>

    <div class="tokens-wrap">
      <div class="token-info">
        <div class="token-icon-wrap start">
          <div class="token-icon-inner">
            <img
              class="token-icon"
              :src="actionConfig.fromToken.config.icon"
              alt=""
            />
          </div>
        </div>
        <div class="token-amount">{{ fromTokenAmount }}</div>
      </div>

      <div class="arrow-wrap">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <g clip-path="url(#clip0_9586_214068)">
            <path
              d="M12.9694 19.2806C12.8997 19.2109 12.8443 19.1282 12.8066 19.0371C12.7689 18.9461 12.7494 18.8485 12.7494 18.7499C12.7494 18.6514 12.7689 18.5538 12.8066 18.4627C12.8443 18.3717 12.8997 18.289 12.9694 18.2193L18.4397 12.7499L-16.25 12.7499C-16.4489 12.7499 -16.6397 12.6709 -16.7803 12.5303C-16.921 12.3896 -17 12.1988 -17 11.9999C-17 11.801 -16.921 11.6103 -16.7803 11.4696C-16.6397 11.3289 -16.4489 11.2499 -16.25 11.2499L18.4397 11.2499L12.9694 5.78055C12.8287 5.63982 12.7496 5.44895 12.7496 5.24993C12.7496 5.05091 12.8287 4.86003 12.9694 4.7193C13.1101 4.57857 13.301 4.49951 13.5 4.49951C13.699 4.49951 13.8899 4.57857 14.0306 4.7193L20.7806 11.4693C20.8504 11.539 20.9057 11.6217 20.9434 11.7127C20.9812 11.8038 21.0006 11.9014 21.0006 11.9999C21.0006 12.0985 20.9812 12.1961 20.9434 12.2871C20.9057 12.3782 20.8504 12.4609 20.7806 12.5306L14.0306 19.2806C13.961 19.3503 13.8783 19.4056 13.7872 19.4433C13.6962 19.4811 13.5986 19.5005 13.5 19.5005C13.4015 19.5005 13.3039 19.4811 13.2128 19.4433C13.1218 19.4056 13.039 19.3503 12.9694 19.2806Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_9586_214068">
              <rect
                width="24"
                height="24"
                fill="white"
                transform="translate(24) rotate(90)"
              />
            </clipPath>
          </defs>
        </svg>
      </div>

      <div class="token-info">
        <div class="token-icon-wrap end">
          <div class="token-icon-inner">
            <img
              class="token-icon"
              :src="actionConfig.toToken.config.icon"
              alt=""
            />
          </div>
        </div>
        <div class="token-amount">{{ toTokenAmount }}</div>
      </div>
    </div>

    <SwapInfoBlock
      :actionConfig="actionConfig"
      :minAmount="BigInt(localData.outputAmountWithSlippage)"
      :showPriceImpact="false"
      :networkFee="networkFee"
    />

    <PriceUpdatedBlock v-if="isUpdatedPrice" @updatedPrice="updatedPrice" />

    <BaseButton :primary="true" @click="swapHandler">Confirm</BaseButton>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { formatTokenBalance } from "@/helpers/filters";
import { mapActions, mapGetters, mapMutations } from "vuex";
import notification from "@/helpers/notification/notification";
// @ts-ignore
import { notificationErrorMsg } from "@/helpers/notification/notificationError";
import { swapTokensForTokens } from "@/helpers/pools/swap/actions/swapTokensForTokens";
import { sellBaseTokensForTokens } from "@/helpers/pools/swap/actions/sellBaseTokensForTokens";
import { sellQuoteTokensForTokens } from "@/helpers/pools/swap/actions/sellQuoteTokensForTokens";
import { SECONDS_PER_MINUTE } from "@/constants/global";

export default {
  props: {
    actionConfig: {} as any,
    swapInfo: {
      type: Object,
      required: true,
    },
    networkFee: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      localData: null as any,
    };
  },

  computed: {
    ...mapGetters({ chainId: "getChainId", account: "getAccount" }),

    fromTokenAmount() {
      return formatTokenBalance(
        formatUnits(
          BigInt(this.localData.inputAmount),
          this.actionConfig.fromToken.config.decimals
        )
      );
    },

    toTokenAmount() {
      return formatTokenBalance(
        formatUnits(
          BigInt(this.localData.outputAmountWithSlippage),
          this.actionConfig.toToken.config.decimals
        )
      );
    },

    isUpdatedPrice() {
      return this.swapInfo.outputAmount !== BigInt(this.localData.outputAmount);
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    updatedPrice() {
      const freezSwapInfo = JSON.stringify(this.swapInfo);
      this.localData = JSON.parse(freezSwapInfo);
    },

    successNotification(notificationId: number) {
      this.deleteNotification(notificationId);
      this.createNotification(notification.success);
    },

    async swapHandler() {
      const notificationId = await this.createNotification(
        notification.pending
      );

      try {
        const { methodName } = this.localData.transactionInfo;

        const deadline =
          moment().unix() +
          SECONDS_PER_MINUTE * (Number(this.actionConfig.deadline) / 100);

        // @ts-ignore
        this.localData.transactionInfo.payload.deadline = deadline;

        switch (methodName) {
          case "sellBaseTokensForTokens":
            await sellBaseTokensForTokens(
              // @ts-ignore
              this.localData.transactionInfo.swapRouterAddress,
              this.localData.transactionInfo.payload
            );
            break;
          case "sellQuoteTokensForTokens":
            await sellQuoteTokensForTokens(
              // @ts-ignore
              this.localData.transactionInfo.swapRouterAddress,
              this.localData.transactionInfo.payload
            );
            break;
          case "swapTokensForTokens":
            await swapTokensForTokens(
              // @ts-ignore
              this.localData.transactionInfo.swapRouterAddress,
              this.localData.transactionInfo.payload
            );
            break;
        }

        this.successNotification(notificationId);
        this.$emit("confirm");
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
  },

  created() {
    (BigInt.prototype as any).toJSON = function () {
      return this.toString();
    };

    const freezSwapInfo = JSON.stringify(this.swapInfo);
    this.localData = JSON.parse(freezSwapInfo);
  },

  components: {
    SwapInfoBlock: defineAsyncComponent(
      () => import("@/components/swap/SwapInfoBlock.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    PriceUpdatedBlock: defineAsyncComponent(
      () => import("@/components/swap/PriceUpdatedBlock.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.content-wrap {
  gap: 24px;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 24px;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 24px;
}

.tokens-wrap {
  gap: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.token-info {
  gap: 4px;
  display: flex;
  flex-direction: column;
}

.token-icon-wrap {
  width: 94px;
  height: 94px;
  border-radius: 20px;
  box-shadow: 0px 4px 29.4px 0px rgba(85, 82, 253, 0.24);
  padding: 1px;
}

.start {
  background: linear-gradient(
    90deg,
    rgba(116, 92, 210, 0.8) 0%,
    rgba(45, 74, 150, 0.5) 80%
  );
}

.end {
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.5) 0%,
    rgba(116, 92, 210, 0.8) 80%
  );
}

.token-icon-inner {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: #18213b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.token-icon {
  width: 70px;
  height: 70px;
}

.arrow-wrap {
  max-width: 122px;
  width: 100%;
  height: 28px;
  border-radius: 16px;
  border: 1px solid #2d4a96;
  background: rgba(25, 31, 47, 0.38);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14),
    0px 4px 29.4px 0px rgba(85, 82, 253, 0.24);
  backdrop-filter: blur(67.9000015258789px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
