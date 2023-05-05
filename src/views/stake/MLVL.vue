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
          <span> Select tranche</span>
          <a
            class="tranches-link"
            href="https://docs.level.finance/tutorials/liquidity-tutorials/trading-pools-tranches"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="@/assets/images/stake/info-Icon.svg" class="info-icon"
          /></a>
        </h4>
        <div class="tranches-buttons">
          <TrancheButton
            type="senior"
            :isActive="tokenLvl === 'Senior'"
            :apr="seniorApy"
            @changeToken="changeTokenLvl('Senior')"
          />
          <TrancheButton
            type="mezzanine"
            :apr="mezzanineApy"
            :isActive="tokenLvl === 'Mezzanine'"
            @changeToken="changeTokenLvl('Mezzanine')"
          />
          <TrancheButton
            type="junior"
            :apr="juniorApy"
            :isActive="tokenLvl === 'Junior'"
            @changeToken="changeTokenLvl('Junior')"
          />
        </div>
      </div>

      <div class="swap-wrap" v-if="tokensInfo">
        <div class="token-input">
          <div class="header-balance">
            <h4>{{ action }}</h4>
            <p>Balance: {{ tokenBalance }}</p>
          </div>
          <BaseTokenInput
            :icon="fromToken.icon"
            :name="fromToken.name"
            :value="amount"
            @updateValue="updateMainValue"
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

    <div class="profile" :style="`background-image: url(${profileBg})`">
      <h1 class="title">Magic Level Tranches</h1>
      <div class="loader-wrap" v-if="isLoading">
        <BaseLoader />
      </div>

      <EmptyBlock v-else-if="!isLoading && !tokensInfo" :warningType="'mlvl'" />

      <template v-else>
        <div class="wrap wrap-chart" v-if="chartData.length && labels.length">
          <div class="chart-row">
            <h1 class="chart-title">APY Chart</h1>
            <div class="chart-apt-wrap">
              <div class="chart-apt">
                <img src="@/assets/images/stake/lvl-apy-icon.png" alt="" />
                <span class="chart-apt-text">est. APY</span>
                <span class="chart-apt-percent" v-if="seniorApy">{{
                  seniorApy
                }}</span>
                <div class="loader-wrap-mini" v-else>
                  <p class="loader"></p>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-btns">
            <button
              class="chart-btn btn-3"
              :class="{ 'chart-btn-active': chartActiveBtn === 3 }"
              @click="changeChartTime(1)"
            >
              3m
            </button>
          </div>
          <TickChart v-if="chartData" :labels="labels" :datasets="chartData" />
        </div>

        <div class="loader-wrap" v-if="!chartData">
          <BaseLoader />
        </div>

        <TranchesStatistics :tokensInfo="tokensInfo" />
        <LvlTokensBalance :tokensInfo="tokensInfo" v-if="tokensInfo" />

        <p class="profile-subscribtion">
          Enjoy the benefits of compounding without having to worry about the
          tedious work! Simply deposit your Level Tranches into Magic Level and
          let it do its magic!
          <br />
          Note: A 1% protocol fee is taken on the yields.
        </p>
        <div class="links-wrap">
          <a
            class="deposit"
            :href="`${trancheLinks[tokenLvl]}/buy`"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src="@/assets/images/deposit.svg" alt="Deposit" /><span>
              Buy LVL</span
            ></a
          >
          <a
            class="deposit"
            :href="`${trancheLinks[tokenLvl]}/sell`"
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
import moment from "moment";
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import mLvlTokensMixin from "@/mixins/stake/mLVL.js";
import { approveToken } from "@/utils/approveHelpers.js";
import profileBg from "@/assets/images/stake/mGLPprofileBg.png";
import notification from "@/helpers/notification/notification.js";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import { getLevelFinanceChartData } from "@/helpers/subgraph/magicLvl/getLevelFinanceChartData.js";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseLoader from "@/components/base/BaseLoader.vue";
import NetworksList from "@/components/ui/NetworksList.vue";
import EmptyBlock from "@/components/stake/EmptyBlock.vue";
import TickChart from "@/components/ui/charts/TickChartMagicLvl.vue";
import TrancheButton from "@/components/stake/TrancheButton.vue";
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import LvlTokensBalance from "@/components/stake/LvlTokensBalance.vue";
import TranchesStatistics from "@/components/stake/TranchesStatistics.vue";

