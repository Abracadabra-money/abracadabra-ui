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

import olimpusStake from "@/mixins/getCollateralLogic/olimpusStake";
import { approveToken } from "@/utils/approveHelpers.js";
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
      isApproved: false,
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

      // eslint-disable-next-line no-useless-escape
      let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (6 || -1) + `})?`);

      if (this.action === "Stake") {
        const amount = this.amount / this.tokensInfo.tokensRate;
        return amount.toString().match(re)[0];
      }
      if (this.action === "Unstake") {
        const amount = this.amount * this.tokensInfo.tokensRate;
        return amount.toString().match(re)[0];
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

    rateInfo() {
      const ohm = this.tokensInfo.tokensRate;

      return `1 sOHM = ${parseFloat(ohm).toFixed(4)} OHM`;
    },
  },

  methods: {
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
      if (!this.isApproved) {
        this.isApproved = await approveToken(
          this.tokensInfo.depositToken.contractInstance,
          this.tokensInfo.mainToken.contractInstance.address
        );
      }

      if (!+this.amount || this.amountError) return false;

      if (this.action === "Stake") {
        await this.stake();
        return false;
      }

      if (this.action === "Withdraw") {
        await this.unstake();
        return false;
      }
    },

    async stake() {
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
      } catch (e) {
        console.log("stake err:", e);
      }
    },

    async unstake() {
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
      } catch (e) {
        console.log("stake err:", e);
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
