<template>
  <div class="pool-action-block">
    <div class="inputs-wrap">
      <BaseTokenInput
        :name="pool.name"
        :icon="pool.icon"
        :decimals="pool.decimals"
        :max="pool.userInfo.balance"
        :value="inputValue"
        :tokenPrice="pool.price"
        @updateInputValue="updateValue($event)"
      />
    </div>

    <RewardsCard
      :pool="pool"
    />

    <RewardsList
      v-if="isBlastLockLogic"
      :rewards="rewardsPerHour"
      :inputAmount="inputAmount"
      :isRewardsCalculating="isRewardsCalculating"
    />

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
import debounce from "lodash.debounce";
import { getRewardsPerHour } from "@/helpers/pools/getRewardsPerHour";
import moment from "moment";
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { trimZeroDecimals } from "@/helpers/numbers";
import { approveTokenViem } from "@/helpers/approval";
import { formatTokenBalance } from "@/helpers/filters";
import { mapActions, mapGetters, mapMutations } from "vuex";
import notification from "@/helpers/notification/notification";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export default {
  props: {
    pool: { type: Object },
    pointsStatistics: { type: Object },
    slippage: { type: BigInt, default: 100n },
    deadline: { type: BigInt, default: 100n },
    isLock: { type: Boolean },
  },

  emits: ["updatePoolInfo"],

  data() {
    return {
      inputAmount: 0n,
      inputValue: "",
      isActionProcessing: false,
      isRewardsCalculating: false,
      rewardsPerHour: {
        pointsReward: 0,
        goldReward: 0,
      },
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

    isAllowed() {
      if (this.isBlastLockLogic)
        return this.pool.lockInfo.allowance >= this.inputAmount;
      return this.pool.stakeInfo.allowance >= this.inputAmount;
    },

    isValid() {
      return !!this.inputAmount;
    },

    error() {
      if (this.inputAmount > this.pool.userInfo.balance)
        return "Insufficient balance";

      return null;
    },

    buttonText() {
      if (!this.isProperNetwork) return "Switch network";
      if (!this.account) return "Connect wallet";
      if (this.error) return this.error;
      if (this.inputValue == "") return "Enter amount";

      if (this.isActionProcessing) return "Processing...";
      if (!this.isAllowed) return "Approve";

      return this.isLock ? "Stake & lock" : "Stake";
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
    async inputAmount(value) {
      if (this.isBlastLockLogic) this.fetchBlastRewards();

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

    fetchBlastRewards() {
      this.isRewardsCalculating = true;
      this.getRewardsPerHour();
    },

    getRewardsPerHour: debounce(async function getRewards() {
      const deposit =
        Number(formatUnits(this.inputAmount, this.pool.decimals)) *
          this.pool.price || 1000;

      this.rewardsPerHour = await getRewardsPerHour(
        this.pool,
        this.pointsStatistics.global,
        deposit
      );
      this.isRewardsCalculating = false;
    }, 500),

    async approveHandler() {
      this.isActionProcessing = true;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const contract = this.isBlastLockLogic
        ? this.pool.lockContract
        : this.pool.stakeContract;

      try {
        await approveTokenViem(
          this.pool.contract,
          contract.address,
          this.inputAmount
        );
        await this.$emit("updatePoolInfo");

        await this.deleteNotification(notificationId);
      } catch (error) {
        console.log("approve err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
      this.isActionProcessing = false;
    },

    async stakeHandler() {
      this.isActionProcessing = true;

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
          functionName: "stake",
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
        console.log("stake lp err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
      this.isActionProcessing = false;
    },

    async stakeLockedHandler() {
      this.isActionProcessing = true;

      const now = moment().unix();
      const notificationId = await this.createNotification(
        notification.pending
      );

      try {
        const { request } = await simulateContractHelper({
          address: this.pool.lockContract.address,
          abi: this.pool.lockContract.abi,
          functionName: "stakeLocked",
          args: [this.inputAmount, now + 100],
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
        console.log("stakeLocked lp err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
      this.isActionProcessing = false;
    },

    async actionHandler() {
      if (this.isButtonDisabled) return false;
      if (!this.isProperNetwork) return switchNetwork(this.pool.chainId);
      if (!this.account) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      if (!this.isAllowed) return await this.approveHandler();

      if (this.isLock) {
        await this.stakeLockedHandler();
      } else {
        await this.stakeHandler();
      }

      await this.$emit("updatePoolInfo");
    },

    formatTokenBalance(value, decimals) {
      return formatTokenBalance(formatUnits(value, decimals));
    },
  },

  async created() {
    if (this.isBlastLockLogic) this.fetchBlastRewards();
  },

  components: {
    BaseTokenInput: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenInput.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    RewardsList: defineAsyncComponent(() =>
      import("@/components/pools/pool/RewardsList.vue")
    ),
    RewardsCard: defineAsyncComponent(() =>
      import("@/components/pools/pool/RewardsCard.vue")
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
