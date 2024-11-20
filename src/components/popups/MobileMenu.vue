<template>
  <TransitionWrapper>
    <div class="popup-wrap" @click.self="closePopup">
      <TransitionWrapper animation-type="fadeLeft" appear v-if="!showStake">
        <div class="popup">
          <div class="popup-header">
            <ConnectButton @click="closePopup" />

            <img
              class="chain-icon"
              v-if="!!chainIcon"
              :src="chainIcon"
              v-tooltip="unsupportedTooltip"
              @click.stop="$emit('openNetworksPopup')"
            />
          </div>

          <div class="primary-block">
            <SwapMobileButton
              :isClassicHeader="isClassicHeader"
              @change-view="isClassicHeader = !isClassicHeader"
            />
          </div>

          <component
            :is="isClassicHeader ? 'MobileHeaderNav' : 'SwapMobileHeaderNav'"
            @close-popup="closePopup"
            @open-inner-popup="openInnerPopup"
          />

          <div class="social-wrap">
            <Lens width="20" height="20" />
            <GitHub />
            <Discord />
            <Twitter />
            <Mirror />
            <V2 />
          </div>
        </div>
      </TransitionWrapper>

      <TransitionWrapper appear v-else>
        <HeaderStakeMobilePopup
          @closePopup="closeInnerPopup"
          @closeMobileMenu="closePopup"
        />
      </TransitionWrapper>
    </div>
  </TransitionWrapper>
</template>

<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";

export default {
  props: {
    chainIcon: { type: String },
    unsupportedTooltip: { type: String },
  },

  data() {
    return {
      showStake: false,
      isClassicHeader: true,
      alternativeHeader: ["MimSwap", "Pools", "Pool", "PotionPoints"],
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

  created() {
    this.isClassicHeader = !this.alternativeHeader.includes(this.$route.name);
  },

  components: {
    ConnectButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/ConnectButton.vue")
    ),
    SwapMobileButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/SwapMobileButton.vue")
    ),
    MobileHeaderNav: defineAsyncComponent(() =>
      import("@/components/ui/navigation/MobileHeaderNav.vue")
    ),
    SwapMobileHeaderNav: defineAsyncComponent(() =>
      import("@/components/ui/navigation/SwapMobileHeaderNav.vue")
    ),
    Lens: defineAsyncComponent(() => import("@/components/ui/icons/Lens.vue")),
    GitHub: defineAsyncComponent(() =>
      import("@/components/ui/icons/GitHub.vue")
    ),
    Discord: defineAsyncComponent(() =>
      import("@/components/ui/icons/Discord.vue")
    ),
    Twitter: defineAsyncComponent(() =>
      import("@/components/ui/icons/Twitter.vue")
    ),
    Mirror: defineAsyncComponent(() =>
      import("@/components/ui/icons/Mirror.vue")
    ),
    V2: defineAsyncComponent(() => import("@/components/ui/icons/V2.vue")),
    HeaderStakeMobilePopup: defineAsyncComponent(() =>
      import("@/components/popups/HeaderStakeMobilePopup.vue")
    ),
    TransitionWrapper: defineAsyncComponent(() =>
      import("@/components/ui/TransitionWrapper.vue")
    ),
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

.popup {
  gap: 30px;
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

.chain-icon {
  height: 32px;
  width: 32px;
  border-radius: 50px;
  cursor: pointer;
}

.primary-block {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.social-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding-top: 8px;
  margin: auto auto 0 auto;
  border-top: 1px solid #7089cc44;
}
</style>
