<template>
  <div class="my-position-view">
    <h2 class="title">My positions</h2>
    <div class="choose">
      <h4 class="choose-title">Choose Chain</h4>
      <NetworksList :items="5" />
    </div>

    <div class="values-list">
      <div v-for="(item, i) in textItems" :key="i" class="values-list-item">
        <p class="values-list-title">{{ item.title }}</p>
        <p class="values-list-value">{{ item.value }}</p>
      </div>
    </div>
    <div class="balance-boxes">
      <BalanceBox
        @withdraw="openPopup(false, false)"
        @deposit="openPopup(false, true)"
        :balance="degenFormattedBalance"
        :usd="degenBalanceInUsd"
      />
      <BalanceBox
        @withdraw="openPopup(true, false)"
        @deposit="openPopup(true, true)"
        :balance="bentoFormattedBalance"
        :usd="bentoBalanceInUsd"
        :isBento="true"
      />
    </div>
    <h2 class="title">Specific positions</h2>
    <div class="spec-positions">
      <SpecPos />
      <SpecPos />
    </div>
    <PopupWrap v-model="popupData.opened" maxWidth="540px" height="400px">
      <DegenBentoPopup
        v-if="mimInBentoDepositObject"
        :infoObject="mimInBentoDepositObject"
        :isBento="popupData.isBento"
        :isDeposit="popupData.isDeposit"
        @close="closePopup"
      />
    </PopupWrap>
  </div>
</template>

<script>
const DegenBentoPopup = () => import("@/components/popups/DegenBentoPopup");
const NetworksList = () => import("@/components/ui/NetworksList");
const BalanceBox = () => import("@/components/myPositions/BalanceBox");
const SpecPos = () => import("@/components/myPositions/SpecPos");
const PopupWrap = () => import("@/components/ui/PopupWrap");
import mimBentoDeposit from "@/mixins/mimBentoDeposit";

const initialPopupData = {
  opened: false,
  isBento: null,
  isDeposit: null,
};

export default {
  mixins: [mimBentoDeposit],
  data: () => ({
    textItems: [
      {
        title: "Collateral Deposit",
        value: "10 $",
      },
      {
        title: "MIM Borrowed",
        value: "10",
      },
      {
        title: "Yield Generated",
        value: "10 %",
      },
    ],
    popupData: { ...initialPopupData },
    isDegenBentoOpened: true,
    mimBentoInterval: null,
  }),
  methods: {
    formatBalance(balance = "x.x") {
      if (balance !== "x.x") {
        const b = this.$ethers.utils.formatEther(balance);
        // eslint-disable-next-line no-useless-escape
        let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (4 || -1) + `})?`);
        return b.toString().match(re)[0];
      }
      return "x.x";
    },
    genBalanceInUsd(balance) {
      if (+balance) {
        return parseFloat(
          +balance * this.mimInBentoDepositObject.mimPrice
        ).toFixed(2);
      }
      return "0";
    },
    openPopup(isBento, isDeposit) {
      this.popupData = { opened: true, isBento, isDeposit };
    },
    closePopup() {
      this.popupData = { ...initialPopupData };
    },
  },
  computed: {
    mimInBentoDepositObject() {
      return this.$store.getters.getMimInBentoDepositObject;
    },
    degenFormattedBalance() {
      return this.formatBalance(
        this.mimInBentoDepositObject?.degenExactBalance
      );
    },
    bentoFormattedBalance() {
      return this.formatBalance(
        this.mimInBentoDepositObject?.bentoExactBalance
      );
    },
    degenBalanceInUsd() {
      return this.genBalanceInUsd(this.degenFormattedBalance);
    },
    bentoBalanceInUsd() {
      return this.genBalanceInUsd(this.bentoFormattedBalance);
    },
  },

  components: { DegenBentoPopup, SpecPos, NetworksList, BalanceBox, PopupWrap },
  async created() {
    await this.createMimBentoInfo();
    this.mimBentoInterval = setInterval(async () => {
      await this.createMimBentoInfo();
    }, 5000);
  },

  beforeDestroy() {
    clearInterval(this.mimBentoInterval);
  },
};
</script>

<style lang="scss" scoped>
.my-position-view {
  padding-top: 160px;
  margin: 0 auto;
  width: 780px;
  max-width: 100%;
  box-sizing: border-box;
  padding-bottom: 207px;
}

.title {
  text-align: center;
  text-transform: uppercase;
}

.choose {
  padding: 20px 16px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
  margin-top: 40px;

  &-title {
    padding-bottom: 14px;
  }
}

.values-list {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(auto-fill, 1fr);
  row-gap: 33px;
  padding: 20px 16px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  margin-top: 16px;

  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    line-height: 27px;
  }

  &-title {
    font-weight: 400;
    color: rgba(255, 255, 255, 0.8);
  }

  &-value {
    font-weight: 700;
  }
}

.balance-boxes {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  margin-top: 16px;
  margin-bottom: 32px;
}

.spec-positions {
  display: grid;
  grid-template-rows: repeat(auto-fill, auto);
  row-gap: 24px;
  margin-top: 40px;
}

@media (min-width: 1024px) {
  .choose {
    padding: 30px;
  }
  .values-list {
    padding: 18px 40px 15px 20px;
  }
  .balance-boxes {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
