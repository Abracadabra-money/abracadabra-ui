<template>
  <div class="action-block">
    <div class="action-wrap">
      <div class="deposit-wrap">
        <div class="row">
          <Tabs
            width="158px"
            :name="activeToken"
            :items="tokensList"
            @select="changeActiveToken"
          />
        </div>

        <BaseTokenInput
          :value="inputValue"
          :icon="fromToken.icon"
          :name="fromToken.name"
          :max="maxInput"
          :primaryMax="!isStakeAction"
          :tokenPrice="formatUnits(fromToken.price, fromToken.decimals)"
          :disabled="isWithdrawLock"
          @updateInputValue="updateMainValue"
        />

        <BaseButton primary :disabled="isActionDisabled" @click="actionHandler"
          >{{ actionButtonText }}
        </BaseButton>
      </div>

      <div class="lock-wrap">
        <div class="lock-inner">
          <div class="lock-info">
            <div class="lock-info-row">
              <span class="lock-info-title">Your Deposited</span>
              <span class="lock-info-value">
                <img class="lock-token-icon" :src="token0.icon" alt="" />
                {{ formatAmount(token0.unlockAmount) }}
                <img class="lock-token-icon" :src="token1.icon" alt="" />
                {{ formatAmount(token1.unlockAmount) }}
              </span>
            </div>

            <div class="lock-info-row">
              <span class="lock-info-title">Your Locked</span>
              <span class="lock-info-value">
                <img class="lock-token-icon" :src="token0.icon" alt="" />
                {{ formatAmount(token0.lockedAmount) }}
                <img class="lock-token-icon" :src="token1.icon" alt="" />
                {{ formatAmount(token1.lockedAmount) }}</span
              >
            </div>

            <div class="line"></div>

            <ClaimBox v-if="stakeInfo" :stakeInfo="stakeInfo" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { formatUnits, parseUnits } from "viem";
import { approveToken } from "@/helpers/approval";
import { BLAST_CHAIN_ID } from "@/constants/global";
import { formatTokenBalance } from "@/helpers/filters";
import { openConnectPopup } from "@/helpers/connect/utils";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { tokensChainLink } from "@/configs/chainLink/config";
import notification from "@/helpers/notification/notification";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { withdraw } from "@/helpers/blast/stake/actions/withdraw";
import { getTokenPriceByChain } from "@/helpers/prices/getTokenPriceByChain";
import { withdrawLocked } from "@/helpers/blast/stake/actions/withdrawLocked";

