<template>
  <div v-if="tokensInfo">
    <div class="collateral-input underline">
      <div class="header-balance">
        <h4>Collateral assets</h4>
        <p v-if="fromToken.balance">
          {{  formatTokenBalance(fromToken.balance) }}
        </p>
      </div>

      <BaseTokenInput
        :icon="fromToken.icon"
        :name="fromToken.name"
        :value="amount"
        :max="fromToken.balance || 0"
        @input="updateMainValue"
        :error="amountError"
      />
    </div>

    <div class="refresh-wrap">
      <img
        class="refresh-img"
        src="@/assets/images/refresh.svg"
        @click="toggleAction"
        alt="refresh"
      />
    </div>

    <div class="collateral-input underline">
      <div class="header-balance">
        <h4>Collateral assets</h4>
        <p v-if="toToken.balance">
          {{ formatTokenBalance(toToken.balance) }}
        </p>
      </div>

      <BaseTokenInput
        :value="toTokenAmount"
        :icon="toToken.icon"
        :name="toToken.name"
        :disabled="true"
      />
    </div>

    <BaseButton @click="actionHandler" :disabled="disabledBtn" primary>{{
      actionBtnText
    }}</BaseButton>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";

import olimpusStake from "@/mixins/getCollateralLogic/olimpusStake";
import { approveToken } from "@/utils/approveHelpers.js";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification.js";
import { mapGetters } from "vuex";

export default {
  mixins: [olimpusStake],
  data() {
    return {
      action: "Stake",
      amount: "",
      amountError: "",
      updateInterval: null,
      tokensInfo: null,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount" }),

    fromToken() {
      if (this.action === "Stake") return this.tokensInfo.stakeToken;
      if (this.action === "Unstake") return this.tokensInfo.mainToken;

      return "";
    },

    toToken() {
      if (this.action === "Stake") return this.tokensInfo.mainToken;
      if (this.action === "Unstake") return this.tokensInfo.stakeToken;

      return "";
    },

    toTokenAmount() {
      if (!this.amount) return "";
      if (!this.tokensInfo) return "";

      if (this.action === "Stake") {
        const amount = this.amount / this.tokensInfo.tokensRate;
        return filters.formatToFixed(amount, 6);
      }
      if (this.action === "Unstake") {
        const amount = this.amount * this.tokensInfo.tokensRate;
        return filters.formatToFixed(amount, 6);
      }
      return "";
    },

    actionBtnText() {
      if (!this.isTokenApprove) {
        return "Approve";
      }

      return this.action;
    },

    disabledBtn() {
      if (this.actionBtnText === "Nothing to do") return true;
      return false;
    },

    rateInfo() {
      const ohm = this.tokensInfo.tokensRate;

      return `1 sOHM = ${parseFloat(ohm).toFixed(4)} OHM`;
    },

    isTokenApprove() {
      if (this.tokensInfo && this.account) {
        if (this.action === "Stake") {
          return this.tokensInfo.stakeToken.isTokenApprowed;
        }

        if (this.action === "Unstake") {
          return this.tokensInfo.mainToken.isTokenApprowed;
        }
      }

      return true;
    },
  },

  methods: {
    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },
    toggleAction() {
      this.amount = "";
      this.amountError = "";

      if (this.action === "Stake") {
        this.action = "Unstake";
        this.$emit("toggleAction", this.action);
        return false;
      }

      if (this.action === "Unstake") {
        this.action = "Stake";
        this.$emit("toggleAction", this.action);
        return false;
      }
    },

    updateMainValue(value) {
      if (+value > +this.fromToken.balance) {
        this.amountError = `The value cannot be greater than ${this.fromToken.balance}`;
        return false;
      }

      this.amountError = "";
      this.amount = value;
    },

    async actionHandler() {
      if (!this.isTokenApprove) {
        const notificationId = await this.$store.dispatch(
          "notifications/new",
          notification.approvePending
        );

        let approve;

        if (this.action === "Stake") {
          approve = await approveToken(
            this.tokensInfo.stakeToken.contractInstance,
            this.tokensInfo.stakeContractInstance.address
          );
        }

        if (this.action === "Unstake") {
          approve = await approveToken(
            this.tokensInfo.mainToken.contractInstance,
            this.tokensInfo.unstakeContractInstance.address
          );
        }

        if (approve) {
          await this.$store.commit("notifications/delete", notificationId);
        } else {
          await this.$store.commit("notifications/delete", notificationId);
          await this.$store.dispatch(
            "notifications/new",
            notification.approveError
          );
        }

        return false;
      }

      if (!+this.amount || this.amountError) return false;

      if (this.action === "Stake") {
        await this.stake();
        return false;
      }

      if (this.action === "Unstake") {
        await this.unstake();
        return false;
      }
    },

    async stake() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );
      try {
        const amount = this.$ethers.utils.parseUnits(
          this.amount,
          this.tokensInfo.stakeToken.decimals
        );

        const estimateGas =
          await this.tokensInfo.stakeContractInstance.estimateGas.stake(amount);

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.tokensInfo.stakeContractInstance.stake(amount, {
          gasLimit,
        });

        this.amount = "";
        this.amountError = "";

        const receipt = await tx.wait();

        console.log("stake", receipt);
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", notification.success);
      } catch (e) {
        console.log("stake err:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    async unstake() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );
      try {
        const amount = this.$ethers.utils.parseUnits(
          this.amount,
          this.tokensInfo.mainToken.decimals
        );

        const estimateGas =
          await this.tokensInfo.unstakeContractInstance.estimateGas.unstake(
            amount,
            true
          );

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.tokensInfo.unstakeContractInstance.unstake(
          amount,
          true,
          {
            gasLimit,
          }
        );

        this.amount = "";
        this.amountError = "";

        const receipt = await tx.wait();

        console.log("stake", receipt);
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", notification.success);
      } catch (e) {
        console.log("stake err:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },
  },

  async created() {
    this.$emit("toggleAction", "Stake");
    this.tokensInfo = await this.createOlimpusStake();

    this.updateInterval = setInterval(async () => {
      this.tokensInfo = await this.createOlimpusStake();
    }, 10000);
  },

  beforeDestroy() {
    clearInterval(this.updateInterval);
  },

  components: {
    BaseTokenInput,
    BaseButton,
  },
};
</script>

<style lang="scss" scoped>
.refresh-wrap {
  display: flex;
  padding: 15px 0;
  justify-content: center;
}

.refresh-img {
  cursor: pointer;
  width: 24px;
  height: 24px;
}
</style>
