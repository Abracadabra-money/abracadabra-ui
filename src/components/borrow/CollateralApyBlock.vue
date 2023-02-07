<template>
  <div :class="{ 'no-apy': !isCalcExist }">
    <div class="apy" v-if="isCalcExist">
      <img class="apy-bg" src="@/assets/images/primary-apy-bg.png" alt="" />
      <div class="apy-content">
        <img class="coins-img" src="@/assets/images/coins.png" alt="" />
        <div>
          <p class="title" v-tooltip="tooltipText">{{ title }}</p>
          <div class="loader-wrap" v-if="loading">
            <p class="loader"></p>
          </div>
          <p class="percent" v-else>{{ isTilde }} {{ calculateApy }} %</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isApyCalcExist, fetchTokenApy } from "@/helpers/collateralsApy";

export default {
  props: {
    expectedLeverage: {
      type: String,
      default: "",
    },
    pool: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      title: "Collateral APY",
      apy: "",
      tooltipText: "",
      isCalcExist: false,
      loading: false,
    };
  },

  computed: {
    chainId() {
      return this.$store.getters.getChainId;
    },
    calculateApy() {
      if (+this.expectedLeverage)
        return parseFloat(+this.apy * +this.expectedLeverage).toFixed(2);
      return parseFloat(this.apy).toFixed(2);
    },

    isTilde() {
      return this.apy < this.calculateApy ? "~" : "";
    },
  },

  watch: {
    async pool(val, oldVal) {
      if (val.id === oldVal.id) return false;
      await this.init();
    },
  },

  methods: {
    async getApy() {
      this.loading = true;
      this.apy = await fetchTokenApy(this.pool);
      this.loading = false;
    },
    async init() {
      this.isCalcExist = isApyCalcExist(this.chainId, this.pool.id);
      if (!this.isCalcExist) return false;
      await this.getApy();
    },
  },
  async created() {
    await this.init();
  },
};
</script>

<style lang="scss" scoped>
.no-apy {
  margin-bottom: 32px;
}

.apy {
  max-width: 680px;
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 16px auto;
  padding: 15px 5px;
  position: relative;
}

.apy-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.apy-content {
  position: relative;
  display: flex;
  align-items: center;
}
.coins-img {
  max-width: 38px;
  margin-right: 8px;
}
.title {
  font-weight: 400;
  font-size: 18px;
  line-height: 1.3;
  position: relative;
}
.percent {
  position: relative;
  font-weight: 700;
  font-size: 30px;
  line-height: 30px;
}

.loader-wrap {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader {
  margin-right: 15px;
  margin-top: 10px;
  position: relative;
  display: block;
  width: 8px;
  animation: rectangle infinite 1s ease-in-out -0.2s;
  border-radius: 4px;
  background-color: #fff;
}
.loader:before,
.loader:after {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  content: "";
  background-color: #fff;
}
.loader:before {
  left: -10px;
  animation: rectangle infinite 1s ease-in-out -0.4s;
}
.loader:after {
  right: -10px;
  animation: rectangle infinite 1s ease-in-out;
}

@media screen and (max-width: 1220px) {
  .primary-apy-block {
    max-width: 100%;
  }

  .percent {
    font-size: 24px;
    line-height: 24px;
  }
}

@media screen and (max-width: 1024px) {
  .not-apy {
    margin-bottom: 30px;
  }
}

@media screen and (max-width: 375px) {
  .title {
    font-size: 16px;
  }
  .percent {
    font-size: 16px;
    line-height: 18px;
  }
}

@keyframes rectangle {
  0%,
  80%,
  100% {
    height: 6px;
  }
  40% {
    height: 8px;
  }
}
</style>
