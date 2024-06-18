<template>
  <div class="popup-wrap">
    <h4 class="popup-title">Select Farm</h4>

    <InputSearch class="input-search" @input="changeSearch" />

    <div class="markets-list" v-if="filteredMarketList.length">
      <MarketsListPopupFarmItem
        v-for="marketItem in filteredMarketList"
        :marketItem="marketItem"
        :key="`${marketItem.id}-${marketItem.chainId}`"
        @changeActiveMarket="changeActiveFarm"
      />
    </div>

    <div class="loader-wrap" v-if="isFarmsLoading || showEmptyBlock">
      <BaseLoader v-if="isFarmsLoading" medium text="Loading farms" />
      <BaseSearchEmpty v-if="showEmptyBlock" text="There are no Farms" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { getFarmsList } from "@/helpers/farm/list/getFarmsList";
import type { FarmItem } from "@/configs/farms/types";

export default {
  data() {
    return {
      search: "",
      farmsList: [] as FarmItem[],
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
    changeSearch({ target }: Event) {
      this.search = (target as HTMLInputElement).value;
    },

    changeActiveFarm({ id, chainId }: FarmItem) {
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
    BaseLoader: defineAsyncComponent(
      () => import("@/components/base/BaseLoader.vue")
    ),
    MarketsListPopupFarmItem: defineAsyncComponent(
      () =>
        import("@/components/popups/marketList/MarketsListPopupFarmItem.vue")
    ),
    InputSearch: defineAsyncComponent(
      () => import("@/components/ui/inputs/InputSearch.vue")
    ),
    BaseSearchEmpty: defineAsyncComponent(
      () => import("@/components/base/BaseSearchEmpty.vue")
    ),
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

.loader-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
