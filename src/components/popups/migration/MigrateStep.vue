<template>
  <div class="popup-header">
    <h3 class="title">Migrate liquidity</h3>
    <div class="step">Step 2</div>
  </div>

  <p class="sub-title">
    Lock your MagicLP for 3 months to obtain the Founder Boost, a permanent
    reward boost exclusive to Phase 3.
  </p>

  <div class="popup-content">
    <div class="migrate-wrap">
      <div>
        <div class="chain-wrap">
          <img
            class="chain-icon"
            src="@/assets/images/blastLpMigration/blast-icon.png"
            alt=""
          />
        </div>
        <div class="from-address">0x23...2ee</div>
      </div>

      <img
        v-show="isActionProcessing"
        class="anim"
        src="@/assets/images/blastLpMigration/animation.gif"
        alt=""
      />

      <a class="layer-zero-link" href="#" target="_blank">
        <span v-show="lzTxInfo"> LayerZero </span>

        <svg
          v-show="lzTxInfo"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="none"
        >
          <path
            d="M13.4375 5.5625V5.0625H12.9375H7.875C7.85842 5.0625 7.84253 5.05592 7.83081 5.04419C7.81908 5.03247 7.8125 5.01658 7.8125 5C7.8125 4.98342 7.81908 4.96753 7.83081 4.95581C7.84253 4.94408 7.85842 4.9375 7.875 4.9375H13.5C13.5166 4.9375 13.5325 4.94409 13.5442 4.95581C13.5559 4.96753 13.5625 4.98342 13.5625 5V10.625C13.5625 10.6416 13.5559 10.6575 13.5442 10.6692C13.5325 10.6809 13.5166 10.6875 13.5 10.6875C13.4834 10.6875 13.4675 10.6809 13.4558 10.6692C13.4441 10.6575 13.4375 10.6416 13.4375 10.625V5.5625Z"
            fill="white"
            stroke="#7088CC"
          />
          <path
            d="M13.544 4.95488L13.5449 4.95578C13.5507 4.96159 13.5553 4.96848 13.5585 4.97607L14.0198 4.78465L13.5585 4.97608C13.5616 4.98367 13.5632 4.99181 13.5632 5.00003C13.5632 5.00825 13.5616 5.01639 13.5585 5.02398L14.0203 5.21562L13.5585 5.02399C13.5553 5.03158 13.5507 5.03847 13.5449 5.04428L13.5444 5.04473L3.41943 15.1697L3.76986 15.5201L3.41943 15.1697C3.40758 15.1816 3.3915 15.1882 3.37473 15.1882C3.35797 15.1882 3.34189 15.1816 3.33004 15.1697L2.97648 15.5233L3.33004 15.1697C3.31818 15.1579 3.31152 15.1418 3.31152 15.125C3.31152 15.1083 3.31818 15.0922 3.33004 15.0803L13.455 4.95533L13.4555 4.95489C13.4613 4.94907 13.4682 4.94445 13.4758 4.9413C13.4834 4.93814 13.4915 4.93652 13.4997 4.93652C13.508 4.93652 13.5161 4.93815 13.5237 4.9413L13.7153 4.47948L13.5237 4.9413C13.5313 4.94445 13.5382 4.94907 13.544 4.95488Z"
            fill="white"
            stroke="#7088CC"
          />
        </svg>
      </a>

      <div>
        <div class="chain-wrap">
          <img
            class="chain-icon"
            src="@/assets/images/blastLpMigration/arbitrum-icon.png"
            alt=""
          />
        </div>
        <div class="to-address">0x23...2ee</div>
      </div>
    </div>

    <div class="row">
      <div class="token-info">
        <img class="token-icon" :src="baseToken.icon" :alt="baseToken.name" />
        <span class="token-amount">
          {{ formattedTokenExpecteds.base.value }}</span
        >
      </div>

      <div class="dotted-line"></div>

      <div class="token-info">
        <img class="token-icon" :src="baseToken.icon" :alt="baseToken.name" />
        <span class="token-amount">
          {{ formattedTokenExpecteds.base.value }}</span
        >
      </div>
    </div>

    <div class="row">
      <div class="token-info">
        <img class="token-icon" :src="quoteToken.icon" :alt="quoteToken.name" />
        <span class="token-amount">
          {{ formattedTokenExpecteds.quote.value }}</span
        >
      </div>

      <div class="dotted-line"></div>

      <div class="token-info">
        <img class="token-icon" :src="quoteToken.icon" :alt="quoteToken.name" />
        <span class="token-amount">
          {{ formattedTokenExpecteds.quote.value }}</span
        >
      </div>
    </div>
  </div>

  <BaseButton @click="actionHandler" primary>{{ buttonText }}</BaseButton>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { useImage } from "@/helpers/useImage";
