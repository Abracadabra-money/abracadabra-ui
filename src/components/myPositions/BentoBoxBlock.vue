<template>
  <div class="bento-wrapper">
    <BentoBoxItem
      @withdraw="openPopup(false)"
      @chooseActiveChain="chooseActiveDegenChain"
      :balance="activeChainDegenConfig.mimInDegenBalance"
      :mimPrice="activeChainDegenConfig.mimPrice"
      :activeChains="activeChains.degen"
      :activeChain="activeDegenChain"
      :currentChain="chainId"
      v-if="activeChains.degen.length"
    />

    <BentoBoxItem
      @withdraw="openPopup(true)"
      @chooseActiveChain="chooseActiveBentoChain"
      :balance="activeChainBentoConfig.mimInBentoBalance"
      :mimPrice="activeChainBentoConfig.mimPrice"
      :activeChains="activeChains.bento"
      :activeChain="activeBentoChain"
      :currentChain="chainId"
      v-if="activeChains.bento.length"
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
import { formatUnits } from "viem";

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
      activeBentoChain: null,
      activeDegenChain: null,
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
      this.bentoBoxConfigs?.forEach((config) => {
        if (formatUnits(config.mimInBentoBalance || 0, 18) > 0.1)
          bento.push(config);
        if (formatUnits(config.mimInDegenBalance || 0, 18) > 0.1)
          degen.push(config);
      });

      bento = bento.sort((a, b) => b.mimInBentoBalance - a.mimInBentoBalance);
      degen = degen.sort((a, b) => b.mimInDegenBalance - a.mimInDegenBalance);

      return {
        bento: bento.map((config) => config.chainId),
        degen: degen.map((config) => config.chainId),
      };
    },

    currentChainBentoConfig() {
      return this.bentoBoxConfigs?.find(
        (config) => this.chainId == config.chainId
      );
    },

    activeChainBentoConfig() {
      return this.bentoBoxConfigs?.find(
        (config) => this.activeBentoChain == config.chainId
      );
    },

    activeChainDegenConfig() {
      return this.bentoBoxConfigs?.find(
        (config) => this.activeDegenChain == config.chainId
      );
    },

    isVisible() {
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

    activeChains(newValue) {
      this.activeBentoChain = newValue.bento[0];
      this.activeDegenChain = newValue.degen[0];
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
          return config;
        })
      );

      this.bentoUpdateInterval = setInterval(async () => {
        this.bentoBoxConfigs = await Promise.all(
          this.activeNetworks.map(async (chainId) => {
            const config = await createBentoBoxConfig(chainId, this.account);
            return config;
          })
        );
      }, 5000);
    },
  },

  async created() {
    await this.createMimBentoData();
  },

  beforeUnmount() {
    clearInterval(this.bentoBoxConfigs);
  },

  components: {
    BentoBoxItem,
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
