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

        <!-- <ArbitrumBlock /> -->

        <CauldronsCarousel />

        <CauldronsTable
          :cauldrons="cauldrons"
          :cauldronsLoading="refresherInfo.isLoading"
          :aprsLoading="aprsLoading"
          :tableKeys="tableKeys"
          @openMobileFiltersPopup="openMobileFiltersPopup"
          ref="cauldronsTable"
        />
      </div>
    </div>

    <FiltersPopup
      v-if="isFiltersPopupOpened"
      :sortersData="tableKeys.slice(1)"
      @updateSortKey="updateSortKeys"
      @close="isFiltersPopupOpened = false"
    />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { mapGetters, mapMutations } from "vuex";
import { dataRefresher } from "@/helpers/dataRefresher";
import type { RefresherInfo } from "@/helpers/dataRefresher";
import { getMarketList } from "@/helpers/cauldron/lists/getMarketList";
import type { CauldronListItem } from "@/helpers/cauldron/lists/getMarketList";
import { fetchCauldronsAprs } from "@/helpers/collateralsApy/fetchCauldronsAprs";
import { getMaxLeverageMultiplier } from "@/helpers/cauldron/getMaxLeverageMultiplier";
import { getMaxLeverageMultiplierPayload } from "@/helpers/migrationHelpers/payloadHelpers";

type Data = {
  cauldrons: any;
  aprs: any;
  aprsLoading: boolean;
  isFiltersPopupOpened: boolean;
  tableKeys: any;
  refresherInfo: RefresherInfo<any[]>;
};

type AprInfo = { [key: string]: AprInfo };

export default {
  data(): Data {
    return {
      cauldrons: [],
      aprs: {},
      aprsLoading: true,
      isFiltersPopupOpened: false,
      tableKeys: [
        {
          tableKey: "Collateral",
        },
        {
          tableKey: "TVL",
          tooltip: "Total Value Locked.",
          isSortingCriterion: true,
        },
        {
          tableKey: "TMB",
          tooltip: "Total MIM Borrowed.",
          isSortingCriterion: true,
        },
        {
          tableKey: "MIMS LB",
          tooltip: "MIMs left to be Borrowed.",
          isSortingCriterion: true,
        },
        {
          tableKey: "Interest",
          tooltip: "Annualised percent that your debt will increase each year.",
          isSortingCriterion: true,
        },
        {
          tableKey: "APR",
          tooltip: "Annualised Percentage Return Range.",
          isSortingCriterion: true,
        },
      ],
      refresherInfo: {
        refresher: null as unknown as dataRefresher<any[]>,
        remainingTime: 0,
        isLoading: false,
        intervalTime: 60,
      },
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      localCauldronsList: "getCauldronsList",
    }),
  },

  watch: {
    account() {
      this.createOrUpdateInfo();
    },

    cauldrons: {
      handler() {
        if (this.cauldrons) this.setCauldronsList(this.cauldrons);
      },
      deep: true,
    },
  },

  methods: {
    ...mapMutations({
      setCauldronsList: "setCauldronsList",
    }),

    async getCollateralsApr(
      cauldrons: CauldronListItem[]
    ): Promise<CauldronListItem[]> {
      this.aprsLoading = true;
      this.aprs = await fetchCauldronsAprs(cauldrons);

      return cauldrons.map((cauldron: CauldronListItem) => {
        const apr =
          this.aprs![
            cauldron.config.contract.address.toLowerCase() as keyof typeof this.aprs
          ];

        const payload = getMaxLeverageMultiplierPayload(cauldron);

        const multiplier = getMaxLeverageMultiplier(
          payload.oracleExchangeRate,
          payload.mcr,
          payload.collateralDecimals,
          payload.userBorrowAmount,
          payload.userCollateralAmount
        );

        cauldron.apr = apr
          ? {
              value: apr,
              multiplier,
            }
          : { value: 0, multiplier: 0 };
        return cauldron;
      });
    },

    openMobileFiltersPopup(): void {
      this.isFiltersPopupOpened = true;
    },

    updateSortKeys(key: any, order: any): void {
      (this.$refs.cauldronsTable as any).updateSortKeys(key, order);
    },

    checkLocalData(): void {
      if (this.localCauldronsList.isCreated) {
        this.cauldrons = this.localCauldronsList.data;
      }
    },

    async fetchCauldronsData() {
      const cauldrons = await getMarketList(this.account);
      const cauldronsWithApr = await this.getCollateralsApr(cauldrons);
      this.aprsLoading = false;
      return cauldronsWithApr;
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
        console.error("Error creating or updating Cauldrons info:", error);
      }
    },

    createDataRefresher() {
      this.refresherInfo.refresher = new dataRefresher<any[]>(
        async () => {
          return await this.fetchCauldronsData();
        },
        this.refresherInfo.intervalTime,
        (time) => (this.refresherInfo.remainingTime = time),
        (loading) => (this.refresherInfo.isLoading = loading),
        (updatedData: any[]) => {
          this.cauldrons = updatedData;
        }
      );
    },
  },

  async created() {
    this.checkLocalData();
    await this.createOrUpdateInfo();
  },

  beforeUnmount() {
    if (this.refresherInfo.refresher) {
      this.refresherInfo.refresher.stop();
    }
  },

  components: {
    // ArbitrumBlock: defineAsyncComponent(
    //   () => import("@/components/cauldrons/ArbitrumBlock.vue")
    // ),
    CauldronsCarousel: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/ui/carousel/CauldronsCarousel.vue")
    ),
    CauldronsTable: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/cauldrons/CauldronsTable.vue")
    ),
    FiltersPopup: defineAsyncComponent(
      () => import("@/components/myPositions/FiltersPopup.vue")
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

@media screen and (max-width: 768px) {
  .cauldrons-container {
    padding: 100px 12px 60px;
    gap: 16px;
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
}
</style>