import { approveTokenViem } from "@/helpers/approval";
import { defineAsyncComponent, type PropType } from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import notification from "@/helpers/notification/notification";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { waitForMessageReceived } from "@layerzerolabs/scan-client";
import { BLAST_BRIDGE_ADDRESS } from "@/constants/blastLpMigration";
import { notificationErrorMsg } from "@/helpers/notification/notificationError";
import { bridgeWithProofs } from "@/helpers/blastLpMigration/actions/bridgeWithProofs";
import { applySlippageToMinOutBigInt } from "@/helpers/gm/applySlippageToMinOut";
import { previewRemoveLiquidity } from "@/helpers/pools/swap/liquidity";

const BLAST_LZ_CHAIN_ID = 243;

export default {
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
      required: true,
    },
    // previewRemoveLiquidityResult: {
    //   type: Object as PropType<any>,
    //   required: true,
    // },
  },

  data() {
    return {
      lzTxInfo: null as any,
      usePermit: true,
      isActionProcessing: false,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

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
      if (!this.usePermit && !this.isLpApprove) return "Approve";
      if (this.isActionProcessing) return "Processing...";
      return "Remove ";
    },

    previewRemoveLiquidityResult() {
      if (!this.poolInfo || !this.userInfo)
        return { baseAmountOut: 0n, quoteAmountOut: 0n };

      const previewRemoveLiquidityResult = previewRemoveLiquidity(
        this.userInfo.balance,
        this.poolInfo
      );

      previewRemoveLiquidityResult.baseAmountOut = applySlippageToMinOutBigInt(
        100n,
        previewRemoveLiquidityResult.baseAmountOut
      );

      previewRemoveLiquidityResult.quoteAmountOut = applySlippageToMinOutBigInt(
        100n,
        previewRemoveLiquidityResult.quoteAmountOut
      );

      return previewRemoveLiquidityResult;
    },

    isLpApprove() {
      return this.userInfo.balance <= this.userInfo.allowance;
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
      this.isActionProcessing = true;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const payload = {
        lpAmount: this.userInfo.balance,
        minMIMAmount: this.previewRemoveLiquidityResult.baseAmountOut,
        minUSDBAmount: this.previewRemoveLiquidityResult.quoteAmountOut,
      };

      try {
        const hash = await bridgeWithProofs(
          this.account,
          payload,
          this.usePermit
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

        const messageResult = await waitForMessageReceived(
          BLAST_LZ_CHAIN_ID,
          hash!
        );

        this.lzTxInfo = messageResult;

        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);

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
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  gap: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close {
  width: 24px;
  height: 24px;
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

.sub-title {
  font-weight: 500;
  line-height: normal;
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
  border: 1px solid #67a069;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.2) 0%,
    rgba(116, 92, 210, 0.2) 100%
  );
  box-shadow: 0px 4px 29.4px 0px rgba(103, 160, 105, 0.24);
  margin-bottom: 4px;
}

.chain-icon {
  width: 70px;
  height: 70px;
}

.migrate-wrap {
  gap: 50px;
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
  color: #67a069;
  font-weight: 500;
  line-height: normal;
}

.to-address {
  text-align: center;
  font-weight: 500;
  line-height: normal;
}

.layer-zero-link {
  gap: 4px;
  display: flex;
  align-items: center;
  color: #7088cc;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  min-width: 90px;
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
  background-size: 20px 1px;
  border: none;
}
</style>
