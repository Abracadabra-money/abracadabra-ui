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
            <h4>{{inputTitle(action === actions[0])}}</h4>
            <p>Balance: {{ parceBalance(info.stakeToken.balance) }}</p>
          </div>
          <ValueInput
            class="value-input"
            :icon="getImgUrl('spell-icon')"
            :name="'Spell'"
            @input="updateMainValue"
            :disabled="action === actions[1]"
            :max="action === actions[0] ? parceBalance(info.stakeToken.balance) : null"
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
            <h4>{{inputTitle(action === actions[1])}}</h4>
            <p>Balance: {{ parceBalance(info.mainToken.balance) }}</p>
          </div>
          <ValueInput
            class="value-input"
            :icon="getImgUrl('sspell-icon')"
            :name="'sSpell'"
            @input="updateMainValue"
            :disabled="action === actions[0]"
            :max="action === actions[1] ? parceBalance(info.mainToken.balance) : null"
          />
        </div>
      </div>
    </div>
    <div class="profile">
      <h1 class="title">STAKE</h1>
      <InfoBlock :tokens-info="info" :locked-until="lockedUntil" />
      <div class="profile-actions">
        <DefaultButton
          width="325px"
          @click="approveToken(info.stakeToken.contractInstance)"
          primary
          :disabled="info.stakeToken.isTokenApprowed"
          v-if="action === actions[0]"
          >{{ "Approve" }}</DefaultButton
        >
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
          <div>{{ (info.apr || 0) + "%" }}</div>
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

import { mapGetters } from "vuex";
import sspellToken from "@/mixins/sspellToken";

const STAKE = "STAKE";
const UNSTAKE = "UNSTAKE";

export default {
  mixins: [sspellToken],
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
      isLoadingsSpellStake: "getLoadingsSpellStake",
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
      return this.$store.getters.getSSpellObject;
    },
    fromToken() {
      if (this.action === STAKE) return this.info.stakeToken;
      if (this.action === UNSTAKE) return this.info.mainToken;
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
          return false;
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
    getImgUrl(type) {
      var images = require.context(
        "../assets/images/tokens-icon/",
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
  },
  async created() {
    await this.createStakePool();
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
    InfoBlock,
    DefaultButton,
    ValueInput,
    NetworksList
  },
};
</script>

<style lang="scss" scoped>

.swap-wrap {
  position: relative;
  height: 330px;
  display: flex;
  justify-content: center;
  @media (max-width: 1023px) {
    height: 350px
  }
}

.value-input {
  min-width: 280px; 
  width: 490px;
}

.swap-img {
  position: absolute;
  left: calc(50% - 20px);
  top: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  cursor: pointer;
  @media (max-width: 1023px) {
    top: 180px
  }
  & img {
    transform: rotateX(0deg);
    transition: all 0.3s;
  }
  & img.reflect {
    transform: rotateX(180deg);
  }
}
.choose-stake-input {
  background-color: white;
}

.choose {
  padding: 20px 16px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
}

.token-input {
  padding-top: 22px;
  padding-bottom: 14px;
  position: absolute;
  top: 164px;
  @media (max-width: 1023px) {
    top: 180px
  }
  &.active {
    top: 0;
  }
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

@media (min-width: 1024px) {
  .choose {
    padding: 30px;
  }
}

.profile-subscribtion {
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  &__approximate {
    margin-top: 55px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    margin-bottom: 30px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  & p {
    margin-bottom: 20px;
    text-align: center;
  }
}

.profile {
  padding: 30px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
}

.title {
  font-size: 24px;
  text-transform: uppercase;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 30px;
}

.profile-actions {
  display: flex;
  margin-top: 30px;
  & .default-button:last-child {
    margin-left: auto;
  }
}

.stake {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  margin: 0 auto;
  width: 100%;
  padding-top: 100px;
  padding-bottom: 100px;
}

@media (min-width: 1300px) {
  .stake {
    grid-template-columns: 550px 1fr;
    width: 1320px;
    max-width: 100%;
  }
}
</style>