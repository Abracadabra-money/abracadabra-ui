<template>
  <div v-if="tokensInfo">
    <div class="collateral-input underline">
      <div class="header-balance">
        <h4>Collateral assets</h4>
        <p v-if="fromToken.balance">
          {{ fromToken.balance | formatTokenBalance }}
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
          {{ toToken.balance | formatTokenBalance }}
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
const BaseTokenInput = () => import("@/components/base/BaseTokenInput");
const BaseButton = () => import("@/components/base/BaseButton");

import olimpusWrap from "@/mixins/getCollateralLogic/olimpusWrap";
import { approveToken } from "@/utils/approveHelpers.js";
import notification from "@/utils/notification/index.js";
import { mapGetters } from "vuex";

export default {
  mixins: [olimpusWrap],
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
      if (this.action === "Wrap") return this.tokensInfo.stakeToken;
      if (this.action === "Unwrap") return this.tokensInfo.mainToken;

      return "";
    },

    toToken() {
      if (this.action === "Wrap") return this.tokensInfo.mainToken;
      if (this.action === "Unwrap") return this.tokensInfo.stakeToken;

      return "";
    },

    toTokenAmount() {
      if (!this.amount) return "";
      if (!this.tokensInfo) return "";

      // eslint-disable-next-line no-useless-escape
      let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (6 || -1) + `})?`);

      if (this.action === "Wrap") {
        const amount = this.amount * this.tokensInfo.stakeToMain;
        return amount.toString().match(re)[0];
      }
      if (this.action === "Unwrap") {
        const amount = this.amount * this.tokensInfo.mainToStake;
        return amount.toString().match(re)[0];
      }
      return "";
    },

    actionBtnText() {
      if (!this.isTokenApprove) {
        return "Approve";
      }

      if (!+this.amount || this.amountError) return "Nothing to do";

      return this.action;
    },

    disabledBtn() {
      if (this.actionBtnText === "Nothing to do") return true;
      return false;
    },

    isTokenApprove() {
      if (this.tokensInfo && this.account) {
        if (this.action === "Wrap") {
          return this.tokensInfo.stakeToken.isTokenApprowed;
        }
      }

      return true;
    },
  },

  methods: {
    toggleAction() {
      this.amount = "";
      this.amountError = "";

      if (this.action === "Wrap") {
        this.action = "Unwrap";
        this.$emit("toggleAction", this.action);
        return false;
      }

      if (this.action === "Unwrap") {
        this.action = "Wrap";
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
          notification.approve.pending
        );

        let approve = await approveToken(
          this.tokensInfo.stakeToken.contractInstance,
          this.tokensInfo.mainToken.contractInstance.address
        );

        if (approve) {
          await this.$store.commit("notifications/delete", notificationId);
        } else {
          await this.$store.commit("notifications/delete", notificationId);
          await this.$store.dispatch(
            "notifications/new",
            notification.approve.error
          );
        }

        return false;
      }

      if (!+this.amount || this.amountError) return false;

      if (this.action === "Wrap") {
        await this.wrap();
        return false;
      }

      if (this.action === "Unwrap") {
        await this.unwrap();
        return false;
      }
    },

    async wrap() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.transaction.pending
      );
      try {
        const amount = this.$ethers.utils.parseUnits(
          this.amount,
          this.tokensInfo.stakeToken.decimals
        );

        const estimateGas =
          await this.tokensInfo.mainToken.contractInstance.estimateGas.wrap(
            amount
          );

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.tokensInfo.mainToken.contractInstance.wrap(
          amount,
          {
            gasLimit,
          }
        );

        this.amount = "";
        this.amountError = "";

        const receipt = await tx.wait();

        console.log("wrap", receipt);
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.success
        );
      } catch (e) {
        console.log("wrap err:", e);
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.error
        );
      }
    },
    async unwrap() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.transaction.pending
      );
      try {
        const amount = this.$ethers.utils.parseUnits(
          this.amount,
          this.tokensInfo.mainToken.decimals
        );

        const estimateGas =
          await this.tokensInfo.mainToken.contractInstance.estimateGas.unwrap(
            amount
          );

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.tokensInfo.mainToken.contractInstance.unwrap(
          amount,
          {
            gasLimit,
          }
        );

        this.amount = "";
        this.amountError = "";

        const receipt = await tx.wait();

        console.log("Unwrap", receipt);
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.success
        );
      } catch (e) {
        console.log("Unwrap err:", e);
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.error
        );
      }
    },
  },

  async created() {
    this.$emit("toggleAction", "Wrap");
    this.tokensInfo = await this.createOlimpusWrap();

    this.updateInterval = setInterval(async () => {
      this.tokensInfo = await this.createOlimpusWrap();
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
