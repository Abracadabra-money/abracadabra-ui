<template>
  <header class="header">
    <router-link :to="{ name: 'Home' }" v-if="!mobileMenu">
      <img src="@/assets/images/header/abra-logo.png" class="main-logo" />
    </router-link>

    <nav class="nav">
      <div class="general-activities">
        <router-link class="header-link" :to="{ name: 'Cauldrons' }">
          Cauldrons
        </router-link>

        <div
          class="dropdown-tools header-link"
          :class="{ active: isDropdownStake }"
          @click="toggleDropdown('stake')"
          v-click-outside="closeDropdownStake"
        >
          <div class="dropdown-title">
            Stake
            <img
              class="arrow"
              src="@/assets/images/arrow-down.svg"
              alt="Arrow down"
            />
          </div>
          <div class="list" v-if="isDropdownStake">
            <router-link class="list-link" :to="{ name: 'StakeSpell' }"
              >Spell</router-link
            >
            <router-link class="list-link" :to="{ name: 'magicGLP' }"
              >magicGLP</router-link
            >
            <router-link class="list-link" :to="{ name: 'magicAPE' }"
              >magicAPE</router-link
            >
            <router-link class="list-link" :to="{ name: 'magicLVL' }"
              >magicLVL</router-link
            >
            <router-link class="list-link" :to="{ name: 'magicKLP' }"
              >magicKLP</router-link
            >
          </div>
        </div>

        <div
          class="dropdown-tools header-link"
          :class="{ active: isDropdownTools }"
          @click="toggleDropdown('tools')"
          v-click-outside="closeDropdownTools"
        >
          <div class="dropdown-title">
            Tools
            <img
              class="arrow"
              src="@/assets/images/arrow-down.svg"
              alt="Arrow down"
            />
          </div>

          <div class="list" v-if="isDropdownTools">
            <router-link class="list-link" :to="{ name: 'MarketsFarm' }"
              >Farms</router-link
            >
            <router-link class="list-link" :to="{ name: 'Beam' }"
              >Beam</router-link
            >
            <a
              href="https://curve.fi/#/ethereum/pools/mim/swap"
              class="list-link"
              target="_blank"
              >Swap</a
            >
            <a
              href="https://analytics.abracadabra.money/fee-statistics"
              class="list-link"
              target="_blank"
              >Analytics</a
            >
          </div>
        </div>
      </div>

      <!-- <router-link class="header-link" :to="{ name: 'Borrow' }"
        >Borrow</router-link
      >
      <router-link class="header-link" :to="{ name: 'Leverage' }"
        >Leverage</router-link
      > -->

      <div class="account-activities">
        <router-link class="header-link" :to="{ name: 'MyPositions' }"
          >Positions</router-link
        >

        <div
          class="header-link networks-btn"
          @click.stop="openNetworkPopup"
          v-tooltip="unsupportedTooltip"
        >
          <img v-if="!!networcIcon" :src="networcIcon" alt="" />
        </div>

        <div class="header-link header-connect">
          <ConnectButton />
        </div>
      </div>

      <!-- <div
        class="dropdown-other header-link"
        :class="{ active: isDropdownOther }"
        @click.stop="toggleDropdown('other')"
        v-click-outside="closeDropdownOther"
      >
        <img
          class="title"
          src="@/assets/images/social/points.svg"
          alt="Points"
        />
        <div class="list" v-if="isDropdownOther">
          <a
            href="https://legacy.abracadabra.money"
            target="_blank"
            rel="noreferrer noopener"
            class="list-link"
            >V 1</a
          >
          <a
            href="https://forum.abracadabra.money/"
            target="_blank"
            rel="noreferrer noopener"
            class="list-link"
            >Forum</a
          >
          <div class="list-row">
            <a
              href="https://abracadabramoney.gitbook.io/abracadabra-money-wiki/"
              target="_blank"
              rel="noreferrer noopener"
              class="list-link"
            >
              <Docs />
            </a>

            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://github.com/Abracadabra-money"
              class="list-link"
            >
              <GitHub />
            </a>
          </div>
          <div class="list-row">
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://twitter.com/MIM_Spell"
              class="list-link"
            >
              <Twitter />
            </a>

            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://mirror.xyz/0x5744b051845B62D6f5B6Db095cc428bCbBBAc6F9"
              class="list-link"
            >
              <Mirror />
            </a>
          </div>
          <div class="list-row">
            <Lens />
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://discord.com/invite/mim"
              class="list-link"
            >
              <Discord />
            </a>
          </div>
        </div>
      </div> -->
    </nav>

    <MimTokenBlock />

    <div
      class="burger"
      :class="{ 'burger-active': mobileMenu }"
      @click="toggleMobileMenu"
    >
      <div class="burger-line"></div>
    </div>

    <MobileMenu
      v-if="mobileMenu"
      @closePopup="closeMobilePopup"
      @openNetworksPopup="isOpenNetworkPopup = !isOpenNetworkPopup"
    />

    <NetworkPopup
      :isOpen="isOpenNetworkPopup"
      @closePopup="closeNetworkPopup"
      :networksArr="networksArr"
      :activeChain="chainId"
    />
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
export default {
  data() {
    return {
      isDropdownTools: false,
      isDropdownStake: false,
      isDropdownOther: false,
      isOpenNetworkPopup: false,
      mobileMenu: false,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      networksArr: "getAvailableNetworks",
    }),

    networcIcon() {
      if (!this.chainId) return "";
      if (this.networksArr.length && this.chainId) {
        const chain = this.networksArr.find((chain) => {
          if (chain.chainId === this.chainId) return chain;
        });

        if (chain) return chain.icon;
      }

      return useImage("assets/images/networks/unsupportedChain.svg");
    },

    isUnsupportedChain() {
      const chain = this.networksArr.find((chain) => {
        if (chain.chainId === this.chainId) return chain;
      });

      return !!chain;
    },

    unsupportedTooltip() {
      if (!this.isUnsupportedChain)
        return "Your wallet's current network is unsupported.";
      return "";
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
    toHome() {
      this.$router.push({ name: "Home" });
    },

    toggleDropdown(nameDropdown) {
      if (nameDropdown === "stake") {
        this.isDropdownStake = !this.isDropdownStake;
      }

      if (nameDropdown === "tools") {
        this.isDropdownTools = !this.isDropdownTools;
      }

      if (nameDropdown === "other") {
        this.isDropdownOther = !this.isDropdownOther;
      }
    },

    closeDropdownTools() {
      this.isDropdownTools = false;
    },

    closeDropdownStake() {
      this.isDropdownStake = false;
    },

    closeDropdownOther() {
      this.isDropdownOther = false;
    },

    openNetworkPopup() {
      this.isOpenNetworkPopup = !this.isOpenNetworkPopup;
    },

    closeNetworkPopup() {
      this.isOpenNetworkPopup = false;
    },

    toggleMobileMenu() {
      this.mobileMenu = !this.mobileMenu;
    },

    closeMobilePopup() {
      this.mobileMenu = false;
    },

    hideAllDropdowns() {
      this.isDropdownTools = false;
      this.isDropdownStake = false;
      this.isDropdownOther = false;
    },
  },

  mounted() {
    window.addEventListener("popstate", this.hideAllDropdowns, false);
  },

  beforeUnmount() {
    window.removeEventListener("popstate", this.hideAllDropdowns);
  },

  components: {
    ConnectButton: defineAsyncComponent(() =>
      import("@/components/ui/ConnectButton.vue")
    ),
    MimTokenBlock: defineAsyncComponent(() =>
      import("@/components/ui/MimTokenBlock.vue")
    ),
    NetworkPopup: defineAsyncComponent(() =>
      import("@/components/popups/NetworkPopup.vue")
    ),
    MobileMenu: defineAsyncComponent(() =>
      import("@/components/popups/MobileMenu.vue")
    ),
    Docs: defineAsyncComponent(() => import("@/components/icons/Docs.vue")),
    Twitter: defineAsyncComponent(() =>
      import("@/components/icons/Twitter.vue")
    ),
    Discord: defineAsyncComponent(() =>
      import("@/components/icons/Discord.vue")
    ),
    Lens: defineAsyncComponent(() => import("@/components/icons/Lens.vue")),
    Mirror: defineAsyncComponent(() => import("@/components/icons/Mirror.vue")),
    GitHub: defineAsyncComponent(() => import("@/components/icons/GitHub.vue")),
  },
};
</script>

