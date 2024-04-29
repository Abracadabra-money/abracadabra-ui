<template>
  <div class="backdrop" @click.self="closePopup">
    <div class="preview-popup">
      <div class="header">
        <h3 class="title">Preview</h3>
        <img
          class="close-img"
          src="@/assets/images/cross.svg"
          alt="Close popup"
          @click="closePopup"
        />
      </div>

      <div class="preview-tokens-wrap">
        <div class="token-info-wrap">
          <div class="token-icon-wrap">
            <BaseTokenIcon
              :icon="tokensSortedByApprove[0].config.icon"
              :name="tokensSortedByApprove[0].config.name"
              size="60px"
            />
          </div>
          <div class="token-value">
            {{
              formatTokenBalance(
                tokensSortedByApprove[0].transactionAmount,
                tokensSortedByApprove[0].config.decimals
              )
            }}
          </div>
        </div>

        <div class="icon-button-wrap">
          <IconButton
            class="icon-button"
            plus
            active
            disable
            :width="40"
            :height="40"
            borderRadius="16px"
          />
        </div>

        <div class="token-info-wrap">
          <div class="token-icon-wrap">
            <BaseTokenIcon
              :icon="tokensSortedByApprove[1].config.icon"
              :name="tokensSortedByApprove[1].config.name"
              size="60px"
            />
          </div>
          <div class="token-value">
            {{
              formatTokenBalance(
                tokensSortedByApprove[1].transactionAmount,
                tokensSortedByApprove[1].config.decimals
              )
            }}
          </div>
        </div>

        <div class="icon-button-wrap">
          <IconButton
            class="icon-button"
            arrowRight
            active
            disable
            :width="40"
            :height="40"
            borderRadius="16px"
          />
        </div>

        <div class="token-info-wrap">
          <div class="token-icon-wrap">
            <BaseTokenIcon :icon="pool.icon" :name="pool.name" size="60px" />
          </div>
          <div class="token-value">
            {{ formatTokenBalance(previewInfo.lpAmount, pool.decimals) }}
          </div>
        </div>
      </div>

      <div class="flow-wrap">
        <FlowBlock
          :stepNumber="1"
          isApprove
          :status="getApprovingStatus(tokensSortedByApprove[0])"
        >
          Allowance
        </FlowBlock>

        <FlowBlock
          :stepNumber="2"
          isApprove
          :status="getApprovingStatus(tokensSortedByApprove[1])"
        >
          Allowance
        </FlowBlock>

        <FlowBlock :stepNumber="3" :status="transActionStatus" final>
          Deposit
        </FlowBlock>
      </div>

      <BaseButton
        class="action-button"
        primary
        @click="actionHandler"
        :disabled="isActionProcessing"
      >
        {{ buttonText }}
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";
import { ActionStatus } from "@/components/pools/pool/PoolActionBlock.vue";
import type { PreviewPopupInfo } from "@/components/pools/pool/actions/deposit/Deposit.vue";
import type { PoolInfo } from "@/configs/pools/types";
import type { TokenInfo } from "@/helpers/pools/swap/tokens";

type PreviewTokenInfo = TokenInfo & {
  isApproved: boolean;
  transactionAmount: bigint;
};

export default {
  props: {
    pool: { type: Object as PropType<PoolInfo>, required: true },

    previewInfo: { type: Object as PropType<PreviewPopupInfo>, required: true },

    isActionProcessing: {
      type: Boolean,
      default: false,
    },

    transActionStatus: {
      type: String,
      default: ActionStatus.WAITING,
    },
  },

  data() {
    return {
      currentlyApprovingToken: "",
    };
  },

  computed: {
    isBaseTokenApproved(): boolean {
      if (!this.pool.tokens.baseToken.userInfo) return false;
      return (
        this.pool.tokens.baseToken.userInfo.allowance >=
        this.previewInfo.baseTokenAmount
      );
    },

    isQuoteTokenApproved(): boolean {
      if (!this.pool.tokens.quoteToken.userInfo) return false;
      return (
        this.pool.tokens.quoteToken.userInfo.allowance >=
        this.previewInfo.quoteTokenAmount
      );
    },

    tokensSortedByApprove(): PreviewTokenInfo[] {
      const baseToken = this.pool.tokens.baseToken;
      const quoteToken = this.pool.tokens.quoteToken;

      baseToken.transactionAmount = this.previewInfo.baseTokenAmount;
      baseToken.isApproved = this.isBaseTokenApproved;

      quoteToken.transactionAmount = this.previewInfo.quoteTokenAmount;
      quoteToken.isApproved = this.isQuoteTokenApproved;

      return [baseToken, quoteToken].sort(
        (a, b) => b.isApproved - a.isApproved
      );
    },

    buttonText(): string {
      if (this.transActionStatus == ActionStatus.SUCCESS) return "Close popup";
      if (this.isActionProcessing) return "Processing...";
      if (!this.isBaseTokenApproved)
        return `Approve ${this.pool.tokens.baseToken.config.name}`;
      if (!this.isQuoteTokenApproved)
        return `Approve ${this.pool.tokens.quoteToken.config.name}`;
      return "Deposit";
    },
  },

  methods: {
    getApprovingStatus(token: PreviewTokenInfo): string {
      if (
        token.config.name == this.currentlyApprovingToken &&
        this.isActionProcessing
      )
        return ActionStatus.PENDING;

      if (token.isApproved) return ActionStatus.SUCCESS;

      return ActionStatus.WAITING;
    },

    formatTokenBalance(value: bigint) {
      return formatTokenBalance(formatUnits(value, 18));
    },

    actionHandler() {
      if (this.isActionProcessing) return false;

      if (this.transActionStatus == ActionStatus.SUCCESS)
        return this.closePopup();

      if (!this.isBaseTokenApproved) {
        this.currentlyApprovingToken = this.pool.tokens.baseToken.config.name;
        return this.$emit(
          "approve",
          this.pool.tokens.baseToken,
          this.previewInfo.baseTokenAmount
        );
      }
      if (!this.isQuoteTokenApproved) {
        this.currentlyApprovingToken = this.pool.tokens.quoteToken.config.name;
        return this.$emit(
          "approve",
          this.pool.tokens.quoteToken,
          this.previewInfo.quoteTokenAmount
        );
      }

      this.currentlyApprovingToken = "";

      this.$emit("deposit");
    },

    closePopup() {
      this.$emit("close");
    },
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    IconButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/IconButton.vue")
    ),
    FlowBlock: defineAsyncComponent(
      () => import("@/components/pools/pool/FlowBlock.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 300;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  background: rgba(25, 25, 25, 0.1);
  backdrop-filter: blur(10px);
}

.preview-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px;
  max-width: 533px;
  width: 100%;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 24px;
  font-weight: 500;
}

.header .title {
  font-size: 24px;
  font-weight: 500;
}

.close-img {
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.close-img:hover {
  opacity: 0.5;
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
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

.preview-tokens-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.token-info-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.token-icon-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-radius: 20px;
  border: 1px solid rgba(45, 74, 150, 0);
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.2) 0%,
    rgba(116, 92, 210, 0.2) 100%
  );
  box-shadow: 0px 4px 29.4px 0px rgba(85, 82, 253, 0.24);
}

.token-icon {
  margin-right: 0;
}

.icon-button-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

.icon-button {
  margin-bottom: 25px;
}

.flow-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.action-button {
  margin-top: auto;
}

@media (max-width: 600px) {
  .backdrop {
    padding: 0;
  }

  .preview-popup {
    max-width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .flow-wrap {
    flex-direction: column;
    align-items: start;
    height: 237px;
  }
}
</style>