export default {
  emits: ["updateStakeInfo"],

  props: {
    actionActiveTab: {
      type: String,
      required: true,
    },
    stakeInfo: {
      type: Object,
      required: true,
    },
    mobileMode: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      actionTabs: ["Stake", "Withdraw"] as string[],
      activeToken: "USDb" as string,
      tokensList: ["USDb", "MIM"] as string[],
      isLock: false as boolean,
      isWithdrawLock: false as boolean,
      isWithdrawPopup: false as boolean,
      inputValue: "" as string | bigint,
      inputAmount: BigInt(0) as bigint,
      mimPrice: 0 as number,
      mimBoost: 1,
      USDbBoost: 3,
      lockBoost: 20,
      cauldronBoost: 15,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

    userTotalPending() {
      const totalPending = 0;
      return formatTokenBalance(totalPending);
    },

    maxInput() {
      if (this.actionActiveTab === "Stake") return this.fromToken.balance;
      return this.fromToken.unlockAmount;
    },

    isStakeAction() {
      return this.actionActiveTab === "Stake";
    },

    isUnsupportedChain() {
      return this.chainId === BLAST_CHAIN_ID;
    },

    isInsufficientBalance() {
      return this.inputAmount > this.fromToken.balance;
    },

    isActionDisabled() {
      if (!this.account) return false;
      if (!this.isUnsupportedChain) return false;
      if (!this.inputAmount) return true;

      if (this.isWithdrawLock) {
        return this.inputAmount !== this.fromToken.lockedAmount;
      }

      return this.inputAmount > this.fromToken.unlockAmount;
    },

    actionButtonText() {
      if (!this.account && this.isUnsupportedChain) return "Connect wallet";
      if (!this.isUnsupportedChain) return "Switch Network";

      return "Withdraw";
    },

    token0() {
      const { name, icon, decimals, contract } =
        this.stakeInfo.config.tokens[0];
      const { balances, allowance, balance, userBorrowPart } =
        this.stakeInfo.tokensInfo[0].userInfo;
      const { caps, totals } = this.stakeInfo.tokensInfo[0];

      return {
        icon,
        name,
        decimals,
        balance,
        contract,
        caps,
        total: totals.total,
        userBorrowPart,
        price: parseUnits(this.mimPrice.toString(), decimals),
        approvedAmount: allowance,
        unlockAmount: balances.unlocked,
        lockedAmount: balances.locked,
      };
    },

    token1() {
      const { name, icon, decimals, contract } =
        this.stakeInfo.config.tokens[1];
      const { balances, allowance, balance, userBorrowPart } =
        this.stakeInfo.tokensInfo[1].userInfo;
      const { caps, totals } = this.stakeInfo.tokensInfo[1];

      return {
        icon,
        name,
        decimals,
        balance,
        contract,
        caps,
        total: totals.total,
        userBorrowPart,
        price: 1000000000000000000n,
        approvedAmount: allowance,
        unlockAmount: balances.unlocked,
        lockedAmount: balances.locked,
      };
    },

    fromToken() {
      return this.activeToken === "USDb" ? this.token0 : this.token1;
    },
  },

  watch: {
    actionActiveTab() {
      this.inputValue = "";
      this.isLock = false;
    },
  },

  methods: {
    formatUnits,
    formatTokenBalance,
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatAmount(value: bigint) {
      return formatTokenBalance(formatUnits(value, this.fromToken.decimals));
    },

    changeActiveToken(token: string) {
      this.activeToken = token;
      this.inputValue = "";
      this.isWithdrawLock = false;
    },

    updateMainValue(amount: bigint) {
      if (!amount) {
        this.inputValue = "";
        this.inputAmount = BigInt(0);
      } else {
        this.inputAmount = amount;
        this.inputValue = formatUnits(amount, this.fromToken.decimals);
      }
    },

    async approveTokenHandler() {
      if (!this.isUnsupportedChain) return false;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveToken(
        this.fromToken.contract,
        this.stakeInfo.config.contract.address,
        this.inputAmount
      );

      if (approve) this.$emit("updateStakeInfo");
      await this.deleteNotification(notificationId);
      if (!approve) await this.createNotification(notification.approveError);
      return false;
    },

    async actionHandler() {
      if (this.isActionDisabled) return false;

      if (!this.account && this.isUnsupportedChain) return openConnectPopup();

      if (!this.isUnsupportedChain) {
        switchNetwork(BLAST_CHAIN_ID);
        return false;
      }

      if (this.isWithdrawLock) {
        this.withdrawLocked();
        return false;
      }

      const notificationId = await this.createNotification(
        notification.pending
      );

      // TODO
      const { error }: any = await withdraw(
        this.stakeInfo.config.contract,
        this.fromToken.contract.address,
        this.inputAmount
      );

      if (error) {
        await this.deleteNotification(notificationId);
        await this.createNotification(error);
      } else {
        await this.$emit("updateStakeInfo");
        this.inputValue = "";
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      }
    },

    async withdrawLocked() {
      this.isWithdrawPopup = false;
      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error }: any = await withdrawLocked(
        this.stakeInfo.config.contract, //todo contract
        this.fromToken.contract.address,
        this.fromToken.lockedAmount
      );

      if (error) {
        await this.deleteNotification(notificationId);
        await this.createNotification(error);
      } else {
        await this.$emit("updateStakeInfo");
        this.inputValue = "";
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      }
    },
  },

  async created() {
    this.mimPrice = await getTokenPriceByChain(
      tokensChainLink.mim.chainId,
      tokensChainLink.mim.address
    );
  },

  components: {
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    Timer: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/stake/earnPoints/Timer.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    ClaimBox: defineAsyncComponent(
      () => import("@/components/stake/earnPoints/ClaimBox.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.gold {
  color: #fcfd02;
}

.action-wrap {
  border-radius: 20px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
}

.deposit-wrap {
  padding: 24px;
  gap: 24px;
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.action-info {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #878b93;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
}

.multiplier-value {
  color: #fff;
  text-shadow: 0px 0px 16px #ab5de8;
}

.info-value {
  gap: 2px;
  display: flex;
  align-items: center;
}

.lock-wrap {
  border-radius: 0px 0px 20px 20px;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.22) 0%,
    rgba(116, 92, 210, 0.22) 100%
  );
  border: 1px solid transparent;
}

.lock-inner {
  margin-top: 20px;
  border: 1px solid transparent;
  border-radius: 0px 0px 20px 20px;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.22) 0%,
    rgba(116, 92, 210, 0.22) 100%
  );
}

.lock-info {
  margin-top: 20px;
  padding: 12px 24px 24px;
  border-radius: 0px 0px 20px 20px;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.22) 0%,
    rgba(116, 92, 210, 0.22) 100%
  );
  display: flex;
  flex-direction: column;
}

.lock-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
}

.lock-info-title {
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
}

.lock-info-value {
  gap: 4px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
}

.lock-info-subtitle {
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
}

.lock-token-icon {
  width: 25px;
  height: 25px;
  margin-left: 5px;
}

.line {
  margin: 8px 0 8px;
  height: 1px;
  width: 100%;
  background: linear-gradient(
    270deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 54.5%,
    rgba(255, 255, 255, 0) 100%
  );
}

.deposit-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
}

.deposit-info .lock-info-row {
  flex-direction: column;
  justify-content: center;
}

.deposit-info .lock-info-row .lock-info-value {
  align-self: self-start;
}

.lock-info-step {
  color: #fff;
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 21px;
  font-weight: 600;
  line-height: normal;
  display: flex;
  align-items: center;
  align-self: self-end;
  height: 32px;
}

.liquidity-info {
  margin-bottom: 16px;
}

@media (max-width: 600px) {
  .deposit-wrap {
    padding: 16px;
    gap: 16px;
  }

  .deposit-info {
    flex-direction: column;
    gap: 12px;
  }

  .deposit-info .lock-info-row {
    flex-direction: row;
    justify-content: space-between;
  }

  .info-row {
    font-size: 14px;
  }

  .lock-inner {
    margin-top: 12px;
  }

  .lock-info {
    margin-top: 12px;
    padding: 12px 16px 16px;
  }

  .lock-info-value,
  .lock-info-step {
    align-self: self-start;
    font-size: 20px;
  }

  .lock-info-title {
    font-size: 16px;
  }

  .lock-info-subtitle {
    width: 164px;
    font-size: 14px;
  }

  .lock-token-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
