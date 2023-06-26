<template>
  <div class="box-popup">
    <p class="title">{{ title }}</p>
    <div>
      <div>
        <div class="header-balance">
          <h4>Collateral assets</h4>
          <p>Balance: {{ formatTokenBalance(balance) }}</p>
        </div>

        <BaseTokenInput
          :icon="mimIcon"
          name="MIM"
          :value="amount"
          @updateValue="amount = $event"
          :max="balance"
          :error="error"
        />
      </div>
    </div>

    <BaseButton v-if="!isApproved && isDeposit" primary @click="approveToken"
      >Approve</BaseButton
    >
    <template v-else>
      <BaseButton
        v-if="isDeposit"
        @click="deposit"
        :disabled="!isValid || !!error"
        >Deposit</BaseButton
      >
      <BaseButton v-else @click="withdraw" :disabled="!isValid || !!error"
        >Withdraw</BaseButton
      >
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import mimIcon from "@/assets/images/tokens/MIM.png";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification.js";
import filters from "@/filters/index.js";

import { approveToken } from "@/utils/approveHelpers.js";

import {
  getPublicClient,
  getWalletClient,
  waitForTransaction,
} from "@wagmi/core";

export default {
  components: { BaseTokenInput, BaseButton },
  props: {
    infoObject: {
      type: Object,
      required: true,
    },
    isBento: { type: Boolean, default: false },
    isDeposit: { type: Boolean, default: false },
  },
  data() {
    return {
      amount: "",
      mimIcon,
      updateInfoInterval: null,
    };
  },
  methods: {
    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },
    async withdraw() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );
      try {
        const publicClient = await getPublicClient();
        const walletClient = await getWalletClient();

        const amount = this.$ethers.utils.parseEther(this.amount);
        const account = this.account;
        const tokenAddress = this.infoObject.mimContract.address;

        const contract = this.activeContract;

        const { request } = await publicClient.simulateContract({
          address: contract.address,
          abi: contract.interface.fragments,
          functionName: "withdraw",
          args: [tokenAddress, account, account, amount, "0"],
          chain: publicClient.chain,
          account: this.account,
        });

        const { hash } = await walletClient.writeContract(request);

        await waitForTransaction({
          hash,
        });

        this.closePopup();

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", notification.success);
      } catch (e) {
        console.log("withdraw err:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },
    async deposit() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );
      try {
        const publicClient = await getPublicClient();
        const walletClient = await getWalletClient();

        const amount = this.$ethers.utils.parseEther(this.amount);
        const account = this.account;
        const tokenAddress = this.infoObject.mimContract.address;

        const contract = this.activeContract;

        const { request } = await publicClient.simulateContract({
          address: contract.address,
          abi: contract.interface.fragments,
          functionName: "deposit",
          args: [tokenAddress, account, account, amount, "0"],
          chain: publicClient.chain,
          account: this.account,
        });

        const { hash } = await walletClient.writeContract(request);

        await waitForTransaction({
          hash,
        });

        console.log("deposit", receipt);

        this.closePopup();
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", notification.success);
      } catch (e) {
        console.log("deposit err:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },
    async approveToken() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.approvePending
      );

      const approve = await approveToken(
        this.selectedPool.stakingTokenContract,
        this.selectedPool.contractAddress
      );

      if (approve) {
        await this.$store.commit("notifications/delete", notificationId);
      } else {
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.approveError
        );
      }
    },
    closePopup() {
      this.$emit("close");
    },
  },
  computed: {
    ...mapGetters({
      account: "getAccount",
    }),
    activeContract() {
      return this.isBento
        ? this.infoObject.bentoBoxContract
        : this.infoObject.degenBoxContract;
    },
    isApproved() {
      return this.isBento
        ? this.infoObject.bentoAllowance
        : this.infoObject.degenAllowance;
    },
    balance() {
      const balance = this.isDeposit
        ? this.infoObject.mimBalance
        : this.isBento
        ? this.infoObject.mimInBentoBalance
        : this.infoObject.mimInDegenBalance;

      return this.$ethers.utils.formatEther(balance.toString());
    },
    isValid() {
      return !!(this.amount && +this.amount);
    },
    error() {
      if (+this.amount > +this.balance)
        return `The value cannot be greater than ${this.balance}`;
      return null;
    },
    title() {
      return `${this.isBento ? "BentoBox" : "DegenBox"} ${
        this.isDeposit ? "Deposit" : "Withdraw"
      }`;
    },
  },
  beforeUnmount() {
    clearInterval(this.updateInfoInterval);
  },
};
</script>

<style lang="scss" scoped>
.box-popup {
  display: grid;
  grid-template-rows: auto 1fr;
  padding: 0 10px;
  width: 490px;
  max-width: 100%;
  height: 300px;
}
.title {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  padding: 8px 0 18px 0;
  margin-bottom: 38px;
  border-bottom: solid 1px rgba(255, 255, 255, 0.1);
}
</style>
