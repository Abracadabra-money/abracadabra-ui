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

        <div class="tranche-btns" v-if="isAction">
          <button
            :class="['tranche-btn', { active: token.name === activeToken }]"
            v-for="token in tokensInfo"
            @click="changeToken(token.name)"
            :key="token.name"
          >
            <img class="tranche-btn-icon" :src="token.icon" alt="" />
            <span class="tranche-btn-name"> {{ token.name }}</span>
          </button>
        </div>

        <div class="row">
          <AvailableNetworksBlock
            :selectedNetwork="selectedNetwork"
            :availableNetworks="availableNetworks"
            @changeNetwork="changeNetwork"
          />

          <div class="tranche-apr">APR {{ trancheApr }}</div>
        </div>

        <template v-if="isAction">
          <div class="action-form">
            <div class="input-wrap">
              <h4 class="title">Select amount</h4>
              <BaseTokenInput
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
              <BaseTokenInput
                :disabled="true"
                :icon="toToken.icon"
                :name="toToken.name"
                :value="expectedAmount"
                :tokenPrice="formatUnits(toToken.price, toToken.decimals)"
              />
            </div>

            <div class="btn-wrap">
              <BaseButton
                primary
                :disabled="isActionDisabled"
                @click="actionHandler"
                >{{ actionButtonText }}</BaseButton
              >
            </div>
          </div>

          <TrancheBalances :trancheInfo="trancheInfo" />
        </template>
      </div>

      <div class="stake-info">
        <LvlSpecialInfoBlock :activeToken="activeToken" v-if="isAction" />

        <template v-if="isChartView">
          <ChartBlock
            :chainId="selectedNetwork"
            :chartConfig="chartConfig"
            :getChartOptions="getChartOptions"
          />

          <TrancheStatistics :stakeInfo="stakeInfo" />
        </template>
      </div>
    </div>

    <div class="loader-wrap" v-else>
      <BaseLoader large text="Loading stake." />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
import { parseUnits, formatUnits } from "viem";
import { approveTokenViem } from "@/helpers/approval";
import actions from "@/helpers/stake/magicLvl/actions/";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { formatPercent, formatToFixed } from "@/helpers/filters";
// @ts-ignore
import notification from "@/helpers/notification/notification.js";
import { getStakeInfo } from "@/helpers/stake/magicLvl/getStakeInfo";
import { getChartOptions } from "@/helpers/stake/magicLvl/getChartOptions";

