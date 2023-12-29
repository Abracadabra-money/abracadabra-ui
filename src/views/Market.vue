<template>
  <div class="market-view">
    <img class="bg-top" src="@/assets/images/market/bg-top.png" alt="" />
    <img class="bg-bottom" src="@/assets/images/market/bg-bottom.png" alt="" />

    <template v-if="cauldron">
      <MarketHead :cauldron="cauldron" v-if="cauldron" />
      <div class="market-info">
        <div class="actions-wrap">
          <Tabs :name="activeTab" :items="tabItems" @select="changeTab" />

          <div class="form-wrap" v-if="isBorrowTab">
            <BorrowForm
              :cauldron="cauldron"
              @updateAmounts="updateAmounts"
              @updateBorrowConfig="onUpdateConfig"
              @updateMarket="createCauldronInfo"
            />
          </div>

          <div class="form-wrap" v-if="isRepayTab">
            <RepayBlock
              :cauldron="cauldron"
              @updateRepayConfig="onUpdateConfig"
            />
          </div>
        </div>

        <div class="market-stats">
          <div class="position-health-wrap">
            <PositionHealth :cauldron="cauldron" />
          </div>

          <div class="row">
            <PositionInfo
              :cauldron="cauldron"
              :actionType="activeTab"
              :actionConfig="actionConfig"
            />
            <CauldronInfo :cauldron="cauldron" />
          </div>
        </div>
      </div>
    </template>

    <div class="loading" v-else>
      <img
        class="loading-icon"
        src="@/assets/images/cauldrons/loader.gif"
        alt="Loader icon"
      />
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { defaultRpc } from "@/helpers/chains";
import { BigNumber, providers } from "ethers";
import { getChainsConfigs } from "@/helpers/getChainsConfigs";
import { getCauldronInfo } from "@/helpers/cauldron/getCauldronInfo";

export default {
  data() {
    return {
      chainId: null as any,
      cauldronId: null as any,
      cauldron: null as any,
      updateInterval: null as any,

      // TODO: remove after RepayBlock update
      amounts: {
        deposit: {
          inputAmount: BigNumber.from(0),
          collateralTokenAmount: BigNumber.from(0),
          unwrapTokenAmount: BigNumber.from(0),
        },
        borrowAmount: BigNumber.from(0),
        leverageAmounts: {
          amountFrom: BigNumber.from(0),
          amountToMin: BigNumber.from(0),
        },
      },

      // TODO: add repay logic & types
      // IMPORTANT: remove config dublicates from Forms & provide this config
      actionConfig: {
        useLeverage: false,
        useDeleverage: false,
        amounts: {
          // TODO: rename to depositAmounts
          deposit: {
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
        },
      },
      activeTab: "borrow",
      tabItems: ["borrow", "repay"],
      useLeverage: false,
      loadingBorrow: false,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", signer: "getSigner" }),

    isBorrowTab() {
      return this.activeTab === "borrow";
    },

    isRepayTab() {
      return this.activeTab === "repay";
    },
  },

  methods: {
    updateAmounts(amounts: any) {
      this.amounts = amounts;
    },

    onUpdateConfig(config: any) {
      this.actionConfig = config;
    },

    changeTab(action: string) {
      this.activeTab = action;
    },

    toogleUseLeverage() {
      this.useLeverage = !this.useLeverage;
    },

    async createCauldronInfo() {
      if (!this.chainId || !this.cauldronId) return false;

      const unsupportedChain =
        !defaultRpc[this.chainId as keyof typeof defaultRpc];
      const { rpcUrls } = getChainsConfigs();

      const currentRpc = unsupportedChain
        ? defaultRpc[1]
        : rpcUrls
        ? rpcUrls[0]
        : defaultRpc[this.chainId as keyof typeof defaultRpc];

      const chainProvider = new providers.StaticJsonRpcProvider(currentRpc);

      const userSigner = this.account ? this.signer : chainProvider;

      this.cauldron = await getCauldronInfo(
        this.cauldronId,
        this.chainId,
        chainProvider,
        userSigner
      );

      this.updateInterval = await setInterval(async () => {
        this.cauldron = await getCauldronInfo(
          this.cauldronId,
          this.chainId,
          chainProvider,
          userSigner
        );
      }, 60000);
    },
  },

  async created() {
    this.chainId = +this.$route.params.chainId;
    this.cauldronId = +this.$route.params.cauldronId;

    await this.createCauldronInfo();
  },

  components: {
    MarketHead: defineAsyncComponent(
      () => import("@/components/market/MarketHead.vue")
    ),
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    BorrowForm: defineAsyncComponent(
      () => import("@/components/market/BorrowForm.vue")
    ),
    RepayBlock: defineAsyncComponent(
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
  },
};
</script>

<style lang="scss" scoped>
.market-view {
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  gap: 30px;
  background: linear-gradient(
    291deg,
    #102649 -26.37%,
    #0c0f1c 40.92%,
    #131728 62.83%,
    #212555 123.87%
  );
  min-height: 100vh;
  width: 100%;
}

.bg-top {
  position: absolute;
  top: 145px;
  left: 0;
}

.bg-bottom {
  position: absolute;
  top: 80vh;
  right: 70px;
}

.market-info {
  max-width: 1310px;
  width: 100%;
  padding: 0 15px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr 2fr;
  z-index: 1;
}

.actions-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 411px;
  width: 100%;
}

.form-wrap {
  height: 100%;
}

.market-stats {
  @include font;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: -1;
}

.position-health-wrap {
  display: flex;
  justify-content: flex-end;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 200px);
}

.loading-icon {
  max-width: 20%;
}
</style>
