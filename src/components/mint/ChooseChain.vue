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
          v-for="(e, i) in items"
          :key="i"
          :selected="i === selectedNetwork"
          @click="selectedNetwork = i"
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
    <div class="inputs underline">
      <div>
        <div class="header-balance">
          <h2>Collateral assets</h2>
          <div class="balance">
            <div v-if="false">Balance: 2000.00</div>
          </div>
        </div>

        <ValueInput />
      </div>
      <div>
        <div class="header-balance">
          <h2>Collateral assets</h2>
          <div class="balance">
            <div>Balance: 2000.00</div>
          </div>
        </div>

        <ValueInput />
      </div>
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

export default {
  name: "ChooseChain",
  components: { NetworkChip, ValueInput },
  data: () => ({
    selectedNetwork: null,
    isListOpened: false,
    items: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    lineHeight: 50,
    linesGap: 16,
    itemsInLine: 4,
  }),
  computed: {
    listMaxHeight() {
      const lines = Math.ceil(this.items.length / 4);
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

.inputs {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-row-gap: 67px;
  padding-top: 27px;
  padding-bottom: 30px;
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
