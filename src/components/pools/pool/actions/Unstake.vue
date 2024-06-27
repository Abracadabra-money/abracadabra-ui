<template>
  <div class="pool-action-block">
    <div class="inputs-wrap">
      <BaseTokenInput
        :name="pool.name"
        :icon="pool.icon"
        :decimals="pool.decimals"
        :max="maxToWithdraw"
        :value="inputValue"
        :tokenPrice="pool.price"
        @updateInputValue="updateValue($event)"
      />
    </div>

    <BaseButton primary @click="actionHandler" :disabled="isButtonDisabled">
      {{ buttonText }}
    </BaseButton>
  </div>
</template>

<script>
import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { trimZeroDecimals } from "@/helpers/numbers";
import { formatTokenBalance } from "@/helpers/filters";
import { mapActions, mapGetters, mapMutations } from "vuex";
import notification from "@/helpers/notification/notification";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export default {
  props: {
    pool: { type: Object },
    slippage: { type: BigInt, default: 100n },
    deadline: { type: BigInt, default: 100n },
  },

  emits: ["updatePoolInfo"],

  data() {
    return {
      inputAmount: 0n,
      inputValue: "",
      isActionProcessing: false,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

    isBlastLockLogic() {
      return !!this.pool.lockInfo;
    },

    maxToWithdraw() {
      if (this.isBlastLockLogic) return this.pool.lockInfo?.balances?.unlocked;

      return this.pool.stakeInfo?.balance;
    },

    isValid() {
      return !!this.inputAmount;
    },

    error() {
      if (this.inputAmount > this.maxToWithdraw)
        return "Insufficient balance";

      return null;
    },

    buttonText() {
      if (!this.isProperNetwork) return "Switch network";
      if (!this.account) return "Connect wallet";
      if (this.error) return this.error;
      if (this.inputValue == "") return "Enter amount";

      if (this.isActionProcessing) return "Processing...";

      return "Unstake";
    },

    isButtonDisabled() {
      return (
        (!this.isValid || !!this.error || this.isActionProcessing) &&
        this.isProperNetwork &&
        !!this.account
      );
    },

    isProperNetwork() {
      return this.chainId == this.pool.chainId;
    },
  },

  watch: {
    inputAmount(value) {
      if (value == 0) {
        this.inputValue = "";
        return false;
      }

      this.inputValue = trimZeroDecimals(formatUnits(value, 18));
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    updateValue(value) {
      if (value === null) return (this.inputAmount = 0n);
      this.inputAmount = value;
    },

    resetInput() {
      this.inputValue = "";
      this.inputAmount = 0n;
    },

    async unstakeHandler() {
      const notificationId = await this.createNotification(
        notification.pending
      );

      const contract = this.isBlastLockLogic
        ? this.pool.lockContract
        : this.pool.stakeContract;

      try {
        const { request } = await simulateContractHelper({
          address: contract.address,
          abi: contract.abi,
          functionName: "withdraw",
          args: [this.inputAmount],
        });

        const hash = await writeContractHelper(request);

        const { result, error } = await waitForTransactionReceiptHelper({
          hash,
        });

        await this.$emit("updatePoolInfo");

        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
        this.resetInput();
      } catch (error) {
        console.log("unstake lp err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
    },

    async actionHandler() {
      if (this.isButtonDisabled) return false;
      if (!this.isProperNetwork) return switchNetwork(this.pool.chainId);
      if (!this.account) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      this.isActionProcessing = true;

      await this.unstakeHandler();

      await this.$emit("updatePoolInfo");

      this.isActionProcessing = false;
    },

    formatTokenBalance(value, decimals) {
      return formatTokenBalance(formatUnits(value, decimals));
    },
  },

  components: {
    BaseTokenInput: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenInput.vue")
    ),
    // BaseTokenIcon: defineAsyncComponent(() =>
    //   import("@/components/base/BaseTokenIcon.vue")
    // ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-action-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.inputs-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.plus-icon {
  position: absolute;
  top: calc(50% - 28px);
  left: calc(50% - 28px);
  width: 46px;
  height: 46px;
}

.info-blocks {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.token-amount {
  display: flex;
  flex-direction: column;
  align-items: end;
}

.value {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.value,
.title {
  display: flex;
  align-items: center;
}

.apr {
  color: #fff;
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 16px;
  font-weight: 600;
}

.usd-equivalent {
  color: #575c62;
  font-size: 16px;
  font-weight: 400;
}
</style>
