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
            <h4>{{ inputTitle(actions.STAKE, true) }}</h4>
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
            <h4>{{ inputTitle(actions.UNSTAKE, false) }}</h4>
            <p>Balance: {{ parceBalance(info.mainToken.balance) }}</p>
          </div>
          <ValueInput
            class="value-input"
            :icon="getImgUrl('Token_mSpell')"
            name="mSpell"
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
        mainTokenName="mSPELL"
        title="mSpell"
        icon="Token_mSpell"
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
            !info.stakeToken.isTokenApprowed ||
            (isUserLocked && actions.UNSTAKE)
          "
        >
          {{
            isUserLocked
              ? "Nothing to do"
              : actions.STAKE
              ? "Deposit"
              : "Withdraw"
          }}
        </DefaultButton>
      </div>
      <div class="profile-subscribtion">
        <div class="profile-subscribtion__approximate">
          <div>Approximate staking APR</div>
          <div>{{ (info.apr || 0).toFixed(4) + "%" }}</div>
        </div>
        <ClaimInfo
          @onClaim="claim"
          class="claim-info"
          token="MIM"
          icon="Token_MIM"
          :count="'200,000'"
        />
        <p>
          Make SPELL work for you! Stake your SPELL into mSPELL! No impermanent
          loss, no loss of governance rights.
        </p>
        <p>
          After each new deposit, all staked SPELL are subject to a 24H lock-up
          period!
        </p>
      </div>
    </div>
  </div>
</template>
<script>
const InfoBlock = () => import("@/components/stake/InfoBlock");
const ClaimInfo = () => import("@/components/stake/ClaimInfo");

const ValueInput = () => import("@/components/UIComponents/ValueInput");
const NetworksList = () => import("@/components/ui/NetworksList");

import DefaultButton from "@/components/main/DefaultButton.vue";

import mSpellStaking from "@/mixins/stake/mSpellStaking";
import stake from "@/mixins/stake/stake";

export default {
  mixins: [mSpellStaking, stake],
  computed: {
    isUserLocked() {
      return (
        this.lockedUntil &&
        Number(this.lockedUntil) !== 0 &&
        this.actions.UNSTAKE
      );
    },
    loading() {
      return this.$store.getters.getLoadingMSpellStake;
    },
    info() {
      return this.$store.getters.getMSpellStakingObj || this.emptyTokens;
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
    lockedUntil(val) {
      if (val && Number(val) !== 0) {
        this.amount = "";
        this.amountError = "";
      }
    },
    async account() {
      if (this.account) {
        await this.createMSpellStaking();
      }
    },
  },
  methods: {
    async claimHandler() {
      console.log("CLAIM");
      try {
        const estimateGas =
          await this.mSpellStakingObj.mSpellStakingContract.estimateGas.withdraw(
            0
          );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await this.mSpellStakingObj.mSpellStakingContract.withdraw(
          0,
          {
            gasLimit,
          }
        );
        const receipt = await tx.wait();

        console.log("CLAIM", receipt);
      } catch (e) {
        console.log("CLAIM err:", e);
      }
    },
    inputTitle(toogler, isSpell) {
      let text = isSpell ? "Deposit" : "Withdrow";
      return toogler ? text : "Receive";
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
        lockTimestamp = this.info.lockedUntil
          ? this.info.lockedUntil.toString()
          : null;

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
          await this.deposit();
          return false;
        }

        const approvedSuccess = await this.approveToken(
          this.info.spellTokenContract,
          this.info.mSpellStakingContract.address
        );

        if (approvedSuccess) await this.deposit();
      }
      if (this.actions.UNSTAKE) {
        await this.withdraw();
      }
    },
    async deposit() {
      console.log("DEPOSIT");
      try {
        const amount = this.$ethers.utils.parseEther(this.amount);

        console.log("AMOUNT", amount.toString());

        const estimateGas =
          await this.info.mSpellStakingContract.estimateGas.deposit(amount);

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await this.info.mSpellStakingContract.deposit(amount, {
          gasLimit,
        });

        this.amount = "";
        this.amountError = "";

        const receipt = await tx.wait();

        console.log("DEPOSIT", receipt);
      } catch (e) {
        console.log("DEPOSIT err:", e);
      }
    },
    async withdraw() {
      console.log("WITHDRAW");
      try {
        const amount = this.$ethers.utils.parseEther(this.amount);

        console.log("AMOUNT", amount.toString());

        const estimateGas =
          await this.info.mSpellStakingContract.estimateGas.withdraw(amount);

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await this.info.mSpellStakingContract.withdraw(amount, {
          gasLimit,
        });

        this.amount = "";
        this.amountError = "";

        const receipt = await tx.wait();

        console.log("WITHDRAW", receipt);
      } catch (e) {
        console.log("WITHDRAW err:", e);
      }
    },
    async claim() {
      console.log("CLAIM");
      try {
        const estimateGas =
          await this.info.mSpellStakingContract.estimateGas.withdraw(0);

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await this.info.mSpellStakingContract.withdraw(0, {
          gasLimit,
        });
        const receipt = await tx.wait();

        console.log("CLAIM", receipt);
      } catch (e) {
        console.log("CLAIM err:", e);
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
    await this.createMSpellStaking();
    this.lockedUntil = await this.getUserLocked();
    this.updateInterval = setInterval(async () => {
      await this.createMSpellStaking();
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
    ClaimInfo,
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
    height: 350px;
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
    top: 180px;
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
    top: 180px;
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
.claim-info {
  margin: 20px 0;
}
</style>
