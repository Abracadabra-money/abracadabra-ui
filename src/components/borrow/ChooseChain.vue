<template>
  <div class="choose">
    <h4>Choose Chain</h4>
    <div class="underline networks-wrap">
      <div class="networks">
        <div
          class="list"
          :style="{
            height: `${listMaxHeight}px`,
          }"
        >
          <NetworkChip
            v-for="(network, i) in networks"
            :key="i"
            :selected="i === selectedNetwork"
            @click="selectedNetwork = i"
            :name="network.name"
            :icon="network.icon"
          />
        </div>
      </div>
      <button
        class="networks-arrow-btn"
        :class="{ 'networks-arrow-btn-pressed': isListOpened }"
        @click="isListOpened = !isListOpened"
      >
        <img
          class="networks-arrow-btn-image"
          src="@/assets/images/arrow.svg"
          alt="arrow"
        />
      </button>
    </div>

    <div class="first-input underline">
      <div class="header-balance">
        <h4>Collateral assets</h4>
        <p v-if="false">Balance: 2000.00</p>
      </div>

      <ValueInput
        :icon="networks[0].icon"
        :name="networks[0].name"
        v-model="firstTokenValue"
        :max="5"
        error="Some Error Text"
        isChooseToken
      />
    </div>
    <div class="second-input underline">
      <div class="header-balance">
        <h4>Collateral assets</h4>
        <p>Balance: 2000.00</p>
      </div>

      <ValueInput :icon="networks[2].icon" :name="networks[2].name" />
    </div>

    <div class="ltv underline">
      <span>LTV</span>
      <span>45 %</span>
    </div>
  </div>
</template>

<script>
import ethIcon from "@/assets/images/networks/ethereum-icon.svg";
import fantomIcon from "@/assets/images/networks/fantom-icon.svg";
import polygonIcon from "@/assets/images/networks/polygon-icon.svg";
import binanceIcon from "@/assets/images/networks/binance-icon.svg";
import avalancheIcon from "@/assets/images/networks/avalanche-icon.png";
import arbitrumIcon from "@/assets/images/networks/arbitrum-icon.svg";

const NetworkChip = () => import("@/components/borrow/NetworkChip");
const ValueInput = () => import("@/components/UIComponents/ValueInput");

export default {
  name: "ChooseChain",
  components: { NetworkChip, ValueInput },
  data: () => ({
    selectedNetwork: null,
    isListOpened: false,
    firstTokenIndex: 0,
    firstTokenValue: null,
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
    lineHeight: 50,
    linesGap: 16,
    itemsInLine: 4,
  }),
  computed: {
    listMaxHeight() {
      const lines = Math.ceil(this.networks.length / 4);
      return this.isListOpened
        ? lines * this.lineHeight + (lines - 1) * this.linesGap
        : this.lineHeight;
    },
  },
};
</script>

<style lang="scss" scoped>
.choose {
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

.first-input {
  padding-top: 27px;
  padding-bottom: 24px;
}

.second-input {
  padding-top: 27px;
  padding-bottom: 14px;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ltv {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
  padding-bottom: 12px;
}

@media (min-width: 1024px) {
  .choose {
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
