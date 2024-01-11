<template>
  <div class="popup-wrap">
    <h4 class="popup-title">Select {{ popupTitle }}</h4>

    <InputSearch class="input-search" @input="changeSearch" />

    <div class="markets-list" v-if="filteredMarketList.length">
      <MarketsListPopupFarmItem
        v-for="marketItem in filteredMarketList"
        :marketItem="marketItem"
        :key="`${marketItem.id}-${marketItem.chainId}`"
        @changeActiveMarket="changeActiveFarm"
      />
    </div>

    <div v-if="isFarmsLoading || showEmptyBlock">
      <BaseLoader v-if="isFarmsLoading" medium text="Loading farms." />
      <BaseSearchEmpty v-if="showEmptyBlock" text="There are no farms." />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getFarmsList } from "@/helpers/farm/list/getFarmsList";
import BaseLoader from "@/components/base/BaseLoader.vue";
import MarketsListPopupFarmItem from "@/components/popups/marketList/MarketsListPopupFarmItem.vue";
import InputSearch from "@/components/ui/inputs/InputSearch.vue";
import BaseSearchEmpty from "@/components/base/BaseSearchEmpty.vue";

export default {
  data() {
    return {
      search: "",
      farmsList: [],
      isFarmsLoading: false,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      signer: "getSigner",
      provider: "getProvider",
    }),

    showEmptyBlock() {
      return (
        !this.isFarmsLoading &&
        this.search.length &&
        !this.filteredMarketList.length
      );
    },

    isFarmsMarket() {
      return this.popupType === "farms";
    },

    popupTitle() {
      return "Farm";
    },

    marketsList() {
      return [...this.farmsList].sort(
        (a, b) => +a.isDeprecated - +b.isDeprecated
      );
    },

    isLoader() {
      return !this.marketsList.length;
    },

    serchNotFound() {
      return !this.filteredMarketList.length && this.marketsList.length;
    },

    popupEmptyType() {
      if (this.isFarmsLoading) return "";
      if (this.serchNotFound) return "search";
      if (!this.marketsList.length) return "pools";
      return "";
    },

    filteredMarketList() {
      return this.search
        ? this.marketsList.filter(
            ({ name }) =>
              name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
          )
        : this.marketsList;
    },
  },

  methods: {
    changeSearch({ target }) {
      this.search = target.value;
    },

    changeActiveFarm({ id, chainId }) {
      this.$emit("changeActiveMarket", { id, chainId });
    },

    async getMarketsList() {
      this.farmsList = await getFarmsList(this.chainId, false);
    },
  },

  async created() {
    this.isFarmsLoading = true;
    await this.getMarketsList();
    this.isFarmsLoading = false;
  },

  components: {
    BaseLoader,
    MarketsListPopupFarmItem,
    InputSearch,
    BaseSearchEmpty,
  },
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.input-search {
  width: 100%;
}

.popup-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 520px;
  width: 100%;
  min-width: 100%;
}

.popup-title {
  font-size: 20px;
  font-weight: 500;
}

.markets-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding: 0 32px 0 4px;
  width: calc(100% + 32px);
}
</style>
