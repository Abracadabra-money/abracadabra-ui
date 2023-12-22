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
    <EmptyState class="empty-state" :isFarmsLoading="isFarmsLoading" v-else />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getFarmsList } from "@/helpers/farm/list/getFarmsList";
import BaseLoader from "@/components/base/BaseLoader.vue";
import MarketsListPopupFarmItem from "@/components/popups/marketList/MarketsListPopupFarmItem.vue";
import EmptyState from "@/components/farm/EmptyState.vue";
import InputSearch from "@/components/ui/inputs/InputSearch.vue";

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

    isFarmsMarket() {
      return this.popupType === "farms";
    },

    popupTitle() {
      return "Farm";
    },

    marketsList() {
      return this.farmsList.sort((a, b) => +a.isDepreciated - +b.isDepreciated);
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
    EmptyState,
    InputSearch,
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
  padding-right: 32px;
  width: calc(100% + 32px);
}
</style>
