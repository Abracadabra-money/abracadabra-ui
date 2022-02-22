<template>
  <div class="stake">
    <StakeInputs 
      :mode="action" 
      :actions="actions"
      :modes="inputs"
      @toggleAction="toggleAction"
      @change="updateMainValue"
      :error="amountError"
    />
    <Profile :tokens-info="info" :locked-until="lockedUntil">
      <template v-slot:buttons>
        <DefaultButton 
          width="325px"
          @click="approveToken(info.stakeToken.contractInstance)" 
          primary 
          :disabled="info.stakeToken.isTokenApprowed"
          v-if=" action===actions[0] "
        >{{ "Approve" }}</DefaultButton>
        <DefaultButton
          width="325px"
          @click="actionHandler"
          :disabled="amountError"
        > {{ action === actions[0] ? "Stake" : "Unstake" }} </DefaultButton>
      </template>
    </Profile>
  </div>
</template>
  components: {}
<script>

const StakeInputs = () => import("@/components/stake/StakeInputs");
const Profile = () => import("@/components/stake/Profile");
import DefaultButton from "@/components/main/DefaultButton.vue";

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
            max: 0,
            balance: "0",
            icon: 'spell-icon'
          }
        },
        [UNSTAKE]: {
          input: {
            label: "sSpell",
            text: "",
            max: 0,
            balance: "0",
            icon: 'sspell-icon'
          }
        },
      },
      amount: "",
      amountError: "",
      lockedUntil: false,
      spellUpdateInterval: null,
    }
  },
  computed: {
    ...mapGetters({
      isLoadingsSpellStake: "getLoadingsSpellStake",
      account: "getAccount",
    }),
    tokenObjByAction() {
      return this.action === this.actions[0] ? this.info.stakeToken : this.info.mainToken;
    },
    info() {
      return this.tokensInfo || {
        stakeToken: {},
        mainToken: {contractInstance: {users:()=>false}},
        
      };
    },
    isUserLocked() {
      return (
        this.lockedUntil &&
        Number(this.lockedUntil) !== 0 &&
        this.action === UNSTAKE
      );
    },
    tokensInfo() {
      return this.$store.getters.getSSpellObject;
    },
    fromToken() {
      if (this.action === STAKE) return this.info.stakeToken;
      if (this.action === UNSTAKE) return this.info.mainToken;
      return "";
    },
    toToken() {
      if (this.action === STAKE) return this.info.mainToken;
      if (this.action === UNSTAKE) return this.info.stakeToken;
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
    actionBtnText() {
      if (this.isUserLocked) return "Nothing to do";
      if (!+this.amount || this.amountError) return "Nothing to do";

      return this.action;
    },
  },
  watch: {
    lockedUntil(val) {
      if (val && Number(val) !== 0) {
        this.amount = "";
        this.amountError = "";
      }
    },
    async account() {
      if (this.account) {
        await this.createStakePool();
        this.setInputs()
      }
    },
  },
  methods: {
    setInputs() {
      this.fillInputData(STAKE,{
          balance: this.parceBalance(this.info.stakeToken.balance),
          max: this.parceBalance(this.info.stakeToken.balance)
        }),
      this.fillInputData(UNSTAKE,{
        balance: this.parceBalance(this.info.mainToken.balance),
        max: this.parceBalance(this.info.mainToken.balance)
      })
    },
    parceBalance(balance) {
      return balance ? parseFloat(balance).toFixed(4) : 0
    },
    fillInputData(mode,data) {
      this.inputs[mode].input = {...this.inputs[mode].input, ...data};
    },
    toggleAction() {
      this.amount = "";
      this.amountError = "";
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
        const infoResp = await this.info.mainToken.contractInstance.users(
          this.account,
          {
            gasLimit: 1000000,
          }
        );
        if (!infoResp) {
          return false
        }
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
    this.setInputs();
    this.lockedUntil = await this.getUserLocked();
    this.spellUpdateInterval = setInterval(async () => {
      await this.createStakePool();
      this.lockedUntil = await this.getUserLocked();
    }, 15000);
  },

  beforeDestroy() {
    clearInterval(this.spellUpdateInterval);
  },
  components: {
    StakeInputs,
    Profile,
    DefaultButton
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