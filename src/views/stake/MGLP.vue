<template>
  <div class="stake">
    <div class="input-block">
      <h4>Choose Chain</h4>
      <div class="underline">
        <NetworksList :active-list="[42161]" />
      </div>

      <button @click="wrap">111111</button>

      <div class="loader-wrap" v-if="isLoading">
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
      </div>
    </div>

    <div class="profile">
      <h1 class="title">magicGLP dashboard</h1>
      <div class="loader-wrap" v-if="isLoading">
        <BaseLoader />
      </div>

      <EmptyBlock v-else-if="!isLoading && !tokensInfo" />

      <div class="wrap">
        <div class="chart-row">
          <h1 class="chart-title">APR Chart</h1>
          <div class="chart-apt-wrap">
            <div class="chart-apt">
              <img src="@/assets/images/glp/chart-apr.png" alt="" />
              <span class="chart-apt-text">est. APR</span>
              <span class="chart-apt-percent" v-if="selfRepayingAPY"
                >{{ selfRepayingAPY }}%</span
              >
              <div class="loader-wrap" v-else>
                <p class="loader"></p>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-btns">
          <button
            class="chart-btn btn-3"
            :class="{ 'chart-btn-active': chartActiveBtn === 3 }"
            @click="changeChartTime(3)"
          >
            3m
          </button>
          <button
            class="chart-btn"
            :class="{ 'chart-btn-active': chartActiveBtn === 6 }"
            @click="changeChartTime(6)"
          >
            6m
          </button>
          <button
            class="chart-btn btn-1y"
            :class="{ 'chart-btn-active': chartActiveBtn === 12 }"
            @click="changeChartTime(12)"
          >
            1y
          </button>
        </div>
        <TickChart
          v-if="chartData"
          :labels="chartData.labels"
          :tickUpper="chartData.tickUpper"
        />
      </div>

      <div class="balance-block wrap" v-if="glpInfo && mGlpInfo">
        <div class="balance-top">
          <h4 class="balance-title">Your balance</h4>
          <div class="balance-ratio">
            <img
              class="balance-ratio-icon"
              src="@/assets/images/glp/mGlp.png"
              alt="mGlp icon"
            />
            <span>1 mGLP = 1 GLP</span>
          </div>
        </div>
        <div class="balance-row">
          <div class="balance-token">
            <BaseTokenIcon
              :icon="require('@/assets/images/tokens/GLP.png')"
              size="60px"
            />
            <div>
              <p class="token-title">GLP</p>
              <p class="token-balance">
                {{ glpInfo.balance | formatTokenBalance }}
              </p>
              <p class="token-price">{{ glpInfo.balanceUsd | formatUSD }}</p>
            </div>
          </div>
          <div class="balance-token">
            <BaseTokenIcon
              :icon="require('@/assets/images/tokens/mGLP.png')"
              size="60px"
            />
            <div>
              <p class="token-title">mGLP</p>
              <p class="token-balance">
                {{ mGlpInfo.balance | formatTokenBalance }}
              </p>
              <p class="token-price">{{ mGlpInfo.balanceUsd | formatUSD }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="info-block wrap">
        <div>
          <h5 class="info-title">Total Supply</h5>
          <div class="info-item">
            <div class="info-icon">
              <BaseTokenIcon
                :icon="require('@/assets/images/tokens/mGLP.png')"
                size="40px"
              />
              <span>mGLP</span>
            </div>
            <div class="info-balance">
              <span class="info-value">{{
                mGlpInfo.totalSupply | formatTokenBalance
              }}</span>
              <span class="info-usd">{{
                mGlpInfo.totalSupplyUsd | formatUSD
              }}</span>
            </div>
          </div>
        </div>
        <div class="info-line"></div>
        <div>
          <h5 class="info-title">Total Rewards Earned</h5>
          <div class="info-item">
            <div class="info-icon">
              <BaseTokenIcon
                :icon="require('@/assets/images/tokens/ETH2.png')"
                size="40px"
              />
              <span>ETH</span>
            </div>
            <div class="info-balance">
              <span class="info-value">45,096.44</span>
              <span class="info-usd">$3,223,111.33</span>
            </div>
          </div>
        </div>
      </div>
      <div class="profile-subscribtion">
        <div class="text-wrap">
          <p>
            Enjoy the benefits of compounding without having to worry about the
            tedious work! Simply deposit your GLP into MagicGLP and let it do
            its magic!
          </p>
        </div>
        <div class="links-wrap">
          <a class="deposit" href="#" target="_blank" rel="noreferrer noopener">
            <img src="@/assets/images/deposit.svg" alt="Deposit" /><span>
              Get GLP</span
            ></a
          >
          <a class="deposit" href="#" target="_blank" rel="noreferrer noopener">
            <img src="@/assets/images/deposit.svg" alt="Deposit" />
            <span>Sell GLP</span></a
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");
const TickChart = () => import("@/components/ui/TickChart");
import moment from "moment";
import getGlpAprChart from "@/helpers/glpAprChart";
import { getGlpApr } from "@/helpers/glpApr";

// ---------------------------------

// ------------
const EmptyBlock = () => import("@/components/stake/EmptyBlock");
const BaseTokenInput = () => import("@/components/base/BaseTokenInput");
const NetworksList = () => import("@/components/ui/NetworksList");
const BaseButton = () => import("@/components/base/BaseButton");
const BaseLoader = () => import("@/components/base/BaseLoader");

import mGlpTokenMixin from "@/mixins/stake/mGlpToken";

import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification.js";
import { mapGetters } from "vuex";

export default {
  mixins: [mGlpTokenMixin],
  data() {
    return {
      action: "Stake",
      amount: "",
      amountError: "",
      // ----------------new
      chartData: null,
      spellUpdateInterval: null,
      chartActiveBtn: 3,
      chartInterval: null,
      selfRepayingAPY: "",
      gasLimitConst: 1000,
    };
  },
  computed: {
    ...mapGetters({
      isLoading: "getLoadingMGlpStake",
      account: "getAccount",
      tokensInfo: "getMGlpObject",
    }),

    glpInfo() {
      return this.tokensInfo?.stakeToken;
    },

    isGlpApproved() {
      return this.tokensInfo.stakeToken.isTokenApprowed;
    },

    mGlpInfo() {
      return this.tokensInfo?.mainToken;
    },

    fromToken() {
      if (this.action === "Stake") return this.tokensInfo.stakeToken;
      return this.tokensInfo.mainToken;
    },

    toToken() {
      if (this.action === "Stake") return this.tokensInfo.mainToken;
      return this.tokensInfo.stakeToken;
    },

    disableApproveBtn() {
      if (this.action === "Unstake") return true;
      return !!this.tokensInfo.stakeToken.isTokenApprowed;
    },

    toTokenAmount() {
      if (!this.amount || !this.tokensInfo) return "";

      if (this.action === "Stake")
        return Vue.filter("formatToFixed")(this.amount, 6);

      return Vue.filter("formatToFixed")(this.amount, 6);
    },

    // -------------------------------
    // todo isUserLocked
    isUserLocked() {
      return this.tokensInfo.lockedUntil && this.action === "Unstake";
    },

    disableActionBtn() {
      // todo isUserLocked
      if (this.isUserLocked) return true;
      return !!(!+this.amount || this.amountError);
    },
  },

  watch: {
    async account(value) {
      if (value) await this.createStakePool();
    },
  },

  methods: {
    toggleAction() {
      this.amount = "";
      this.amountError = "";
      this.action = this.action === "Stake" ? "Unstake" : "Stake";
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
        notification.approvePending
      );

      let approve = await this.approveToken(
        this.glpInfo.contractInstance,
        this.mGlpInfo.contractInstance.address
      );

      if (approve) {
        await this.$store.commit("notifications/delete", notificationId);
      } else {
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.approveError
        );
      }

      return false;
    },

    async actionHandler() {
      if (this.isUserLocked || !+this.amount || this.amountError) return false;
      if (this.action === "Stake" && this.isGlpApproved) await this.wrap();
      if (this.action === "Unstake") await this.unstake();
    },

    async wrap() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );
      try {
        const amount = this.$ethers.utils.parseEther(this.amount);
        const estimateGas =
          await this.tokensInfo.wrapperContract.estimateGas.wrap(
            this.glpInfo.contractInstance.address,
            amount
          );

        const gasLimit = this.gasLimitConst * 100 + +estimateGas.toString();

        await this.tokensInfo.wrapperContract.wrap(
          this.glpInfo.contractInstance.address,
          amount,
          {
            gasLimit,
          }
        );

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", notification.success);
      } catch (error) {
        console.log("Wrap GLP error:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    async unWrap() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );
      try {
        const amount = this.$ethers.utils.parseEther(this.amount);
        const estimateGas =
          await this.tokensInfo.wrapperContract.estimateGas.unwrap(
            this.account,
            amount
          );

        const gasLimit = this.gasLimitConst * 100 + +estimateGas.toString();

        await this.tokensInfo.wrapperContract.unwrap(this.account, amount, {
          gasLimit,
        });

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", notification.success);
      } catch (error) {
        console.log("Wrap GLP error:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    // ------------------------ TODO tyt

    async unstake() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

      try {
        const amount = this.$ethers.utils.parseEther(this.amount);

        const estimateGas =
          await this.tokensInfo.mainToken.contractInstance.estimateGas.burn(
            this.account,
            amount
          );

        const gasLimit = 1000 + +estimateGas.toString();

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
        await this.$store.dispatch("notifications/new", notification.success);
      } catch (e) {
        console.log("stake err:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },
    async approveToken(tokenContract, approveAddr) {
      try {
        const estimateGas = await tokenContract.estimateGas.approve(
          approveAddr,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );

        const gasLimit = 1000 + +estimateGas.toString();

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
    // -----------------------
    async createChartData(time = 3) {
      const result = {
        labels: [],
        tickUpper: [],
      };

      const data = await getGlpAprChart(time);

      data.forEach((element) => {
        result.labels.push(moment.unix(element.timestamp).format("DD.MM"));
        result.tickUpper.push(element.glpApr);
      });

      this.chartData = result;
      console.log("this.chartData", this.chartData);
    },

    async changeChartTime(time) {
      this.chartActiveBtn = time;
      await this.createChartData(time);
    },
  },

  async created() {
    await this.createStakePool();
    this.spellUpdateInterval = setInterval(async () => {
      await this.createStakePool();
    }, 15000);

    // ------------------new

    await this.createChartData(this.chartActiveBtn);

    const selfRepayingAPY = await getGlpApr();
    this.selfRepayingAPY = parseFloat(selfRepayingAPY - 1).toFixed(2);

    // this.chartInterval = setInterval(async () => {
    //   await this.createChartData(this.chartActiveBtn);
    //   const selfRepayingAPY = await getGlpApr();
    //   this.selfRepayingAPY = parseFloat(selfRepayingAPY - 1).toFixed(2);
    // }, 60000);
  },

  beforeDestroy() {
    clearInterval(this.spellUpdateInterval);
  },
  components: {
    BaseTokenIcon,
    TickChart,
    // -----------------------
    // -----------------------
    BaseButton,
    BaseTokenInput,
    NetworksList,
    BaseLoader,
    EmptyBlock,
  },
};
</script>
<style lang="scss" scoped>
.empty-link {
  color: #759ffa;
}

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

// new style

.chart-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.chart-title {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
}

.chart-apt-wrap {
  width: 178px;
  height: 32px;
  background: linear-gradient(92.08deg, #63ff7b 0%, #6b9ef8 100%);
  display: flex;
  align-items: center;
  border-radius: 0px 30px 30px 0px;
}

.chart-apt {
  width: 176px;
  height: 30px;
  background: #23212d;
  border-radius: 0px 30px 30px 0px;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 30px;

  img {
    width: 44px;
    height: 44px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -22px;
  }
}

.chart-apt-text {
  font-weight: 400;
  font-size: 18px;
  line-height: 27px;
  margin-right: 10px;
}

.chart-apt-percent {
  background: linear-gradient(92.08deg, #63ff7b 0%, #6b9ef8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.chart-btns {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.chart-btn {
  width: 32px;
  background: #2a2835;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: #fff;
  cursor: pointer;
}

.chart-btn-active {
  background: #343141;
}

.btn-3 {
  border-radius: 4px 0 0 4px;
}

.btn-1y {
  border-radius: 0 4px 4px 0;
}

.wrap {
  width: 100%;
  padding: 16px;
  background: #2b2b3c;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.05);
  backdrop-filter: blur(50px);
  border-radius: 30px;
}

.balance-block {
  margin: 16px 0;
}

.balance-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.balance-title {
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
}

.balance-ratio {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
}

.balance-ratio-icon {
  width: 24px;
  height: 24px;
}

.balance-row,
.info-block {
  display: grid;
  grid-template-columns: 1fr 33px 1fr;
  text-align: left;
}

.balance-token {
  display: flex;
  font-weight: 400;
  line-height: 22px;
  font-size: 18px;
}

.token-balance {
  font-weight: 700;
  font-size: 24px;
  line-height: 30px;
}

.token-price {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.info-block {
  margin-bottom: 24px;
}

.info-title {
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  margin-bottom: 14px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-icon {
  display: flex;
  align-items: center;
}

.info-balance {
  display: flex;
  flex-direction: column;
  align-items: end;
}

.info-line {
  position: relative;
}

.info-line::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 1px;
  height: 45px;
  background: rgba(255, 255, 255, 0.1);
}

.info-value {
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
}

.info-usd {
  font-size: 14px;
  line-height: 21px;
  display: flex;
  color: rgba(255, 255, 255, 0.6);
}

.links-wrap {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.deposit {
  background: linear-gradient(
    90deg,
    rgba(157, 244, 255, 0.2) 0%,
    rgba(121, 129, 255, 0.2) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 30px;
  padding: 3px 8px;
  color: #63caf8;
  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    font-weight: 600;
    font-size: 14px;
    line-height: 21px;
    display: flex;
    align-items: center;
    letter-spacing: 0.025em;
    background: linear-gradient(90deg, #9df4ff 0%, #7981ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }

  img {
    margin-right: 5px;
  }
}

.loader-wrap {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35%;
}

.loader {
  position: relative;
  display: block;
  width: 8px;
  animation: rectangle infinite 1s ease-in-out -0.2s;
  border-radius: 4px;
  background: linear-gradient(92.08deg, #63ff7b 0%, #6b9ef8 100%);
}
.loader:before,
.loader:after {
  position: absolute;

  width: 8px;
  height: 8px;
  border-radius: 4px;

  content: "";

  background: linear-gradient(92.08deg, #63ff7b 0%, #6b9ef8 100%);
}
.loader:before {
  left: -10px;
  animation: rectangle infinite 1s ease-in-out -0.4s;
}
.loader:after {
  right: -10px;
  animation: rectangle infinite 1s ease-in-out;
}

@keyframes rectangle {
  0%,
  80%,
  100% {
    height: 6px;
  }
  40% {
    height: 8px;
  }
}

@media (max-width: 1200px) {
  .stake {
    grid-gap: 15px;
  }

  .profile {
    padding: 30px 15px;
  }
}

@media (min-width: 1024px) {
  .choose {
    padding: 30px;
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
