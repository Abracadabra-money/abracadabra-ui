<template>
  <div class="networks-wrap">
    <div class="networks">
      <div
        class="list"
        :style="{
          height: `${listMaxHeight}px`,
        }"
      >
        <NetworkChip
          v-for="network in networks"
          :key="network.chainId"
          :selected="network.chainId === chainId"
          :name="network.name"
          :icon="network.icon"
          :disabled="loading"
          @click="changeNetwork(network.chainId)"
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
</template>

<script>
import { mapGetters } from "vuex";

import chainSwitch from "@/mixins/chainSwitch";
const NetworkChip = () => import("@/components/borrow/NetworkChip");

export default {
  name: "NetworksList",
  components: { NetworkChip },
  mixins: [chainSwitch],
  data: () => ({
    isListOpened: false,
    lineHeight: 50,
    linesGap: 16,
    itemsInLine: 4,
    loading: false,
  }),
  methods: {
    async changeNetwork(chainId) {
      this.loading = true;
      try {
        await this.switchNetwork(chainId);
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
  },
  computed: {
    ...mapGetters({
      availableNetworks: "getAvailableNetworks",
      chainId: "getChainId",
    }),
    networks() {
      return this.activeChain
        ? [
            this.activeChain,
            ...this.availableNetworks.filter(
              ({ chainId }) => chainId !== this.chainId
            ),
          ]
        : this.availableNetworks;
    },
    activeChain() {
      return this.availableNetworks.find(
        ({ chainId }) => chainId === this.chainId
      );
    },
    listMaxHeight() {
      const lines = Math.ceil(this.networks.length / 4);
      return this.isListOpened
        ? lines * this.lineHeight + (lines - 1) * this.linesGap
        : this.lineHeight;
    },
  },
};
</script>

<style scoped lang="scss">
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

@media (min-width: 1024px) {
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
