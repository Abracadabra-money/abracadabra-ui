<template>
  <div class="bento-wrapper">
    <BentoBoxItem
      @withdraw="openPopup(false)"
      @chooseActiveChain="chooseActiveDegenChain"
      :balance="activeChainDegenConfig?.mimInDegenBalance || 0n"
      :mimPrice="activeChainDegenConfig?.mimPrice || 1"
      :activeChains="activeChains.degen"
      :activeChain="activeDegenChain"
      :currentChain="chainId"
      v-if="activeChains.degen.length"
    />

    <BentoBoxItem
      @withdraw="openPopup(true)"
      @chooseActiveChain="chooseActiveBentoChain"
      :balance="activeChainBentoConfig?.mimInBentoBalance || 0n"
      :mimPrice="activeChainBentoConfig?.mimPrice || 1"
      :activeChains="activeChains.bento"
      :activeChain="activeBentoChain"
      :currentChain="chainId"
      v-if="activeChains.bento.length"
      :isBento="true"
    />

    <DegenBentoPopup
      v-if="popupData.opened && currentChainBentoConfig"
      :infoObject="currentChainBentoConfig"
      :isBento="popupData.isBento"
      @close="popupData.opened = false"
    />
  </div>
</template>

<script lang="ts">
import { parseUnits } from "viem";
import { mapGetters, mapMutations } from "vuex";
import bentoBoxMixin from "@/mixins/mimBentoDeposit";
import BentoBoxItem from "@/components/myPositions/BentoBoxItem.vue";
import DegenBentoPopup from "@/components/popups/DegenBentoPopup.vue";
import { createBentoBoxConfig } from "@/helpers/bentoBox/createBentoBoxConfig";
import type { BentoBoxConfig } from "@/helpers/bentoBox/types";
import type { PropType } from "vue";

const initialPopupData: PopupData = {
  opened: false,
  isBento: false,
  isDeposit: false,
};

type PopupData = {
  opened: boolean;
  isBento: boolean;
  isDeposit?: boolean;
};

type ActiveChains = number[];

export default {
  mixins: [bentoBoxMixin],

  props: {
    activeNetworks: { type: Array as PropType<number[]> },
  },

  data() {
    return {
      popupData: { ...initialPopupData },
      bentoUpdateInterval: null as NodeJS.Timeout | null,
      bentoBoxConfigs: [] as BentoBoxConfig[],
      activeBentoChain: null as number | null,
      activeDegenChain: null as number | null,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      bentoBoxData: "getBentoBoxData",
    }),

    activeChains(): { bento: ActiveChains; degen: ActiveChains } {
      let bento: BentoBoxConfig[] = [];
      let degen: BentoBoxConfig[] = [];

      const parsedAmountToCompare = parseUnits("0.1", 18);

      console.log("this.bentoBoxConfigs", this.bentoBoxConfigs);

      this.bentoBoxConfigs?.forEach((config: BentoBoxConfig) => {
        if (config.mimInBentoBalance > parsedAmountToCompare)
          bento.push(config);
        if (config.mimInDegenBalance > parsedAmountToCompare)
          degen.push(config);
      });

      bento = bento.sort((a, b) =>
        Number(b.mimInBentoBalance - a.mimInBentoBalance)
      );

      degen = degen.sort((a, b) =>
        Number(b.mimInDegenBalance - a.mimInDegenBalance)
      );

      return {
        bento: bento.map((config) => config.chainId),
        degen: degen.map((config) => config.chainId),
      };
    },

    currentChainBentoConfig(): BentoBoxConfig | undefined {
      return this.bentoBoxConfigs?.find(
        (config: BentoBoxConfig) => this.chainId == config.chainId
      );
    },

    activeChainBentoConfig(): BentoBoxConfig | undefined {
      return this.bentoBoxConfigs?.find(
        (config: BentoBoxConfig) => this.activeBentoChain == config.chainId
      );
    },

    activeChainDegenConfig(): BentoBoxConfig | undefined {
      return this.bentoBoxConfigs?.find(
        (config: BentoBoxConfig) => this.activeDegenChain == config.chainId
      );
    },

    isVisible(): boolean {
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

    activeChains(newValue: { bento: ActiveChains; degen: ActiveChains }) {
      this.activeBentoChain = newValue.bento[0];
      this.activeDegenChain = newValue.degen[0];
    },
  },

  methods: {
    ...mapMutations({
      setBentoBoxData: "setBentoBoxData",
    }),

    chooseActiveBentoChain(e: number) {
      this.activeBentoChain = e;
    },

    chooseActiveDegenChain(e: number) {
      this.activeDegenChain = e;
    },

    openPopup(isBento: boolean) {
      this.popupData = { opened: true, isBento };
    },

    closePopup() {
      this.popupData = { ...initialPopupData };
    },

    checkLocalData() {
      if (this.bentoBoxData.isCreated) {
        this.bentoBoxConfigs = this.bentoBoxData.data;
      }
    },

    async createMimBentoData() {
      if (!this.account || !this.activeNetworks) return;

      const configs: (BentoBoxConfig | null)[] = await Promise.all(
        this.activeNetworks.map(async (chainId) => {
          const config = await createBentoBoxConfig(chainId, this.account);
          return config;
        })
      );

      this.bentoBoxConfigs = configs.filter(
        (config: BentoBoxConfig | null) => config !== null
      );
    },
  },

  async created() {
    this.checkLocalData();
    await this.createMimBentoData();
    this.setBentoBoxData(this.bentoBoxConfigs);

    this.bentoUpdateInterval = setInterval(async () => {
      await this.createMimBentoData();
    }, 60000);
  },

  beforeUnmount() {
    if (this.bentoUpdateInterval) clearInterval(this.bentoUpdateInterval);
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
