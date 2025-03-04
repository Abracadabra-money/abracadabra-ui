<template>
  <div class="networks-wrap">
    <div class="networks">
      <div
        class="list"
        :style="{
          height: `${listMaxHeight}px`,
          gridTemplateColumns: `repeat(${items}, 1fr)`,
        }"
      >
        <NetworkChip
          v-for="network in activeNetworks"
          :key="network.chainId"
          :selected="network.chainId === chainId"
          :name="network.symbol"
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
import NetworkChip from "@/components/ui/NetworkChip.vue";
import { switchNetwork } from "@/helpers/chains/switchNetwork";

export default {
  name: "NetworksList",
  components: { NetworkChip },
  props: {
    items: { type: Number, default: 4 },
    activeList: { type: Array, default: () => [] },
  },
  data() {
    return {
      isListOpened: false,
      lineHeight: 50,
      linesGap: 16,
      loading: false,
    };
  },
  methods: {
    async changeNetwork(chainId) {
      this.loading = true;
      try {
        await switchNetwork(chainId);
      } catch (error) {
        console.log("Switch Network Error", error);
      } finally {
        this.loading = false;
      }
    },
  },
  computed: {
    ...mapGetters({
      availableNetworks: "getAvailableNetworks",
      chainId: "getChainId",
      account: "getAccount",
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
    activeNetworks() {
      return !this.activeList.length
        ? this.networks
        : this.networks.filter(({ chainId }) =>
            this.activeList.includes(chainId)
          );
    },
    activeChain() {
      return this.availableNetworks.find(
        ({ chainId }) => chainId === this.chainId
      );
    },
    listMaxHeight() {
      const lines = Math.ceil(this.activeNetworks.length / this.items);
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
