<template>
  <div :class="['burger', { active: mobileMenu }]" @click="toggleMobileMenu">
    <div class="line"></div>
  </div>

  <MobileMenu
    v-if="mobileMenu"
    :chainIcon="chainIcon"
    :unsupportedTooltip="unsupportedTooltip"
    @closePopup="closeMobilePopup"
    @openNetworksPopup="isOpenNetworkPopup = !isOpenNetworkPopup"
  />

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
      mobileMenu: false,
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

  watch: {
    mobileMenu() {
      if (this.mobileMenu) {
        document.documentElement.style.overflow = "hidden";
      } else {
        document.documentElement.style.overflow = "auto";
      }
    },
  },

  methods: {
    toggleMobileMenu() {
      this.mobileMenu = !this.mobileMenu;
    },

    closeMobilePopup() {
      this.mobileMenu = false;
    },
  },

  components: {
    NetworkPopup: defineAsyncComponent(
      () => import("@/components/popups/NetworkPopup.vue")
    ),
    MobileMenu: defineAsyncComponent(
      () => import("@/components/popups/MobileMenu.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.burger {
  display: none;
  align-items: center;
  height: 16px;
  position: relative;
  cursor: pointer;
}

.base-line {
  transition: all 0.25s;
  content: "";
  width: 20px;
  height: 2px;
  border-radius: 20px;
  background: #fff;
}

.line {
  @extend .base-line;

  &:before {
    @extend .base-line;
    position: absolute;
    top: 0;
  }

  &:after {
    @extend .base-line;
    position: absolute;
    bottom: 0;
  }
}

.active {
  .line {
    background-color: transparent;
    transition: all 0.25s;

    &:before {
      top: 45%;
      transform: rotate(45deg);
    }

    &:after {
      transform: rotate(-45deg);
      bottom: 45%;
    }
  }
}

@media (max-width: 1200px) {
  .burger {
    display: flex;
  }
}
</style>
