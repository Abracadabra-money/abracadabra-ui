<template>
  <div class="my-position-view">
    <div class="choose-chain">
      <h4>Choose Chain</h4>

      <div class="underline">
        <NetworksList />
      </div>

      <div class="underline">
        <PositionType @changeType="changeType" />
      </div>

      <div class="my-position">
        <p class="my-position-title">Choose Position</p>
        <p class="my-position-type">Borrow</p>

        <div class="my-position-list">
          <MyPositionItem
            v-for="(position, inx) in myPositions"
            :key="inx"
            :item="position"
            :inx="inx"
            :activePosition="activePosition"
            @enterPosition="enterPosition"
          />
        </div>
      </div>
    </div>

    <div class="stable">
      <h1 class="title">Mint Stablecoins</h1>
      <div class="info-wrap underline">
        <StableInfo />
      </div>

      <div class="tabs-wrap underline">
        <Tabs @activeTab="changeTab" />
      </div>

      <div v-if="activeTab === 'repay'">
        <Repay />
      </div>
      <div v-if="activeTab === 'collateral'">
        <Collateral />
      </div>
      <div v-if="activeTab === 'deleverage'">
        <Deleverage />
      </div>
    </div>
  </div>
</template>

<script>
const NetworksList = () => import("@/components/ui/NetworksList");
const MyPositionItem = () =>
  import("@/components/myPosition/MyPositionItem.vue");

const StableInfo = () => import("@/components/borrow/StableInfo");
const PositionType = () => import("@/components/myPosition/PositionType");
const Tabs = () => import("@/components/myPosition/Tabs");
const Repay = () => import("@/components/myPosition/Repay");
const Collateral = () => import("@/components/myPosition/Collateral");
const Deleverage = () => import("@/components/myPosition/Deleverage");

import ethIcon from "@/assets/images/networks/ethereum-icon.svg";
import fantomIcon from "@/assets/images/networks/fantom-icon.svg";
import polygonIcon from "@/assets/images/networks/polygon-icon.svg";
import binanceIcon from "@/assets/images/networks/binance-icon.svg";
import avalancheIcon from "@/assets/images/networks/avalanche-icon.png";
import arbitrumIcon from "@/assets/images/networks/arbitrum-icon.svg";

export default {
  data: () => ({
    selectedNetwork: null,
    isListOpened: false,
    networks: [
      { name: "ERC-20", icon: ethIcon },
      {
        name: "Fantom",
        icon: fantomIcon,
      },
      {
        name: "BSC",
        icon: binanceIcon,
      },
      {
        name: "AVAX",
        icon: avalancheIcon,
      },
      {
        name: "AETH",
        icon: arbitrumIcon,
      },
      {
        name: "MATIC",
        icon: polygonIcon,
      },
    ],
    myPositions: [
      {
        icon: require("@/assets/images/myposition/ETH.svg"),
        name: "ETH",
        status: "Safe",
        collateral: "10",
        borrowed: "15,000",
        total: "32,504.49898",
      },
      {
        icon: require("@/assets/images/myposition/ETH.svg"),
        name: "ETH",
        status: "Medium",
        collateral: "10",
        borrowed: "15,000",
        total: "32,504.49898",
      },
      {
        icon: require("@/assets/images/myposition/ETH.svg"),
        name: "ETH",
        status: "High",
        collateral: "10",
        borrowed: "15,000",
        total: "32,504.49898",
      },
    ],
    lineHeight: 50,
    linesGap: 16,
    activeType: null,
    activeTab: "repay",
    activePosition: null,
  }),
  computed: {
    listMaxHeight() {
      const lines = Math.ceil(this.networks.length / 4);
      return this.isListOpened
        ? lines * this.lineHeight + (lines - 1) * this.linesGap
        : this.lineHeight;
    },
  },

  methods: {
    enterPosition(pos) {
      this.activePosition = pos;
      console.log("enterPosition", pos);
    },

    changeType(type) {
      console.log("changeType", type);
    },

    changeTab(name) {
      this.activeTab = name;
      console.log("changeTab", name);
    },
  },

  components: {
    NetworksList,
    MyPositionItem,
    StableInfo,
    PositionType,
    Tabs,
    Repay,
    Collateral,
    Deleverage,
  },
};
</script>

<style lang="scss" scoped>
.my-position-view {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  margin: 0 auto;
  width: 100%;
  padding-top: 160px;
}

.choose-chain {
  padding: 20px 16px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
}

.networks-wrap {
  position: relative;
}

.networks {
  position: relative;
  left: -16px;
  width: calc(100% + 32px);
  margin-top: 10px;
  padding-bottom: 30px;
  padding-left: 16px;
  padding-right: 16px;
  overflow-y: hidden;
  overflow-x: scroll;
}

.list {
  display: grid;
  grid-auto-flow: column;
  grid-gap: 16px;
  max-height: 50px;
  transition: height 0.2s ease-out;
  width: max-content;
}

.networks-arrow-btn-pressed {
  transform: rotate(180deg);
}

.networks-arrow-btn {
  position: absolute;
  right: 10px;
  top: -28px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: transform 0.2s;
  display: none;
}

.networks-arrow-btn-image {
  width: 11px;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.my-position-title {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  margin: 20px 0 10px;
}

.my-position-type {
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 20px;
}

// stable

.stable {
  padding: 30px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
}

.title {
  font-size: 24px;
  text-transform: uppercase;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 30px;
}

.info-wrap {
  padding-bottom: 30px;
}

.tabs-wrap {
  padding: 15px 0;
}

@media (min-width: 1024px) {
  .my-position-view {
    grid-template-columns: 550px 1fr;
    width: 1320px;
    max-width: 100%;
  }

  .choose-chain {
    padding: 30px;
  }

  .list {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-flow: row;
    overflow: hidden;
    max-height: none;
  }

  .networks-arrow-btn {
    display: block;
  }

  .networks {
    position: static;
    width: auto;
    overflow-x: hidden;
    padding-left: 0;
  }
}
</style>
