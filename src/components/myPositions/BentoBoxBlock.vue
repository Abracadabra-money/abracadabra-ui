<template>
  <div class="bento-wrapper">
    <BentoBoxItem />

    <BentoBoxItem :isBento="true" />

    <LocalPopupWrap
      :isOpened="popupData.opened"
      @closePopup="popupData.opened = false"
    >
      <DegenBentoPopup
        :infoObject="bentoBoxConfig"
        :isBento="popupData.isBento"
        :isDeposit="popupData.isDeposit"
        @close="closePopup"
      />
    </LocalPopupWrap>
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

  data() {
    return {
      popupData: { ...initialPopupData },
      bentoUpdateInterval: null,
      bentoBoxConfig: null,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

    isHide() {
      return (
        (this.bentoBoxConfig?.mimInBentoBalance ||
          this.bentoBoxConfig?.mimInDegenBalance) &&
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
    openPopup(isBento, isDeposit) {
      this.popupData = { opened: true, isBento, isDeposit };
    },

    closePopup() {
      this.popupData = { ...initialPopupData };
    },

    async createMimBentoData() {
      if (!this.account) return false;
      this.bentoBoxConfig = await createBentoBoxConfig(
        this.chainId,
        this.account
      );

      this.bentoUpdateInterval = setInterval(async () => {
        this.bentoBoxConfig = await createBentoBoxConfig(
          this.chainId,
          this.account
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
