<template>
  <div class="cauldrons-page">
    <h2 class="title">Available Cauldrons</h2>
    <EmptyState v-if="isEmptyState" />
    <div v-else-if="cauldronsIsLoaded" class="loader-wrap">
      <BaseLoader />
    </div>

    <template v-else>
      <div class="tools">
        <Search @changeSerch="changeSerch" />

        <DropdownSortBy
          :sortList="sortList"
          :activeSortValue="activeSortValue"
          @changeDropdawnValue="changeDropdawnValue"
          @changeSortOrder="changeSortOrder"
        />

        <div class="toggle-markets">
          active markets only
          <CheckBox @update="toggleActiveMarkets" :value="!isShowDeprecated" />
        </div>
      </div>

      <div class="cauldrons-list">
        <div class="list-header">
          <div v-for="title in tableHeaders" :key="title">{{ title }}</div>
        </div>

        <template v-if="filteredCouldrons.length">
          <CauldronItem
            v-for="cauldron in filteredCouldrons"
            :key="cauldron.id"
            :cauldron="cauldron"
          />
        </template>

        <EmptyState text="No cauldrons found with this name" v-else />
      </div>
    </template>

    <ScrollToTop v-if="cauldrons.length" />
  </div>
</template>

<script>
import cauldronsListMixin from "@/mixins/cauldron/cauldronsList.js";
const ScrollToTop = () => import("@/components/ui/ScrollToTop");
const Search = () => import("@/components/ui/search/CauldronsSearch");
const DropdownSortBy = () => import("@/components/ui/dropdown/SortBy");
const BaseLoader = () => import("@/components/base/BaseLoader");
const EmptyState = () => import("@/components/markets/EmptyState");
const CauldronItem = () => import("@/components/markets/CauldronItem");
const CheckBox = () => import("@/components/ui/CheckBox");

export default {
  mixins: [cauldronsListMixin],
  data() {
    return {
      isShowDeprecated: false,
      cauldrons: [],
      cauldronsLoading: true,
      activeSortValue: "MIMsLeftToBorrow",
      sortOrder: false,
      searchValue: "",
      updateInterval: null,
      sortList: [
        { title: "Title", name: "name" },
        { title: "TVL", name: "totalMim" },
        { title: "MIMs Left", name: "MIMsLeftToBorrow" },
        { title: "Interest", name: "interest" },
        { title: "Fee", name: "fee" },
      ],
      tableHeaders: [
        "CHAIN",
        "COLLATERAL",
        "TOTAL MIM BORROWED",
        "TVL",
        "MIMS LEFT TO BORROW",
        "INTEREST",
      ],
    };
  },

  computed: {
    isEmptyState() {
      return !this.cauldrons.length && !this.cauldronsLoading;
    },

    cauldronsIsLoaded() {
      return !this.cauldrons.length && this.cauldronsLoading;
    },

    activeSortData() {
      return (
        this.sortList.find(({ name }) => this.activeSortValue === name) || null
      );
    },

    filteredCouldrons() {
      return this.sortByDepreciate(
        this.sortCauldrons(this.searchByValue(this.cauldrons, this.searchValue))
      );
    },
  },

  methods: {
    changeDropdawnValue(value) {
      this.activeSortValue = value;
    },

    changeSortOrder(value) {
      this.sortOrder = value;
    },

    changeSerch(value) {
      this.searchValue = value;
    },

    searchByValue(cauldrons, value) {
      if (cauldrons) {
        return cauldrons.filter(
          ({ config }) =>
            config.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      }

      return cauldrons;
    },

    getCouldronValue(cauldron, { name }) {
      if (name === "name") return cauldron.config.name;
      if (name === "fee") return cauldron.config.liquidationFee;
      return +cauldron[name] || null;
    },

    sortCauldrons(cauldrons) {
      if (this.activeSortData !== null) {
        [...cauldrons].sort((cauldronA, cauldronB) => {
          const a = this.getCouldronValue(cauldronA, this.activeSortData);
          const b = this.getCouldronValue(cauldronB, this.activeSortData);
          const factor = this.sortOrder ? -1 : 1;
          if (this.activeSortValue === "name") return a < b ? -factor : factor;
          return a < b ? factor : -factor;
        });
      }

      return cauldrons;
    },

    sortByDepreciate(cauldrons = []) {
      if (!this.isShowDeprecated) {
        return cauldrons.filter((cauldron) => {
          if (cauldron?.config?.cauldronSettings)
            return !cauldron.config?.cauldronSettings?.isDepreciated;

          return cauldrons;
        });
      } else {
        return cauldrons.sort((a, b) => {
          if (a?.config?.cauldronSettings || b?.config?.cauldronSettings) {
            return (
              +a.config?.cauldronSettings?.isDepreciated -
              +b.config?.cauldronSettings?.isDepreciated
            );
          }

          return a;
        });
      }
    },

    toggleActiveMarkets() {
      this.isShowDeprecated = !this.isShowDeprecated;
    },

    async createCauldronsList() {
      this.cauldrons = await this.initCauldronsList();
      this.cauldronsLoading = false;

      this.updateInterval = setInterval(await this.initCauldronsList(), 60000);
    },
  },

  async created() {
    this.createCauldronsList();
  },

  beforeDestroy() {
    clearInterval(this.updateInterval);
  },

  components: {
    ScrollToTop,
    DropdownSortBy,
    Search,
    EmptyState,
    BaseLoader,
    CauldronItem,
    CheckBox,
  },
};
</script>

<style lang="scss" scoped>
.cauldrons-page {
  padding: 160px 0 100px;
  margin: 0 auto;
  width: 940px;
  max-width: calc(100% - 20px);
}

.title {
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 40px;
}

.loader-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
}

.tools {
  width: 100%;
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr;
  grid-gap: 10px;
  margin-bottom: 10px;
}

.toggle-markets {
  height: 50px;
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 20px;
  font-size: 16px;
  line-height: 24px;
  background: rgba(255, 255, 255, 0.06);
}

.cauldrons-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list-header {
  display: none;
  grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1fr 1fr 180px;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  font-size: 14px;
  border-radius: 30px;
  background-color: #2a2835;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
}

@media screen and (max-width: 1024px) {
  .tools {
    display: flex;
    flex-direction: column;
  }
  .toggle-markets {
    justify-content: center;
  }
}
</style>
