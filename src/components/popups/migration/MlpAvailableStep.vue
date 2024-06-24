<template>
  <h3 class="title">Migrate your MLP with two Steps</h3>

  <p class="sub-title">As a Founder you are eligble to Migrate</p>

  <div class="popup-content">
    <div class="mlp-info">
      <div class="mlp-icon-wrap">
        <img clas="mlp-icon" src="@/assets/images/tokens/MIM-USDB.png" alt="" />
        <span>MLP available for migration</span>
      </div>

      <div class="mlp-amounts">
        <div class="mlp-balance">
          {{ formatTokenBalance(parseAvailableAmount) }}
        </div>
        <div class="mlp-balance-usd">{{ availableAmountUsd }}</div>
      </div>
    </div>

    <div class="line"></div>

    <div class="info">
      <div class="info-title">Balance on wallet</div>
      <div class="info-balance">
        <div class="info-amount">
          {{ mlpInfo.walletBalance }}
        </div>
        <div class="info-amount-usd">{{ mlpInfo.walletBalanceUsd }}</div>
      </div>
    </div>

    <div class="info">
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

  <BaseButton :disabled="isDisabledButton" @click="actionHandler" primary>{{
    buttonText
  }}</BaseButton>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { mapGetters } from "vuex";
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

    isProperNetwork() {
      return this.chainId === BLAST_CHAIN_ID;
    },

    buttonText() {
      if (this.isDisabledButton) return "Nothing to do";

      if (
        this.userInfo.balance > 0n ||
        this.userInfo.balance >= this.availableAmount ||
        !this.userInfo.balances.unlocked
      )
        return "Proceed with Migration";
      return "Unstake MLP";
    },

    mlpInfo() {
      if (!this.userInfo || !this.poolInfo) return {};

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
      if (
        this.userInfo.balance > 0n ||
        this.userInfo.balance >= this.availableAmount ||
        !this.userInfo.balances.unlocked
      )
        return 4;
      return 3;
    },

    isDisabledButton() {
      return !this.userInfo.balance && !this.userInfo.balances.unlocked;
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
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    Timer: defineAsyncComponent(
      () => import("@/components/stake/earnPoints/Timer.vue")
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

.sub-title {
  font-weight: 500;
  line-height: normal;
}

.popup-content {
  width: 469px;
  gap: 24px;
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
</style>
