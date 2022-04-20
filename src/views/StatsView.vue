<template>
  <div class="stats-wrap">
    <div class="search-wrap">
      <img class="search-icon" src="@/assets/images/search.svg" alt="search" />
      <input
        v-model="search"
        type="text"
        placeholder="Search"
        class="search-input"
      />
    </div>
    <DropdownWrap class="dropdown">
      <template slot="btn">
        <button class="sort-btn open-btn">
          <span class="sort-title-wrap">
            <img
              class="sort-icon"
              src="@/assets/images/filter.svg"
              alt="filter"
            />
            <span>{{ selectedTitle || "Sorted by Title" }}</span>
          </span>
          <img
            class="arrow-icon"
            src="@/assets/images/arrow-down.svg"
            alt="filter"
          />
        </button>
      </template>
      <template slot="list">
        <button
          class="sort-btn sort-item"
          v-for="(title, i) in titlesList"
          :key="i"
          @click="select(title)"
        >
          {{ title }}
        </button>
      </template>
    </DropdownWrap>
    <div class="stats-list-wrap">
      <div
        class="stats-list-header"
        :class="{ 'stats-list-header-farm': isFarm }"
      >
        <div v-for="(title, i) in headers" :key="i">{{ title }}</div>
      </div>
      <StatsItem
        v-for="(network, i) in prepNetworks"
        :key="network.chainId"
        :name="network.name"
        :icon="network.icon"
        :degen="!isFarm && i === prepNetworks.length - 1"
        :isNew="!isFarm ? !i : i === 2"
        :isSelected="selectedNetworkId === network.chainId"
        :isFarm="isFarm"
        @select="selectedNetworkId = network.chainId"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

const DropdownWrap = () => import("@/components/ui/DropdownWrap");
const StatsItem = () => import("@/components/stats/StatsItem");

export default {
  name: "StatsView",
  components: { DropdownWrap, StatsItem },
  props: { isFarm: { type: Boolean, default: false } },
  data: () => ({
    titlesList: ["TVL", "Interest", "Interest", "Fee", "MIMs Left"],
    selectedTitle: null,
    search: "",

    selectedNetworkId: 1,
  }),
  methods: {
    select(name) {
      this.selectedTitle = name;
    },
  },
  computed: {
    ...mapGetters({ networks: "getAvailableNetworks" }),
    headers() {
      return this.isFarm
        ? ["Pool", "~Yield per $1000", "ROI Annually", "TVL"]
        : [
            "COMPONENT",
            "TOTAL MIM BORROWED",
            "MIMS LEFT TO BORROW",
            "INTEREST",
            "LIQUIDATION FEE",
          ];
    },
    prepNetworks() {
      return this.isFarm ? this.networks.slice(0, 3) : this.networks;
    },
  },
};
</script>

<style lang="scss" scoped>
.stats-wrap {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  padding: 0 16px 60px 16px;
}

.dropdown {
  &:focus-within {
    .open-btn {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}

.open-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
  padding: 0 17px 0 12px;
  width: 100%;

  .sort-icon {
    margin-right: 10px;
    width: 20px;
  }

  .arrow-icon {
    margin-left: 25px;
  }
}

.sort-btn {
  height: 50px;
  color: white;
  background-color: rgba(255, 255, 255, 0.06);
  cursor: pointer;
  border: none;
}

.sort-title-wrap {
  display: flex;
  align-items: center;
}

.sort-item {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(40px);

  &:last-child {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
  }
}

.search-wrap {
  display: grid;
  grid-template-columns: 30px auto;
  align-items: center;
  padding-left: 10px;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  height: 50px;

  .search-icon {
    width: 20px;
  }

  .search-input {
    background-color: transparent;
    border: none;
    outline: none;
    color: white;
    width: 100%;

    &::placeholder {
      color: white;
    }
  }
}

.stats-list-wrap {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  grid-column: 1;
  margin-top: 10px;
}

.stats-list-header {
  display: none;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 60px;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  font-size: 16px;
  border-radius: 30px;
  background-color: #2a2835;
  text-transform: uppercase;

  &-farm {
    grid-template-columns: 1fr 1fr 1fr 1fr 60px;
  }
}

@media (min-width: 1024px) {
  .stats-wrap {
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
    padding: 0 0 60px 0;
  }
  .stats-list-wrap {
    grid-column: 1 / 5;
    margin-top: 0;
  }
  .stats-list-header {
    display: grid;
  }
}
</style>
