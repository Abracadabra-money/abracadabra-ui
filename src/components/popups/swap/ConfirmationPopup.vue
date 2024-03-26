<template>
  <div class="content-wrap">
    <h3 class="title">Preview</h3>

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

      <div class="arrow-wrap">Swapping</div>

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
      :priceImpact="priceImpact"
      :minAmount="BigInt(localData.outputAmountWithSlippage)"
    />

    <PriceUpdatedBlock v-if="isUpdatedPrice" @updatedPrice="updatedPrice" />

    <BaseButton :primary="true" @click="swapHandler">Confirm swap</BaseButton>
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
    priceImpact: { type: Number, default: 0 },
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
  max-width: 131px;
  width: 100%;
  background: center / contain no-repeat
    url("@/assets/images/arrows/big-arrow-right.png");
  filter: drop-shadow(0px 4px 32px rgba(103, 103, 103, 0.14))
    drop-shadow(0px 4px 29.4px rgba(85, 82, 253, 0.24));
  backdrop-filter: blur(67.9000015258789px);
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7088cc;
  text-shadow: 0px 0px 4.5px rgba(85, 82, 253, 0.46);
  font-size: 10px;
}

@media screen and (max-width: 470px) {
  .tokens-wrap {
    gap: 16px;
  }
}
</style>
