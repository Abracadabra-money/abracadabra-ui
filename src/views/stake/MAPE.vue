<template>
  <div class="stake">
    <div class="input-block" :style="`background-image: url(${inputBlockBg})`">
      <h4>Choose Chain</h4>
      <div class="underline">
        <NetworksList :active-list="[1]" />
      </div>
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
            :to="{ name: 'Leverage', params: { id: 39 } }"
            >this.</router-link
          >
        </p>
      </div>
    </div>

    <div class="profile" :style="`background-image: url(${profileBg})`">
      <h1 class="title">
        magic
        <img class="title-img" src="@/assets/images/ape/ape.png" alt="" /> Ape
      </h1>
      <div class="loader-wrap" v-if="isLoading">
        <BaseLoader />
      </div>

      <EmptyBlock v-else-if="!isLoading && !tokensInfo" :warningType="'mape'" />

      <template v-else>
        <div class="wrap wrap-chart" :class="[chartActive]" v-if="chartData">
          <div class="chart-row">
            <h1 class="chart-title">APY Chart</h1>
            <div class="chart-apt-wrap">
              <div class="chart-apt">
                <img src="@/assets/images/ape/apr.png" alt="" />
                <span class="chart-apt-text">est. APY</span>
                <span class="chart-apt-percent" v-if="apy">{{ apy }}%</span>
                <div class="loader-wrap-mini" v-else>
                  <p class="loader"></p>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-btns">
            <div>
              <button
                class="chart-btn btn-start"
                :class="{ 'chart-btn-active': chartActive === 'apy' }"
                @click="changeChart('apy')"
              >
                APY
              </button>
              <button
                class="chart-btn"
                :class="{ 'chart-btn-active': chartActive === 'apr' }"
                @click="changeChart('apr')"
              >
                APR
              </button>
              <button
                class="chart-btn"
                :class="{ 'chart-btn-active': chartActive === 'tvl' }"
                @click="changeChart('tvl')"
              >
                TVL
              </button>
              <button
                class="chart-btn btn-last"
                :class="{ 'chart-btn-active': chartActive === 'price' }"
                @click="changeChart('price')"
              >
                Price
              </button>
            </div>
            <div>
              <button
                class="chart-btn btn-start"
                :class="{ 'chart-btn-active': chatrTime === 1 }"
                @click="changeChartTime(1)"
              >
                1m
              </button>
              <button
                class="chart-btn btn-last"
                :class="{ 'chart-btn-active': chatrTime === 3 }"
                @click="changeChartTime(3)"
              >
                3m
              </button>
            </div>
          </div>
          <TickChart
            v-if="chartData"
            :label="chartActive.toUpperCase()"
            :labels="chartData.labels"
            :tickUpper="chartData.tickUpper"
          />
        </div>

        <div class="loader-wrap" v-if="!chartData">
          <BaseLoader />
        </div>

        <div class="balance-block wrap" v-if="stakeToken && mainToken">
          <div class="balance-top">
            <h4 class="balance-title">Your balance</h4>
            <div class="balance-ratio">
              <img
                class="balance-ratio-icon"
                src="@/assets/images/tokens/mAPE.png"
                alt="mApe icon"
              />
              <span>1 magicAPE = {{ tokensRate }} APE</span>
            </div>
          </div>
          <div class="balance-row">
            <div class="balance-token">
              <div class="token-icon">
                <BaseTokenIcon
                  :icon="require('@/assets/images/tokens/APE.png')"
                  size="60px"
                />
                <span class="token-icon-name">APE</span>
              </div>
              <div>
                <p class="token-title">APE</p>
                <p class="token-balance">
                  {{ stakeToken.balance | formatTokenBalance }}
                </p>
                <p class="token-price">
                  {{ stakeToken.balanceUsd | formatUSD }}
                </p>
              </div>
            </div>
            <div class="balance-token">
              <div class="token-icon">
                <BaseTokenIcon
                  :icon="require('@/assets/images/tokens/mAPE.png')"
                  size="60px"
                />
                <span class="token-icon-name">magicAPE</span>
              </div>
              <div>
                <p class="token-title">magicAPE</p>
                <p class="token-balance">
                  {{ mainToken.balance | formatTokenBalance }}
                </p>
                <p class="token-price">
                  {{ mainToken.balanceUsd | formatUSD }}
                </p>
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
                  :icon="require('@/assets/images/tokens/mAPE.png')"
                  size="40px"
                />
                <span>magicAPE</span>
              </div>
              <div class="info-balance">
                <span class="info-value">{{
                  mainToken.totalSupply | formatTokenBalance
                }}</span>
                <span class="info-usd">{{
                  mainToken.totalSupplyUsd | formatUSD
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
                  :icon="require('@/assets/images/tokens/APE.png')"
                  size="40px"
                />
                <span>APE</span>
              </div>
              <div class="info-balance">
                <span class="info-value">{{
                  totalRewardsEarned | formatTokenBalance
                }}</span>
                <span class="info-usd">${{ totalRewardsUsd }}</span>
              </div>
            </div>
          </div>
        </div>
        <p class="profile-subscribtion">
          Enjoy the benefits of compounding without having to worry about the
          tedious work! Simply deposit your APE into MagicAPE and let it do its
          magic!
          <br />
          Note: A 1% protocol fee is taken on the yields.
        </p>
        <div class="btns-wrap">
          <BaseButton @click="goBorrow">
            <div class="btn-ape-wrap">
              <img
                class="btn-ape-img"
                src="@/assets/images/ape/ape.b.png"
                alt=""
              />
              <span class="btn-ape-text">Borrow against MAGIC APE</span>
            </div>
          </BaseButton>
          <BaseButton @click="goLeverage">
            <span class="btn-ape-text"
              >Leverage your Yield (up to ≈{{ expectedApy }}%)</span
            ></BaseButton
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
const TickChart = () => import("@/components/ui/TickChart");
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");
import { approveToken } from "@/utils/approveHelpers";
import mAPETokenMixin from "@/mixins/stake/mAPEToken";
import notification from "@/helpers/notification/notification.js";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import inputBlockBg from "@/assets/images/ape/bg.png";
import profileBg from "@/assets/images/ape/bg-info.png";
import { getApeApy } from "@/helpers/collateralsApy/getApeApy";

export default {
  mixins: [mAPETokenMixin],
  data() {
    return {
      action: "Stake",
      amount: "",
      amountError: "",
      chartData: null,
      updateInterval: null,
      chartInterval: null,
      apy: "",
      gasLimitConst: 1000,
      totalRewards: null,
      inputBlockBg,
      profileBg,
      fetchData: null,
      tvlData: null,
      tvlInterval: null,
      chatrTime: 1,
      chartActive: "apy",
      priceData: null,
      priceIntervalL: null,
    };
  },

  computed: {
    ...mapGetters({
      isLoading: "getLoadingMApeStake",
      account: "getAccount",
      tokensInfo: "getMApeObject",
      itsMetamask: "getMetamaskActive",
      provider: "getProvider",
    }),

    stakeToken() {
      return this.tokensInfo?.stakeToken;
    },

    mainToken() {
      return this.tokensInfo?.mainToken;
    },

    isActionApproved() {
      if (this.action === "Stake")
        return !!this.tokensInfo?.stakeToken.isApproved;
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

    tokensRate() {
      const amount = 1 * this.tokensInfo.tokensRate;
      return Vue.filter("formatToFixed")(amount, 4);
    },

    toTokenAmount() {
      if (!this.amount || !this.tokensInfo) return "";

      if (this.action === "Stake") {
        const amount = this.amount / this.tokensInfo.tokensRate;
        return Vue.filter("formatToFixed")(amount, 6);
      }

      const amount = this.amount * this.tokensInfo.tokensRate;
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
            +this.totalRewardsEarned * +this.tokensInfo.stakeToken.price
          ).toFixed(2)
        : 0;
    },

    expectedApy() {
      const multiplier = 15;
      const percentMultiplier = 0.7;
      const expectedLevearage =
        (1 - Math.pow(percentMultiplier, multiplier + 1)) /
        (1 - percentMultiplier);

      return Math.floor(parseFloat(expectedLevearage * this.apy).toFixed(2));
    },
  },

  watch: {
    async account(value) {
      if (value) await this.createStakePool();
    },
  },

  methods: {
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

      if (this.action === "Stake") await this.stake();

      if (this.action === "Unstake") await this.unstake();
    },

    async stake() {
      const { pending, success } = notification;
      const notificationId = await this.createNotification(pending);

      try {
        const amount = this.$ethers.utils.parseEther(this.amount);
        const estimateGas =
          await this.tokensInfo.mainToken.contractInstance.estimateGas.deposit(
            amount,
            this.account
          );

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.tokensInfo.mainToken.contractInstance.deposit(
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
          await this.tokensInfo.mainToken.contractInstance.estimateGas.redeem(
            amount,
            this.account,
            this.account
          );

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.tokensInfo.mainToken.contractInstance.redeem(
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

    async fetchChartData() {
      const response = await axios.get(
        "https://analytics.abracadabra.money/api/mape"
      );
      const apy = await getApeApy(this.provider);
      this.apy = apy.toFixed(2);
      this.fetchData = response.data;
      this.changeChart();
    },

    async fetchTvl() {
      const response = await axios.get(
        "https://analytics.abracadabra.money/api/mape/tvl"
      );

      return response.data;
    },

    async createChartTvlData() {
      this.tvlData = await this.fetchTvl();

      this.tvlInterval = setInterval(async () => {
        this.tvlData = await this.fetchTvl();
      }, 60000);

      return this.tvlData;
    },

    async fetchPrice() {
      const response = await axios.get(
        "https://analytics.abracadabra.money/api/mape/price"
      );

      return response.data;
    },

    async createChartPriceData() {
      this.priceData = await this.fetchPrice();

      this.priceInterval = setInterval(async () => {
        this.priceData = await this.fetchPrice();
      }, 60000);

      return this.priceData;
    },

    async changeChart(type = "apy") {
      this.chartActive = type;
      const labels = [];
      const tickUpper = [];

      let typeData = this.fetchData;

      if (type === "tvl") {
        if (!this.tvlData) typeData = await this.createChartTvlData();
        else typeData = this.tvlData;
      }

      if (type === "price") {
        if (!this.priceData) typeData = await this.createChartPriceData();
        else typeData = this.priceData;
      }

      const data = typeData.slice(0, this.chatrTime * 31).reverse();

      data.forEach((element) => {
        labels.push(moment(element.date).format("DD.MM"));
        tickUpper.push(element[type]);
      });

      this.chartData = { labels, tickUpper };
    },

    async changeChartTime(time) {
      this.chatrTime = time;
      this.changeChart(this.chartActive);
    },

    async getTotalRewards() {
      try {
        const response = await axios.get(
          "https://analytics.abracadabra.money/api/mape/rewards"
        );

        this.totalRewards = response.data;
      } catch (error) {
        console.log("Get Total Rewards Error", error);
      }
    },

    goBorrow() {
      this.$router.push({ name: "Borrow", params: { id: 39 } });
    },

    goLeverage() {
      this.$router.push({ name: "Leverage", params: { id: 39 } });
    },
  },

  async created() {
    await this.createStakePool();

    if (this.chainId !== 1) return false;
    await this.getTotalRewards();
    this.updateInterval = setInterval(async () => {
      await this.createStakePool();
    }, 15000);

    await this.fetchChartData();

    this.chartInterval = setInterval(async () => {
      await this.fetchChartData();
    }, 60000);
  },

  beforeDestroy() {
    clearInterval(this.updateInterval);
    clearInterval(this.chartInterval);
    clearInterval(this.tvlInterval);
    clearInterval(this.priceIntervalL);
  },
  components: {
    BaseTokenIcon,
    TickChart,
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
  background-position: center;
  background-size: cover;
}

.token-input {
  padding-top: 22px;
  padding-bottom: 14px;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-subscribtion {
  line-height: 24px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 24px;
  text-align: center;
}

.profile {
  padding: 30px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
  background-position: center;
  background-size: cover;
}

.title {
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  margin: 0 0 30px;
  text-transform: uppercase;
}

.title-img {
  max-width: 27px;
  margin: 0 10px;
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
  width: 190px;
  height: 32px;
  background: #c0c53f;
  display: flex;
  align-items: center;
  border-radius: 0px 30px 30px 0px;
}

.chart-apt {
  width: 188px;
  height: 30px;
  background: #23212d;
  border-radius: 0px 30px 30px 0px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 10px 0 30px;

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
  margin-right: 5px;
}

.chart-apt-percent {
  font-weight: 700;
  font-size: 17px;
  line-height: 27px;
  color: #c0c53f;
}

.chart-btns {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.chart-btn {
  max-width: 60px;
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

.btn-start {
  border-radius: 4px 0 0 4px;
}

.btn-last {
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

.btns-wrap {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.btn-ape-wrap {
  display: flex;
  align-items: center;
}

.btn-ape-img {
  max-width: 22px;
  margin-right: 10px;
}

.btn-ape-text {
  font-weight: 600;
  font-size: 15px;
  line-height: 24px;
  display: flex;
  align-items: center;
  letter-spacing: 0.025em;
  background: linear-gradient(90deg, #9df4ff 0%, #7981ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
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

  .btns-wrap {
    flex-direction: column;
  }

  .btn-ape-text {
    font-size: 14px;
  }
}
</style>
