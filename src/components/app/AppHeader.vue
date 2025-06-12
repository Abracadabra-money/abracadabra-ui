<template>
  <header class="header">
    <router-link
      class="logo-wrap"
      :to="{ name: isClassicHeader ? 'Home' : 'MimSwap' }"
    >
      <component
        :is="isClassicHeader ? 'MainLogoIcon' : 'SwapLogoIcon'"
        :width="isClassicHeader ? 42 : 52"
        :height="42"
      />
    </router-link>

    <nav class="nav">
      <component :is="isClassicHeader ? 'HeaderNav' : 'SwapHeaderNav'" />

      <div class="line"></div>

      <SwapLink :isClassicHeader="isClassicHeader" />
    </nav>

    <div class="user-actions">
      <ChainButton />

      <BellButton
        v-if="notifiCardId && notifiWalletBlockchain && account"
        :notifiCardId="notifiCardId"
        :notifiWalletBlockchain="notifiWalletBlockchain"
        :unreadNotificationCount="unreadNotificationCount"
        :isSignedUp="isSignedUp"
        :isOpenNotifiModal="isOpenNotifiModal"
        @toggleNotifiModal="toggleNotifiModal"
      />

      <ConnectionDropdown />

      <MimTokenBlock />
    </div>

    <BurgerButton />
  </header>

  <NotifiSubscriptionCardModal
    :isOpenNotifiModal="isOpenNotifiModal"
    @toggleNotifiModal="toggleNotifiModal"
  />
</template>

<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { instantiateFrontendClient } from "@notifi-network/notifi-frontend-client";

export default {
  data() {
    return {
      isOpenNotifiModal: false,
      unreadNotificationCount: 0,
      unreadNotificationCountChecker: null,
      isSignedUp: false,
      alternativeHeader: [
        "MimSwap",
        "Pools",
        "PoolFarms",
        "Pool",
        "PoolFarm",
        "PotionPoints",
      ],
      exception: ["Blast", "PointsDashboard"],
      isClassicHeader: true,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      notifiCardId: "getNotifiCardId",
      notifiWalletBlockchain: "getNotifiWalletBlockchain",
    }),
  },

  watch: {
    $route() {
      if (!this.exception.includes(this.$route.name)) {
        this.checkTypeHeader();
      }
    },
  },

  methods: {
    async updateUnreadNotificationCount() {
      const frontendClient = instantiateFrontendClient(
        "4zfoga0vjqh90ahg8apd", // TODO: Replace with "abracadabra" tenant ID
        {
          walletBlockchain: this.notifiWalletBlockchain,
          walletPublicKey: this.account,
        },
      );
      await frontendClient.initialize();
      if (frontendClient.userState.status !== "authenticated") {
        this.isSignedUp = false;
        return;
      }
      this.isSignedUp = true;
      const { count } =
        await frontendClient.getUnreadNotificationHistoryCount(this.notifiCardId);        
      this.unreadNotificationCount = count;
    },

    toggleNotifiModal() {
      this.isOpenNotifiModal = !this.isOpenNotifiModal;
    },

    checkTypeHeader() {
      this.isClassicHeader = !this.alternativeHeader.includes(this.$route.name);
    },
  },

  mounted() {
    this.checkTypeHeader();

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
    clearInterval(this.unreadNotificationCountChecker);
  },

  components: {
    MainLogoIcon: defineAsyncComponent(() =>
      import("@/components/ui/icons/MainLogoIcon.vue")
    ),
    SwapLogoIcon: defineAsyncComponent(() =>
      import("@/components/ui/icons/SwapLogoIcon.vue")
    ),
    HeaderNav: defineAsyncComponent(() =>
      import("@/components/ui/navigation/HeaderNav.vue")
    ),
    SwapHeaderNav: defineAsyncComponent(() =>
      import("@/components/ui/navigation/SwapHeaderNav.vue")
    ),
    SwapLink: defineAsyncComponent(() =>
      import("@/components/ui/links/SwapLink.vue")
    ),
    ChainButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/ChainButton.vue")
    ),
    BellButton: defineAsyncComponent(() =>
      import("@/components/notifi/BellButton.vue")
    ),
    ConnectionDropdown: defineAsyncComponent(() =>
      import("@/components/ui/dropdown/ConnectionDropdown.vue")
    ),
    MimTokenBlock: defineAsyncComponent(() =>
      import("@/components/ui/MimTokenBlock.vue")
    ),
    BurgerButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/BurgerButton.vue")
    ),
    NotifiSubscriptionCardModal: defineAsyncComponent(() =>
      import("@/components/notifi/NotifiSubscriptionCardModal.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  top: 28px;
  left: 0;
  right: 0;
  max-width: 1310px;
  padding: 0 15px;
  margin: 0 auto;
  z-index: 101;
  gap: 12px;
  display: flex;
  align-items: center;
}

.logo-wrap {
  margin-right: 14px;
}

.nav {
  flex: 1;
  gap: 12px;
  display: flex;
  align-items: center;
}

.line {
  height: 46px;
  width: 1px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 46.5%,
    rgba(255, 255, 255, 0) 100%
  );
}

.user-actions {
  gap: 16px;
  display: flex;
  align-items: center;
  z-index: 0;
}

@media (max-width: 1200px) {
  .nav {
    display: none;
  }

  .user-actions {
    gap: 12px;
    margin-left: auto;

    &::v-deep(.chain-button) {
      display: none;
    }
  }

  .connect-button::v-deep(.btn-text) {
    display: none;
  }
}

@media (max-width: 600px) {
  .logo-wrap {
    margin-right: 0;
  }

  .nav {
    width: 0;
  }
}
</style>
