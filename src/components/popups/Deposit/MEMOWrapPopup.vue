<template>
  <div class="popup" v-if="tokensInfo">
    <div class="popup-header">
      <p class="title">{{ action }}</p>
      <img
        class="close"
        @click="closePopup"
        src="@/assets/images/close.svg"
        alt="close"
      />
    </div>

    <div class="collateral-input underline">
      <div class="header-balance">
        <h4>Collateral assets</h4>
        <p v-if="fromToken.balance">
          {{ formatTokenBalance(fromToken.balance) }}
        </p>
      </div>

      <BaseTokenInput
        :icon="fromToken.icon"
        :name="fromToken.name"
        :value="amount"
        :max="fromToken.balance || 0"
        @updateValue="updateMainValue"
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

import memoWrap from "@/mixins/getCollateralLogic/memoWrap";
import { mapGetters } from "vuex";

import { approveToken } from "@/utils/approveHelpers.js";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification.js";
export default {
  mixins: [memoWrap],
  data() {
    return {
      action: "Wrap",
      amount: "",
      amountError: "",
      updateInterval: null,
      tokensInfo: null,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount" }),

    fromToken() {
      if (this.action === "Wrap") return this.tokensInfo.depositToken;
      if (this.action === "Unwrap") return this.tokensInfo.mainToken;

      return "";
    },

    toToken() {
      if (this.action === "Wrap") return this.tokensInfo.mainToken;
      if (this.action === "Unwrap") return this.tokensInfo.depositToken;

      return "";
    },

    toTokenAmount() {
      if (!this.amount) return "";
      if (!this.tokensInfo) return "";

      if (this.action === "Wrap") {
        const amount = this.amount * this.tokensInfo.tokensRate;

        return filters.formatToFixed(amount, 6);
      }
      if (this.action === "Unwrap") {
        const amount = this.amount / this.tokensInfo.tokensRate;

        return filters.formatToFixed(amount, 6);
      }
      return "";
    },

    actionBtnText() {
      if (!+this.amount || this.amountError) return "Nothing to do";

      if (!this.isTokenApprove) {
        return "Approve";
      }

      return this.action;
    },

    disabledBtn() {
      if (this.actionBtnText === "Nothing to do") return true;
      return false;
    },

    isTokenApprove() {
      if (this.tokensInfo && this.account) {
        return this.tokensInfo.depositToken.isTokenApprowed;
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

      if (this.action === "Wrap") {
        this.action = "Unwrap";
        return false;
      }

      if (this.action === "Unwrap") {
        this.action = "Wrap";
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

        let approve = await approveToken(
          this.tokensInfo.depositToken.contractInstance,
          this.tokensInfo.mainToken.contractInstance.address
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

        return false;
      }

      if (!+this.amount || this.amountError) return false;

      if (this.action === "Wrap") {
        await this.deposit();
        return false;
      }
      if (this.action === "Unwrap") {
        await this.withdraw();
        return false;
      }
    },

    async deposit() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );
      try {
        let methodName = "wrap";

        const amount = this.$ethers.utils.parseUnits(
          this.amount,
          this.tokensInfo.depositToken.decimals
        );

        const estimateGas =
          await this.tokensInfo.mainToken.contractInstance.estimateGas[
            methodName
          ](amount);

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.tokensInfo.mainToken.contractInstance[methodName](
          amount,
          {
            gasLimit,
          }
        );

        this.amount = "";
        this.amountError = "";

        const receipt = await tx.wait();

        console.log("WRAP", receipt);
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", notification.success);
      } catch (e) {
        console.log("WRAP err:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    async withdraw() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );
      try {
        let methodName = "unwrap";

        const amount = this.$ethers.utils.parseUnits(
          this.amount,
          this.tokensInfo.mainToken.decimals
        );

        const estimateGas =
          await this.tokensInfo.mainToken.contractInstance.estimateGas[
            methodName
          ](amount);

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.tokensInfo.mainToken.contractInstance[methodName](
          amount,
          {
            gasLimit,
          }
        );

        this.amount = "";
        this.amountError = "";

        const receipt = await tx.wait();

        console.log("Deposit", receipt);
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

    closePopup() {
      this.$store.commit("closePopups");
    },
  },

  async created() {
    this.tokensInfo = await this.createMEMOWrapObj();

    this.updateInterval = setInterval(async () => {
      this.tokensInfo = await this.createMEMOWrapObj();
    }, 10000);
  },
  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    BaseTokenInput,
    BaseButton,
  },
};
</script>

<style lang="scss" scoped>
.popup {
  background: #302e38;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  padding: 15px 25px;
  max-width: 540px;
  width: 100%;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 40px;
}

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

.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
}

.close {
  width: 14px;
  height: 14px;
  cursor: pointer;
}
</style>
