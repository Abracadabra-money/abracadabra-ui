<template>
  <div class="action-block">
    <div class="actions-head">
      <img class="label" src="@/assets/images/blast/label.png" alt="" />

      <Tabs
        class="tabs"
        :name="actionActiveTab"
        :items="actionTabs"
        activeColor="#FCFC03"
        @select="changeActionTab"
      />
    </div>

    <div class="action-wrap">
      <div class="deposit-wrap">
        <div class="row">
          <Tabs
            width="184px"
            :name="activeToken"
            :items="tokensList"
            @select="changeActiveToken"
          />

          <Toggle
            text="Lock and Boost"
            :selected="isLock"
            @updateToggle="changeLockToggle"
          />
        </div>

        <BaseTokenInput
          :value="inputValue"
          :icon="fromToken.icon"
          :name="fromToken.name"
          :max="fromToken.balance"
          :primaryMax="!isStakeAction"
          :tokenPrice="formatUnits(fromToken.price, fromToken.decimals)"
          @updateInputValue="updateMainValue"
        />

        <div class="action-info">
          <div class="info-row">
            <span>Points per day</span>
            <span>25</span>
          </div>
          <div class="info-row">
            <span>Multiplier</span>
            <span>20X</span>
          </div>
        </div>

        <BaseButton primary :disabled="isActionDisabled" @click="actionHandler"
          >{{ actionButtonText }}
        </BaseButton>
      </div>

      <div class="lock-wrap">
        <div class="lock-inner">
          <div class="lock-info">
            <div class="lock-info-row">
              <span class="lock-info-title">Points earned</span>
              <span class="lock-info-value">{{
                formatTokenBalance(userPointsEarned)
              }}</span>
            </div>

            <div class="lock-info-row">
              <span class="lock-info-title">You deposited</span>
              <span class="lock-info-value">
                <img class="lock-token-icon" :src="fromToken.icon" alt="" />
                {{ formatAmount(fromToken.unlockAmount) }}</span
              >
            </div>

            <div class="line"></div>

            <div class="deposit-info">
              <div class="lock-info-row">
                <span class="lock-info-title">You deposited</span>
                <span class="lock-info-subtitle">
                  Lock your {{ activeToken }} and earn more Points
                </span>
              </div>

              <div class="lock-info-row">
                <span class="lock-info-value">
                  <img class="lock-token-icon" :src="fromToken.icon" alt="" />
                  {{ formatAmount(fromToken.unlockAmount) }}</span
                >

                <span class="lock-info-step">
                  3x <img src="@/assets/images/arrow-right.svg" alt="" /> 20x
                </span>
              </div>
            </div>

            <BaseButton
              primary
              :disabled="isLockDisabled"
              @click="lockHandler"
              >{{ lockButtonText }}</BaseButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits, parseUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { approveTokenViem } from "@/helpers/approval";
import { formatTokenBalance } from "@/helpers/filters";
import { lock } from "@/helpers/blast/stake/actions/lock";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { tokensChainLink } from "@/configs/chainLink/config";
import notification from "@/helpers/notification/notification";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { deposit } from "@/helpers/blast/stake/actions/deposit";
import { getTokenPriceByChain } from "@/helpers/prices/getTokenPriceByChain";

const BLAST_CHAIN_ID = 168587773;