export default {
  data() {
    return {
      activeTab: "stake",
      tabItems: ["stake", "unstake"],
      activeToken: "senior",
      tokensInfo: [
        {
          name: "senior",
          icon: useImage("assets/images/stake/senior-icon.svg"),
        },
        {
          name: "mezzanine",
          icon: useImage("assets/images/stake/mezzanine-icon.svg"),
        },
        {
          name: "junior",
          icon: useImage("assets/images/stake/junior-icon.svg"),
        },
      ],
      selectedNetwork: null as any,
      availableNetworks: [56],
      stakeInfoArr: null as any,
      inputAmount: BigInt(0) as bigint,
      inputValue: "" as string | bigint,
      updateInterval: null as any,
      isMobile: false,
      chartToggle: false,
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

    isTokenApproved() {
      if (!this.account) return true;
      if (!this.isStakeAction) return true;
      if (!this.isUnsupportedChain) return true;
      return this.fromToken.approvedAmount >= this.inputAmount;
    },

    isActionDisabled() {
      if (!this.account) return false;
      if (!this.isUnsupportedChain) return false;
      if (!this.inputAmount) return true;
      return this.isInsufficientBalance;
    },

    precision(): bigint {
      return parseUnits("1", this.mainToken.decimals);
    },

    expectedAmount() {
      const { tokensRate } = this.stakeInfo[this.activeToken];

      const amount = this.isStakeAction
        ? (this.inputAmount * this.precision) / tokensRate
        : (this.inputAmount * tokensRate) / this.precision;

      return formatToFixed(formatUnits(amount, this.mainToken.decimals), 6);
    },

    stakeInfo() {
      if (!this.stakeInfoArr) return null;

      return this.stakeInfoArr.find(
        (info: any) => +info.chainId === +this.selectedNetwork
      );
    },

    stakeToken() {
      return this.stakeInfo[this.activeToken].stakeToken;
    },

    mainToken() {
      return this.stakeInfo[this.activeToken].mainToken;
    },

    fromToken() {
      return this.isStakeAction ? this.stakeToken : this.mainToken;
    },

    toToken() {
      return this.isStakeAction ? this.mainToken : this.stakeToken;
    },

    trancheApr() {
      switch (this.activeToken) {
        case "senior":
          return formatPercent(this.stakeInfo.tranchesStatistics.seniorApy);
        default:
          return formatPercent(0);
      }
    },

    actionButtonText() {
      if (!this.account && this.isUnsupportedChain) return "Connect wallet";
      if (!this.isUnsupportedChain) return "Switch Network";
      if (this.isInsufficientBalance) return "Insufficient balance";
      if (!this.isTokenApproved) return "Approve";
      if (!this.isStakeAction) return "Unstake";
      return "Stake";
    },

    trancheInfo() {
      const { junior, mezzanine, senior } = this.stakeInfo;
      return [senior, mezzanine, junior];
    },

    chartConfig() {
      return {
        icon: this.stakeInfo.senior.mainToken.icon,
        title: "APY Chart",
        type: "magicLvlApy",
        feePercent: this.stakeInfo[this.activeToken].feePercent,
        intervalButtons: [{ label: "3m", time: 3 }],
      };
    },
  },

  watch: {
    async account(value) {
      if (value) await this.createStakeInfo();
    },

    async chainId() {
      await this.createStakeInfo();
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({
      deleteNotification: "notifications/delete",
      updateNotification: "notifications/updateTitle",
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

    changeTab(action: string) {
      this.activeTab = this.activeToken === "senior" ? action : "unstake";
      this.inputValue = "";
    },

    changeNetwork(network: number) {
      this.selectedNetwork = network;
    },

    changeToken(token: string) {
      this.activeToken = token;
      this.activeTab = this.activeToken === "senior" ? "stake" : "unstake";
      this.inputValue = "";
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

    async withdrawHandler(notificationId: number) {
      this.updateNotification({
        title: "1/2 withdrawing Lps",
        id: notificationId,
      });

      const { levelMasterContract, stakeToken } =
        this.stakeInfo[this.activeToken];

      const withdrawAmount = this.inputAmount - stakeToken.walletBalance;
      const { error, result }: any = await actions.withdraw(
        levelMasterContract,
        withdrawAmount,
        this.account,
        stakeToken.pid
      );

      if (error) return { error };

      this.updateNotification({
        title: "2/2 staking to magicLVL",
        id: notificationId,
      });

      return { result };
    },

    async actionHandler() {
      if (this.isActionDisabled) return false;

      if (!this.account && this.isUnsupportedChain) {
        // @ts-ignore
        return this.$openWeb3modal();
      }
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

      const isWithdrawAction = this.stakeToken.walletBalance < this.inputAmount;

      if (isWithdrawAction && this.isStakeAction) {
        const { error } = await this.withdrawHandler(notificationId);
        if (error) {
          await this.deleteNotification(notificationId);
          return await this.createNotification(error);
        }
      }

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
  },

  async created() {
    if (this.availableNetworks.includes(this.chainId))
      this.selectedNetwork = this.chainId;
    else this.selectedNetwork = this.availableNetworks[0];

    if (window.innerWidth <= 600) this.isMobile = true;
    window.addEventListener("resize", this.getWindowSize, false);

    await this.createStakeInfo();

    this.updateInterval = setInterval(async () => {
      await this.createStakeInfo();
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
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
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    TrancheBalances: defineAsyncComponent(
      () => import("@/components/stake/magicLvl/TrancheBalances.vue")
    ),
    LvlSpecialInfoBlock: defineAsyncComponent(
      () => import("@/components/stake/magicLvl/LvlSpecialInfoBlock.vue")
    ),
    ChartBlock: defineAsyncComponent(
      () => import("@/components/stake/ChartBlock.vue")
    ),
    TrancheStatistics: defineAsyncComponent(
      () => import("@/components/stake/magicLvl/TrancheStatistics.vue")
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

.tranche-btns {
  width: 100%;
  padding: 6px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(16, 18, 23, 0.38);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tranche-btn {
  height: 36px;
  max-width: 167px;
  width: 100%;
  padding: 6px;
  border-radius: 8px;
  background: transparent;
  outline: transparent;
  border-color: transparent;
  color: #878b93;
  font-weight: 500;
  line-height: 150%;
  cursor: pointer;
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.active {
  color: #fff;
  background: rgba(111, 111, 111, 0.06);
  backdrop-filter: blur(4.5px);
}

.tranche-btn-icon {
  width: 24px;
  height: 24px;
}

.tranche-btn-name::first-letter {
  text-transform: uppercase;
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

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tranche-apr {
  text-shadow: 0px 0px 16px #ab5de8;
  font-weight: 600;
  line-height: 150%;
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

  .tranche-btns {
    flex-direction: column;
  }

  .tranche-btn {
    max-width: 100%;
  }

  .mobile-btn {
    display: flex;
  }
}
</style>
