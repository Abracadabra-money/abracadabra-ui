<template>
  <div class="popup" v-if="routeDatas.length">
    <div class="popup-header">
      <p class="title">[test] Fetching best route...</p>
      <img
        class="close"
        @click="closePopup"
        src="@/assets/images/close.svg"
        alt="close"
      />
    </div>

    <div class="popup-content">
      <div class="test-item">
        <p>Token</p>
        <p>feesPoints</p>
        <p>{{amountTitle}}</p>
      </div>
      <div v-for="(item, idx) of routeDatas" :key="item.name" class="test-item" :class="{best: idx === 0}">
        <p>{{ item.name }}</p>
        <p>{{ item.feesPoints }}</p>
        <p>{{ item.amount }}</p>
      </div>
    </div>
  </div>
</template>

<script>
const compareAmounts = (a, b) => {
  return +b.amount - +a.amount;
}

export default {
  computed: {
    routeDatas() {
      return this.$store.getters.getRouteData.map((item) => {
        return {
          name: item.tokenName,
          feesPoints: item.feesPoints,
          amount: parseFloat(
            this.$ethers.utils.formatUnits(item.glpOutAmount ? item.glpOutAmount : item.buyAmount)
          ).toFixed(4),
        };
      }).sort(compareAmounts);
    },
    amountTitle() {
        return this.$store.getters.getRouteData[0]?.glpOutAmount ? "glpOut": "mimOut"
    },
  },
  methods: {
    closePopup() {
      this.$store.commit("closePopups");
    },
  },
};
</script>

<style lang="scss" scoped>
.test-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  text-align: left;
  width: 100%;
  margin-bottom: 4px;

  p {
    padding: 1px 3px;
  }

  &.best {
    color: #63FF7B;
  }
}

.popup {
  background: #302e38;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  padding: 20px;
  max-width: 400px;
  width: 100%;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 15px;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px 25px 10px;
  text-align: center;

  .main-img {
    width: 135px;
    height: auto;
    object-fit: contain;
    margin-bottom: 6px;
  }

  .info-title {
    font-weight: 600;
    font-size: 18px;
    line-height: 1.5;
    margin-bottom: 4px;
  }

  .info-subtitle {
    font-weight: 400;
    font-size: 14px;
    line-height: 1.3;
  }
}

.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
}

.close {
  width: 14px;
  height: 14px;
  cursor: pointer;
}
</style>
