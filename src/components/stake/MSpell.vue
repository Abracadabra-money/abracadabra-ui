<template>
  <div class="stake">
    <div class="choose">
      <h4>Choose Chain</h4>
      <div class="underline">
        <NetworksList />
      </div>
      <div class="swap-wrap">
        <div class="token-input" :class="{active: action === actions[0]}">
          <div class="header-balance">
            <h4>{{ inputTitle(action === actions[0]) }}</h4>
            <p>Balance: {{ parceBalance(info.stakeToken.balance) }}</p>
          </div>
          <ValueInput
            class="value-input"
            :icon="getImgUrl('spell-icon')"
            :name="'Spell'"
            @input="updateMainValue"
            :disabled="action === actions[1]"
            :max="action === actions[0] ? parceBalance(info.stakeToken.balance) : 0"
            :error="amountError"
          />
        </div>
        <div class="swap-img">
          <img
            src="@/assets/images/swap.svg"
            :class="{ reflect: action === actions[1] }"
            @click="toggleAction"
            alt="swap"
          />
        </div>
        <div class="token-input" :class="{active: action === actions[1]}">
          <div class="header-balance">
            <h4>{{ inputTitle(action === actions[1]) }}</h4>
            <p>Balance: {{ parceBalance(info.mainToken.balance) }}</p>
          </div>
          <ValueInput
            class="value-input"
            :icon="getImgUrl('Token_mSpell')"
            name="mSpell"
            @input="updateMainValue"
            :disabled="action === actions[0]"
            :value="toTokenAmount"
            :max="action === actions[1] ? parceBalance(info.mainToken.balance) : 0"
          />
        </div>
      </div>
    </div>
    <div class="profile">
      <h1 class="title">STAKE</h1>
      <InfoBlock 
        mainTokenName="mSPELL"
        title="mSpell"
        icon="Token_mSpell"
        :tokens-info="info" 
        :locked-until="lockedUntil" 
        :isMSpell="isMSpell"
        :rate="info.tokensRate"
      />
      <div class="profile-actions">
        <DefaultButton
          width="325px"
          @click="approveToken(info.stakeToken.contractInstance)"
          primary
          :disabled="info.stakeToken.isTokenApprowed"
          v-if="action === actions[0]"
          >{{ "Approve" }}
        </DefaultButton>
        <DefaultButton
          width="325px"
          @click="actionHandler"
          :disabled="amountError"
        >
          {{ action === actions[0] ? "Stake" : "Unstake" }}
        </DefaultButton>
      </div>
      <div class="profile-subscribtion">
        <div class="profile-subscribtion__approximate">
          <div>Approximate staking APR</div>
          <div>{{ (info.apr || 0).toFixed(4) + "%" }}</div>
        </div>
        <p>
          Make SPELL work for you! Stake your SPELL into mSPELL! No impermanent loss, no loss of governance rights. 
        </p>
        <p>
          After each new deposit, all staked SPELL are subject to a 24H lock-up period! 
        </p>
      </div>
    </div>
  </div>
</template>
<script>

const InfoBlock = () => import("@/components/stake/InfoBlock");
const ValueInput = () => import("@/components/UIComponents/ValueInput");
const NetworksList = () => import("@/components/ui/NetworksList");

import DefaultButton from "@/components/main/DefaultButton.vue";

import { mapGetters } from "vuex";

import mSpellStaking from "@/mixins/mSpellStaking";

const STAKE = "STAKE";
const UNSTAKE = "UNSTAKE";

export default {
  mixins: [mSpellStaking],
  data() {
    return {
      actions: [STAKE, UNSTAKE],
      action: STAKE,
      amount: "",
      amountError: "",
      lockedUntil: false,
      spellUpdateInterval: null,
    };
  },
  computed: {
    ...mapGetters({
      isLoadingMSpellStake: "getLoadingMSpellStake",
      account: "getAccount",
      networks: "getAvailableNetworks"
    }),
    info() {
      return (
        this.tokensInfo || {
          stakeToken: {},
          mainToken: { contractInstance: { users: () => false } },
        }
      );
    },
    isUserLocked() {
      return (
        this.lockedUntil &&
        Number(this.lockedUntil) !== 0 &&
        this.action === UNSTAKE
      );
    },
    tokensInfo() {
      return this.$store.getters.getMSpellStakingObj;
    },
    fromToken() {
      if (this.action === STAKE) return this.info.stakeToken;
      if (this.action === UNSTAKE) return this.info.mainToken;
      return "";
    },
    toTokenAmount() {
      if (!this.amount) return "";
      if (!this.info) return "";

      // eslint-disable-next-line no-useless-escape
      let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (6 || -1) + `})?`);

      if (this.action === STAKE) {
        const amount = this.amount / this.info.tokensRate;
        return amount.toString().match(re)[0];
      }
      if (this.action === UNSTAKE) {
        const amount = this.amount * this.info.tokensRate;
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
        await this.createStakeObjects();
      }
    },
  },
  methods: {
    inputTitle(toogler) {
      return toogler ? 'Deposit' : 'Receive'
    },
    parceBalance(balance) {
      return balance ? parseFloat(balance).toFixed(4) : 0;
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
      } else {
        this.amountError = "";
      }
      this.amount = value;
    },
    async getUserLocked() {
      try {
        let lockTimestamp, currentTimestamp;
        currentTimestamp = (Date.now() / 1000).toString();
        lockTimestamp = this.info.lockedUntil ? this.info.lockedUntil.toString() : null;
        

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
    getImgUrl(type) {
      var images = require.context(
        "../../assets/images/tokens-icon/",
        false,
        /\.svg$/
      );
      return images("./" + type + ".svg");
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
    },
    async createStakeObjects() {
      if (this.isMSpell) {
        await this.createMSpellStaking();
      } else {
        await this.createStakePool();
      }
    },
  },
  async created() {
    await this.createStakeObjects();
    this.lockedUntil = await this.getUserLocked();
    this.spellUpdateInterval = setInterval(async () => {
      await this.createStakeObjects();
      this.lockedUntil = await this.getUserLocked();
    }, 15000);
  },
  beforeDestroy() {
    clearInterval(this.spellUpdateInterval);
  },
  components: {
    InfoBlock,
    DefaultButton,
    ValueInput,
    NetworksList
  },
};
</script>