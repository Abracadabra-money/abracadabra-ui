<template>
  <div class="balance-boxes" v-if="account">
    <BalanceBox
      @withdraw="openPopup(false, false)"
      @deposit="openPopup(false, true)"
      :balance="infoObject.mimInDegenBalance"
      :mimPrice="infoObject.mimPrice"
    />
    <BalanceBox
      @withdraw="openPopup(true, false)"
      @deposit="openPopup(true, true)"
      :balance="infoObject.mimInBentoBalance"
      :mimPrice="infoObject.mimPrice"
      :isBento="true"
    />
    <LocalPopupWrap v-model="popupData.opened">
      <DegenBentoPopup
        :infoObject="infoObject"
        :isBento="popupData.isBento"
        :isDeposit="popupData.isDeposit"
        @close="closePopup"
      />
    </LocalPopupWrap>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

const BalanceBox = () => import("@/components/myPositions/BalanceBox");
const DegenBentoPopup = () => import("@/components/popups/DegenBentoPopup");
const LocalPopupWrap = () => import("@/components/popups/LocalPopupWrap");

const initialPopupData = {
  opened: false,
  isBento: null,
  isDeposit: null,
};

export default {
  name: "BalanceBoxes",
  components: { BalanceBox, DegenBentoPopup, LocalPopupWrap },
  props: {
    infoObject: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    popupData: { ...initialPopupData },
  }),
  methods: {
    openPopup(isBento, isDeposit) {
      this.popupData = { opened: true, isBento, isDeposit };
    },
    closePopup() {
      this.popupData = { ...initialPopupData };
    },
  },
  computed: {
    ...mapGetters({
      account: "getAccount",
    }),
  },
};
</script>

<style lang="scss" scoped>
.balance-boxes {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  margin-top: 16px;
}

@media (min-width: 1024px) {
  .balance-boxes {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
