<template>
  <div class="bento-wrapper" v-if="isVisible">
    <BentoBoxItem
      @withdraw="openPopup(false)"
      @chooseActiveChain="chooseActiveDegenChain"
      :balance="currentChainBentoConfig.mimInDegenBalance"
      :mimPrice="currentChainBentoConfig.mimPrice"
      :activeChains="activeChains.degen"
      :activeChain="activeDegenChain"
    />

    <BentoBoxItem
      @withdraw="openPopup(true)"
      @chooseActiveChain="chooseActiveBentoChain"
      :balance="currentChainBentoConfig.mimInBentoBalance"
      :mimPrice="currentChainBentoConfig.mimPrice"
      :activeChains="activeChains.bento"
      :activeChain="activeBentoChain"
      :isBento="true"
    />

    <DegenBentoPopup
      v-if="popupData.opened"
      :infoObject="currentChainBentoConfig"
      :isBento="popupData.isBento"
      @close="popupData.opened = false"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import bentoBoxMixin from "@/mixins/mimBentoDeposit";
import BentoBoxItem from "@/components/myPositions/BentoBoxItem.vue";
import DegenBentoPopup from "@/components/popups/DegenBentoPopup.vue";
import LocalPopupWrap from "@/components/popups/LocalPopupWrap.vue";

import { createBentoBoxConfig } from "@/helpers/bentoBox/createBentoBoxConfig.ts";

const initialPopupData = {
  opened: false,
  isBento: null,
  isDeposit: null,
};

export default {
  mixins: [bentoBoxMixin],

  props: {
    activeNetworks: { type: Array },
  },

  data() {
    return {
      popupData: { ...initialPopupData },
      bentoUpdateInterval: null,
      bentoBoxConfigs: null,
      activeBentoChain: this.activeChains?.bento[0],
      activeDegenChain: this.activeChains?.degen[0],
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

    activeChains() {
      let bento = [];
      let degen = [];
      this.bentoBoxConfigs.forEach((config) => {
        if (true) bento.push(config.chainId);
        if (true) degen.push(config.chainId);
      });
      return { bento, degen };
    },

    currentChainBentoConfig() {
      return this.bentoBoxConfigs?.find(
        (config) => this.chainId == config.chainId
      );
    },

    isVisible() {
      return this.bentoBoxConfigs;
      return (
        (this.currentChainBentoConfig?.mimInBentoBalance ||
          this.currentChainBentoConfig?.mimInDegenBalance) &&
        this.account
      );
    },
  },

  watch: {
    async account() {
      await this.createMimBentoData();
    },
  },

  methods: {
    chooseActiveBentoChain(e) {
      this.activeBentoChain = e;
    },

    chooseActiveDegenChain(e) {
      this.activeDegenChain = e;
    },

    openPopup(isBento) {
      this.popupData = { opened: true, isBento };
    },

    closePopup() {
      this.popupData = { ...initialPopupData };
    },

    async createMimBentoData() {
      if (!this.account) return false;
      this.bentoBoxConfigs = await Promise.all(
        this.activeNetworks.map(async (chainId) => {
          const config = await createBentoBoxConfig(chainId, this.account);
          return { chainId, ...config };
        })
      );

      this.bentoUpdateInterval = setInterval(async () => {
        this.bentoBoxConfigs = await Promise.all(
          this.activeNetworks.map(async (chainId) => {
            const config = await createBentoBoxConfig(chainId, this.account);
            return { chainId, ...config };
          })
        );
      }, 5000);
    },
  },

  async created() {
    await this.createMimBentoData();
  },

  beforeUnmount() {
    clearInterval(this.bentoUpdateInterval);
  },

  components: {
    BentoBoxItem,
    LocalPopupWrap,
    DegenBentoPopup,
  },
};
</script>

<style lang="scss" scoped>
.bento-wrapper {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

@media screen and (max-width: 1300px) {
  .bento-wrapper {
    flex-direction: column;
  }
}
</style>
