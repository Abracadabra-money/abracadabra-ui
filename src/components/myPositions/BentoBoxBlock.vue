<template>
  <div class="bento-wrapper" v-if="isHide">
    <BentoBoxItem
      v-if="bentoBoxConfig.mimInDegenBalance"
      @withdraw="openPopup(false, false)"
      @deposit="openPopup(false, true)"
      :balance="bentoBoxConfig.mimInDegenBalance"
      :mimPrice="bentoBoxConfig.mimPrice"
    />

    <BentoBoxItem
      v-if="bentoBoxConfig.mimInBentoBalance"
      @withdraw="openPopup(true, false)"
      @deposit="openPopup(true, true)"
      :balance="bentoBoxConfig.mimInBentoBalance"
      :mimPrice="bentoBoxConfig.mimPrice"
      :isBento="true"
    />

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
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      bentoBoxConfig: "getMimInBentoDepositObject",
    }),

    isHide() {
      return (
        (this.bentoBoxConfig && +this.bentoBoxConfig?.mimInBentoBalance) ||
        (+this.bentoBoxConfig?.mimInDegenBalance && this.account)
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
      await this.createMimBentoInfo();

      this.bentoUpdateInterval = setInterval(async () => {
        await this.createMimBentoInfo();
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;
}

@media (max-width: 1024px) {
  .bento-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>
