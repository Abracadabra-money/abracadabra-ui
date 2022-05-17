<template>
  <div class="stake">
    <div class="input-block">
      <h4>Choose Chain</h4>
      <div class="underline">
        <NetworksList />
      </div>

      <div class="loader-wrap" v-if="isLoadingsSpellStake">
        <BaseLoader />
      </div>

      <div class="swap-wrap" v-if="tokensInfo">
        <div class="token-input">
          <div class="header-balance">
            <h4>{{ action }}</h4>
            <p>Balance: {{ fromToken.balance | formatTokenBalance }}</p>
          </div>
          <BaseTokenInput
            :icon="fromToken.icon"
            :name="fromToken.name"
            :disabled="tokensInfo.lockedUntil && action === 'Unstake'"
            :value="amount"
            @input="updateMainValue"
            :max="fromToken.balance"
            :error="amountError"
          />
        </div>
        <div class="swap-img">
          <img
            src="@/assets/images/swap.svg"
            @click="toggleAction"
            alt="swap"
          />
        </div>
        <div class="token-input">
          <div class="header-balance">
            <h4>Receive</h4>
          </div>
          <BaseTokenInput
            :icon="toToken.icon"
            :name="toToken.name"
            :value="toTokenAmount"
            :disabled="true"
          />
        </div>
      </div>
    </div>
    <div class="profile">
      <h1 class="title">sSPELL Token Staking</h1>
      <div class="loader-wrap" v-if="isLoadingsSpellStake">
        <BaseLoader />
      </div>

      <InfoBlock v-else-if="tokensInfo" :tokensInfo="tokensInfo" />
      <EmptyBlock v-else-if="!isLoadingsSpellStake && !tokensInfo" />
      <div class="profile-actions" v-if="tokensInfo && account">
        <BaseButton
          @click="approveTokenHandler"
          primary
          :disabled="disableApproveBtn"
          >Approve
        </BaseButton>
        <BaseButton @click="actionHandler" :disabled="disableActionBtn">
          {{ action }}
        </BaseButton>
      </div>
      <div class="profile-subscribtion">
        <div class="profile-subscribtion__approximate" v-if="tokensInfo">
          <div>Approximate staking APR</div>
          <div>{{ tokensInfo.apr | formatPercent }}</div>
        </div>

        <div class="text-wrap">
          <p>
            Make SPELL work for you! Stake your SPELL and gain sSPELL. No
            impermanent loss, no loss of governance rights. Continuously
            compounding. After each new deposit, all staked SPELL are subject to
            a 24H lock-up period!
          </p>
          <p>
            sSPELL automatically earns fees from MIM repayments from all wizards
            proportional to your share of the stake pool.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const InfoBlock = () => import("@/components/stake/InfoBlock");
const EmptyBlock = () => import("@/components/stake/EmptyBlock");
const BaseTokenInput = () => import("@/components/base/BaseTokenInput");
const NetworksList = () => import("@/components/ui/NetworksList");
const BaseButton = () => import("@/components/base/BaseButton");
const BaseLoader = () => import("@/components/base/BaseLoader");

import sspellToken from "@/mixins/stake/sspellToken";

import notification from "@/utils/notification/index.js";

export default {
  mixins: [sspellToken],
  data() {
    return {
      action: "Stake",
      amount: "",
      amountError: "",
      spellUpdateInterval: null,
    };
  },
  computed: {
    account() {
      return this.$store.getters.getAccount;
    },
    isLoadingsSpellStake() {
      return this.$store.getters.getLoadingSSpellStake;
    },
    isUserLocked() {
      return this.tokensInfo.lockedUntil && this.action === "Unstake";
    },
    tokensInfo() {
      return this.$store.getters.getSSpellObject;
    },
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
    disableActionBtn() {
      if (this.isUserLocked) return true;
      return !!(!+this.amount || this.amountError);
    },
    disableApproveBtn() {
      if (this.action === "Unstake") return true;
      return !!this.tokensInfo.stakeToken.isTokenApprowed;
    },
  },
  watch: {
    async account(value) {
      if (value) {
        await this.createStakePool();
      }
    },
  },
  methods: {
    toggleAction() {
      this.amount = "";
      this.amountError = "";

      if (this.action === "Stake") {
        this.action = "Unstake";
        return false;
      }

      if (this.action === "Unstake") {
        this.action = "Stake";
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
    async approveTokenHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.approve.pending
      );

      let approve = await this.approveToken(
        this.tokensInfo.stakeToken.contractInstance,
        this.tokensInfo.mainToken.contractInstance.address
      );

      if (approve) {
        await this.$store.commit("notifications/delete", notificationId);
      } else {
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.approve.error
        );
      }

      return false;
    },
    async actionHandler() {
      if (this.isUserLocked) return false;
      if (!+this.amount || this.amountError) return false;

      if (this.action === "Stake") {
        const isApproved = this.tokensInfo.stakeToken.isTokenApprowed;
        if (!isApproved) return false;

        await this.stake();
      }
      if (this.action === "Unstake") {
        await this.unstake();
      }
    },
    async stake() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.transaction.pending
      );

      console.log("STAKE");
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

        console.log("stake", receipt);

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.success
        );
      } catch (e) {
        console.log("stake err:", e);
        let msg;

        if (e.code === 4001) {
          msg = notification.userDenied;
        } else {
          msg = notification.transaction.error;
        }

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", msg);
      }
    },
    async unstake() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.transaction.pending
      );
      console.log("UNSTAKE");
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

        console.log("stake", receipt);

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.success
        );
      } catch (e) {
        console.log("stake err:", e);
        let msg;

        if (e.code === 4001) {
          msg = notification.userDenied;
        } else {
          msg = notification.transaction.error;
        }

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", msg);
      }
    },
    async approveToken(tokenContract, approveAddr) {
      try {
        const estimateGas = await tokenContract.estimateGas.approve(
          approveAddr,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await tokenContract.approve(
          approveAddr,
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
    this.spellUpdateInterval = setInterval(async () => {
      await this.createStakePool();
    }, 15000);
  },
  beforeDestroy() {
    clearInterval(this.spellUpdateInterval);
  },
  components: {
    InfoBlock,
    BaseButton,
    BaseTokenInput,
    NetworksList,
    BaseLoader,
    EmptyBlock,
  },
};
</script>
<style lang="scss" scoped>
.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 10px;
}
.swap-img {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

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

.input-block {
  padding: 30px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
}

.token-input {
  padding-top: 22px;
  padding-bottom: 14px;
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

  .text-wrap {
    margin-top: 30px;
  }

  &__approximate {
    margin-top: 55px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-top: 30px;
}

.stake {
  display: grid;
  grid-template-columns: 550px 1fr;
  width: 1320px;
  max-width: calc(100% - 20px);
  grid-gap: 30px;
  margin: 0 auto;

  padding: 100px 0;
}

@media (max-width: 1200px) {
  .stake {
    grid-gap: 15px;
  }

  .profile {
    padding: 30px 15px;
  }
}

@media (max-width: 1024px) {
  .stake {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .input-block {
    padding: 30px 10px;
  }

  .profile {
    padding: 30px 10px;
  }
}
</style>
