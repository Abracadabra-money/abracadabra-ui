<template>
  <div class="choose">
    <h2>Choose Chain</h2>
    <div class="networks underline">
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
          :network="network"
        />
      </div>
      <button
        class="networks-arrow"
        :class="{ 'networks-arrow-pressed': isListOpened }"
        @click="isListOpened = !isListOpened"
      >
        <img
          class="networks-arrow-image"
          src="@/assets/images/arrow.svg"
          alt="arrow"
        />
      </button>
    </div>

    <div class="first-input underline">
      <div class="header-balance">
        <h2>Collateral assets</h2>
        <div class="balance">
          <div v-if="false">Balance: 2000.00</div>
        </div>
      </div>

      <ValueInput
        :values="networks"
        :tokenIndex="firstTokenIndex"
        v-model="firstTokenValue"
        :max="5"
        error="Some Error Text"
      />
    </div>
    <div class="second-input underline">
      <div class="header-balance">
        <h2>Collateral assets</h2>
        <div class="balance">
          <div>Balance: 2000.00</div>
        </div>
      </div>

      <ValueInput :values="[networks[4]]" />
    </div>

    <div class="ltv underline">
      <span>LTV</span>
      <span>45 %</span>
    </div>
  </div>
</template>

<script>
const NetworkChip = () => import("@/components/mint/NetworkChip");
const ValueInput = () => import("@/components/UIComponents/ValueInput");
/**/
import ethIcon from "@/assets/images/networks/ethereum-icon.svg";
import fantomIcon from "@/assets/images/networks/fantom-icon.svg";
import polygonIcon from "@/assets/images/networks/polygon-icon.svg";
import binanceIcon from "@/assets/images/networks/binance-icon.svg";
import avalancheIcon from "@/assets/images/networks/avalanche-icon.png";
import arbitrumIcon from "@/assets/images/networks/arbitrum-icon.svg";

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
  padding: 30px 30px 300px 30px;
  border-radius: 30px;
  background-color: $clrBg2;
}

.networks {
  position: relative;
  margin-top: 10px;
  padding-bottom: 30px;
}

.list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 16px;
  overflow: hidden;
  transition: height 0.2s ease-out;
}

.networks-arrow-pressed {
  transform: rotate(180deg);
}

.networks-arrow {
  position: absolute;
  right: 10px;
  top: -25px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: transform 0.2s;
}

.networks-arrow-image {
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

h2 {
  font-weight: 600;
  font-size: 18px;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-balance {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;

  .balance {
    font-size: 14px;
  }
}
.ltv {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
}
</style>