export default {
  mixins: [mLvlTokensMixin],
  data() {
    return {
      action: "Stake",
      amount: "",
      amountError: "",
      chartData: [],
      labels: [],
      updateInterval: null,
      chartActiveBtn: 3,
      chartInterval: null,
      // apy: "",
      gasLimitConst: 1000,
      tokenLvl: "Senior",
      profileBg,
      trancheLinks: {
        Junior: "https://app.level.finance/liquidity/junior-tranche",
        Mezzanine: "https://app.level.finance/liquidity/mezzanine-tranche",
        Senior: "https://app.level.finance/liquidity/senior-tranche",
      },
    };
  },

  computed: {
    ...mapGetters({
      isLoading: "getLoadingMLvlStake",
      tokensInfo: "getMLvlObject",
      account: "getAccount",
      itsMetamask: "getMetamaskActive",
    }),

    activeTokenInfo() {
      return this.tokensInfo[this.tokenLvl];
    },

    stakeToken() {
      return this.activeTokenInfo?.stakeToken;
    },

    tokenBalance() {
      return filters.formatTokenBalance(this.fromToken.balance);
    },

    mainToken() {
      return this.activeTokenInfo?.mainToken;
    },

    isActionApproved() {
      if (this.action === "Stake") return this.stakeToken.isApproved;
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

      if (this.action === "Stake")
        return filters.formatToFixed(
          +this.amount / +this.activeTokenInfo?.tokensRate,
          6
        );

      return filters.formatToFixed(
        +this.amount * +this.activeTokenInfo?.tokensRate,
        6
      );
    },

    disableActionBtn() {
      if (!this.isActionApproved) return true;
      return !!(!+this.amount || this.amountError);
    },

    seniorApy() {
      return filters.formatPercent(
        this.tokensInfo.tranchesStatistics.seniorApy
      );
    },

    mezzanineApy() {
      return filters.formatPercent(
        this.tokensInfo.tranchesStatistics.mezzanineApy
      );
    },

    juniorApy() {
      return filters.formatPercent(
        this.tokensInfo.tranchesStatistics.juniorApy
      );
    },
  },

  watch: {
    async account(value) {
      if (value) await this.createStakeData();
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
        if (+this.stakeToken.walletBalance < +this.amount) {
          const withdrawAmount = this.$ethers.utils.parseEther(
            (+this.amount - +this.stakeToken.walletBalance).toString()
          );

          const tx = await this.activeTokenInfo.levelMasterContract.withdraw(
            this.stakeToken.pid.toString(),
            withdrawAmount.toString(),
            this.account
          );

          await tx.wait();
        }

        const amount = this.$ethers.utils.parseEther(this.amount.toString());

        console.log("amount", amount);

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
      this.labels = [];
      const tickUpper = [];
      const tickUpper2 = [];
      const tickUpper3 = [];
      const data = await getLevelFinanceChartData();

      data.forEach((element) => {
        this.labels.push(moment.unix(element.timestamp).format("DD.MM"));
        tickUpper.push(element.juniorApy);
        tickUpper2.push(element.mezzanineApy);
        tickUpper3.push(element.seniorApy);
      });

      const dataset1 = {
        label: "junior",
        data: tickUpper,
        borderColor: "#ff7101",
        pointBackgroundColor: "#ff7101",
        pointBorderColor: "#ff7101",
        pointRadius: 0,
        borderWidth: 4,
      };

      const dataset2 = {
        label: "megazine",
        data: tickUpper2,
        borderColor: "#874efb",
        pointBackgroundColor: "#874efb",
        pointBorderColor: "#874efb",
        pointRadius: 0,
        borderWidth: 3,
      };

      const dataset3 = {
        label: "sinior",
        data: tickUpper2,
        borderColor: "#58c6f9",
        pointBackgroundColor: "#58c6f9",
        pointBorderColor: "#58c6f9",
        pointRadius: 0,
        borderWidth: 3,
      };

      this.chartData = [];
      this.chartData.push(dataset1, dataset2, dataset3);
    },

    // async changeChartTime(time) {
    //   this.chartActiveBtn = time;
    //   await this.createChartData(time);
    // },

    async createStakeData() {
      await this.createStakePool();
      this.updateInterval = setInterval(async () => {
        await this.createStakePool();
      }, 15000);
    },
  },

  async created() {
    await this.createStakeData();
    await this.createChartData(this.chartActiveBtn);

    // const apy = await getGlpApy(true);
    // this.apy = parseFloat(apy).toFixed(2);

    this.chartInterval = setInterval(async () => {
      await this.createChartData(this.chartActiveBtn);
      // const apy = await getGlpApy(true);
      // this.apy = parseFloat(apy).toFixed(2);
    }, 60000);
  },

  beforeUnmount() {
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
  display: flex;
  align-items: center;
}

.tranches-link {
  display: flex;
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
  background-size: cover;
  background-repeat: no-repeat;
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
  background: linear-gradient(0deg, #37caff, #37caff);
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
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #37caff;
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
  background: linear-gradient(0deg, #37caff, #37caff);
}
.loader:before,
.loader:after {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  content: "";
  background: linear-gradient(0deg, #37caff, #37caff);
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

.wrap-chart {
  margin-bottom: 16px;
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
