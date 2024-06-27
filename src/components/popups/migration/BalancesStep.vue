<template>
  <div class="popup-header">
    <svg
      class="back-button"
      @click="$emit('changeSteap', 1)"
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

    <h3 class="title">Step 1: Review Your Balances</h3>
  </div>

  <Steps :step="1" />

  <p class="subtitle">Founder Status Confirmed: You're eligible to migrate</p>

  <div class="popup-content">
    <div class="mlp-info">
      <div class="mlp-icon-wrap">
        <img
          class="mlp-icon"
          src="@/assets/images/tokens/MIM-USDB.png"
          alt=""
        />
        <span class="tooltip-wrap"
          >MLP Available for Migration
          <TooltipIcon
            tooltip="This includes your locked MLP tokens. Migration will transfer all the underlying tokens available on your MLP balance to Arbitrum"
        /></span>
      </div>

      <div class="mlp-amounts">
        <div class="mlp-balance">
          {{ formatTokenBalance(parseAvailableAmount) }}
        </div>
        <div class="mlp-balance-usd">{{ availableAmountUsd }}</div>
      </div>
    </div>

    <div class="line"></div>

    <div class="info" v-if="Number(mlpInfo.walletBalance)">
      <div class="info-title">Balance on wallet</div>
      <div class="info-balance">
        <div class="info-amount">
          {{ mlpInfo.walletBalance }}
        </div>
        <div class="info-amount-usd">{{ mlpInfo.walletBalanceUsd }}</div>
      </div>
    </div>

    <div class="info" v-if="Number(mlpInfo.stakeBalance)">
      <div class="info-title">Staked Balance</div>
      <div class="info-balance">
        <div class="info-amount">
          {{ mlpInfo.stakeBalance }}
        </div>
        <div class="info-amount-usd">{{ mlpInfo.stakeBalanceUsd }}</div>
      </div>
    </div>

    <div class="user-locks">
      <div
        class="lock-item"
        v-for="(userLock, index) in userInfo.userLocks"
        :key="index"
      >
        <div class="timer-info">
          <span> Locked</span>
          <Timer
            class="timer"
            small
            isLock
            gap="4px"
            width="44px"
            padding="4px"
            height="26px"
            :endDateTimestamp="Number(userLock.unlockTime)"
          />
        </div>

        <div class="lock-balances">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="29"
            viewBox="0 0 28 29"
            fill="none"
          >
            <path
              d="M22.75 9.25H19.25V6.625C19.25 5.23261 18.6969 3.89726 17.7123 2.91269C16.7277 1.92812 15.3924 1.375 14 1.375C12.6076 1.375 11.2723 1.92812 10.2877 2.91269C9.30312 3.89726 8.75 5.23261 8.75 6.625V9.25H5.25C4.78587 9.25 4.34075 9.43437 4.01256 9.76256C3.68437 10.0908 3.5 10.5359 3.5 11V23.25C3.5 23.7141 3.68437 24.1592 4.01256 24.4874C4.34075 24.8156 4.78587 25 5.25 25H22.75C23.2141 25 23.6592 24.8156 23.9874 24.4874C24.3156 24.1592 24.5 23.7141 24.5 23.25V11C24.5 10.5359 24.3156 10.0908 23.9874 9.76256C23.6592 9.43437 23.2141 9.25 22.75 9.25ZM10.5 6.625C10.5 5.69674 10.8687 4.8065 11.5251 4.15013C12.1815 3.49375 13.0717 3.125 14 3.125C14.9283 3.125 15.8185 3.49375 16.4749 4.15013C17.1313 4.8065 17.5 5.69674 17.5 6.625V9.25H10.5V6.625ZM22.75 23.25H5.25V11H22.75V23.25Z"
              fill="#7088CC"
            />
          </svg>

          <div class="lock-amounts">
            <div class="lock-amount">
              {{ formatTokenBalance(formatUnits(userLock.amount, 18)) }}
            </div>
            <div class="lock-amount-usd">
              {{
                formatUSD(
                  Number(formatUnits(userLock.amount, 18)) * poolInfo.price
                )
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="btn-wrap">
    <BaseButton :disabled="isDisabledButton" @click="actionHandler" primary>{{
      buttonText
    }}</BaseButton>

    <p class="label">
      Once unlocked, you'll be able to proceed to the next step: Unstaking
    </p>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { BLAST_CHAIN_ID } from "@/constants/global";

export default {
  emits: ["changeSteap"],

  props: {
    availableAmount: {
      required: true,
      default: 0n,
    },
    poolInfo: {
      type: Object,
      required: true,
    },
    userInfo: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    parseAvailableAmount() {
      return formatUnits(this.availableAmount, this.poolInfo.decimals || 18);
    },

    availableAmountUsd() {
      if (!this.poolInfo) return 0;
      return formatUSD(Number(this.parseAvailableAmount) * this.poolInfo.price);
    },

    buttonText() {
      if (!this.unlockInProgress && this.isDisabledButton)
        return "Insufficient MLP Balances";
      if (this.isDisabledButton) return "Unlock in Progress";
      return "Proceed with Migration";
    },

    mlpInfo() {
      if (!this.userInfo || !this.poolInfo)
        return {
          walletBalance: "0",
          walletBalanceUsd: "0",
          stakeBalance: "0",
          stakeBalanceUsd: "0",
        };

      return {
        walletBalance: formatTokenBalance(
          formatUnits(this.userInfo.balance, this.poolInfo.decimals)
        ),
        walletBalanceUsd: formatUSD(
          Number(formatUnits(this.userInfo.balance, this.poolInfo.decimals)) *
            this.poolInfo.price
        ),
        stakeBalance: formatTokenBalance(
          formatUnits(this.userInfo.balances.unlocked, this.poolInfo.decimals)
        ),
        stakeBalanceUsd: formatUSD(
          Number(
            formatUnits(this.userInfo.balances.unlocked, this.poolInfo.decimals)
          ) * this.poolInfo.price
        ),
      };
    },

    nextStep() {
      if (this.userInfo.balance >= this.availableAmount) return 4;
      if (this.userInfo.balances.unlocked) return 3;
      return 4;
    },

    isDisabledButton() {
      return !this.userInfo.balance && !this.userInfo.balances.unlocked;
    },

    unlockInProgress() {
      return !!this.userInfo.balances.locked;
    },
  },

  methods: {
    formatUSD,
    formatUnits,
    formatTokenBalance,

    actionHandler() {
      if (this.chainId !== BLAST_CHAIN_ID) return switchNetwork(BLAST_CHAIN_ID);
      this.$emit("changeSteap", this.nextStep);
    },
  },

  components: {
    Steps: defineAsyncComponent(
      () => import("@/components/popups/migration/Steps.vue")
    ),
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
    Timer: defineAsyncComponent(
      () => import("@/components/stake/earnPoints/Timer.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
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

.popup-content {
  width: 469px;
  gap: 12px;
  display: flex;
  flex-direction: column;
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

.migration-icon {
  max-width: 263px;
  margin: 0 auto;
}

.mlp-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mlp-icon-wrap {
  gap: 8px;
  display: flex;
  align-items: center;
  color: var(--additional-ffffff, #fff);
  font-weight: 400;
  line-height: normal;
}

.mlp-icon {
  width: 28px;
  height: 28px;
}

.tooltip-wrap {
  gap: 8px;
  display: flex;
  align-items: center;
}

.mlp-amounts {
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

.info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-title {
  color: #878b93;
  font-weight: 400;
  line-height: normal;
}

.info-balance {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.info-amount {
  font-weight: 500;
  line-height: normal;
}

.info-amount-usd {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
}

.user-locks {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.lock-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.timer-info {
  gap: 6px;
  display: flex;
  align-items: center;
  color: #878b93;
}

.lock-balances {
  gap: 8px;
  display: flex;
  align-items: center;
}

.lock-amounts {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.lock-amount {
  font-weight: 500;
  line-height: normal;
}

.lock-amount-usd {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
}

.btn-wrap {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.label {
  text-align: center;
  font-size: 12px;
  line-height: normal;
}

@media screen and (max-width: 600px) {
  .title {
    font-size: 18px;
  }

  .subtitle {
    font-size: 14px;
  }

  .popup-content {
    width: 100%;
  }

  .timer-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .mlp-info {
    flex-direction: column;
  }

  .mlp-amounts {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
