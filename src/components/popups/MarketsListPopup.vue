<template>
  <div class="popup-wrap">
    <div class="popup-header">
      <h4 class="popup-title">Select {{ popupTitle }}</h4>
      <PopupSearch v-if="!isLoadingMarkets" @input="changeSearch" />
    </div>

    <div class="loader-wrap" v-if="isLoader">
      <BaseLoader />
    </div>

    <div class="markets-list" v-else-if="filteredMarketList.length">
      <template v-if="isFarmsMarket">
        <MarketsListPopupFarmItem
          v-for="marketItem in filteredMarketList"
          :marketItem="marketItem"
          :key="marketItem.id"
          @changeActiveMarket="changeActiveMarket"
        />
      </template>

      <template v-else>
        <MarketsListPopupCauldronItem
          v-for="marketItem in filteredMarketList"
          :marketItem="marketItem"
          :key="marketItem.config.id"
          @changeActiveMarket="changeActiveMarket"
        />
      </template>
    </div>

    <PopupEmptyState :popupType="popupType" :emptyType="popupEmptyType" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getPopupList } from "@/helpers/cauldron/lists/getPopupList.ts";
import { getFarmsList } from "@/helpers/farm/list/getFarmsList";
import PopupSearch from "@/components/popups/ui/PopupSearch.vue";
import BaseLoader from "@/components/base/BaseLoader.vue";
import MarketsListPopupFarmItem from "@/components/popups/marketList/MarketsListPopupFarmItem.vue";
import MarketsListPopupCauldronItem from "@/components/popups/marketList/MarketsListPopupCauldronItem.vue";
import PopupEmptyState from "@/components/popups/ui/PopupEmptyState.vue";

export default {
  props: {
    popupType: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      search: "",
      cauldronsList: [],
      farmsList: [],
      cauldronsListIsLoading: true,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      signer: "getSigner",
      provider: "getProvider",
      isLoadedFarms: "getFarmPoolLoading",
    }),

    isFarmsMarket() {
      return this.popupType === "farms";
    },

    popupTitle() {
      return this.isFarmsMarket ? "Farm" : "Cauldron";
    },

    marketsList() {
      return this.isFarmsMarket ? this.farmsList : this.cauldronsList;
    },

    isLoadingMarkets() {
      return this.isFarmsMarket
        ? this.isLoadedFarms
        : this.cauldronsListIsLoading;
    },

    isLoader() {
      return !this.marketsList.length && this.isLoadingMarkets;
    },

    serchNotFound() {
      return !this.filteredMarketList.length && this.marketsList.length;
    },

    popupEmptyType() {
      if (this.isLoadingMarkets) return "";
      if (this.serchNotFound) return "search";
      if (!this.marketsList.length) return "pools";
      return "";
    },

    borrowFilteredList() {
      return this.marketsList
        .filter(({ config }) => !config.cauldronSettings.isDepreciated)
        .sort(({ userInfo: a }, { userInfo: b }) =>
          +a.collateralAmountUsd < +b.collateralAmountUsd ? 1 : -1
        );
    },

    leverageFilteredList() {
      return this.marketsList
        .filter(
          ({ config }) =>
            config.cauldronSettings.isSwappersActive &&
            config.leverageInfo &&
            !config.cauldronSettings.isDepreciated
        )
        .sort(({ userInfo: a }, { userInfo: b }) =>
          +a.collateralAmountUsd < +b.collateralAmountUsd ? 1 : -1
        );
    },

    repayFilteredList() {
      return [...this.marketsList].sort(({ userInfo: a }, { userInfo: b }) =>
        +a.collateralAmountUsd < +b.collateralAmountUsd ? 1 : -1
      );
    },

    deleverageFilteredList() {
      return this.marketsList
        .filter(({ config }) => config.cauldronSettings.isSwappersActive)
        .sort(({ userInfo: a }, { userInfo: b }) =>
          +a.collateralAmountUsd < +b.collateralAmountUsd ? 1 : -1
        );
    },

    sortedMarketsList() {
      if (this.popupType === "borrow") return this.borrowFilteredList;
      if (this.popupType === "leverage") return this.leverageFilteredList;
      if (this.popupType === "repay") return this.repayFilteredList;
      if (this.popupType === "deleverage") return this.deleverageFilteredList;
      if (!this.search) return this.marketsList;
      return this.marketsList;
    },

    filteredMarketList() {
      if (this.isFarmsMarket) {
        return this.sortedMarketsList.filter(
          ({ name }) =>
            name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
        );
      }

      return this.sortedMarketsList.filter(
        ({ config }) =>
          config.name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
      );
    },
  },

  methods: {
    changeSearch({ target }) {
      this.search = target.value;
    },

    changeActiveMarket(marketId) {
      this.$emit("changeActiveMarket", marketId);
    },

    async getMarketsList() {
      if (this.popupType === "farms")
        this.farmsList = await getFarmsList(this.chainId, false);

      this.cauldronsList = await getPopupList(
        this.chainId,
        this.provider,
        this.account
      );

      this.cauldronsListIsLoading = false;
    },
  },

  async created() {
    await this.getMarketsList();
  },

  components: {
    PopupSearch,
    BaseLoader,
    MarketsListPopupFarmItem,
    MarketsListPopupCauldronItem,
    PopupEmptyState,
  },
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-thumb {
  border-width: 1px 1px 1px 2px;
  border-radius: 2px;
  background-color: #252423;
}

::-webkit-scrollbar-thumb:hover {
  border-width: 1px 1px 1px 2px;
  background-color: #565656;
}

::-webkit-scrollbar-track {
  border-width: 1px;

  background-color: #414141;
  border-color: transparent;
}
.popup-wrap {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 520px;
  width: 380px;
  max-width: 100%;
}

.popup-header {
  padding: 10px 10px 20px 10px;
  border-bottom: solid 1px rgba(255, 255, 255, 0.1);
}

.popup-title {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  margin-bottom: 10px;
}

.loader-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 52px;
}

.markets-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>
