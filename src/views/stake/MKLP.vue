<template>
  <div class="stake-view">
    <div class="stake-wrap" v-if="stakeInfo">
      <div class="actions-block">
        <div class="actions-head">
          <h3>{{ activeTab }}</h3>
          <Tabs :name="activeTab" :items="tabItems" @select="changeTab" />
          <button class="mobile-btn" @click="updateChartToggle">
            <ChartIcon :fill="chartToggle ? '#ffffff' : '#7088CC'" />
          </button>
        </div>

        <AvailableNetworksBlock
          :selectedNetwork="selectedNetwork"
          :availableNetworks="availableNetworks"
          @changeNetwork="changeNetwork"
        />

        <div class="action-form" v-if="isAction">
          <div class="input-wrap">
            <h4 class="title">Select amount</h4>

            <TokenInput
              :value="inputValue"
              :icon="fromToken.icon"
              :name="fromToken.name"
              :max="fromToken.balance"
              :tokenPrice="formatUnits(fromToken.price, fromToken.decimals)"
              @updateInputValue="updateMainValue"
            />
          </div>

          <div class="input-wrap">
            <h4 class="title">Receive</h4>

            <TokenInput
              :value="expectedAmount"
              :icon="toToken.icon"
              :name="toToken.name"
              :disabled="true"
              :tokenPrice="formatUnits(toToken.price, toToken.decimals)"
            />
          </div>

          <StakeInfoBlock
            type="klp"
            :mainToken="mainToken"
            :stakeToken="stakeToken"
            :selectedNetwork="selectedNetwork"
          />

          <div class="btn-wrap">
            <BaseButton
              v-tooltip="tooltipText"
              primary
              :disabled="isActionDisabled"
              @click="actionHandler"
              >{{ actionButtonText }}</BaseButton
            >
          </div>
        </div>
      </div>

      <div class="stake-info">
        <KlpSpecialInfoBlock v-if="isAction" />

        <template v-if="isChartView">
          <ChartBlock
            :chainId="selectedNetwork"
            :chartConfig="chartConfig"
            :getChartOptions="getChartOptions"
          />

          <AdditionalInfoBlock :configs="additionalConfig" />
        </template>
      </div>
    </div>

    <BaseLoader v-else />
  </div>
</template>

<script lang="ts">
import moment from "moment";
// @ts-ignore
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
import { parseUnits, formatUnits } from "viem";
import { approveTokenViem } from "@/helpers/approval";
import actions from "@/helpers/stake/magicKLP/actions/";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
// @ts-ignore
import notification from "@/helpers/notification/notification.js";
import { getStakeInfo } from "@/helpers/stake/magicKLP/getStakeInfo";
import { getChartOptions } from "@/helpers/stake/magicKLP/getChartOptions";

