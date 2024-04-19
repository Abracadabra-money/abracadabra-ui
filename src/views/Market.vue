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

  <div class="mobile-navigation" v-if="cauldron">
    <div
      class="nav-item"
      v-for="tab in mobileTabs"
      :key="`mobileTab=${tab.id}`"
      :class="{ active: tab.id === currentMobileTab }"
      @click="currentMobileTab = tab.id"
    >
      <img :class="{ mini: tab.id !== 0 }" :src="tab.icon" alt="" />
      <p>{{ tab.text }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { BigNumber, utils } from "ethers";
import { useImage } from "@/helpers/useImage";
import { PERCENT_PRESITION } from "@/helpers/cauldron/utils";
import { getCauldronInfo } from "@/helpers/cauldron/getCauldronInfo";

export default {
  data() {
    return {
      chainId: null as any,
      cauldronId: null as any,
      cauldron: null as any,
      updateInterval: null as any,
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
      activeTab: "borrow",
      tabItems: ["borrow", "repay"],
      currentMobileTab: 0,
      mobileTabs: [
        {
          id: 0,
          text: "Manage",
          icon: useImage("assets/images/nav-1.png"),
        },
        {
          id: 1,
          text: "My Position",
          icon: useImage("assets/images/nav-2.png"),
        },
        {
          id: 2,
          text: "Stats",
          icon: useImage("assets/images/nav-3.png"),
        },
      ],
      mobileMode: false,
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
      const chainId = Number(this.$route.params.chainId);

      return chainId;
    },

    routeCauldronId() {
      const chainId = Number(this.$route.params.cauldronId);

      return chainId;
    },

    isOpenPosition() {
      return (
        this.cauldron.userPosition.collateralInfo.userCollateralShare.gt(0) ||
        this.cauldron.userPosition.borrowInfo.userBorrowPart.gt(0)
      );
    },

    isBorrowTab() {
      return this.activeTab === "borrow";
    },

    isRepayTab() {
      return this.activeTab === "repay";
    },

    isHiddenWrap() {
      return !!this.cauldron.config?.wrapInfo?.isHiddenWrap;
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

    onUpdateToggle(toggle: string, isReset = false) {
      // @ts-ignore
      this.actionConfig[toggle] = !this.actionConfig[toggle];
      if (isReset) this.resetAmounts();

      this.checkAndUpdateRouteQuery();
    },

    checkAndSetQuerySettings() {
      const currentQuery = this.$route.query;

      //@ts-ignore
      if (currentQuery.action) this.activeTab = currentQuery.action;
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
      // @ts-ignore
      this.actionConfig.amounts[type] = value;
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
    },
  },

  updated() {
    this.checkAndUpdateRouteQuery();
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
    window.removeEventListener("resize", this.getWindowSize);
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
  },
};
</script>

<style lang="scss" scoped>
.mobile-navigation {
  display: none;
  align-items: center;
  justify-content: center;
  padding: 12px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(16, 22, 34, 0.6);
  gap: 52px;
  box-shadow: 0px 4px 36.4px 0px rgba(98, 88, 195, 0);
  backdrop-filter: blur(12.5px);
  z-index: 100;

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    &.active,
    &:hover {
      p {
        color: #7088cc;
      }
    }

    img {
      width: 50px;
      height: 50px;
      object-fit: contain;
    }

    p {
      color: #fff;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      text-align: center;
      transition: all 0.3s ease;
    }
  }
}

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

  .mobile-navigation {
    display: flex;
  }
}

@media screen and (max-width: 640px) {
  .mobile-navigation {
    padding: 8px;
    gap: 52px;

    .nav-item {
      img {
        width: 36px;
        height: 36px;

        &.mini {
          width: 28px;
        }
      }

      p {
        font-size: 14px;
      }
    }
  }
}
</style>
