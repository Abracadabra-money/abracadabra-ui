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

import BalanceBox from "@/components/myPositions/BalanceBox.vue";
import DegenBentoPopup from "@/components/popups/DegenBentoPopup.vue";
import LocalPopupWrap from "@/components/popups/LocalPopupWrap.vue";

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
  data(){
    return {
      popupData: { ...initialPopupData },
    }
  },
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