export default {
  data() {
    return {
      activeTab: "stake",
      tabItems: ["stake", "unstake"],
      selectedNetwork: null as any,
      availableNetworks: [2222],
      stakeInfoArr: null as any,
      inputAmount: BigInt(0) as bigint,
      inputValue: "" as string | bigint,
      updateInterval: null as any,
      timeInterval: null as any,
      isMobile: false,
      chartToggle: false,
      timerLocked: "00:00:00",
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    isChartView() {
      return this.isMobile ? this.chartToggle : true;
    },

    isAction() {
      return this.isMobile ? !this.chartToggle : true;
    },

    isStakeAction() {
      return this.activeTab === "stake";
    },

    isUnsupportedChain() {
      return this.chainId === this.selectedNetwork;
    },

    isInsufficientBalance() {
      return this.inputAmount > this.fromToken.balance;
    },

    isActionDisabled() {
      if (!this.isUnsupportedChain) return false;
      if (!this.inputAmount) return true;
      if (this.isLocked) return true;
      return this.isInsufficientBalance;
    },

    isTokenApproved() {
      if (!this.account) return true;
      if (!this.isStakeAction) return true;
      if (!this.isUnsupportedChain) return true;
      return this.fromToken.approvedAmount >= this.inputAmount;
    },

    expectedAmount() {
      const amount = this.isStakeAction
        ? (this.inputAmount * this.precision) / this.mainToken.rate
        : (this.inputAmount * this.mainToken.rate) / this.precision;

      return filters.formatToFixed(
        formatUnits(amount, this.mainToken.decimals),
        6
      );
    },

    precision(): bigint {
      return parseUnits("1", this.mainToken.decimals);
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

    actionButtonText() {
      if (this.timerLocked !== "00:00:00" && this.isStakeAction)
        return this.timerLocked;
      if (!this.isUnsupportedChain) return "Switch Network";
      if (this.isInsufficientBalance) return "Insufficient balance";
      if (!this.isTokenApproved) return "Approve";
      if (!this.isStakeAction) return "Unstake";
      return "Stake";
    },

    chartConfig() {
      return {
        icon: this.mainToken.icon,
        title: "APY Chart",
        type: "magicKlpApy",
        feePercent: this.stakeInfo.feePercent,
        intervalButtons: [
          { label: "1m", time: 1 },
          { label: "3m", time: 3 },
          { label: "6m", time: 6 },
          { label: "1y", time: 12 },
        ],
      };
    },

    additionalConfig() {
      return [
        {
          title: "Total Supply",
          tooltip: "Total Supply",
          icon: this.mainToken.icon,
          decimals: this.mainToken.decimals,
          amount: this.mainToken.totalSupply,
          amountUsd: this.mainToken.totalSupplyUsd,
        },
      ];
    },

    stakeInfo() {
      if (!this.stakeInfoArr) return null;

      return this.stakeInfoArr.find(
        (info: any) => +info.chainId === +this.selectedNetwork
      );
    },

    finalTime() {
      const lockTimestamp = +this.stakeToken?.lastAdded
        ? moment.unix(this.stakeToken.lastAdded).add(15, "minutes")
        : moment.unix(0);
      return Number(lockTimestamp.unix().toString()) || 0;
    },

    isLocked() {
      const start = moment(new Date());
      const end = moment.unix(this.finalTime);
      return end.isAfter(start);
    },

    tooltipText() {
      return this.isLocked
        ? "Kintetix Finance applies a 15 minutes lock on all freshly minted KLP. Please wait"
        : "";
    },
  },

  watch: {
    async account() {
      await this.createStakeInfo();
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatUnits,
    getChartOptions,

    updateMainValue(amount: bigint) {
      if (!amount) {
        this.inputValue = "";
        this.inputAmount = BigInt(0);
      } else {
        this.inputAmount = amount;
        this.inputValue = formatUnits(amount, this.mainToken.decimals);
      }
    },

    updateChartToggle() {
      this.chartToggle = !this.chartToggle;
    },

    changeTab(action: string) {
      this.activeTab = action;
      this.inputValue = "";
    },

    changeNetwork(network: number) {
      this.selectedNetwork = network;
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
      if (!this.isUnsupportedChain) {
        switchNetwork(this.selectedNetwork);
        return false;
      }
      if (!this.isTokenApproved) {
        await this.approveTokenHandler();
        return false;
      }

      const notificationId = await this.createNotification(
        notification.pending
      );

      const methodName = this.isStakeAction ? "deposit" : "redeem";

      const { error }: any = await actions[methodName](
        this.mainToken.contract,
        this.inputAmount,
        this.account
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

    getWindowSize() {
      if (window.innerWidth <= 600) this.isMobile = true;
      else this.isMobile = false;
    },

    async createStakeInfo() {
      this.stakeInfoArr = await getStakeInfo();
    },

    checkDuration() {
      this.timeInterval = setInterval(() => {
        if (!this.finalTime) {
          this.timerLocked = "00:00:00";
          return false;
        }

        const start = moment(new Date());
        const end = moment.unix(this.finalTime);
        const duration = end.diff(start);

        const isLocked = end.isAfter(start);

        this.timerLocked = isLocked
          ? moment.utc(duration).format("HH:mm:ss")
          : "00:00:00";
      }, 1000);
    },
  },

  async created() {
    if (this.availableNetworks.includes(this.chainId))
      this.selectedNetwork = this.chainId;
    else this.selectedNetwork = this.availableNetworks[0];

    if (window.innerWidth <= 600) this.isMobile = true;
    window.addEventListener("resize", this.getWindowSize, false);

    await this.createStakeInfo();

    if (this.isLocked) this.checkDuration();

    this.updateInterval = setInterval(async () => {
      await this.createStakeInfo();
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
    clearInterval(this.timeInterval);
    window.removeEventListener("resize", this.getWindowSize);
  },

  components: {
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    ChartIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/ChartIcon.vue")
    ),
    AvailableNetworksBlock: defineAsyncComponent(
      () => import("@/components/stake_new/AvailableNetworksBlock.vue")
    ),
    TokenInput: defineAsyncComponent(
      () => import("@/components/market/TokenInput.vue")
    ),
    StakeInfoBlock: defineAsyncComponent(
      () => import("@/components/stake_new/StakeInfoBlock.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    KlpSpecialInfoBlock: defineAsyncComponent(
      () => import("@/components/stake_new/KlpSpecialInfoBlock.vue")
    ),
    ChartBlock: defineAsyncComponent(
      () => import("@/components/stake/ChartBlock.vue")
    ),
    AdditionalInfoBlock: defineAsyncComponent(
      () => import("@/components/stake_new/AdditionalInfoBlock.vue")
    ),
    BaseLoader: defineAsyncComponent(
      () => import("@/components/base/BaseLoader.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.stake-view {
  min-height: 100vh;
  background: linear-gradient(
    291deg,
    #102649 -26.37%,
    #0c0f1c 40.92%,
    #131728 62.83%,
    #212555 123.87%
  );
}

.bg-top {
  position: absolute;
  top: 145px;
  left: 0;
  z-index: 0;
}

.bg-bottom {
  position: absolute;
  top: 80vh;
  right: 70px;
  z-index: 0;
}

.stake-wrap {
  position: relative;
  max-width: 1310px;
  width: 100%;
  padding: 124px 15px 90px;
  display: grid;
  grid-template-columns: 520px 1fr;
  grid-gap: 24px;
  margin: 0 auto;
}

.actions-block {
  gap: 20px;
  display: flex;
  flex-direction: column;
}

.actions-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 32px;
  font-weight: 600;
  line-height: 150%;
  position: relative;

  h3::first-letter {
    text-transform: uppercase;
  }
}

.mobile-btn {
  position: absolute;
  right: 0;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--Primary-Gradient, #2d4a96);
  background: rgba(25, 31, 47, 0.38);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  width: 44px;
  height: 44px;
  display: none;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.action-form {
  @include block-wrap;
  gap: 16px;
  display: flex;
  flex-direction: column;
}

.input-wrap {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: 0.45px;
}

.btn-wrap {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.stake-info {
  gap: 20px;
  display: flex;
  flex-direction: column;
}

@media screen and (max-width: 1200px) {
  .stake-wrap {
    grid-template-columns: 400px 1fr;
  }
}

@media screen and (max-width: 1024px) {
  .stake-wrap {
    grid-template-columns: 100%;
    grid-template-rows: auto;
  }
}

@media screen and (max-width: 600px) {
  .actions-head {
    font-size: 24px;
    gap: 16px;
    flex-direction: column;
    align-items: flex-start;
  }

  .mobile-btn {
    display: flex;
  }
}
</style>
