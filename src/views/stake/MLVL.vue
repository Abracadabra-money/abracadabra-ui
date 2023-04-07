<template>
  <div class="stake">
    <div class="input-block">
      <h4>Choose Chain</h4>
      <div class="underline">
        <NetworksList :active-list="[56]" />
      </div>
      <div class="loader-wrap" v-if="isLoading">
        <BaseLoader />
      </div>

      <div class="tranches-wrap" v-if="tokensInfo">
        <h4>
          Select tranche
          <img src="@/assets/images/stake/info-Icon.svg" class="info-icon" />
        </h4>
        <div class="tranches-buttons">
          <TrancheButton
            type="senior"
            :isActive="tokenLvl === 'Junior'"
            @changeToken="changeTokenLvl('Junior')"
          />
          <TrancheButton
            type="mezzanine"
            :isActive="tokenLvl === 'Mezzanine'"
            @changeToken="changeTokenLvl('Mezzanine')"
          />
          <TrancheButton
            type="junior"
            :isActive="tokenLvl === 'Senior'"
            @changeToken="changeTokenLvl('Senior')"
          />
        </div>
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
        <p class="profile-subscribtion">
          Amplify your yield with the Abracadabra Leverage Engine
          <router-link
            class="link"
            :to="{ name: 'Leverage', params: { id: 3 } }"
            >here.</router-link
          >
        </p>
      </div>
    </div>

    <div class="profile" :style="`background-image: url(${profileBg})`">
      <h1 class="title">Magic Level Tranches</h1>
      <div class="loader-wrap" v-if="isLoading">
        <BaseLoader />
      </div>

      <EmptyBlock v-else-if="!isLoading && !tokensInfo" :warningType="'mlvl'" />

      <template v-else>
        <!-- <div class="wrap wrap-chart" v-if="chartData"> -->
        <div class="wrap wrap-chart" v-if="false">
          <div class="chart-row">
            <h1 class="chart-title">APY Chart</h1>
            <div class="chart-apt-wrap">
              <div class="chart-apt">
                <img src="@/assets/images/glp/chart-apr.png" alt="" />
                <span class="chart-apt-text">est. APY</span>
                <span class="chart-apt-percent" v-if="apy">{{ apy }}%</span>
                <div class="loader-wrap-mini" v-else>
                  <p class="loader"></p>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-btns">
            <button
              class="chart-btn btn-3"
              :class="{ 'chart-btn-active': chartActiveBtn === 1 }"
              @click="changeChartTime(1)"
            >
              1m
            </button>
            <button
              class="chart-btn"
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

        <div class="loader-wrap" v-if="!chartData">
          <BaseLoader />
        </div>

        <TranchesStatistics />
        <LvlTokensBalance :tokensInfo="tokensInfo" />

        <p class="profile-subscribtion">
          Enjoy the benefits of compounding without having to worry about the
          tedious work! Simply deposit your GLP into MagicGLP and let it do its
          magic!
          <br />
          Note: A 1% protocol fee is taken on the yields.
        </p>
        <div class="links-wrap">
          <a
            class="deposit"
            href="https://app.gmx.io/#/buy_glp"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src="@/assets/images/deposit.svg" alt="Deposit" /><span>
              Buy LVL</span
            ></a
          >
          <a
            class="deposit"
            href="https://app.gmx.io/#/buy_glp#redeem"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src="@/assets/images/deposit.svg" alt="Deposit" />
            <span>Sell LVL</span></a
          >
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import moment from "moment";
import { mapGetters } from "vuex";
const NetworksList = () => import("@/components/ui/NetworksList");
const BaseLoader = () => import("@/components/base/BaseLoader");
const BaseTokenInput = () => import("@/components/base/BaseTokenInput");
const BaseButton = () => import("@/components/base/BaseButton");
const EmptyBlock = () => import("@/components/stake/EmptyBlock");
const TickChart = () => import("@/components/ui/charts/TickChart");
const TrancheButton = () => import("@/components/stake/TrancheButton");
const TranchesStatistics = () =>
  import("@/components/stake/TranchesStatistics");
const LvlTokensBalance = () => import("@/components/stake/LvlTokensBalance");

// import { getGlpApy } from "@/helpers/collateralsApy/getGlpApy";
import { approveToken } from "@/utils/approveHelpers";
import { getGlpChartApr } from "@/helpers/glpAprChart";
import mGlpTokenMixin from "@/mixins/stake/mLVL";
import notification from "@/helpers/notification/notification.js";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import profileBg from "@/assets/images/stake/mGLPprofileBg.png";

