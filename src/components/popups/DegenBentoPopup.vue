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

    <BaseButton
      v-if="!isApproved && isDeposit"
      :disabled="isDisabled"
      primary
      @click="approveToken"
      >Approve</BaseButton
    >
    <template v-else>
      <BaseButton @click="actionHandler" :disabled="isDisabled">{{
        buttonText
      }}</BaseButton>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import mimIcon from "@/assets/images/tokens/MIM.png";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification.js";
import filters from "@/filters/index.js";
import actions from "@/helpers/bentoBox/actions";
import { approveTokenViem } from "@/helpers/approval";

import { formatUnits, parseUnits } from "viem";

export default {
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
  computed: {
    ...mapGetters({
      account: "getAccount",
    }),

    parsedAmount() {
      return parseUnits(this.amount, 18);
    },

    activeContract() {
      return this.isBento
        ? this.infoObject.bentoContractInfo
        : this.infoObject.degenContractInfo;
    },

    isApproved() {
      return this.isBento
        ? this.infoObject.bentoAllowance > this.parsedAmount
        : this.infoObject.degenAllowance > this.parsedAmount;
    },

    balance() {
      const balance = this.isDeposit
        ? this.infoObject.mimBalance
        : this.isBento
        ? this.infoObject.mimInBentoBalance
        : this.infoObject.mimInDegenBalance;

      return formatUnits(balance.toString(), 18);
    },

    isDisabled() {
      return !this.isValid || !!this.error;
    },

    isValid() {
      return !!this.parsedAmount;
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

    buttonText() {
      return this.isDeposit ? "Deposit" : "Withdraw";
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },

    async actionHandler() {
      if (this.isDisabled) return false;
      if (this.isDeposit) {
        await this.deposit();
      } else {
        await this.withdraw();
      }
    },

    async withdraw() {
      const notificationId = await this.createNotification(
        notification.pending
      );
      const tokenAddress = this.infoObject.tokenInfo.address;
      const contractInfo = {
        address: this.activeContract.address,
        abi: this.activeContract.abi,
      };

      const { error } = await actions.withdraw(
        contractInfo,
        tokenAddress,
        this.account,
        this.parsedAmount
      );

      if (error) {
        const errorNotification = {
          msg: await notificationErrorMsg({ message: error.msg }),
          type: "error",
        };
        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      } else {
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      }

      this.closePopup();
    },

    async deposit() {
      const notificationId = await this.createNotification(
        notification.pending
      );
      const tokenAddress = this.infoObject.tokenInfo.address;
      const contractInfo = {
        address: this.activeContract.address,
        abi: this.activeContract.abi,
      };
      const { error } = await actions.deposit(
        contractInfo,
        tokenAddress,
        this.account,
        this.parsedAmount
      );

      if (error) {
        const errorNotification = {
          msg: await notificationErrorMsg({ message: error.msg }),
          type: "error",
        };
        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      } else {
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      }

      this.closePopup();
    },

    async approveToken() {
      if (this.isDisabled) return false;
      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const mimContractInfo = {
        address: this.infoObject.tokenInfo.address,
        abi: this.infoObject.tokenInfo.abi,
      };

      const approve = await approveTokenViem(
        mimContractInfo,
        this.activeContract.address
      );

      if (approve) await this.createStakeInfo();
      await this.deleteNotification(notificationId);

      if (!approve) await this.createNotification(notification.approveError);

      return false;
    },

    closePopup() {
      this.$emit("close");
    },
  },

  beforeUnmount() {
    clearInterval(this.updateInfoInterval);
  },

  components: { BaseTokenInput, BaseButton },
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
