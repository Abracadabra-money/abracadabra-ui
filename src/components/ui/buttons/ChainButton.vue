<template>
  <div
    class="chain-button"
    v-tooltip="unsupportedTooltip"
    @click.stop="isOpenNetworkPopup = !isOpenNetworkPopup"
  >
    <img class="chain-icon" v-if="!!chainIcon" :src="chainIcon" />
  </div>

  <NetworkPopup
    :activeChain="chainId"
    :networksArr="networksArr"
    :isOpen="isOpenNetworkPopup"
    @closePopup="isOpenNetworkPopup = false"
  />
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import { getChainConfig } from "@/helpers/chains/getChainsInfo";

export default {
  data() {
    return {
      isOpenNetworkPopup: false,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      networksArr: "getAvailableNetworks",
    }),

    chainIcon() {
      return getChainIcon(this.chainId);
    },

    isUnsupportedChain() {
      return !!getChainConfig(this.chainId);
    },

    unsupportedTooltip() {
      return !this.isUnsupportedChain
        ? "Your wallet's current network is unsupported."
        : "";
    },
  },

  components: {
    NetworkPopup: defineAsyncComponent(
      () => import("@/components/popups/NetworkPopup.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.chain-button {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 7px;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(20px);
  }
}

.chain-icon {
  width: 32px;
  height: 32px;
  border-radius: 50px;
}
</style>