export default {
  mixins: [mGlpTokenMixin],
  data() {
    return {
      action: "Stake",
      amount: "",
      amountError: "",
      chartData: null,
      updateInterval: null,
      chartActiveBtn: 1,
      chartInterval: null,
      apy: "",
      gasLimitConst: 1000,
      totalRewards: null,
      tokenLvl: "Junior",
      profileBg,
    };
  },

  computed: {
    ...mapGetters({
      isLoading: "getLoadingMLvlStake",
      tokensInfo: "getMLvlObject",
      account: "getAccount",
      itsMetamask: "getMetamaskActive",
    }),

    lvlInfo() {
      return this.tokensInfo[this.tokenLvl];
    },

    stakeToken() {
      return this.lvlInfo?.stakeToken;
    },

    mainToken() {
      return this.lvlInfo?.mainToken;
    },

    isActionApproved() {
      if (this.action === "Stake") return !!this.stakeToken.isApproved;
      return true;
    },

    fromToken() {
      if (this.action === "Stake") return this.stakeToken;
      return this.mainToken;
    },

    toToken() {
      if (this.action === "Stake") return this.mainToken;
      return this.stakeToken;
    },

    disableApproveBtn() {
      return this.isActionApproved;
    },

    toTokenAmount() {
      if (!this.amount || !this.tokensInfo) return "";

      if (this.action === "Stake") {
        const amount = this.amount / this.lvlInfo?.tokensRate;
        return Vue.filter("formatToFixed")(amount, 6);
      }

      const amount = this.amount * this.lvlInfo?.tokensRate;
      return Vue.filter("formatToFixed")(amount, 6);
    },

    disableActionBtn() {
      if (!this.isActionApproved) return true;
      return !!(!+this.amount || this.amountError);
    },

    totalRewardsEarned() {
      return this.totalRewards
        ? this.$ethers.utils.formatEther(this.totalRewards?.total)
        : 0;
    },

    totalRewardsUsd() {
      return this.totalRewards
        ? parseFloat(
            +this.totalRewardsEarned * +this.lvlInfo?.ethPrice
          ).toFixed(2)
        : 0;
    },
  },

  watch: {
    async account(value) {
      if (value) await this.createStakePool();
    },
  },

  methods: {
    changeTokenLvl(lvl) {
      this.tokenLvl = lvl;
    },

    updateValue(amount) {
      this.amount = amount ? amount : "";
      this.amountError = "";
    },

    toggleAction() {
      this.updateValue();
      this.action = this.action === "Stake" ? "Unstake" : "Stake";
    },

    updateMainValue(amount) {
      if (+amount > +this.fromToken.balance)
        this.amountError = `The value cannot be greater than ${this.fromToken.balance}`;
      else this.updateValue(amount);
    },

    async createNotification(msg) {
      return await this.$store.dispatch("notifications/new", msg);
    },

    async deleteNotification(id) {
      await this.$store.commit("notifications/delete", id);
    },

    async approveTokenHandler() {
      const { approvePending, approveError } = notification;

      const notificationId = await this.createNotification(approvePending);

      const approve = await approveToken(
        this.stakeToken.contractInstance,
        this.mainToken.address
      );

      await this.deleteNotification(notificationId);

      if (!approve) await this.createNotification(approveError);

      return false;
    },

    async actionHandler() {
      if (!+this.amount || this.amountError || !this.isActionApproved)
        return false;

      if (this.action === "Stake") {
        await this.stake();
      }
      if (this.action === "Unstake") {
        await this.unstake();
      }
    },

    async stake() {
      const { pending, success } = notification;
      const notificationId = await this.createNotification(pending);

      try {
        if (this.stakeToken.walletBalance < this.amount) {
          const withdrawAmount = this.$ethers.utils.parseEther(
            this.amount - this.stakeToken.walletBalance
          );
          const tx = await this.lvlInfo.levelMasterContract.withdraw(
            this.stakeToken.pid.toString(),
            withdrawAmount,
            this.account
          );

          await tx.wait();
        }

        const amount = this.$ethers.utils.parseEther(this.amount);

        const estimateGas =
          await this.mainToken.contractInstance.estimateGas.deposit(
            amount,
            this.account
          );

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.mainToken.contractInstance.deposit(
          amount,
          this.account,
          {
            gasLimit,
          }
        );

        this.amount = "";
        this.amountError = "";

        const receipt = await tx.wait();

        console.log("stake", receipt);

        this.deleteNotification(notificationId);
        this.createNotification(success);
      } catch (e) {
        console.log("stake err:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        this.deleteNotification(notificationId);
        this.createNotification(errorNotification);
      }
    },

    async unstake() {
      const { pending, success } = notification;
      const notificationId = await this.createNotification(pending);

      try {
        const amount = this.$ethers.utils.parseEther(this.amount);

        const estimateGas =
          await this.mainToken.contractInstance.estimateGas.redeem(
            amount,
            this.account,
            this.account
          );

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.mainToken.contractInstance.redeem(
          amount,
          this.account,
          this.account,
          {
            gasLimit,
          }
        );

        this.amount = "";
        this.amountError = "";

        const receipt = await tx.wait();

        console.log("stake", receipt);

        this.deleteNotification(notificationId);
        this.createNotification(success);
      } catch (e) {
        console.log("stake err:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        this.deleteNotification(notificationId);
        this.createNotification(errorNotification);
      }
    },

    async createChartData(time = 3) {
      const labels = [];
      const tickUpper = [];
      const data = await getGlpChartApr(time);
      data.forEach((element) => {
        labels.push(moment.unix(element.timestamp).format("DD.MM"));
        tickUpper.push(element.glpApy * (1 - this.lvlInfo?.feePercent));
      });

      this.chartData = { labels, tickUpper };
    },

    async changeChartTime(time) {
      this.chartActiveBtn = time;
      await this.createChartData(time);
    },

    async getTotalRewards() {
      try {
        const response = await axios.get(
          "https://analytics.abracadabra.money/api/mglp"
        );

        this.totalRewards = response.data;
      } catch (error) {
        console.log("Get Total Rewards Error", error);
      }
    },
  },

  filters: {
    localAmountFilter(val) {
      return Number(val).toLocaleString();
    },
  },

  async created() {
    await this.createStakePool();

    // if (this.chainId !== 42161) return false;
    // await this.getTotalRewards();
    this.updateInterval = setInterval(async () => {
      await this.createStakePool();
    }, 15000);

    // await this.createChartData(this.chartActiveBtn);

    // const apy = await getGlpApy(true);
    // this.apy = parseFloat(apy).toFixed(2);

    // this.chartInterval = setInterval(async () => {
    //   await this.createChartData(this.chartActiveBtn);
    //   const apy = await getGlpApy(true);
    //   this.apy = parseFloat(apy).toFixed(2);
    // }, 60000);
  },

  beforeDestroy() {
    clearInterval(this.updateInterval);
  },
  components: {
    TickChart,
    BaseButton,
    BaseTokenInput,
    NetworksList,
    BaseLoader,
    EmptyBlock,
    TrancheButton,
    TranchesStatistics,
    LvlTokensBalance,
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

.tranches-wrap {
  margin-top: 15px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.tranches-wrap h4 {
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  display: flex;
  align-items: center;
  letter-spacing: 0.025em;
}
.info-icon {
  margin-left: 10px;
}
.tranches-buttons {
  display: flex;
  gap: 10px;
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
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.025em;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 30px;
  margin-bottom: 24px;
  text-align: center;
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
  margin: 30px 0;
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

.balance-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  text-align: left;
}

.info-block {
  grid-template-columns: 1fr 33px 1fr;
}

.balance-token {
  display: flex;
  font-weight: 400;
  line-height: 22px;
  font-size: 18px;
}

.token-icon {
  display: flex;
  align-items: center;
}

.token-icon-name {
  display: none;
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

.loader-wrap-mini {
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

.link {
  background: linear-gradient(90deg, #9df4ff 0%, #7981ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
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

@media (max-width: 1100px) {
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

  .balance-top {
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: 5px;
  }

  .info-block,
  .balance-row {
    display: flex;
    flex-direction: column;
  }

  .balance-row {
    gap: 10px;
  }

  .balance-token {
    justify-content: space-between;
  }

  .info-line,
  .token-title {
    display: none;
  }

  .token-icon-name {
    display: block;
  }

  .chart-row {
    flex-direction: column;
  }

  .wrap-chart {
    max-width: 88vw;
    margin: 0 auto;
  }
  .tranches-buttons {
    flex-direction: column;
  }
}
</style>
