<template>
  <div class="stake">
    <StakeInputs 
      :mode="this.action" 
      :actions="this.actions"
      :modes="this.inputs"
      @toggleAction="this.toggleAction"
    />
    <Profile />
  </div>
</template>
  components: {
    
  },
<script>
const StakeInputs = () => import("@/components/stake/StakeInputs");
const Profile = () => import("@/components/stake/Profile");
import { mapGetters } from "vuex";
import sspellToken from "@/mixins/sspellToken";

const STAKE = "STAKE";
const UNSTAKE = "UNSTAKE";

export default {
  mixins: [sspellToken],
  data() {
    return {
      actions: [STAKE,UNSTAKE],
      action: STAKE,
      inputs: { 
        [STAKE]: {
          input: {
            label: "Spell",
            text: "",
            max: 12.292215,
            balance: "200,000.00",
            icon: 'spell-icon'
          }
        },
        [UNSTAKE]: {
          input: {
            label: "sSpell",
            text: "",
            max: 3000000,
            balance: "3,000.00",
            icon: 'sspell-icon'
          }
        },
      },
      amount: "",
      amountError: "",
      lockedUntil: false,
      spellUpdateInterval: null,
    };
  },
  computed: {
    ...mapGetters({
      isLoadingsSpellStake: "getLoadingsSpellStake",
      address: "getAccount",
    }),
    isUserLocked() {
      console.log("isUserLocked")
      return (
        this.lockedUntil &&
        Number(this.lockedUntil) !== 0 &&
        this.action === UNSTAKE
      );
    },
    tokensInfo() {
      return this.$store.getters.getSSpellObject;
    },
    account() {
      return this.$store.getters.getAccount;
    },
    fromToken() {
      if (this.action === STAKE) return this.tokensInfo.stakeToken;
      if (this.action === UNSTAKE) return this.tokensInfo.mainToken;

      return "";
    },
    toToken() {
      if (this.action === STAKE) return this.tokensInfo.mainToken;
      if (this.action === UNSTAKE) return this.tokensInfo.stakeToken;

      return "";
    },
    toTokenAmount() {
      if (!this.amount) return "";
      if (!this.tokensInfo) return "";

      // eslint-disable-next-line no-useless-escape
      let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (6 || -1) + `})?`);

      if (this.action === STAKE) {
        const amount = this.amount / this.tokensInfo.tokensRate;
        return amount.toString().match(re)[0];
      }
      if (this.action === UNSTAKE) {
        const amount = this.amount * this.tokensInfo.tokensRate;
        return amount.toString().match(re)[0];
      }
      return "";
    },
    stakeTokenBalanceUsd() {
      if (!this.tokensInfo.stakeToken.price) return false;
      if (!+this.tokensInfo.stakeToken.balance) return 0;

      const balanceInUsd =
        +this.tokensInfo.stakeToken.balance * +this.tokensInfo.stakeToken.price;

      return parseFloat(balanceInUsd).toFixed(6);
    },
    mainTokenBalanceUsd() {
      if (!this.tokensInfo.mainToken.price) return false;
      if (!+this.tokensInfo.mainToken.balance) return 0;

      const balanceInUsd =
        +this.tokensInfo.mainToken.balance * +this.tokensInfo.mainToken.price;

      return parseFloat(balanceInUsd).toFixed(6);
    },
    actionBtnText() {
      if (this.isUserLocked) return "Nothing to do";
      if (!+this.amount || this.amountError) return "Nothing to do";

      return this.action;
    },
    rateInfo() {
      const sspel = this.tokensInfo.tokensRate;

      return `1 sSpell = ${parseFloat(sspel).toFixed(4)} Spell`;
    },
  },
  watch: {
    lockedUntil(val) {
      if (val && Number(val) !== 0) {
        this.amount = "";
        this.amountError = "";
      }
    },
    async address() {
      if (this.address) {
        await this.createStakePool();
      }
    },
  },
  methods: {
    toggleAction() {
      this.amount = "";
      this.amountError = "";
      console.log(this.action)
      if (this.action === STAKE) {
        this.action = UNSTAKE;
        return false;
      }

      if (this.action === UNSTAKE) {
        this.action = STAKE;
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
    async getUserLocked() {
      try {
        const infoResp = await this.tokensInfo.mainToken.contractInstance.users(
          this.account,
          {
            gasLimit: 1000000,
          }
        );

        const lockTimestamp = infoResp.lockedUntil.toString();
        const currentTimestamp = (Date.now() / 1000).toString();

        if (lockTimestamp && lockTimestamp > currentTimestamp)
          return lockTimestamp;
        return false;
      } catch (e) {
        console.log("isApprowed err:", e);
      }
    },
    async actionHandler() {
      if (this.isUserLocked) return false;
      if (!+this.amount || this.amountError) return false;

      if (this.action === STAKE) {
        const isApproved = this.tokensInfo.stakeToken.isTokenApprowed;

        if (isApproved) {
          await this.stake();
          return false;
        }

        const approvedSuccess = await this.approveToken(
          this.tokensInfo.stakeToken.contractInstance
        );

        if (approvedSuccess) await this.stake();
      }
      if (this.action === UNSTAKE) {
        await this.unstake();
      }
    },
    async stake() {
      console.log(STAKE);
      try {
        const amount = this.$ethers.utils.parseEther(this.amount);

        console.log("AMOUNT", amount.toString());

        const estimateGas =
          await this.tokensInfo.mainToken.contractInstance.estimateGas.mint(
            amount
          );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await this.tokensInfo.mainToken.contractInstance.mint(
          amount,
          {
            gasLimit,
          }
        );

        this.amount = "";
        this.amountError = "";

        const receipt = await tx.wait();

        console.log(STAKE, receipt);
      } catch (e) {
        console.log("stake err:", e);
      }
    },
    async unstake() {
      console.log(UNSTAKE);
      try {
        const amount = this.$ethers.utils.parseEther(this.amount);

        console.log("AMOUNT", amount.toString());

        const estimateGas =
          await this.tokensInfo.mainToken.contractInstance.estimateGas.burn(
            this.account,
            amount
          );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await this.tokensInfo.mainToken.contractInstance.burn(
          this.account,
          amount,
          {
            gasLimit,
          }
        );

        this.amount = "";
        this.amountError = "";

        const receipt = await tx.wait();

        console.log(STAKE, receipt);
      } catch (e) {
        console.log("stake err:", e);
      }
    },
    async approveToken(tokenContract) {
      try {
        const estimateGas = await tokenContract.estimateGas.approve(
          this.tokensInfo.mainToken.contractInstance.address,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await tokenContract.approve(
          this.tokensInfo.mainToken.contractInstance.address,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          {
            gasLimit,
          }
        );
        const receipt = await tx.wait();
        console.log("APPROVE RESP:", receipt);
        return true;
      } catch (e) {
        console.log("isApprowed err:", e);
        return false;
      }
    }
  },
  async created() {
    await this.createStakePool();
    this.lockedUntil = await this.getUserLocked();
    // this.spellUpdateInterval = setInterval(async () => {
    //   await this.createStakePool();
    //   this.lockedUntil = await this.getUserLocked();
    // }, 15000);
  },
  beforeDestroy() {
    clearInterval(this.spellUpdateInterval);
  },
  components: {
    StakeInputs,
    Profile
  },
};
</script>

<style lang="scss" scoped>
.stake {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  margin: 0 auto;
  width: 100%;
  padding-top: 160px;
}

@media (min-width: 1024px) {
  .stake {
    grid-template-columns: 550px 1fr;
    width: 1320px;
    max-width: 100%;
  }
}
</style>