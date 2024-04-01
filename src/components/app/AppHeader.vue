<template>
  <header class="header">
    <router-link :to="{ name: 'Home' }" v-if="!mobileMenu">
      <img src="@/assets/images/logo.svg" class="main-logo" />
    </router-link>

    <nav class="nav">
      <div class="general-activities">
        <router-link class="header-link" :to="{ name: 'Cauldrons' }">
          Cauldrons
        </router-link>

        <HeaderStakeDropdown />

        <HeaderMoreDropdown />

        <router-link class="header-link" :to="{ name: 'MSR' }">
          MSR
        </router-link>

        <router-link class="header-link" :to="{ name: 'MimSwap' }">
          MIMSwap
        </router-link>

        <BlastButton />
      </div>

      <div class="account-activities">
        <router-link class="header-link" :to="{ name: 'MyPositions' }">
          <img src="@/assets/images/header/positions-header-icon.png" />
          My Positions
        </router-link>

        <div
          class="header-link networks-btn"
          @click.stop="openNetworkPopup"
          v-tooltip="unsupportedTooltip"
        >
          <img v-if="!!networkIcon" :src="networkIcon" />
        </div>
      </div>
    </nav>

    <div class="user-actions-wrap">
      <BellButton
        v-if="notifiCardId && notifiWalletBlockchain"
        :notifiCardId="notifiCardId"
        :notifiWalletBlockchain="notifiWalletBlockchain"
        :unreadNotificationCount="unreadNotificationCount"
        :isSignedUp="isSignedUp"
        :isOpenNotifiModal="isOpenNotifiModal"
        @toggleNotifiModal="toggleNotifiModal"
      />
      <NotifiSubscriptionCardModal
        :isOpenNotifiModal="isOpenNotifiModal"
        @toggleNotifiModal="toggleNotifiModal"
      />

      <ConnectButton class="connect-button" />
    </div>

    <MimTokenBlock />

    <div class="burger" @click="toggleMobileMenu">
      <div class="burger-line"></div>
    </div>

    <MobileMenu
      v-if="mobileMenu"
      :networkIcon="networkIcon"
      :unsupportedTooltip="unsupportedTooltip"
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
import { newFrontendClient } from "@notifi-network/notifi-frontend-client";

export default {
  data() {
    return {
      isDropdownTools: false,
      isDropdownStake: false,
      isDropdownOther: false,
      isOpenNetworkPopup: false,
      mobileMenu: false,

      isOpenNotifiModal: false,
      unreadNotificationCount: 0,
      unreadNotificationCountChecker: null,
      isSignedUp: false,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      networksArr: "getAvailableNetworks",
      notifiCardId: "getNotifiCardId",
      notifiWalletBlockchain: "getNotifiWalletBlockchain",
    }),

    networkIcon() {
      if (!this.chainId) return "";
      if (this.networksArr.length && this.chainId) {
        const chain = this.networksArr.find((chain) => {
          if (chain.chainId === this.chainId) return chain;
        });

        if (chain) return chain.networkIcon;
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
    async updateUnreadNotificationCount() {
      const configInput = {
        account: {
          publicKey: this.account,
        },
        tenantId: "abracadabra",
        walletBlockchain: this.notifiWalletBlockchain,
        env: "Production",
      };
      const frontendClient = newFrontendClient(configInput);
      await frontendClient.initialize();
      if (frontendClient.userState.status !== "authenticated") {
        this.isSignedUp = false;
        return;
      }
      this.isSignedUp = true;
      const { count } =
        await frontendClient.getUnreadNotificationHistoryCount();
      this.unreadNotificationCount = count;
    },

    toggleNotifiModal() {
      this.isOpenNotifiModal = !this.isOpenNotifiModal;
    },

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

    setTimeout(() => {
      // wait for indexedDB to be ready
      this.updateUnreadNotificationCount();
    }, 1000);
    this.unreadNotificationCountChecker = setInterval(
      () => {
        this.updateUnreadNotificationCount();
      },
      // a random number between 5 and 8 seconds
      Math.floor(Math.random() * (8000 - 5000 + 1) + 5000)
    );
  },

  beforeUnmount() {
    window.removeEventListener("popstate", this.hideAllDropdowns);
    clearInterval(this.unreadCountNotificationChecker);
  },

  components: {
    ConnectButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/ConnectButton.vue")
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
    HeaderMoreDropdown: defineAsyncComponent(() =>
      import("@/components/ui/dropdown/HeaderMoreDropdown.vue")
    ),
    HeaderStakeDropdown: defineAsyncComponent(() =>
      import("@/components/ui/dropdown/HeaderStakeDropdown.vue")
    ),
    NotifiSubscriptionCardModal: defineAsyncComponent(() =>
      import("@/components/notifi/NotifiSubscriptionCardModal.vue")
    ),
    BellButton: defineAsyncComponent(() =>
      import("@/components/notifi/BellButton.vue")
    ),
    BlastButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/BlastButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.main-logo {
  width: 42px;
  height: 42px;
  margin-right: 48px;
}

.header {
  position: absolute;
  top: 28px;
  left: 0;
  right: 0;
  max-width: 1310px;
  padding: 0 15px;
  margin: 0 auto;
  z-index: 101;
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
  gap: 25px;
}

.account-activities {
  gap: 16px;
  margin-right: 16px;
}

.connect-button {
  margin-right: 16px;
}

.header-link {
  display: flex;
  padding: 10px 6px;
  align-items: center;
  gap: 10px;
  height: 50px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  cursor: pointer;

  &.blast-link {
    height: 40px;
    background-color: #fcfc06;
    img {
      width: 77px;
      height: auto;
    }

    &:hover {
      background: #fcfc06;
      opacity: 0.9;
    }
  }
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
  width: 32px;
  height: 32px;
  border-radius: 50px;
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
  cursor: pointer;
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

.user-actions-wrap {
  display: flex;
  align-items: center;
}

@media (max-width: 1500px) {
  .header {
    padding: 0 15px;
  }
}

@media (max-width: 1110px) {
  .user-actions-wrap {
    margin-left: auto;
  }
  .header-link {
    display: none;
  }

  .nav {
    display: none;
  }

  .connect-button::v-deep(.btn-text) {
    display: none;
  }

  .burger {
    display: flex;
    margin-left: 20px;
  }
}

@media (max-width: 600px) {
  .nav {
    width: 0;
  }
  .main-logo {
    margin-right: 0;
  }
}
</style>
