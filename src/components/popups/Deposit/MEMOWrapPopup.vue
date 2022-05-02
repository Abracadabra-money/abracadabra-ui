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
          {{ parseFloat(fromToken.balance).toFixed(4) }}
        </p>
      </div>

      <ValueInput
        :icon="fromToken.icon"
        :name="fromToken.name"
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
        <p v-if="fromToken.balance">
          {{ parseFloat(fromToken.balance).toFixed(4) }}
        </p>
      </div>

      <ValueInput
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
const ValueInput = () => import("@/components/base/BaseTokenInput");
const BaseButton = () => import("@/components/base/BaseButton");

import memoWrap from "@/mixins/getCollateralLogic/memoWrap";
import { mapGetters } from "vuex";

import { approveToken } from "@/utils/approveHelpers.js";
export default {
  mixins: [memoWrap],
  data() {
    return {
      action: "Wrap",
      amount: "",
      amountError: "",
      updateInterval: null,
      tokensInfo: null,
      isApproved: false,
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

      // eslint-disable-next-line no-useless-escape
      let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (6 || -1) + `})?`);

      if (this.action === "Wrap") {
        const amount = this.amount * this.tokensInfo.tokensRate;
        return parseFloat(amount).toFixed(20).toString().match(re)[0];
      }
      if (this.action === "Unwrap") {
        const amount = this.amount / this.tokensInfo.tokensRate;
        return parseFloat(amount).toFixed(20).toString().match(re)[0];
      }
      return "";
    },

    actionBtnText() {
      if (!this.isApproved) {
        return "Approve";
      }

      if (!+this.amount || this.amountError) return "Nothing to do";

      return this.action;
    },

    disabledBtn() {
      if (this.actionBtnText === "Nothing to do") return true;
      return false;
    },
  },

  methods: {
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
      if (!this.isApproved) {
        this.isApproved = await approveToken(
          this.tokensInfo.depositToken.contractInstance,
          this.tokensInfo.mainToken.contractInstance.address
        );
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
      try {
        let methodName = "wrap";

        const amount = this.$ethers.utils.parseUnits(
          this.amount,
          this.tokensInfo.depositToken.decimals
        );

        console.log("AMOUNT", amount.toString());

        const estimateGas =
          await this.tokensInfo.mainToken.contractInstance.estimateGas[
            methodName
          ](amount);

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

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
      } catch (e) {
        console.log("WRAP err:", e);
      }
    },

    async withdraw() {
      console.log("Unwrap");
      try {
        let methodName = "unwrap";

        const amount = this.$ethers.utils.parseUnits(
          this.amount,
          this.tokensInfo.mainToken.decimals
        );

        console.log("AMOUNT", amount.toString());

        const estimateGas =
          await this.tokensInfo.mainToken.contractInstance.estimateGas[
            methodName
          ](amount);

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

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
      } catch (e) {
        console.log("stake err:", e);
      }
    },

    closePopup() {
      this.$store.commit("closePopups");
    },
  },

  async created() {
    this.tokensInfo = await this.createMEMOWrapObj();

    this.updateInterval = setInterval(async () => {
      console.log("stake interval");
      this.tokensInfo = await this.createMEMOWrapObj();
    }, 10000);
  },
  beforeDestroy() {
    clearInterval(this.updateInterval);
  },

  components: { ValueInput, BaseButton },
};
</script>

<style lang="scss" scoped>
.popup {
  background: #302e38;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  padding: 15px 25px;
  width: 540px;
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
