<template>
  <div class="cauldrons-page">
    <div class="banner-container">
      <div class="cauldrons-container">
        <div class="text-wrap">
          <h3 class="title">Available Cauldrons</h3>
          <h4 class="subtitle">
            Use your favourite assets as collateral to mint
          </h4>
          <h4 class="subtitle">
            <img
              class="mim-icon"
              src="@/assets/images/PixelMIM.svg"
              alt="Mim icon"
            />
            MIM a leading decentralised and collateral-backed stablecoin.
          </h4>
        </div>

        <div class="banner-wrap" v-if="isArbitrumChain">
          <img class="banner-coins" src="@/assets/gifs/coins.gif" alt="" />
          <img
            class="banner-book"
            src="@/assets/images/arbitrum/book-background.png"
            alt=""
          />
        </div>

        <div class="farm-cards-wrap" v-if="isArbitrumChain">
          <h4 class="farm-title">
            Explore the Abracadabra ecosystem on Arbitrum!
          </h4>

          <FarmItem v-if="farmCardInfo" :farm="farmCardInfo" :top="true" />
        </div>

        <CauldronsCarousel />

        <CauldronsTable
          :cauldrons="cauldrons"
          :cauldronsLoading="cauldronsLoading"
          :tableKeys="tableKeys"
          @openMobileFiltersPopup="openMobileFiltersPopup"
          ref="cauldronsTable"
        />
      </div>
    </div>

    <FiltersPopup
      v-if="isFiltersPopupOpened"
      :sortersData="tableKeys.slice(1)"
      @updateSortKey="$refs.cauldronsTable.updateSortKeys"
      @close="isFiltersPopupOpened = false"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import farmsConfig from "@/configs/farms/farms";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import { getCollateralApr } from "@/helpers/collateralsApy";
import { getMarketList } from "@/helpers/cauldron/lists/getMarketList";
import { createFarmItemConfig } from "@/helpers/farm/createFarmItemConfig";

export default {
  data() {
    return {
      cauldrons: [],
      cauldronsLoading: true,
      farmCardInfo: null,
      updateInterval: null,
      isFiltersPopupOpened: false,
      tableKeys: [
        {
          tableKey: "Collateral",
        },
        {
          tableKey: "TVL",
          tooltip: "Total Value Locked.",
        },
        {
          tableKey: "TMB",
          tooltip: "Total MIM Borrowed.",
        },
        {
          tableKey: "MIMS LB",
          tooltip: "MIMs left to be Borrowed.",
        },
        {
          tableKey: "Interest",
          tooltip: "Annualised percent that your debt will increase each year.",
        },
        {
          tableKey: "APR",
          tooltip: "Annualised Percentage Return Range.",
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    isArbitrumChain() {
      return this.chainId === ARBITRUM_CHAIN_ID;
    },
  },

  watch: {
    account() {
      this.createCauldronsList();
    },
  },

  methods: {
    async createCauldronsList() {
      this.cauldrons = await getMarketList(this.account);
      this.cauldronsLoading = false;
      this.updateInterval = setInterval(
        await getMarketList(this.account),
        60000
      );
    },

    async getCollateralsApr() {
      this.cauldrons = await Promise.all(
        this.cauldrons.map(async (cauldron) => {
          const apr = await getCollateralApr(cauldron, true);
          cauldron.apr = apr;
          return cauldron;
        })
      );
    },

    getFarmConfig(farmId, chainId) {
      return farmsConfig.find(
        (farm) => farm.id === farmId && farm.contractChain === chainId
      );
    },

    openMobileFiltersPopup() {
      this.isFiltersPopupOpened = true;
    },

    updateSortKeys(key, order) {
      this.$refs.cauldronsTable.updateSortKeys(key, order);
    },
  },

  async created() {
    const farmConfig = this.getFarmConfig(4, ARBITRUM_CHAIN_ID);

    this.farmCardInfo = await createFarmItemConfig(
      farmConfig.id,
      farmConfig.contractChain,
      this.account,
      true
    );

    await this.createCauldronsList();
    await this.getCollateralsApr();
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    CauldronsTable: defineAsyncComponent(() =>
      import("@/components/cauldrons/CauldronsTable.vue")
    ),
    FarmItem: defineAsyncComponent(() =>
      import("@/components/farm/FarmItem.vue")
    ),
    CauldronsCarousel: defineAsyncComponent(() =>
      import("@/components/ui/carousel/CauldronsCarousel.vue")
    ),
    FiltersPopup: defineAsyncComponent(() =>
      import("@/components/myPositions/FiltersPopup.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.cauldrons-page {
  min-height: 100vh;
  width: 100%;
  height: 100%;
}

.banner-container {
  position: relative;
  max-width: 1500px;
  width: 100%;
  margin: 0 auto;
}

.cauldrons-container {
  padding: 125px 15px 100px;
  max-width: 1310px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  line-height: 150%;
}

.subtitle {
  display: flex;
  gap: 4px;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  line-height: 150%;
}

.mim-icon {
  width: 24px;
  height: 24px;
}

.banner-wrap {
  position: absolute;
  top: 44px;
  right: 0;
  max-width: 871px;
  width: 100%;
  z-index: 0;
}

.banner-coins {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  z-index: 0;
}

.banner-book {
  width: 100%;
}

.farm-cards-wrap {
  z-index: 1;
}

.farm-title {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.6px;
  margin-bottom: 12px;
  z-index: 10;
}

@media screen and (max-width: 1024px) {
  .banner-wrap {
    max-width: 600px;
    top: 200px;
    z-index: 0;
  }
}

@media screen and (max-width: 768px) {
  .cauldrons-container {
    padding: 100px 12px 60px;
    gap: 16px;
  }

  .banner-wrap {
    position: inherit;
    max-width: 100%;
  }
}

@media screen and (max-width: 600px) {
  .title {
    font-size: 24px;
  }

  .subtitle {
    align-items: flex-start;
    font-size: 14px;
  }

  .mim-icon {
    width: 16px;
    height: 16px;
  }

  .farm-title {
    font-size: 20px;
  }
}
</style>