export default {
  emits: ["updateStakeInfo"],

  props: {
    stakeInfo: {
      type: Object,
      required: true,
    },
    userPointsEarned: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      actionActiveTab: "Stake" as string,
      actionTabs: ["Stake", "Unstake"] as string[],
      activeToken: "MIM" as string,
      tokensList: ["MIM", "USDb"] as string[],
      isLock: false as boolean,
      inputValue: "" as string | bigint,
      inputAmount: BigInt(0) as bigint,
      mimPrice: 0 as number,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

    isStakeAction() {
      return this.actionActiveTab === "Stake";
    },

    isUnsupportedChain() {
      return this.chainId === BLAST_CHAIN_ID;
    },

    isTokenApproved() {
      if (!this.account) return true;
      if (!this.isStakeAction) return true;
      if (!this.isUnsupportedChain) return true;
      return this.fromToken.approvedAmount >= this.inputAmount;
    },

    isInsufficientBalance() {
      return this.inputAmount > this.fromToken.balance;
    },

    isActionDisabled() {
      if (!this.account) return false;
      if (!this.isUnsupportedChain) return false;
      if (!this.inputAmount) return true;
      return this.isInsufficientBalance;
    },

    isLockDisabled() {
      if (!this.account) return false;
      if (!this.isUnsupportedChain) return false;
      return !this.fromToken.unlockAmount;
    },

    token0() {
      const { name, icon, decimals, contract } =
        this.stakeInfo.config.tokens[0];
      const { balances, allowance, balance } =
        this.stakeInfo.tokensInfo[0].userInfo;

      return {
        icon,
        name,
        decimals,
        balance,
        contract,
        price: parseUnits(this.mimPrice.toString(), decimals),
        approvedAmount: allowance,
        unlockAmount: balances.unlocked,
      };
    },

    token1() {
      const { name, icon, decimals, contract } =
        this.stakeInfo.config.tokens[1];
      const { balances, allowance, balance } =
        this.stakeInfo.tokensInfo[1].userInfo;

      return {
        icon,
        name,
        decimals,
        balance,
        contract,
        price: 1000000000000000000n,
        approvedAmount: allowance,
        unlockAmount: balances.unlocked,
      };
    },

    fromToken() {
      return this.activeToken === "MIM" ? this.token0 : this.token1;
    },

    actionButtonText() {
      if (!this.account && this.isUnsupportedChain) return "Connect wallet";
      if (!this.isUnsupportedChain) return "Switch Network";
      if (this.isInsufficientBalance) return "Insufficient balance";
      if (!this.isTokenApproved) return "Approve";
      if (!this.isStakeAction) return "Withdraw";
      if (this.isLock) return "Deposit And Lock";
      return "Deposit";
    },

    lockButtonText() {
      if (!this.account && this.isUnsupportedChain) return "Connect wallet";
      if (!this.isUnsupportedChain) return "Switch Network";
      if (!this.fromToken.unlockAmount) return "Nothing to do";
      return "Lock";
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

    changeActionTab(action: string) {
      this.actionActiveTab = action;
    },

    changeActiveToken(token: string) {
      this.activeToken = token;
    },

    changeLockToggle() {
      this.isLock = !this.isLock;
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

      const approve = await approveTokenViem(
        this.fromToken.contract,
        this.stakeInfo.config.contract.address
      );

      if (approve) this.$emit("updateStakeInfo");
      await this.deleteNotification(notificationId);
      if (!approve) await this.createNotification(notification.approveError);
      return false;
    },

    async actionHandler() {
      if (this.isActionDisabled) return false;

      if (!this.account && this.isUnsupportedChain) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      if (!this.isUnsupportedChain) {
        switchNetwork(BLAST_CHAIN_ID);
        return false;
      }

      if (!this.isTokenApproved) {
        await this.approveTokenHandler();
        return false;
      }

      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error }: any = await deposit(
        this.stakeInfo.config.contract,
        this.fromToken.contract.address,
        this.inputAmount,
        this.isLock
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

    async lockHandler() {
      if (this.isLockDisabled) return false;

      if (!this.account && this.isUnsupportedChain) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      if (!this.isUnsupportedChain) {
        switchNetwork(BLAST_CHAIN_ID);
        return false;
      }

      if (!this.isTokenApproved) {
        await this.approveTokenHandler();
        return false;
      }

      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error }: any = await lock(
        this.stakeInfo.config.contract,
        this.fromToken.contract.address,
        this.fromToken.unlockAmount
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
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.actions-head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 32px;
  font-weight: 600;
  line-height: normal;
  padding-right: 12px;
  margin-bottom: 32px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.label {
  position: relative;
  top: 0;
  left: 0;
  height: 73px;
  max-width: 304px;
  width: 100%;
  border-radius: 12px 0 0 12px;
}

.tabs {
  margin-left: -16px;
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
  flex-wrap: wrap;
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
  font-size: 24px;
  font-weight: 500;
  line-height: normal;
}

.lock-info-subtitle {
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
}

.lock-token-icon {
  width: 32px;
  height: 32px;
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
  flex-direction: column;
  margin-bottom: 9px;
}

.lock-info-step {
  color: #fff;
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 21px;
  font-weight: 600;
  line-height: normal;
  display: flex;
  align-items: center;
}

@media (max-width: 600px) {
  .actions-head {
    flex-direction: column;
    align-items: start;
    gap: 16px;
    padding: 0 0 12px 0;
    margin-bottom: 16px;
  }

  .label {
    width: 60%;
    height: 60%;
  }

  .tabs {
    align-self: center;
  }

  .deposit-wrap {
    padding: 16px;
    gap: 16px;
  }

  .lock-info {
    padding: 12px 16px 16px;
  }

  .lock-info-value,
  .lock-info-step {
    font-size: 20px;
  }

  .lock-info-title {
    font-size: 16px;
  }

  .lock-info-subtitle {
    font-size: 14px;
    text-align: end;
  }
}
</style>
