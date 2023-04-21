<template>
  <div class="bento-wrapper">
    <BentoBoxItem
      @withdraw="openPopup(false, false)"
      @deposit="openPopup(false, true)"
      :balance="bentoInfo.mimInDegenBalance"
      :mimPrice="bentoInfo.mimPrice"
    />

    <BentoBoxItem
      @withdraw="openPopup(true, false)"
      @deposit="openPopup(true, true)"
      :balance="bentoInfo.mimInBentoBalance"
      :mimPrice="bentoInfo.mimPrice"
      :isBento="true"
    />

    <LocalPopupWrap
      :isOpened="popupData.opened"
      @closePopup="popupData.opened = false"
    >
      <DegenBentoPopup
        :infoObject="bentoInfo"
        :isBento="popupData.isBento"
        :isDeposit="popupData.isDeposit"
        @close="closePopup"
      />
    </LocalPopupWrap>
  </div>
</template>

<script>
import BentoBoxItem from "@/components/myPositions/BentoBoxItem.vue";
import DegenBentoPopup from "@/components/popups/DegenBentoPopup.vue";
import LocalPopupWrap from "@/components/popups/LocalPopupWrap.vue";

const initialPopupData = {
  opened: false,
  isBento: null,
  isDeposit: null,
};

export default {
  props: {
    bentoInfo: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      popupData: { ...initialPopupData },
    };
  },

  methods: {
    openPopup(isBento, isDeposit) {
      this.popupData = { opened: true, isBento, isDeposit };
    },

    closePopup() {
      this.popupData = { ...initialPopupData };
    },
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
