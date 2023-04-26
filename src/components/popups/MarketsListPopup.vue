<template>
  <div class="popup-wrap">
    <div class="popup-header">
      <h4 class="popup-title">Select {{ title }}</h4>
      <PopupSearch v-if="!isLoading" @input="changeInput" />
    </div>

    <div class="loader-wrap" v-if="isLoader">
      <BaseLoader />
    </div>

    <div class="tokens-list" v-else-if="filteredPools.length">
      <template v-if="popupType === 'farms'">
        <TokenPopupItem
          v-for="pool in filteredPools"
          @click="selectToken(pool)"
          :key="pool.id"
          :name="pool.name"
          :icon="pool.icon"
          :farmItem="pool"
          :balance="pool.accountInfo ? pool.accountInfo.balance : null"
          :price="pool.lpPrice"
        />
      </template>

      <template v-else>
        <SelectPopupItem
          v-for="pool in filteredPools"
          :key="pool.id"
          :pool="pool"
          @enterPool="selectToken"
        />
      </template>
    </div>

    <PopupEmptyState :popupType="popupType" :emptyType="emptyType" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PopupSearch from "@/components/popups/ui/PopupSearch.vue";
import { createMarketsList } from "@/helpers/cauldron/marketsList.js";

import BaseLoader from "@/components/base/BaseLoader.vue";
import TokenPopupItem from "@/components/farms/FarmListItem.vue";
import SelectPopupItem from "@/components/popups/marketList/MarketsListPopupItem.vue";
import PopupEmptyState from "@/components/popups/ui/PopupEmptyState.vue";

export default {
  props: {
    pools: {
      type: Array,
      default: () => [],
    },

    popupType: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      search: "",
      cauldronsList: [],
      cauldronsListIsLoading: true,
    };
  },

  computed: {
    ...mapGetters({
      // isLoadedCauldrons: "getLoadPoolsBorrow",
      isLoadedFarms: "getFarmPoolLoading",
      provider: "getProvider",
      chainId: "getChainId",
      account: "getAccount",
    }),

    marketsList() {
      if (this.popupType === "farms") return this.pools;
      return this.cauldronsList;
    },

    title() {
      return this.popupType === "farms" ? "Farm" : "Cauldron";
    },

    isLoading() {
      return this.popupType === "farms"
        ? this.isLoadedFarms
        : this.cauldronsListIsLoading;
    },

    isLoader() {
      return !this.marketsList.length && this.isLoading;
    },

    emptyType() {
      if (this.isLoading) return "";
      if (!this.filteredPools.length && this.marketsList.length)
        return "search";
      if (!this.marketsList.length) return "pools";
      return "";
    },

    filteredPools() {
      let filteredPools = null;
      if (this.popupType === "borrow") filteredPools = this.borrowfilteredPool;

      if (!this.search) return filteredPools;

      return filteredPools.filter(
        ({ name }) =>
          name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
      );
    },

    // todo end balanceUsd
    borrowfilteredPool() {
      return this.marketsList
        .filter(({ config }) => !config.cauldronSettings.isDepreciated)
        .sort((a, b) =>
          a.userCollateralAmounts.toString() <
          b.userCollateralAmounts.toString()
            ? 1
            : -1
        );

      // if (this.account && this.pools[0]?.userInfo) {
      //   return this.pools
      //     .filter((pool) => !pool.cauldronSettings.isDepreciated)
      //     .sort((a, b) =>
      //       a.userInfo.balanceUsd < b.userInfo.balanceUsd ? 1 : -1
      //     );
      // }

      // return this.pools.filter((pool) => !pool.cauldronSettings.isDepreciated);
    },
  },

  methods: {
    changeInput({ target }) {
      this.search = target.value;
    },

    selectToken(chainId) {
      this.$emit("select", chainId);
      this.$emit("close");
    },

    async getMarketsList() {
      this.cauldronsList = await createMarketsList(
        this.chainId,
        this.provider,
        this.account
      );

      this.cauldronsIsLoading = false;
    },
  },

  async created() {
    await this.getMarketsList();
  },

  components: {
    PopupSearch,
    BaseLoader,
    SelectPopupItem,
    TokenPopupItem,
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

.tokens-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.token-spacer-wrap {
  display: flex;
  justify-content: flex-end;
  flex: 0 0 1px;
}
.token-spacer {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.1);
  height: 1px;
  width: calc(100% - 42px);
}

// .not-found {
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   text-align: center;
//   padding: 30px 10px;
// }

// .not-found__img {
//   width: 186px;
//   max-width: 100%;
//   height: auto;
//   margin-bottom: 19px;
// }
</style>
