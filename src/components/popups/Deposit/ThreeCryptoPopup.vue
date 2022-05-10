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
import threeCryptoDeposit from "@/mixins/getCollateralLogic/threeCryptoDeposit";
import { mapGetters } from "vuex";

import { approveToken } from "@/utils/approveHelpers.js";
export default {
  mixins: [threeCryptoDeposit],
  data() {
    return {
      action: "Deposit",
      amount: "",
      amountError: "",
      updateInterval: null,
      tokensInfo: null,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", popupData: "getPopupData" }),

    fromToken() {
      if (this.action === "Deposit") return this.tokensInfo.depositToken;
      if (this.action === "Withdraw") return this.tokensInfo.mainToken;

      return "";
    },

    toToken() {
      if (this.action === "Deposit") return this.tokensInfo.mainToken;
      if (this.action === "Withdraw") return this.tokensInfo.depositToken;

      return "";
    },

    toTokenAmount() {
      if (!this.amount) return "";
      if (!this.tokensInfo) return "";

      // eslint-disable-next-line no-useless-escape
      let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (6 || -1) + `})?`);

      if (this.action === "Deposit") {
        const amount = this.amount / this.tokensInfo.tokensRate;
        return amount.toString().match(re)[0];
      }
      if (this.action === "Withdraw") {
        const amount = this.amount * this.tokensInfo.tokensRate;
        return amount.toString().match(re)[0];
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
    toggleAction() {
      this.amount = "";
      this.amountError = "";

      if (this.action === "Deposit") {
        this.action = "Withdraw";
        return false;
      }

      if (this.action === "Withdraw") {
        this.action = "Deposit";
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
        await approveToken(
          this.tokensInfo.depositToken.contractInstance,
          this.tokensInfo.mainToken.contractInstance.address
        );
      }

      if (!+this.amount || this.amountError) return false;

      if (this.action === "Deposit") {
        await this.deposit();
        return false;
      }
      if (this.action === "Withdraw") {
        await this.withdraw();
        return false;
      }
    },

    async deposit() {
      try {
        const amount = this.$ethers.utils.parseUnits(
          this.amount,
          this.tokensInfo.depositToken.decimals
        );

        const estimateGas =
          await this.tokensInfo.mainToken.contractInstance.estimateGas.deposit(
            amount,
            this.account
          );

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.tokensInfo.mainToken.contractInstance.deposit(
          amount,
          this.account,
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

    async withdraw() {
      try {
        const amount = this.$ethers.utils.parseUnits(
          this.amount,
          this.tokensInfo.mainToken.decimals
        );

        const estimateGas =
          await this.tokensInfo.mainToken.contractInstance.estimateGas.withdrawAndUnwrap(
            amount
          );

        const gasLimit = 1000 + +estimateGas.toString();

        const tx =
          await this.tokensInfo.mainToken.contractInstance.withdrawAndUnwrap(
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
    this.tokensInfo = await this.createCrvDeposit();

    this.updateInterval = setInterval(async () => {
      this.tokensInfo = await this.createCrvDeposit();
    }, 10000);
  },

  beforeDestroy() {
    clearInterval(this.updateInterval);
  },

  components: { BaseTokenInput, BaseButton },
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
