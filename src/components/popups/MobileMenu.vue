<template>
  <div class="popup-wrap" @click.self="closePopup">
    <div class="popup" v-if="!showStake">
      <div class="popup-header">
        <ConnectButton />

        <img
          class="network-icon"
          v-if="!!networkIcon"
          :src="networkIcon"
          @click.stop="$emit('openNetworksPopup')"
          v-tooltip="unsupportedTooltip"
        />
      </div>

      <ul class="popup-links">
        <li class="popup-link-wrap" @click="closePopup">
          <router-link
            class="popup-link my-positions"
            :to="{ name: 'MyPositions' }"
          >
            <img src="@/assets/images/header/positions-header-icon.png" />
            <span class="link-text"> My Positions </span>
          </router-link>
        </li>

        <li class="popup-link-wrap" @click="closePopup">
          <router-link class="popup-link" :to="{ name: 'Cauldrons' }">
            <img src="@/assets/images/header/dropdown/more/bars-icon.svg" />
            <span class="link-text"> Cauldrons </span>
          </router-link>
        </li>

        <li class="popup-link-wrap" @click.stop="openInnerPopup()">
          <button class="popup-link">
            <img src="@/assets/images/header/dropdown/more/bars-icon.svg" />
            <span class="link-text"> Stake </span>
            <img class="arrow" src="@/assets/images/arrow.svg" />
          </button>
        </li>

        <li class="popup-link-wrap" @click="closePopup">
          <router-link class="popup-link" :to="{ name: 'MarketsFarm' }">
            <img src="@/assets/images/header/dropdown/more/bars-icon.svg" />
            <span class="link-text"> Farms </span>
          </router-link>
        </li>

        <li class="popup-link-wrap" @click="closePopup">
          <router-link class="popup-link" :to="{ name: 'Beam' }">
            <img src="@/assets/images/header/dropdown/more/bars-icon.svg" />
            <span class="link-text"> Beam </span>
          </router-link>
        </li>

        <li class="popup-link-wrap" @click="closePopup">
          <a
            class="popup-link"
            href="https://curve.fi/#/ethereum/pools/mim/swap"
            target="_blank"
          >
            <img src="@/assets/images/header/dropdown/more/swap-icon.svg" />
            <span class="link-text"> Swap </span>
          </a>
        </li>

        <li class="popup-link-wrap" @click="closePopup">
          <a
            class="popup-link"
            href="https://analytics.abracadabra.money/fee-statistics"
            target="_blank"
          >
            <img src="@/assets/images/header/dropdown/more/bars-icon.svg" />
            <span class="link-text"> Analytics </span>
          </a>
        </li>

        <li class="popup-link-wrap" @click="closePopup">
          <a
            class="popup-link"
            href="https://docs.abracadabra.money/learn/"
            target="_blank"
          >
            <img src="@/assets/images/header/dropdown/more/docs-icon.svg" />
            <span class="link-text"> Documentation </span>
          </a>
        </li>
      </ul>

      <div class="social-media">
        <GitHub />
        <Discord />
        <Twitter />
        <Mirror />
      </div>
    </div>

    <HeaderStakeMobilePopup
      v-if="showStake"
      @closePopup="closeInnerPopup"
      @closeMobileMenu="closePopup"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import ConnectButton from "@/components/ui/buttons/ConnectButton.vue";
import Docs from "@/components/icons/Docs.vue";
// const Medium from "@/components/icons/Medium");
import Twitter from "@/components/icons/Twitter.vue";
import Discord from "@/components/icons/Discord.vue";
import Lens from "@/components/icons/Lens.vue";
import Mirror from "@/components/icons/Mirror.vue";
import GitHub from "@/components/icons/GitHub.vue";
import HeaderStakeMobilePopup from "@/components/popups/HeaderStakeMobilePopup.vue";

export default {
  props: {
    networkIcon: { type: String },
    unsupportedTooltip: { type: String },
  },

  data() {
    return {
      showStake: false,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount" }),
  },

  methods: {
    closePopup() {
      this.$emit("closePopup");
    },

    openInnerPopup() {
      this.showStake = true;
    },

    closeInnerPopup() {
      this.showStake = false;
    },
  },

  components: {
    HeaderStakeMobilePopup,
    ConnectButton,
    Docs,
    Mirror,
    Twitter,
    Discord,
    Lens,
    GitHub,
  },
};
</script>

<style lang="scss" scoped>
.popup-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
  display: flex;
  justify-content: start;
  overflow-y: auto;
  backdrop-filter: blur(20px);
}

.inner {
  z-index: 11;
}

.popup {
  display: flex;
  flex-direction: column;
  width: 266px;
  height: 100%;
  padding: 32px 24px;
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(20px);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #7089cc44;
}

.network-icon {
  height: 32px;
  width: 32px;
  cursor: pointer;
}

.popup-links {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 28px;
  list-style: none;
}

.popup-link-wrap {
  width: 100%;
}

.popup-link {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 6px;
  background: transparent;
  border-radius: 8px;
  color: #fff;
  border: none;
  outline: transparent;
  cursor: pointer;
  transition: all 0.5s;
}

.popup-link:hover {
  opacity: 0.7;
}

.my-positions {
  margin: 40px 0 12px 0;
}

.popup-connect {
  padding: 0;
}

.social-media {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding-top: 8px;
  margin: auto auto 0 auto;
  border-top: 1px solid #7089cc44;
}

.router-link-active {
  opacity: 0.5;
}

.arrow {
  height: 8px;
  width: 8px;
  transform: rotate(-90deg);
  margin-left: auto;
}
</style>
