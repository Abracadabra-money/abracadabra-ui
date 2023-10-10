<template>
  <div class="stake-view">
    <div class="deposit-block">
      <h4>Choose Chain</h4>

      <div class="underline">
        <NetworksList :active-list="[2222]" />
      </div>

      <div class="loader-wrap" v-if="!isInfoLoading">
        <BaseLoader />
      </div>

      <div v-else>
        <div class="input-assets">
          <InputLabel
            :amount="formatTokenBalance(formatAmount(fromToken.balance))"
            :title="action"
          />

          <BaseTokenInput
            :value="inputValue"
            :icon="fromToken.icon"
            :name="fromToken.name"
            :max="formatAmount(fromToken.balance)"
            :error="errorMainValue"
            @updateValue="updateMainValue"
          />
        </div>

        <button class="swap-button">
          <img
            src="@/assets/images/swap.svg"
            @click="toggleAction"
            alt="Swap action"
          />
        </button>

        <div class="input-assets">
          <h4 class="input-labal">Receive</h4>
          <BaseTokenInput
            :icon="toToken.icon"
            :name="toToken.name"
            :value="expectedAmount"
            :disabled="true"
          />
        </div>

        <div class="btns-wrap">
          <BaseButton
            primary
            :disabled="isTokenApproved"
            @click="approveTokenHandler"
            >Approve
          </BaseButton>
          <BaseButton
            v-tooltip="tooltipText"
            :disabled="isActionDisabled"
            @click="actionHandler"
          >
            {{ actionButtonText }}
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="stake-stand" :style="standBackground">
      <h1 class="title">magicKLP</h1>

      <div class="loader-wrap" v-if="!isInfoLoading">
        <BaseLoader />
      </div>

      <div v-else>
        <div class="stand-info-wrap" v-if="isUnsupportedChain">
          <ChartBlock
            :chartConfig="chartConfig"
            :getChartOptions="getChartOptions"
          />

          <BalancesBlock :mainToken="mainToken" :stakeToken="stakeToken" />

          <AdditionalInfoBlock
            v-if="account"
            :mainToken="mainToken"
            :rewardToken="stakeInfo?.rewardToken"
          />
        </div>

        <div class="empty-wrap" v-else>
          <EmptyBlock :warningType="'mklp'" />
        </div>

        <div class="description">
          <p>
            Enjoy the benefits of compounding without having to worry about the
            tedious work! Simply deposit your KLP into MagicKLP and let it do
            its magic!
          </p>
          <p>Note: A 1% protocol fee is taken on the yields.</p>
        </div>

        <div class="links-wrap" v-if="isUnsupportedChain">
          <GetTokenLink
            :data="{
              href: 'https://perps.kinetix.finance/#/liquidity',
              label: 'Buy KLP',
            }"
          />
          <GetTokenLink
            :data="{
              href: 'https://perps.kinetix.finance/#/liquidity#redeem',
              label: 'Sell KLP',
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
import { parseUnits, formatUnits } from "viem";
import { ANALYTICS_URK } from "@/constants/global";
import { approveTokenViem } from "@/helpers/approval"; //todo
import actions from "@/helpers/stake/magicKLP/actions/";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { magicKlpConfig } from "@/utils/stake/magicKlpConfig";
import notification from "@/helpers/notification/notification.js";
import { getChartOptions } from "@/helpers/stake/magicKLP/getChartOptions";
import { getStakeInfo } from "@/helpers/stake/magicKLP/getStakeInfo.ts";

