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

    <RewardsList
      :rewards="rewardsPerHour"
      :inputAmount="inputAmount"
      :isRewardsCalculating="isRewardsCalculating"
    />

    <BaseButton primary @click="actionHandler" :disabled="isButtonDisabled">
      {{ buttonText }}
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import type { PropType } from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { formatUnits } from "viem";
import moment from "moment";
// @ts-ignore
import debounce from "lodash.debounce";
import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import { getRewardsPerHour } from "@/helpers/pools/getRewardsPerHour";
import { trimZeroDecimals } from "@/helpers/numbers";
import { approveTokenViem } from "@/helpers/approval";
import { formatTokenBalance } from "@/helpers/filters";
import notification from "@/helpers/notification/notification";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import type { PoolInfo } from "@/configs/pools/types";
import type { PointsStatistics } from "@/helpers/blast/stake/points";

export default {
  props: {
    pool: { type: Object as PropType<PoolInfo>, required: true },
    pointsStatistics: {
      type: Object as PropType<{
        user: PointsStatistics;
        global: PointsStatistics;
      }>,
      required: true,
    },
    slippage: {
      type: BigInt as unknown as PropType<bigint>,
      required: true,
    },
    deadline: {
      type: BigInt as unknown as PropType<bigint>,
      required: true,
    },
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

    isAllowed(): boolean {
      if (!this.pool.lockInfo) return false;
      return this.pool.lockInfo.allowance >= this.inputAmount;
    },

    isValid(): boolean {
      return !!this.inputAmount;
    },

    error(): string {
      if (this.inputAmount > this.pool.userInfo.balance)
        return "Insufficient balance";

      return "";
    },

    buttonText(): string {
      if (!this.isProperNetwork) return "Switch network";
      if (!this.account) return "Connect wallet";
      if (this.error) return this.error;
      if (this.inputValue == "") return "Enter amount";

      if (this.isActionProcessing) return "Processing...";
      if (!this.isAllowed) return "Approve";

      return this.isLock ? "Stake & lock" : "Stake";
    },

    isButtonDisabled(): boolean {
      return (
        (!this.isValid || !!this.error || this.isActionProcessing) &&
        this.isProperNetwork &&
        !!this.account
      );
    },

    isProperNetwork(): boolean {
      return this.chainId == this.pool.chainId;
    },
  },

  watch: {
    async inputAmount(value: bigint) {
      this.isRewardsCalculating = true;
      await this.getRewardsPerHour();

      if (value == 0n) {
        this.inputValue = "";
        return false;
      }

      this.inputValue = trimZeroDecimals(formatUnits(value, 18));
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    updateValue(value: bigint) {
      if (value === null) return (this.inputAmount = 0n);
      this.inputAmount = value;
    },

    resetInput() {
      this.inputValue = "";
      this.inputAmount = 0n;
    },

    getRewardsPerHour: debounce(async function getRewards(this: any) {
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

      try {
        if (!this.pool || !this.pool.lockContract)
          throw new Error("Current pool doesnt have lock contract");

        await approveTokenViem(
          this.pool.contract,
          this.pool.lockContract.address,
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

      try {
        if (!this.pool || !this.pool.lockContract)
          throw new Error("Current pool doesnt have lock contract");

        const { request } = await simulateContractHelper({
          address: this.pool.lockContract.address,
          abi: this.pool.lockContract.abi,
          functionName: "stake",
          args: [this.inputAmount],
        });

        const hash = await writeContractHelper(request);

        await waitForTransactionReceiptHelper({
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
        if (!this.pool || !this.pool.lockContract)
          throw new Error("Current pool doesnt have lock contract");

        const { request } = await simulateContractHelper({
          address: this.pool.lockContract.address,
          abi: this.pool.lockContract.abi,
          functionName: "stakeLocked",
          args: [this.inputAmount, now + 100],
        });

        const hash = await writeContractHelper(request);

        await waitForTransactionReceiptHelper({
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

    formatTokenBalance(value: bigint, decimals: number) {
      return formatTokenBalance(formatUnits(value, decimals));
    },
  },

  async created() {
    this.isRewardsCalculating = true;
    await this.getRewardsPerHour();
  },

  components: {
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    RewardsList: defineAsyncComponent(
      () => import("@/components/pools/pool/RewardsList.vue")
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
