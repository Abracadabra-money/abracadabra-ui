<template>
  <div class="market-view">
    <img class="bg-top" src="@/assets/images/market/bg-top.png" alt="" />
    <img class="bg-bottom" src="@/assets/images/market/bg-bottom.png" alt="" />

    <template v-if="cauldron">
      <MarketHead :cauldron="cauldron" v-if="cauldron" />

      <div class="market-info">
        <MarketActions
          :cauldron="cauldron"
          :useUnwrapToken="useUnwrapToken"
          @updateCollateralValues="updateCollateralValues"
          @updateActiveToken="updateActiveToken"
        />

        <div class="market-stats">
          <div class="row">
            <div
              style="
                height: 48px;
                width: 215px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.04);
                background: rgba(16, 18, 23, 0.38);
              "
            ></div>
            <PriceRange />
          </div>

          <div class="row">
            <PositionInfo
              :cauldron="cauldron"
              :expectedCollateralDeposit="expectedCollateralDeposit"
            />
            <CauldronInfo />
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
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { BigNumber, providers } from "ethers";
import { defaultRpc } from "@/helpers/chains";
import { getCauldronInfo } from "@/helpers/cauldron/getCauldronInfo";

type CollateralsValue = {
  amount: BigNumber;
  unwrapAmount: BigNumber;
};

export default {
  data() {
    return {
      chainId: null as any,
      cauldronId: null as any,
      cauldron: null as any,
      updateInterval: null as any,
      collateralsValue: {
        amount: BigNumber.from(0),
        unwrapAmount: BigNumber.from(0),
      },
      useUnwrapToken: false,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", signer: "getSigner" }),

    expectedCollateralDeposit() {
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;

      if (this.useUnwrapToken)
        return userCollateralAmount.add(this.collateralsValue.unwrapAmount);

      return userCollateralAmount.add(this.collateralsValue.amount);
    },
  },

  methods: {
    updateCollateralValues(value: CollateralsValue) {
      this.collateralsValue = value;
    },

    updateActiveToken() {
      this.useUnwrapToken = !this.useUnwrapToken;
    },

    async createCauldronInfo() {
      if (!this.chainId || !this.cauldronId) return false;

      const chainProvider = new providers.StaticJsonRpcProvider(
        defaultRpc[this.chainId as keyof typeof defaultRpc]
      );

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

    console.log("cauldron", this.cauldron);
  },

  components: {
    MarketHead: defineAsyncComponent(
      () => import("@/components/market/MarketHead.vue")
    ),
    MarketActions: defineAsyncComponent(
      () => import("@/components/market/MarketActions.vue")
    ),
    PriceRange: defineAsyncComponent(
      () => import("@/components/ui/range/PriceRange.vue")
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
  display: flex;
  gap: 24px;
}

.market-stats {
  @include font;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.cauldron-info {
  max-width: 410px;
  padding: 24px;
  width: 100%;
  display: flex;
  gap: 16px;
  align-items: center;
  align-self: stretch;
  flex-direction: column;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
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
