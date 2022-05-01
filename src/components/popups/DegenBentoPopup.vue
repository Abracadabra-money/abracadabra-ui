<template>
  <div class="box-popup">
    <p class="title">{{ title }}</p>
    <div>
      <div>
        <div class="header-balance">
          <h4>Collateral assets</h4>
          <p>Balance: {{ (+balance).toFixed(2) }}</p>
        </div>

        <BaseTokenInput
          :icon="mimIcon"
          name="MIM"
          v-model="amount"
          :max="balance"
          :error="error"
        />
      </div>
    </div>
    <template v-if="isApproved !== null">
      <BaseButton v-if="!isApproved" primary @click="approveToken"
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
    </template>
    <div v-else class="load-wrap">
      <BaseLoader />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const BaseTokenInput = () =>
  import("@/components/base/BaseTokenInput");
const BaseButton = () => import("@/components/base/BaseButton");
import mimIcon from "@/assets/images/tokens/MIM.png";
const BaseLoader = () => import("@/components/base/BaseLoader");

export default {
  components: { BaseLoader, BaseTokenInput, BaseButton },
  props: {
    infoObject: {
      type: Object,
      required: true,
    },
    isBento: { type: Boolean, default: false },
    isDeposit: { type: Boolean, default: false },
  },
  data: () => ({
    amount: "",
    mimIcon,
    isDegenApproved: null,
    isBentoApproved: null,
    updateInfoInterval: null,
  }),
  methods: {
    async withdraw() {
      try {
        const amount = this.$ethers.utils.parseEther(this.amount);
        const account = this.account;
        const tokenAddress = this.infoObject.mimContract.address;
        console.log("AMOUNT", amount.toString());

        const estimateGas = await this.activeContract.estimateGas.withdraw(
          tokenAddress,
          account,
          account,
          amount,
          "0"
        );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await this.activeContract.withdraw(
          tokenAddress,
          account,
          account,
          amount,
          "0",
          {
            gasLimit,
          }
        );

        const receipt = await tx.wait();

        console.log("withdraw", receipt);

        this.closePopup();
      } catch (e) {
        console.log("withdraw err:", e);
      }
    },
    async deposit() {
      try {
        const amount = this.$ethers.utils.parseEther(this.amount);
        const account = this.account;
        const tokenAddress = this.infoObject.mimContract.address;
        console.log("AMOUNT", amount.toString());

        const estimateGas = await this.activeContract.estimateGas.deposit(
          tokenAddress,
          account,
          account,
          amount,
          "0"
        );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await this.activeContract.deposit(
          tokenAddress,
          account,
          account,
          amount,
          "0",
          {
            gasLimit,
          }
        );

        const receipt = await tx.wait();

        console.log("deposit", receipt);

        this.closePopup();
      } catch (e) {
        console.log("deposit err:", e);
      }
    },
    async updateApprovedValue() {
      try {
        const addressApproved = await this.infoObject.mimContract.allowance(
          this.account,
          this.activeContract.address,
          {
            gasLimit: 1000000,
          }
        );
        const isApproved = parseFloat(addressApproved.toString()) > 0;

        console.log("OPENED VALUE", isApproved);
        this.setIsApproved(isApproved);
      } catch (e) {
        console.log("isTokenApproved err:", e);
        this.setIsApproved(false);
      }
    },
    setIsApproved(value) {
      if (this.isBento) this.isBentoApproved = value;
      else this.isDegenApproved = value;
    },
    async approveToken() {
      try {
        const estimateGas =
          await this.infoObject.mimContract.estimateGas.approve(
            this.activeContract.address,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          );

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.infoObject.mimContract.approve(
          this.activeContract.address,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          {
            gasLimit,
          }
        );
        const receipt = await tx.wait();

        await this.updateApprovedValue();
        console.log("APPROVE RESP:", receipt);
      } catch (e) {
        console.log("isApprowed err:", e);
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
    isApproved() {
      return this.isBento ? this.isBentoApproved : this.isDegenApproved;
    },
    activeContract() {
      return this.isBento
        ? this.infoObject.bentoBoxContract
        : this.infoObject.degenBoxContract;
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
  watch: {
    activeContract: {
      immediate: true,
      handler() {
        this.updateApprovedValue();
      },
    },
  },
  created() {
    this.updateInfoInterval = setInterval(async () => {
      await this.updateApprovedValue();
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.updateInfoInterval);
  },
};
</script>

<style lang="scss" scoped>
.box-popup {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
}
.title {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  padding-bottom: 20px;
  margin-bottom: 38px;
  border-bottom: solid 1px rgba(255, 255, 255, 0.1);
}
.load-wrap {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
