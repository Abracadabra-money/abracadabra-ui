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
      @updateSortKey="($refs.cauldronsTable as any).updateSortKeys"
      @close="isFiltersPopupOpened = false"
    />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { mapGetters, mapMutations } from "vuex";
import { getCollateralApr } from "@/helpers/collateralsApy";
import { getMarketList } from "@/helpers/cauldron/lists/getMarketList";

type Data = {
  cauldrons: any;
  cauldronsLoading: boolean;
  updateInterval: null | NodeJS.Timeout;
  timerInterval: number;
  isFiltersPopupOpened: boolean;
  tableKeys: any;
};

export default {
  data(): Data {
    return {
      cauldrons: [],
      cauldronsLoading: true,
      updateInterval: null,
      timerInterval: 60000,
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
      localCauldronsList: "getCauldronsList",
    }),
  },

  watch: {
    async account() {
      this.cauldrons = await getMarketList(this.account);
    },
  },

  methods: {
    ...mapMutations({
      setCauldronsList: "setCauldronsList",
    }),

    async getCollateralsApr(): Promise<void> {
      this.cauldrons = await Promise.all(
        this.cauldrons.map(async (cauldron: any) => {
          const apr = await getCollateralApr(cauldron, true);
          cauldron.apr = apr;
          return cauldron;
        })
      );
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
        this.cauldronsLoading = false;
      }
    },

    async createCaulldronsInfo(): Promise<void> {
      this.cauldrons = await getMarketList(this.account);
      this.cauldronsLoading = false;

      await this.getCollateralsApr();

      this.setCauldronsList(this.cauldrons);
    },
  },

  async created() {
    this.checkLocalData();
    await this.createCaulldronsInfo();

    this.updateInterval = setInterval(async () => {
      this.cauldrons = await getMarketList(this.account);
    }, this.timerInterval);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval as any);
  },

  components: {
    // ArbitrumBlock: defineAsyncComponent(
    //   () => import("@/components/cauldrons/ArbitrumBlock.vue")
    // ),
    CauldronsCarousel: defineAsyncComponent(
      () => import("@/components/ui/carousel/CauldronsCarousel.vue")
    ),
    CauldronsTable: defineAsyncComponent(
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