<style lang="scss" scoped>
.main-logo {
  width: 42px;
  height: 42px;
  margin-right: 40px;
}

.header {
  position: absolute;
  top: 28px;
  left: 0;
  right: 0;
  max-width: 1440px;
  margin: 0 auto;
  z-index: 10;
  display: flex;
  align-items: center;
}

.nav {
  display: flex;
  flex: 1;
  justify-content: space-between;
}

.general-activities,
.account-activities {
  display: flex;
  align-items: center;
}

.general-activities {
  gap: 40px;
}

.account-activities {
  gap: 16px;
  margin-right: 16px;
}

.header-link {
  display: flex;
  padding: 12px 20px;
  align-items: flex-start;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

.header-link:hover {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
}

.networks-btn {
  padding: 0;
  height: 100%;
  min-width: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.networks-btn img {
  max-width: 25px;
  max-height: 25px;
  width: 100%;
  height: 100%;
}

.header-connect {
  width: 146px;
  padding: 0;
}

.dropdown-tools {
  position: relative;

  .dropdown-title {
    display: flex;
    align-items: center;
  }
}

.dropdown-other {
  display: flex;
  justify-content: center;
  width: 90px;
  position: relative;

  .dropdown-title {
    max-width: 20px;
  }
}

.arrow {
  margin-left: 5px;
  transition: all 300ms ease-in-out;
}

.list {
  position: absolute;
  top: calc(100% + 12.5px);

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 233px;
  padding: 16px;
  gap: 16px;
  border-radius: 12px;
  border: 1px solid #2d4a96;
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.list-link {
  padding: 13px 0;
  display: flex;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  line-height: 24px;
}

.list-link:hover {
  color: #76c3f5;
}

.list-row {
  display: flex;
  justify-content: space-evenly;

  .list-link {
    border-bottom: none;
  }

  img {
    max-width: 24px;
  }
}

.active {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
}

.active .arrow {
  transform: rotate(180deg);
}

.line {
  transition: all 0.25s;
  content: "";
  width: 20px;
  height: 2px;
  border-radius: 20px;
  background: #fff;
}

.burger {
  display: none;
  align-items: center;
  height: 16px;
  position: relative;
}

.burger-line {
  @extend .line;
  &:before {
    @extend .line;
    position: absolute;
    top: 0;
  }
  &:after {
    @extend .line;
    position: absolute;
    bottom: 0;
  }
}

.burger-active {
  .burger-line {
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

@media (max-width: 1500px) {
  .header {
    padding: 0 15px;
  }
}

@media (max-width: 1110px) {
  .header-link {
    display: none;
  }

  .nav {
    padding: 0 15px;
    align-items: center;
  }

  .burger {
    display: flex;
    z-index: 11;
  }
}
</style>
