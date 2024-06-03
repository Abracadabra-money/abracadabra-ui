<template>
  <div class="market-view">
    <template v-if="cauldron">
      <MarketHead :cauldron="cauldron" v-if="cauldron" />

      <div class="top-row">
        <template v-if="!hideActions">
          <Tabs :name="activeTab" :items="tabItems" @select="changeTab" />
        </template>

        <template v-if="!hidePositions">
          <PositionHealth v-if="isOpenPosition" :cauldron="cauldron" />
        </template>
      </div>

      <div class="market-info">
        <div class="form-wrap" v-show="!hideActions">
          <BorrowForm
            v-if="isBorrowTab"
            :cauldron="cauldron"
            :actionConfig="actionConfig"
            @updateMarket="createCauldronInfo"
            @updateToggle="onUpdateToggle"
            @updateAmounts="onUpdateAmounts"
            @clearData="resetAmounts"
          />

          <RepayForm
            v-if="isRepayTab"
            :cauldron="cauldron"
            :actionConfig="actionConfig"
            @updateToggle="onUpdateToggle"
            @updateAmounts="onUpdateAmounts"
            @updateMarket="createCauldronInfo"
            @clearData="resetAmounts"
          />
        </div>

        <template v-if="!hidePositions">
          <PositionInfo
            :cauldron="cauldron"
            :actionType="activeTab"
            :actionConfig="actionConfig"
          />
        </template>

        <template v-if="!hideCauldronInfo">
          <CauldronInfo :cauldron="cauldron" />
        </template>
      </div>
    </template>

    <div class="loader-wrap" v-else>
      <BaseLoader large text="Loading market" />
    </div>
  </div>

  <MobileNavigation
    v-if="cauldron"
    :cauldron="cauldron"
    :currentMobileTab="currentMobileTab"
    @chamgeMobileTab="(value) => (currentMobileTab = value)"
  />
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { PERCENT_PRESITION } from "@/helpers/cauldron/utils";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { getCauldronInfo } from "@/helpers/cauldron/getCauldronInfo";

type ToggleKeys =
  | "withdrawUnwrapToken"
  | "useUnwrapToken"
  | "useNativeToken"
  | "useDeleverage"
  | "useLeverage";

