<template>
  <div class="bento-wrapper">
    <BentoBoxItem
      @withdraw="openPopup(false)"
      @chooseActiveChain="chooseActiveDegenChain"
      :balance="activeChainDegenData?.mimInDegenBalance || 0n"
      :mimPrice="activeChainDegenData?.mimPrice || 1"
      :activeChains="activeChains.degen"
      :activeChain="activeDegenChain"
      :currentChain="chainId"
      v-if="activeChains.degen.length"
    />

    <BentoBoxItem
      @withdraw="openPopup(true)"
      @chooseActiveChain="chooseActiveBentoChain"
      :balance="activeChainBentoData?.mimInBentoBalance || 0n"
      :mimPrice="activeChainBentoData?.mimPrice || 1"
      :activeChains="activeChains.bento"
      :activeChain="activeBentoChain"
      :currentChain="chainId"
      v-if="activeChains.bento.length"
      :isBento="true"
    />

    <DegenBentoPopup
      v-if="popupData.opened && currentChainBentoData"
      :infoObject="currentChainBentoData"
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
import { createBentoBoxDatas } from "@/helpers/bentoBox/createBentoBoxData";
import type { BentoBoxData } from "@/helpers/bentoBox/types";

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

  data() {
    return {
      popupData: { ...initialPopupData },
      bentoUpdateInterval: null as NodeJS.Timeout | null,
      bentoBoxDatas: [] as BentoBoxData[],
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
      let bento: BentoBoxData[] = [];
      let degen: BentoBoxData[] = [];

      const parsedAmountToCompare = parseUnits("0.1", 18);

      this.bentoBoxDatas?.forEach((data: BentoBoxData) => {
        if (data.mimInBentoBalance > parsedAmountToCompare) bento.push(data);
        if (data.mimInDegenBalance > parsedAmountToCompare) degen.push(data);
      });

      bento = bento.sort((a, b) =>
        Number(b.mimInBentoBalance - a.mimInBentoBalance)
      );

      degen = degen.sort((a, b) =>
        Number(b.mimInDegenBalance - a.mimInDegenBalance)
      );

      return {
        bento: bento.map((data) => data.chainId),
        degen: degen.map((data) => data.chainId),
      };
    },

    currentChainBentoData(): BentoBoxData | undefined {
      return this.bentoBoxDatas?.find(
        (data: BentoBoxData) => this.chainId == data.chainId
      );
    },

    activeChainBentoData(): BentoBoxData | undefined {
      return this.bentoBoxDatas?.find(
        (data: BentoBoxData) => this.activeBentoChain == data.chainId
      );
    },

    activeChainDegenData(): BentoBoxData | undefined {
      return this.bentoBoxDatas?.find(
        (data: BentoBoxData) => this.activeDegenChain == data.chainId
      );
    },

    isVisible(): boolean {
      return (
        (this.currentChainBentoData?.mimInBentoBalance ||
          this.currentChainBentoData?.mimInDegenBalance) &&
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
        this.bentoBoxDatas = this.bentoBoxData.data;
      }
    },

    async createMimBentoData() {
      this.bentoBoxDatas = await createBentoBoxDatas(this.account);
    },
  },

  async created() {
    this.checkLocalData();
    await this.createMimBentoData();
    this.setBentoBoxData(this.bentoBoxDatas);

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
@/helpers/bentoBox/createBentoBoxData
