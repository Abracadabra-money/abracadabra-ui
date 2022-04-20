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
    <BalanceBoxes
      v-if="mimInBentoDepositObject"
      :infoObject="mimInBentoDepositObject"
    />
    <h2 class="title">Specific positions</h2>
    <div class="spec-positions">
      <SpecPos />
      <SpecPos />
    </div>
  </div>
</template>

<script>
const NetworksList = () => import("@/components/ui/NetworksList");
const BalanceBoxes = () => import("@/components/myPositions/BalanceBoxes");
const SpecPos = () => import("@/components/myPositions/SpecPos");
import mimBentoDeposit from "@/mixins/mimBentoDeposit";

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
    mimBentoInterval: null,
  }),

  computed: {
    mimInBentoDepositObject() {
      return this.$store.getters.getMimInBentoDepositObject;
    },
  },

  components: {
    SpecPos,
    NetworksList,
    BalanceBoxes,
  },
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
}
</style>
