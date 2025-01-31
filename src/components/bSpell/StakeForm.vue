<template>
  <div class="stake-form" v-if="bSpellInfo">
    <div class="inputs-wrap">
      <BaseTokenInput
        :value="inputValue"
        :icon="bSpellInfo.bSpell?.icon"
        :name="bSpellInfo.bSpell?.name"
        :max="bSpellInfo.bSpell?.balance"
        :tokenPrice="bSpellInfo.bSpell?.price"
        @updateInputValue="updateMainValue"
      />
    </div>

    <div class="lock-info">
      <img src="@/assets/images/stake/lock.svg" alt="Lock icon" />

      <span>Unstaking is locked for 7 days after staking</span>
    </div>

    <div class="reward-info" v-if="aprInfo">
      <div class="apr-info">
        <div class="row">
          <img
            class="reward-icon"
            src="@/assets/images/stake/staking-apr.png"
            alt="Staking apr icon"
          />
          <span class="apr-title">Staking APR</span>
        </div>

        <div class="tokens-info-wrap">
          <div class="tokens-info">
            <img
              class="token-icon"
              :src="tokenInfo.icon"
              v-for="tokenInfo in aprInfo.tokensApr"
              :key="tokenInfo.name"
              :alt="`${tokenInfo.name} icon`"
            />
          </div>
          <span class="apr-percent">{{ aprInfo.totalApr }}%</span>
        </div>
      </div>

      <div class="tokens-apr-info">
        <div
          class="token-apr-info"
          v-for="tokenInfo in aprInfo.tokensApr"
          :key="tokenInfo.name"
        >
          <div class="token-info">
            <img
              class="token-apr-icon"
              :src="tokenInfo.icon"
              :alt="`${tokenInfo.name} icon`"
            />

            <span>{{ tokenInfo.name }}</span>
          </div>
          <div class="token-apr-percent">{{ tokenInfo.apr }}%</div>
        </div>
      </div>
    </div>

    <BaseButton primary :disabled="isActionDisabled" @click="actionHandler">
      {{ actionButtonText }}
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import type { PropType } from "vue";
import { defineAsyncComponent } from "vue";
import { approveTokenViem } from "@/helpers/approval";
import { stake } from "@/helpers/bSpell/actions/stake";
import { mapActions, mapGetters, mapMutations } from "vuex";
import ErrorHandler from "@/helpers/errorHandler/ErrorHandler";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import notification from "@/helpers/notification/notification";
import type { AprInfo, BSpellInfo } from "@/helpers/bSpell/types";
import moment from "moment";

export default {
  emits: ["updateBSpellInfo"],

  props: {
    aprInfo: {
      type: Object as PropType<AprInfo | null>,
      required: true,
    },

    selectedNetwork: {
      type: Number,
      required: true,
    },

    bSpellInfo: {
      type: Object as PropType<BSpellInfo | null>,
      required: true,
    },
  },

  data() {
    return {
      inputValue: "" as string | bigint,
      inputAmount: BigInt(0),
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),

    isUnsupportedChain() {
      return this.chainId === this.selectedNetwork;
    },

    isInsufficientBalance() {
      return this.inputAmount > (this.bSpellInfo?.bSpell?.balance || 0n);
    },

    isActionDisabled() {
      if (!this.bSpellInfo) return true;
      if (!this.bSpellInfo.stakeInfo) return true;
      if (!this.account) return false;
      if (!this.isUnsupportedChain) return false;
      if (!this.inputAmount) return true;
      return this.isInsufficientBalance;
    },

    isTokenApproved() {
      if (!this.inputAmount) return true;
      if (!this.account) return true;
      if (!this.isUnsupportedChain) return true;
      if (!this.bSpellInfo?.stakeInfo) return true;

      return this.bSpellInfo.stakeInfo?.approvedAmount >= this.inputAmount;
    },

    actionButtonText() {
      if (!this.account && this.isUnsupportedChain) return "Connect wallet";
      if (!this.isUnsupportedChain) return "Switch Network";
      if (this.isInsufficientBalance) return "Insufficient balance";
      if (!this.isTokenApproved) return "Approve";
      return "Stake";
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    updateMainValue(amount: bigint) {
      if (!amount) {
        this.inputValue = "";
        this.inputAmount = BigInt(0);
      } else {
        this.inputAmount = amount;
        this.inputValue = formatUnits(amount, 18);
      }
    },

    async approveTokenHandler() {
      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveTokenViem(
        this.bSpellInfo!.bSpell.contract,
        this.bSpellInfo!.stakeInfo!.contract.address,
        this.inputAmount
      );

      if (approve) this.$emit("updateBSpellInfo");
      this.deleteNotification(notificationId);

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
        switchNetwork(this.selectedNetwork);
        return false;
      }

      if (!this.isTokenApproved) return await this.approveTokenHandler();
      this.stakeHandler();
    },

    async stakeHandler() {
      try {
        const notificationId = await this.createNotification(
          notification.pending
        );

        await stake(this.bSpellInfo!.stakeInfo!.contract, this.inputAmount);
        this.$emit("updateBSpellInfo");
        this.inputValue = "";
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      } catch (error) {
        ErrorHandler.handleError(error as Error);
      }
    },
  },

  components: {
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    Timer: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/stake/earnPoints/Timer.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.stake-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.inputs-wrap {
  position: relative;
  gap: 16px;
  display: flex;
  flex-direction: column;
}

.warning {
  border-radius: 12px;
  border: 1px solid var(--Primary-Gradient, #2d4a96);
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  padding: 12px;
  font-size: 14px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lock-info {
  border-radius: 12px;
  border: 1px solid var(--Primary-Gradient, #2d4a96);
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  padding: 12px;
  gap: 8px;
  display: flex;
  align-items: center;
}

.reward-info {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.apr-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.row {
  gap: 12px;
  display: flex;
  align-items: center;
}

.reward-icon {
  width: 48px;
  height: 48px;
}

.apr-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
}

.tokens-info-wrap {
  gap: 4px;
  display: flex;
  align-items: center;
}

.tokens-info {
  display: flex;
  align-items: center;
}

.token-icon {
  width: 24px;
  height: 24px;

  &:not(:first-child) {
    margin-left: -4px;
  }
}

.apr-percent {
  color: #fff;
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 23px;
  font-weight: 600;
  line-height: normal;
}

.tokens-apr-info {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.token-apr-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.token-info {
  gap: 12px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
}

.token-apr-icon {
  width: 24px;
  height: 24px;
}

.token-apr-percent {
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
}

@media screen and (max-width: 600px) {
  .stake-form {
    gap: 16px;
  }

  .lock-info {
    font-size: 14px;
  }

  .apr-info {
    margin-bottom: 8px;
  }

  .reward-icon {
    width: 40px;
    height: 40px;
  }

  .apr-percent {
    font-size: 20px;
  }

  .tokens-apr-info {
    gap: 8px;
  }

  .apr-title,
  .token-info,
  .token-apr-percent {
    font-size: 16px;
  }
}
</style>