export default {
  data() {
    return {
      apy: "",
      stakeInfo: null,
      action: "Stake",
      inputValue: "",
      updateInterval: null,
      timerCount: "Stake",
      timeInterval: null,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    actionButtonText() {
      if (!this.stakeToken && this.isStakeAction) return "Stake";
      if (!this.stakeToken && !this.isStakeAction) return "Unstake";

      if (this.isStakeAction && !!this.finalTime) return this.timerCount;
      if (this.isStakeAction && !this.finalTime) return "Stake";
      return "Unstake";
    },

    finalTime() {
      const lockTimestamp = +this.stakeToken?.lastAdded
        ? moment.unix(this.stakeToken.lastAdded).add(15, "minutes")
        : moment.unix(0);

      return this.timerCount ? lockTimestamp.unix().toString() : 0;
    },

    tooltipText() {
      return this.timerCount
        ? "Kintetix Finance applies a 15 minutes lock on all freshly minted KLP. Please wait"
        : "";
    },

    isInfoLoading() {
      return !!this.stakeInfo;
    },

    isStakeAction() {
      return this.action === "Stake";
    },

    isTokenApproved() {
      if (!this.isStakeAction) return true;
      if (this.errorMainValue) return true;
      if (!this.account) return true;
      if (!this.isUnsupportedChain) return true;
      return this.toToken.approvedAmount >= this.parsedInputValue;
    },

    isActionDisabled() {
      if (!this.isTokenApproved) return true;
      if (this.isStakeAction)
        return !!(!this.inputValue || this.errorMainValue || +this.finalTime);
      return !!(!this.inputValue || this.errorMainValue);
    },

    isUnsupportedChain() {
      return !!magicKlpConfig[this.chainId];
    },

    stakeToken() {
      return this.stakeInfo?.stakeToken;
    },

    mainToken() {
      return this.stakeInfo?.mainToken;
    },

    fromToken() {
      return this.isStakeAction ? this.stakeToken : this.mainToken;
    },

    toToken() {
      return this.isStakeAction ? this.mainToken : this.stakeToken;
    },

    errorMainValue() {
      if (this.parsedInputValue > this.fromToken.balance) {
        return `The value cannot be greater than ${this.formatAmount(
          this.fromToken.balance
        )}`;
      }

      return "";
    },

    precision() {
      return parseUnits("1", this.mainToken.decimals);
    },

    expectedAmount() {
      const amount = this.isStakeAction
        ? (this.parsedInputValue * this.precision) / this.mainToken.rate
        : (this.parsedInputValue * this.mainToken.rate) / this.precision;

      return filters.formatToFixed(this.formatAmount(amount), 6);
    },

    parsedInputValue() {
      return parseUnits(this.inputValue || "0", 18);
    },

    actionInfo() {
      const options = [this.parsedInputValue, this.account];

      return this.isStakeAction
        ? { methodName: "deposit", options }
        : { methodName: "redeem", options };
    },

    chartConfig() {
      return {
        title: "APY Chart",
        type: "magicKlpApy",
        apy: this.apy,
        feePercent: this.stakeInfo.feePercent,
        intervalButtons: [{ label: "1m", time: 1 }],
      };
    },

    standBackground() {
      return `background-image: url(${useImage(
        "assets/images/stake/mKlpStand.png"
      )})`;
    },
  },

  watch: {
    async account(value) {
      if (value) await this.createStakeInfo();
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),
    getChartOptions,

    formatAmount(value) {
      return formatUnits(value, this.mainToken.decimals);
    },

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },

    updateMainValue(amount) {
      this.inputValue = amount;
    },

    toggleAction() {
      this.inputValue = "";
      this.action = this.action === "Stake" ? "Unstake" : "Stake";
    },

    async createStakeInfo() {
      this.stakeInfo = await getStakeInfo(this.chainId);
    },

    async approveTokenHandler() {
      if (!this.isUnsupportedChain) return false;
      if (this.isTokenApproved) return false;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveTokenViem(
        this.stakeToken.contract,
        this.mainToken.contract.address
      );

      if (approve) await this.createStakeInfo();
      await this.deleteNotification(notificationId);
      if (!approve) await this.createNotification(notification.approveError);
      return false;
    },

    async actionHandler() {
      if (this.isActionDisabled) return false;
      if (!this.actionInfo.methodName) return false;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error } = await actions[this.actionInfo.methodName](
        this.mainToken.contract,
        ...this.actionInfo.options
      );

      if (error) {
        await this.deleteNotification(notificationId);
        await this.createNotification(error);
      } else {
        await this.createStakeInfo();
        this.inputValue = "";
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      }
    },

    isLocked() {
      const start = moment(new Date());
      const end = moment.unix(this.finalTime);
      return end.isAfter(start);
    },

    checkDuration() {
      this.timeInterval = setInterval(() => {
        if (!this.finalTime) {
          this.timerCount = 0;
          return false;
        }

        const start = moment(new Date());
        const end = moment.unix(this.finalTime);
        const duration = end.diff(start);

        const isLocked = end.isAfter(start);

        this.timerCount = isLocked
          ? `Unlocks in: ${moment.utc(duration).format("HH:mm:ss")}`
          : 0;
      }, 1000);
    },
  },

  async created() {
    await this.createStakeInfo();
    if (!this.isUnsupportedChain) return false;
    const isLocked = this.isLocked();

    if (isLocked) this.checkDuration();
    else this.timerCount = 0;

    this.updateInterval = setInterval(async () => {
      await this.createStakeInfo();
    }, 60000);

    const { data } = await axios.get(`${ANALYTICS_URK}/kinetix/info`);
    this.apy = filters.formatToFixed(data.apr, 2);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
    clearInterval(this.timeInterval);
  },

  components: {
    NetworksList: defineAsyncComponent(() =>
      import("@/components/ui/NetworksList.vue")
    ),
    BaseLoader: defineAsyncComponent(() =>
      import("@/components/base/BaseLoader.vue")
    ),
    InputLabel: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputLabel.vue")
    ),
    BaseTokenInput: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenInput.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    ChartBlock: defineAsyncComponent(() =>
      import("@/components/stake/ChartBlock.vue")
    ),
    BalancesBlock: defineAsyncComponent(() =>
      import("@/components/stake/BalancesBlock.vue")
    ),
    AdditionalInfoBlock: defineAsyncComponent(() =>
      import("@/components/stake/AdditionalInfoBlock.vue")
    ),
    EmptyBlock: defineAsyncComponent(() =>
      import("@/components/stake/EmptyBlock.vue")
    ),
    GetTokenLink: defineAsyncComponent(() =>
      import("@/components/ui/links/GetTokenLink.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.stake-view {
  display: grid;
  grid-template-columns: 550px 1fr;
  width: 1320px;
  max-width: calc(100% - 20px);
  grid-gap: 15px;
  margin: 0 auto;
  padding: 100px 0;
}

.deposit-block {
  padding: 30px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 10px;
}

.loader-wrap-mini {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35%;
}

.input-assets {
  padding: 22px 0 14px;
}

.swap-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
}

.input-labal {
  margin-bottom: 6px;
}

.btns-wrap {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin: 30px 0;
}

.leverage-link {
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-size: 15px;
}

.stake-stand {
  padding: 30px 15px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
  background-position: center;
  background-size: cover;
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 30px;
}

.stand-info-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.empty-wrap {
  margin-bottom: 20px;
}

.description {
  line-height: 24px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 24px;
  text-align: center;
}

.links-wrap {
  display: flex;
  justify-content: center;
  gap: 24px;
}

@media (max-width: 1024px) {
  .stake-view {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .deposit-block,
  .stake-stand {
    padding: 30px 10px;
  }
}
</style>
