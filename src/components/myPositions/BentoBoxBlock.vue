<template>
  <div class="bento-wrapper" v-if="isVisible">
    <BentoBoxItem
      @withdraw="openPopup(false)"
      :balance="currentChainBentoConfig.mimInDegenBalance"
      :mimPrice="currentChainBentoConfig.mimPrice"
      :activeChains="activeChains.degen"
    />

    <BentoBoxItem
      @withdraw="openPopup(true)"
      :balance="currentChainBentoConfig.mimInBentoBalance"
      :mimPrice="currentChainBentoConfig.mimPrice"
      :activeChains="activeChains.bento"
      :isBento="true"
    />

    <DegenBentoPopup
      v-if="popupData.opened"
      :infoObject="currentChainBentoConfig"
      :isBento="popupData.isBento"
      :isDeposit="popupData.isDeposit"
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
        if (config.mimInBentoBalance) bento.push(config.chainId);
        if (config.mimInDegenBalance) degen.push(config.chainId);
      });
      return { bento, degen };
    },

    currentChainBentoConfig() {
      return this.bentoBoxConfigs?.find(
        (config) => this.chainId == config.chainId
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
  },

  methods: {
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
</style>