export default {
  data() {
    return {
      mobileMode: false,
      activeTab: "borrow",
      currentMobileTab: 0,
      tabItems: ["borrow", "repay"],
      cauldron: null as null | CauldronInfo,
      updateInterval: null as null | NodeJS.Timeout,
      actionConfig: {
        useLeverage: false,
        useDeleverage: false,
        useNativeToken: false,
        useUnwrapToken: false,
        withdrawUnwrapToken: false,
        amounts: {
          depositAmounts: {
            inputAmount: BigNumber.from(0),
            collateralTokenAmount: BigNumber.from(0),
            unwrapTokenAmount: BigNumber.from(0),
          },
          borrowAmount: BigNumber.from(0),
          leverageAmounts: {
            amountFrom: BigNumber.from(0),
            amountToMin: BigNumber.from(0),
          },
          deleverageAmounts: {
            amountFrom: BigNumber.from(0),
            amountToMin: BigNumber.from(0),
          },
          repayAmount: BigNumber.from(0),
          withdrawAmount: BigNumber.from(0),
          slippage: utils.parseUnits("1", PERCENT_PRESITION),
        },
      },
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      signer: "getSigner",
      activeChainId: "getChainId",
    }),

    hideActions() {
      return this.mobileMode && this.currentMobileTab !== 0;
    },

    hidePositions() {
      return this.mobileMode && this.currentMobileTab !== 1;
    },

    hideCauldronInfo() {
      return this.mobileMode && this.currentMobileTab !== 2;
    },

    routeChainId() {
      return Number(this.$route.params.chainId);
    },

    routeCauldronId() {
      return Number(this.$route.params.cauldronId);
    },

    isOpenPosition() {
      if (!this.cauldron) return false;

      return (
        !!this.cauldron.userPosition.alternativeData.collateralInfo
          .userCollateralShare ||
        !!this.cauldron.userPosition.alternativeData.borrowInfo.userBorrowPart
      );
    },

    isBorrowTab() {
      return this.activeTab === "borrow";
    },

    isRepayTab() {
      return this.activeTab === "repay";
    },

    isHiddenWrap() {
      return !!this.cauldron?.config?.wrapInfo?.isHiddenWrap;
    },
  },

  watch: {
    async account() {
      await this.createCauldronInfo();
    },

    async activeChainId() {
      await this.createCauldronInfo();
    },
  },

  methods: {
    resetAmounts() {
      this.actionConfig.amounts = {
        depositAmounts: {
          inputAmount: BigNumber.from(0),
          collateralTokenAmount: BigNumber.from(0),
          unwrapTokenAmount: BigNumber.from(0),
        },
        borrowAmount: BigNumber.from(0),
        leverageAmounts: {
          amountFrom: BigNumber.from(0),
          amountToMin: BigNumber.from(0),
        },
        deleverageAmounts: {
          amountFrom: BigNumber.from(0),
          amountToMin: BigNumber.from(0),
        },
        repayAmount: BigNumber.from(0),
        withdrawAmount: BigNumber.from(0),
        slippage: utils.parseUnits("1", PERCENT_PRESITION),
      };
    },

    resetToggles() {
      this.actionConfig.useLeverage = false;
      this.actionConfig.useDeleverage = false;
      this.actionConfig.useNativeToken = false;
      this.actionConfig.useUnwrapToken = this.isHiddenWrap ? true : false;
      this.actionConfig.withdrawUnwrapToken = this.isHiddenWrap;
    },

    onUpdateToggle(toggle: ToggleKeys, isReset = false) {
      this.actionConfig[toggle] = !this.actionConfig[toggle];
      if (isReset) this.resetAmounts();

      this.checkAndUpdateRouteQuery();
    },

    checkAndSetQuerySettings() {
      const currentQuery = this.$route.query;

      if (currentQuery.action) this.activeTab = currentQuery.action as string;
      if (currentQuery.leverage === "active")
        this.actionConfig.useLeverage = true;
      if (currentQuery.deleverage === "active")
        this.actionConfig.useDeleverage = true;
    },

    checkAndUpdateRouteQuery() {
      const currentParams = this.$route.params;
      const action = this.activeTab;

      if (this.actionConfig.useLeverage) {
        this.$router.replace({
          name: "Market",
          params: currentParams,
          query: {
            action: "borrow",
            leverage: "active",
          },
        });
        return;
      }

      if (this.actionConfig.useDeleverage) {
        this.$router.replace({
          name: "Market",
          params: currentParams,
          query: {
            action: "repay",
            deleverage: "active",
          },
        });
        return;
      }

      if (action === "borrow") {
        this.$router.replace({
          name: "Market",
          params: currentParams,
          query: {
            action: "borrow",
          },
        });
        return;
      }

      if (action === "repay") {
        this.$router.replace({
          name: "Market",
          params: currentParams,
          query: {
            action: "repay",
          },
        });
        return;
      }
    },

    onUpdateAmounts(type: string, value: any) {
      this.actionConfig.amounts[
        type as keyof typeof this.actionConfig.amounts
      ] = value;
    },

    changeTab(action: string) {
      this.activeTab = action;
      this.resetAmounts();
      this.resetToggles();
    },

    getWindowSize() {
      if (window.innerWidth <= 1024) this.mobileMode = true;
      else this.mobileMode = false;
    },

    async createCauldronInfo() {
      if (!this.routeChainId || !this.routeCauldronId) return false;

      this.checkAndSetQuerySettings();

      this.cauldron = await getCauldronInfo(
        this.routeCauldronId,
        this.routeChainId,
        this.account
      );

      if (!this.cauldron) return this.$router.push({ name: "Home" });
    },
  },

  async created() {
    await this.createCauldronInfo();
    this.getWindowSize();
    window.addEventListener("resize", this.getWindowSize, false);

    this.actionConfig.withdrawUnwrapToken = this.isHiddenWrap;
    this.actionConfig.useUnwrapToken = this.isHiddenWrap;

    this.updateInterval = setInterval(async () => {
      await this.createCauldronInfo();
    }, 60000);
  },

  updated() {
    this.checkAndUpdateRouteQuery();
  },

  beforeUnmount() {
    clearInterval(Number(this.updateInterval));
    window.removeEventListener("resize", this.getWindowSize);
  },

  components: {
    MarketHead: defineAsyncComponent(
      () => import("@/components/market/MarketHead.vue")
    ),
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    BorrowForm: defineAsyncComponent(
      () => import("@/components/market/BorrowForm.vue")
    ),
    RepayForm: defineAsyncComponent(
      () => import("@/components/market/RepayForm.vue")
    ),
    PositionHealth: defineAsyncComponent(
      () => import("@/components/market/PositionHealth.vue")
    ),
    PositionInfo: defineAsyncComponent(
      () => import("@/components/market/PositionInfo.vue")
    ),
    CauldronInfo: defineAsyncComponent(
      () => import("@/components/market/CauldronInfo.vue")
    ),
    BaseLoader: defineAsyncComponent(
      () => import("@/components/base/BaseLoader.vue")
    ),
    MobileNavigation: defineAsyncComponent(
      () => import("@/components/market/MobileNavigation.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.market-view {
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100vh;
  width: 100%;
}

.top-row {
  position: relative;
  max-width: 1310px;
  width: 100%;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.market-info {
  max-width: 1310px;
  width: 100%;
  padding: 0 15px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(300px, 1fr) minmax(300px, 1fr) minmax(
      300px,
      1fr
    );
  z-index: 1;
}

.form-wrap {
  height: 100%;
}

.market-stats {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: -1;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 200px);
}

@media screen and (max-width: 1024px) {
  .form-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .market-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .top-row {
    justify-content: center;
  }
}
</style>
