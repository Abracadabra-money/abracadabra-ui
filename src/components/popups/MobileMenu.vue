<template>
  <div class="popup-wrap" :class="{ inner: isOpenInnerPopup }">
    <div class="popup">
      <div class="popup-link-wrap" @click="closePopup">
        <router-link class="popup-link" :to="{ name: 'Cauldrons' }"
          >Cauldrons</router-link
        >
      </div>
      <div class="popup-link-wrap" @click="closePopup">
        <router-link class="popup-link" :to="{ name: 'Borrow' }"
          >Borrow</router-link
        >
      </div>
      <div class="popup-link-wrap" @click="closePopup">
        <router-link class="popup-link" :to="{ name: 'Leverage' }"
          >Leverage</router-link
        >
      </div>

      <div class="popup-link-wrap" @click="closePopup">
        <router-link class="popup-link" :to="{ name: 'MyPositions' }"
          >Positions</router-link
        >
      </div>

      <button class="popup-link" @click.stop="openInnerPopup('stake')">
        Stake
      </button>
      <button class="popup-link" @click.stop="openInnerPopup('tools')">
        Tools
      </button>
      <button class="popup-link" @click.stop="openInnerPopup('networks')">
        <img src="@/assets/images/networks/ethereum-icon.svg" alt="" />
      </button>
      <div class="popup-link popup-connect">
        <ConnectButton />
      </div>
      <button v-if="account" class="popup-link" @click="$disconnectWallet">
        Disconnect
      </button>
      <button class="popup-link" @click.stop="openInnerPopup('other')">
        <img
          class="title"
          src="@/assets/images/social/points.svg"
          alt="Points"
        />
      </button>
    </div>

    <div class="stake-popup" v-if="showStake" @click="closeInnerPopup('stake')">
      <div class="tools">
        <div class="popup-link-wrap" @click="closePopup">
          <router-link class="popup-link" :to="{ name: 'StakeSpell' }"
            >s/mSpell</router-link
          >
        </div>

        <div class="popup-link-wrap" @click="closePopup">
          <router-link class="popup-link" :to="{ name: 'magicGLP' }"
            >magicGLP</router-link
          >
        </div>

        <div class="popup-link-wrap" @click="closePopup">
          <router-link class="popup-link" :to="{ name: 'magicAPE' }"
            >magicAPE</router-link
          >
        </div>
      </div>
    </div>
    <div class="tools-popup" v-if="showTools" @click="closeInnerPopup('tools')">
      <div class="tools">
        <div class="popup-link-wrap" @click="closePopup">
          <router-link class="popup-link" :to="{ name: 'MarketsFarm' }"
            >Farms</router-link
          >
        </div>

        <div class="popup-link-wrap" @click="closePopup">
          <router-link class="popup-link" :to="{ name: 'Beam' }"
            >Beam</router-link
          >
        </div>
        <div class="popup-link-wrap" @click="closePopup">
          <a
            class="popup-link"
            href="https://curve.fi/#/ethereum/pools/mim/swap"
            target="_blank"
            >Swap</a
          >
        </div>
        <div class="popup-link-wrap" @click="closePopup">
          <a
            class="popup-link"
            href="https://analytics.abracadabra.money/fee-statistics"
            target="_blank"
            >Analytics</a
          >
        </div>
      </div>
    </div>

    <div class="other-popup" v-if="showOther" @click="closeInnerPopup('other')">
      <div class="other">
        <div class="other-line">
          <a
            href="https://legacy.abracadabra.money"
            target="_blank"
            rel="noreferrer noopener"
            class="other-link"
            >V 1</a
          >
          <a
            href="https://forum.abracadabra.money/"
            target="_blank"
            rel="noreferrer noopener"
            class="other-link"
            >Forum</a
          >
          <div class="social">
            <a
              href="https://abracadabramoney.gitbook.io/abracadabra-money-wiki/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Docs
            /></a>

            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://github.com/Abracadabra-money"
            >
              <GitHub />
            </a>

            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://mirror.xyz/0x5744b051845B62D6f5B6Db095cc428bCbBBAc6F9"
            >
              <Mirror
            /></a>
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://twitter.com/MIM_Spell"
            >
              <Twitter />
            </a>

            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://discord.com/invite/mim"
            >
              <Discord />
            </a>

            <!-- <Discord /> -->

            <Lens :isMobile="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import ConnectButton from "@/components/ui/ConnectButton.vue";
import Docs from "@/components/icons/Docs.vue";
// const Medium from "@/components/icons/Medium");
import Twitter from "@/components/icons/Twitter.vue";
import Discord from "@/components/icons/Discord.vue";
import Lens from "@/components/icons/Lens.vue";
import Mirror from "@/components/icons/Mirror.vue";
import GitHub from "@/components/icons/GitHub.vue";
export default {
  data() {
    return {
      showStake: false,
      showTools: false,
      showOther: false,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount" }),
    isOpenInnerPopup() {
      return this.showTools || this.showOther;
    },
  },

  methods: {
    closePopup() {
      this.$emit("closePopup");
    },

    openInnerPopup(name) {
      if (name === "stake") this.showStake = true;

      if (name === "tools") this.showTools = true;

      if (name === "other") this.showOther = true;

      if (name === "networks") this.$emit("openNetworksPopup");

      return false;
    },

    closeInnerPopup(name) {
      if (name === "stake" && event.target.classList.contains("stake-popup")) {
        this.showStake = false;
      }

      if (name === "tools" && event.target.classList.contains("tools-popup")) {
        this.showTools = false;
      }

      if (name === "other" && event.target.classList.contains("other-popup")) {
        this.showOther = false;
      }

      return false;
    },
  },

  components: {
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
  justify-content: center;
  overflow-y: auto;
  padding: $headerHeight 10px 60px;
  background: #23212d;
}

.inner {
  z-index: 11;
}

.popup {
  display: flex;
  flex-direction: column;
  width: 95%;
}

.popup-link {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(40px);
  border-radius: 20px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  height: 50px;
  border: none;
  outline: transparent;
  margin-bottom: 10px;
  cursor: pointer;
}

.popup-connect {
  padding: 0;
}

.stake-popup,
.tools-popup,
.other-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 12;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.tools,
.other {
  background: #312f38;
  border-radius: 20px;
  padding: 40px 10px;
  width: 90%;

  .popup-link {
    background: #3f3e47;
  }

  .router-link-active {
    background: rgba(255, 255, 255, 0.2);
  }
}

.other {
  padding: 10px 5px;
  background: #313038;
}

.other-line {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.other-link {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.social {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 210px;
  margin: 0 auto;
}

.router-link-active {
  background: rgba(255, 255, 255, 0.2);
}
</style>
