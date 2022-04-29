<template>
  <div class="stake">
    <div class="choose">
      <h4>Choose Chain</h4>
      <div class="underline">
        <NetworksList />
      </div>
      <div class="swap-wrap">
        <div class="token-input" :class="{ active: actions.STAKE }">
          <div class="header-balance">
            <h4>{{ inputTitle(actions.STAKE) }}</h4>
            <p>Balance: {{ parceBalance(info.stakeToken.balance) }}</p>
          </div>
          <ValueInput
            class="value-input"
            :icon="getImgUrl('spell-icon')"
            :name="'Spell'"
            :disabled="!actions.STAKE"
            :value="actions.STAKE ? amount : toTokenAmount"
            @input="updateMainValue"
            :max="actions.STAKE ? parceBalance(info.stakeToken.balance) : 0"
            :error="actions.STAKE ? amountError : null"
          />
        </div>
        <div class="swap-img">
          <img
            src="@/assets/images/swap.svg"
            :class="{ reflect: actions.UNSTAKE }"
            @click="toggleAction"
            alt="swap"
          />
        </div>
        <div class="token-input" :class="{ active: actions.UNSTAKE }">
          <div class="header-balance">
            <h4>{{ inputTitle(actions.UNSTAKE) }}</h4>
            <p>Balance: {{ parceBalance(info.mainToken.balance) }}</p>
          </div>
          <ValueInput
            class="value-input"
            :icon="getImgUrl('sspell-icon')"
            name="sSpell"
            @input="updateMainValue"
            :disabled="!actions.UNSTAKE"
            :error="actions.UNSTAKE ? amountError : null"
            :value="actions.UNSTAKE ? amount : toTokenAmount"
            :max="actions.UNSTAKE ? parceBalance(info.mainToken.balance) : 0"
          />
        </div>
      </div>
    </div>
    <div class="profile">
      <h1 class="title">STAKE</h1>
      <InfoBlock
        mainTokenName="sSPELL"
        title="sSpell"
        icon="sspell-icon"
        :tokens-info="info"
        :locked-until="lockedUntil"
        :rate="info.tokensRate"
      />
      <div class="profile-actions">
        <DefaultButton
          width="325px"
          @click="approveToken(info.stakeToken.contractInstance)"
          primary
          :disabled="info.stakeToken.isTokenApprowed"
          v-if="actions.STAKE"
          >{{ "Approve" }}
        </DefaultButton>
        <DefaultButton
          width="325px"
          @click="actionHandler"
          :disabled="
            !!amountError ||
            !amount ||
            amount <= 0 ||
            !info.stakeToken.isTokenApprowed
          "
        >
          {{ actions.STAKE ? "Stake" : "Unstake" }}
        </DefaultButton>
      </div>
      <div class="profile-subscribtion">
        <div class="profile-subscribtion__approximate">
          <div>Approximate staking APR</div>
          <div>{{ parceBalance(info.apr) + "%" }}</div>
        </div>
        <p>
          Make SPELL work for you! Stake your SPELL and gain sSPELL. No
          impermanent loss, no loss of governance rights. Continuously
          compounding. After each new deposit, all staked SPELL are subject to a
          24H lock-up period!
        </p>
        <p>
          sSPELL automatically earns fees from MIM repayments from all wizards
          proportional to your share of the stake pool.
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

import sspellToken from "@/mixins/stake/sspellToken";
import stake from "@/mixins/stake/stake";

export default {
  mixins: [sspellToken, stake],
  computed: {
    loading() {
      return this.$store.getters.getLoadingSSpellStake;
    },
    isUserLocked() {
      return (
        this.lockedUntil &&
        Number(this.lockedUntil) !== 0 &&
        this.actions.UNSTAKE
      );
    },
    info() {
      return this.$store.getters.getSSpellObject || this.emptyTokens;
    },
    fromToken() {
      if (this.actions.STAKE) return this.info.stakeToken;
      if (this.actions.UNSTAKE) return this.info.mainToken;
      return "";
    },
    toTokenAmount() {
      if (!this.amount) return "";
      if (!this.info) return "";

      // eslint-disable-next-line no-useless-escape
      let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (6 || -1) + `})?`);

      if (this.actions.STAKE) {
        const amount = this.amount / this.info.tokensRate;
        return amount.toString().match(re)[0];
      }
      if (this.actions.UNSTAKE) {
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
    isTokenApprowed(val) {
      if (val && Number(val) !== 0) {
        this.amount = "";
        this.amountError = "";
      }
    },
    async account() {
      if (this.account) {
        await this.createStakePool();
      }
    },
  },
  methods: {
    inputTitle(toogler) {
      return toogler ? "Deposit" : "Receive";
    },
    parceBalance(balance) {
      return balance ? parseFloat(balance).toFixed(4) : 0;
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
        const infoResp = await this.info.mainToken.contractInstance.users(
          this.account,
          {
            gasLimit: 1000000,
          }
        );
        if (!infoResp) {
          return false;
        }
        currentTimestamp = (Date.now() / 1000).toString();
        lockTimestamp = infoResp.lockedUntil.toString();

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

      if (this.actions.STAKE) {
        const isApproved = this.info.stakeToken.isTokenApprowed;

        if (isApproved) {
          await this.stake();
          return false;
        }

        const approvedSuccess = await this.approveToken(
          this.info.stakeToken.contractInstance
        );

        if (approvedSuccess) await this.stake();
      }
      if (this.actions.UNSTAKE) {
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
      console.log("STAKE");

      try {
        const amount = this.$ethers.utils.parseEther(this.amount);

        console.log("AMOUNT", amount.toString());

        const estimateGas =
          await this.info.mainToken.contractInstance.estimateGas.mint(amount);

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.info.mainToken.contractInstance.mint(amount, {
          gasLimit,
        });

        this.amount = "";
        this.amountError = "";

        const receipt = await tx.wait();

        console.log("STAKE", receipt);
      } catch (e) {
        console.log("stake err:", e);
      }
    },
    async unstake() {
      console.log("UNSTAKE");
      try {
        const amount = this.$ethers.utils.parseEther(this.amount);

        console.log("AMOUNT", amount.toString());

        const estimateGas =
          await this.info.mainToken.contractInstance.estimateGas.burn(
            this.account,
            amount
          );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await this.info.mainToken.contractInstance.burn(
          this.account,
          amount,
          {
            gasLimit,
          }
        );

        this.amount = "";
        this.amountError = "";

        const receipt = await tx.wait();

        console.log("STAKE", receipt);
      } catch (e) {
        console.log("stake err:", e);
      }
    },
    async approveToken(tokenContract) {
      try {
        const estimateGas = await tokenContract.estimateGas.approve(
          this.info.mainToken.contractInstance.address,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await tokenContract.approve(
          this.info.mainToken.contractInstance.address,
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
  },
  async created() {
    await this.createStakePool();
    this.lockedUntil = await this.getUserLocked();
    this.updateInterval = setInterval(async () => {
      await this.createStakePool();
      this.lockedUntil = await this.getUserLocked();
    }, 15000);
  },
  beforeDestroy() {
    clearInterval(this.updateInterval);
  },
  components: {
    InfoBlock,
    DefaultButton,
    ValueInput,
    NetworksList,
  },
};
</script>
