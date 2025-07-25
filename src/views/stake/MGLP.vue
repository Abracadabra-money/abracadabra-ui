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
          v-if="availableNetworks.length > 1"
          :selectedNetwork="selectedNetwork"
          :availableNetworks="availableNetworks"
          @changeNetwork="changeNetwork"
        />

        <div class="action-form" v-if="isAction">
          <div class="input-wrap">
            <h4 class="title">Select amount</h4>

            <BaseTokenInput
              :value="inputValue"
              :icon="fromToken.icon"
              :name="fromToken.name"
              :max="fromToken.balance"
              :tokenPrice="''"
              @updateInputValue="updateMainValue"
            />
          </div>

          <div class="input-wrap">
            <h4 class="title">Receive</h4>
            <BaseTokenInput
              :disabled="true"
              :icon="toToken.icon"
              :name="toToken.name"
              :value="expectedAmount"
              :tokenPrice="''"
            />
          </div>

          <StakeInfoBlock
            :mainToken="mainToken"
            :stakeToken="stakeToken"
            :selectedNetwork="selectedNetwork"
          />

          <div class="btn-wrap">
            <BaseButton
              error
              :disabled="isActionDisabled"
              @click="actionHandler"
              >{{ actionButtonText }}</BaseButton
            >

            <LeverageInfo
              :selectedNetwork="selectedNetwork"
              :leverageInfo="stakeInfo.leverageInfo"
            />
          </div>
        </div>
      </div>

      <div class="stake-info">
        <GlpSpecialInfoBlock v-if="isAction" />

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

    <div class="loader-wrap" v-else>
      <BaseLoader large text="Loading stake" />
    </div>
  </div>
</template>

<script lang="ts">
import type {
  ChartConfig,
  StakeTokenInfo,
  AdditionalConfig,
} from "@/helpers/stake/types";
import { defineAsyncComponent } from "vue";
import { formatUnits, parseUnits } from "viem";
import { formatToFixed } from "@/helpers/filters";
import { approveToken } from "@/helpers/approval";
import actions from "@/helpers/stake/magicGlp/actions/";
import { dataRefresher } from "@/helpers/dataRefresher";
import type { RefresherInfo } from "@/helpers/dataRefresher";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import notification from "@/helpers/notification/notification";
import { getStakeInfo } from "@/helpers/stake/magicGlp/getStakeInfo";
import type { MagicGlpStakeInfo } from "@/helpers/stake/magicGlp/types";
import { getChartOptions } from "@/helpers/stake/magicGlp/getChartOptions";
import { openConnectPopup } from "@/helpers/connect/utils";

