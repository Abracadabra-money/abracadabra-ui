<template>
  <div class="stake-view">
    <img class="bg-top" src="@/assets/images/market/bg-top.png" alt="" />
    <img class="bg-bottom" src="@/assets/images/market/bg-bottom.png" alt="" />

    <div class="stake-wrap" v-if="stakeInfo">
      <div class="actions-block">
        <div class="actions-head">
          <h3>{{ activeTab }}</h3>
          <Tabs :name="activeTab" :items="tabItems" @select="changeTab" />
        </div>

        <AvailableNetworksBlock
          :selectedNetwork="selectedNetwork"
          :availableNetworks="availableNetworks"
          @changeNetwork="changeNetwork"
        />

        <div class="action-form">
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
              :disabled="true"
              :icon="toToken.icon"
              :name="toToken.name"
              :value="expectedAmount"
              :tokenPrice="formatUnits(toToken.price, toToken.decimals)"
            />
          </div>

          <StakeInfoBlock
            :mainToken="mainToken"
            :stakeToken="stakeToken"
            :selectedNetwork="selectedNetwork"
          />

          <div class="btn-wrap">
            <BaseButton
              primary
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
        <GlpSpecialInfoBlock />

        <ChartBlock
          :chainId="selectedNetwork"
          :chartConfig="chartConfig"
          :getChartOptions="getChartOptions"
        />

        <AdditionalInfoBlock :configs="additionalConfig" />
      </div>
    </div>

    <BaseLoader v-else />
  </div>
</template>

<script lang="ts">
//@ts-ignore
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
import { formatUnits, parseUnits } from "viem";
import { approveTokenViem } from "@/helpers/approval";
import actions from "@/helpers/stake/magicGlp/actions/";
import { mapGetters, mapActions, mapMutations } from "vuex";
//@ts-ignore
import notification from "@/helpers/notification/notification.js";
import { getStakeInfo } from "@/helpers/stake/magicGlp/getStakeInfo";
import { getChartOptions } from "@/helpers/stake/magicGlp/getChartOptions";

export default {
  data() {
    return {
      activeTab: "stake",
      tabItems: ["stake", "unstake"],
      selectedNetwork: null as any,
      availableNetworks: [42161, 43114],
      stakeInfoArr: null as any,
      inputAmount: BigInt(0) as bigint,
      inputValue: "" as string | bigint,
      updateInterval: null as any,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

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
      return this.toToken.approvedAmount >= this.inputAmount;
    },

    isInsufficientBalance() {
      return this.inputAmount > this.fromToken.balance;
    },

    isActionDisabled() {
      if (!this.inputAmount) return true;
      return this.isInsufficientBalance;
    },

    stakeInfo() {
      if (!this.stakeInfoArr) return null;

      return this.stakeInfoArr.find(
        (info: any) => +info.chainId === +this.selectedNetwork
      );
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

    precision() {
      return parseUnits("1", this.mainToken.decimals);
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

    chartConfig() {
      return {
        icon: this.mainToken.icon,
        title: "APR Chart",
        type: "magicGlpTvl",
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
      const { icon, amount, amountUsd } = this.stakeInfo.rewardToken;

      return [
        {
          title: "Total Supply",
          tooltip: "Total Supply",
          icon: this.mainToken.icon,
          decimals: this.mainToken.decimals,
          amount: this.mainToken.totalSupply,
          amountUsd: this.mainToken.totalSupplyUsd,
        },
        {
          title: "Total Rewards Earned",
          tooltip: "Total Rewards Earned",
          icon: icon,
          decimals: 18,
          amount: parseUnits(amount, 18),
          amountUsd: parseUnits(amountUsd.toString(), 18),
        },
      ];
    },

    actionButtonText() {
      if (!this.isUnsupportedChain) return "Switch Network";
      if (this.isInsufficientBalance) return "Insufficient balance";
      if (!this.isTokenApproved) return "Approve";
      if (!this.isStakeAction) return "Unstake";
      return "Stake";
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
      if (!this.isTokenApproved) this.approveTokenHandler();
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

    async createStakeInfo() {
      this.stakeInfoArr = await getStakeInfo();
    },
  },

  async created() {
    if (this.availableNetworks.includes(this.chainId))
      this.selectedNetwork = this.chainId;
    else this.selectedNetwork = this.availableNetworks[0];

    await this.createStakeInfo();

    this.updateInterval = setInterval(async () => {
      await this.createStakeInfo();
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
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
    LeverageInfo: defineAsyncComponent(
      () => import("@/components/stake_new/LeverageInfo.vue")
    ),
    GlpSpecialInfoBlock: defineAsyncComponent(
      () => import("@/components/stake_new/GlpSpecialInfoBlock.vue")
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
  @include font;
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

.actions-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
  font-size: 32px;
  font-weight: 600;
  line-height: 150%;

  h3::first-letter {
    text-transform: uppercase;
  }
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
</style>
