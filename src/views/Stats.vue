<template>
  <div class="stats">
    <h2 class="title">Available MIM Markets</h2>
    <div class="stats-wrap">
      <div class="search-wrap">
        <img
          class="search-icon"
          src="@/assets/images/search.svg"
          alt="search"
        />
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
            <div class="sort-title-wrap">
              <img
                class="sort-icon"
                src="@/assets/images/filter.svg"
                alt="filter"
              />
              <span>{{ selectedTitle || "Sorted by Title" }}</span>
            </div>
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
        <div class="stats-item stats-list-header">
          <div v-for="(title, i) in headers" :key="i">{{ title }}</div>
        </div>
        <div
          v-for="(network, i) in networks"
          class="stats-item"
          :key="network.chain"
        >
          <div class="network-data">
            <img class="network-image" :src="network.icon" alt="network" />
            <span>{{ network.name }}</span>
          </div>
          <div>14%</div>
          <div>14%</div>
          <div>14%</div>
          <div>14%</div>
          <div class="degenbox">
            <img
              v-if="i === networks.length - 1"
              class="degenbox-img"
              src="@/assets/images/degenbox.svg"
              alt="DegenBox"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

const DropdownWrap = () => import("@/components/ui/DropdownWrap");

export default {
  components: { DropdownWrap },
  data: () => ({
    titlesList: ["TVL", "Interest", "Interest", "Fee", "MIMs Left"],
    selectedTitle: null,
    search: "",
    headers: [
      "COMPONENT",
      "TOTAL MIM BORROWED",
      "MIMS LEFT TO BORROW",
      "INTEREST",
      "LIQUIDATION FEE",
    ],
  }),
  methods: {
    select(name) {
      this.selectedTitle = name;
    },
  },
  computed: {
    ...mapGetters({ networks: "getAvailableNetworks" }),
  },
};
</script>

<style lang="scss" scoped>
.stats {
  padding-top: 160px;
  margin: 0 auto;
  width: 940px;
  max-width: 100%;
}
.stats-wrap {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  margin-top: 40px;
  padding-bottom: 60px;
}

.title {
  text-align: center;
  text-transform: uppercase;
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
  grid-column: 1 / 5;
}

.stats-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 60px;
  align-items: center;
  padding: 0 20px;
  line-height: 24px;
  background: #2a2835;
  border-radius: 20px;
  height: 100px;
}

.stats-list-header {
  height: 60px;
}

.degenbox {
  display: flex;
  justify-content: center;
}

.degenbox-img {
  width: 40px;
}

.network-data {
  display: flex;
  justify-content: flex-start;
}

.network-image {
  height: 28px;
  margin-right: 8px;
}
</style>