export default {
  data() {
    return {
      activeTab: "stake",
      tabItems: ["stake", "unstake"],
      selectedNetwork: 42161,
      availableNetworks: [42161],
      stakeInfoArr: null as null | MagicGlpStakeInfo[],
      inputAmount: BigInt(0),
      inputValue: "" as string | bigint,
      isMobile: false,
      chartToggle: false,
      refresherInfo: {
        refresher: null as unknown as dataRefresher<MagicGlpStakeInfo[]>,
        remainingTime: 0,
        isLoading: false,
        intervalTime: 60,
      } as RefresherInfo<MagicGlpStakeInfo[]>,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      localStakeData: "getMagicGlpStakeData",
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

    isTokenApproved() {
      if (!this.account) return true;
      if (!this.isStakeAction) return true;
      if (!this.isUnsupportedChain) return true;
      return (
        (this.fromToken as StakeTokenInfo)?.approvedAmount >= this.inputAmount
      );
    },

    isInsufficientBalance() {
      return this.inputAmount > this.fromToken.balance;
    },

    isActionDisabled() {
      return true;
      // if (!this.account) return false;
      // if (!this.isUnsupportedChain) return false;
      // if (!this.inputAmount) return true;
      // return this.isInsufficientBalance;
    },

    stakeInfo() {
      if (!this.stakeInfoArr) return null;

      const stakeInfo = this.stakeInfoArr.find(
        (info: MagicGlpStakeInfo) => +info.chainId === +this.selectedNetwork
      );

      if (!stakeInfo) return null;
      return stakeInfo;
    },

    stakeToken() {
      return this.stakeInfo!.stakeToken;
    },

    mainToken() {
      return this.stakeInfo!.mainToken;
    },

    fromToken() {
      return this.isStakeAction ? this.stakeToken : this.mainToken;
    },

    toToken() {
      return this.isStakeAction ? this.mainToken : this.stakeToken;
    },

    precision() {
      return parseUnits("1", this.mainToken.decimals);
    },

    expectedAmount() {
      if (!this.inputAmount) return "";

      const amount = this.isStakeAction
        ? (this.inputAmount * this.precision) / this.mainToken.rate
        : (this.inputAmount * this.mainToken.rate) / this.precision;

      return formatToFixed(formatUnits(amount, this.mainToken.decimals), 6);
    },

    chartConfig(): ChartConfig {
      return {
        icon: this.mainToken.icon,
        title: "APR Chart",
        type: "magicGlpTvl",
        feePercent: this.stakeInfo!.feePercent,
        intervalButtons: [
          { label: "1m", time: 1 },
          { label: "3m", time: 3 },
          { label: "6m", time: 6 },
          { label: "1y", time: 12 },
        ],
      };
    },

    additionalConfig(): AdditionalConfig[] {
      const { icon, amount, amountUsd } = this.stakeInfo!.rewardToken;

      return [
        {
          title: "Total Supply",
          tooltip: "Total Amount of Staked Assets.",
          icon: this.mainToken.icon,
          decimals: this.mainToken.decimals,
          amount: this.mainToken.totalSupply,
          amountUsd: this.mainToken.totalSupplyUsd,
        },
        {
          title: "Total Rewards Earned",
          tooltip:
            "Total Amount of Rewards Autocompounded back into the vault.",
          icon: icon,
          decimals: 18,
          amount: amount,
          amountUsd: amountUsd,
        },
      ];
    },

    actionButtonText() {
      return "Temporary Depracated";
      // if (!this.account && this.isUnsupportedChain) return "Connect wallet";
      // if (!this.isUnsupportedChain) return "Switch Network";
      // if (this.isInsufficientBalance) return "Insufficient balance";
      // if (!this.isTokenApproved) return "Approve";
      // // if (!this.isStakeAction) return "Unstake";
      // return "Unstake";
      // return "Stake";
    },
  },

  watch: {
    async account() {
      await this.createOrUpdateInfo();
    },

    async chainId() {
      await this.createOrUpdateInfo();
    },

    stakeInfoArr: {
      handler() {
        if (this.stakeInfoArr) this.setMagicGlpStakeData(this.stakeInfoArr);
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({
      deleteNotification: "notifications/delete",
      setMagicGlpStakeData: "setMagicGlpStakeData",
    }),

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

    async createOrUpdateInfo() {
      const refresher = this.refresherInfo?.refresher;
      try {
        if (!refresher) {
          this.createDataRefresher();
          await this.refresherInfo.refresher.start();
        } else {
          await refresher.manualUpdate();
        }
      } catch (error) {
        console.error("Error creating or updating MagicGLP stake info:", error);
      }
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

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveToken(
        this.stakeToken.contract,
        this.mainToken.contract.address,
        this.inputAmount
      );

      if (approve) await this.createOrUpdateInfo();
      await this.deleteNotification(notificationId);
      if (!approve) await this.createNotification(notification.approveError);
      return false;
    },

    async actionHandler() {
      return false;
      // if (this.isActionDisabled) return false;

      // if (!this.account && this.isUnsupportedChain) return openConnectPopup();

      // if (!this.isUnsupportedChain) {
      //   switchNetwork(this.selectedNetwork);
      //   return false;
      // }
      // if (!this.isTokenApproved) {
      //   await this.approveTokenHandler();
      //   return false;
      // }

      // const notificationId = await this.createNotification(
      //   notification.pending
      // );

      // const methodName = this.isStakeAction ? "deposit" : "redeem";

      // const { error } = (await actions[methodName](
      //   this.mainToken.contract,
      //   this.inputAmount,
      //   this.account
      // )) as { error?: string };

      // if (error) {
      //   await this.deleteNotification(notificationId);
      //   await this.createNotification(error);
      // } else {
      //   await this.createOrUpdateInfo();
      //   this.inputValue = "";
      //   await this.deleteNotification(notificationId);
      //   await this.createNotification(notification.success);
      // }
    },

    checkLocalData() {
      if (this.localStakeData.isCreated && this.account) {
        this.stakeInfoArr = this.localStakeData.data;
      }
    },

    async createStakeInfo() {
      return await getStakeInfo(this.account);
    },

    createDataRefresher() {
      this.refresherInfo.refresher = new dataRefresher(
        this.createStakeInfo,
        this.refresherInfo.intervalTime,
        (time) => (this.refresherInfo.remainingTime = time),
        (loading) => (this.refresherInfo.isLoading = loading),
        (updatedData: null | MagicGlpStakeInfo[]) =>
          (this.stakeInfoArr = updatedData)
      );
    },

    getWindowSize() {
      if (window.innerWidth <= 600) this.isMobile = true;
      else this.isMobile = false;
    },
  },

  async created() {
    if (this.availableNetworks.includes(this.chainId))
      this.selectedNetwork = this.chainId;
    else this.selectedNetwork = this.availableNetworks[0];

    if (window.innerWidth <= 600) this.isMobile = true;
    window.addEventListener("resize", this.getWindowSize, false);

    this.checkLocalData();
    await this.createOrUpdateInfo();
  },

  beforeUnmount() {
    this.refresherInfo.refresher.stop();
    window.removeEventListener("resize", this.getWindowSize);
  },

  components: {
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    ChartIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/ChartIcon.vue")
    ),
    AvailableNetworksBlock: defineAsyncComponent(
      () => import("@/components/stake/AvailableNetworksBlock.vue")
    ),
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    StakeInfoBlock: defineAsyncComponent(
      () => import("@/components/stake/StakeInfoBlock.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    LeverageInfo: defineAsyncComponent(
      () => import("@/components/stake/LeverageInfo.vue")
    ),
    GlpSpecialInfoBlock: defineAsyncComponent(
      () => import("@/components/stake/magicGlp/GlpSpecialInfoBlock.vue")
    ),
    ChartBlock: defineAsyncComponent(
      () => import("@/components/stake/ChartBlock.vue")
    ),
    AdditionalInfoBlock: defineAsyncComponent(
      () => import("@/components/stake/AdditionalInfoBlock.vue")
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

.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
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
