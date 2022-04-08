<template>
  <div class="my-position-view">
    <h2 class="title">My positions</h2>
    <div class="choose">
      <h4>Choose Chain</h4>
      <NetworksList :items="5" />
    </div>
  </div>
</template>

<script>
const NetworksList = () => import("@/components/ui/NetworksList");

export default {
  data: () => ({
    myPositions: [
      {
        icon: require("@/assets/images/myposition/ETH.svg"),
        name: "ETH",
        status: "Safe",
        collateral: "10",
        borrowed: "15,000",
        total: "32,504.49898",
      },
      {
        icon: require("@/assets/images/myposition/ETH.svg"),
        name: "ETH",
        status: "Medium",
        collateral: "10",
        borrowed: "15,000",
        total: "32,504.49898",
      },
      {
        icon: require("@/assets/images/myposition/ETH.svg"),
        name: "ETH",
        status: "High",
        collateral: "10",
        borrowed: "15,000",
        total: "32,504.49898",
      },
    ],
    activeTab: "repay",
    activePosition: null,
  }),

  components: { NetworksList },
};
</script>

<style lang="scss" scoped>
.my-position-view {
  padding-top: 160px;
  margin: 0 auto;
  width: 780px;
  max-width: 100%;
  box-sizing: border-box;
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
}

@media (min-width: 1024px) {
  .choose {
    padding: 30px;
  }
}
</style>
