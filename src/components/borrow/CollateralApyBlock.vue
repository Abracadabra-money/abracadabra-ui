<template>
  <div :class="{ 'no-apy': !apy }">
    <div class="apy" v-if="apy">
      <img class="apy-bg" src="@/assets/images/primary-apy-bg.png" alt="" />
      <div class="apy-content">
        <img class="coins-img" src="@/assets/images/coins.png" alt="" />
        <div>
          <p class="title" v-tooltip="tooltipText">{{ title }}</p>
          <p class="percent">{{ isTilde }} {{ calculateApy }} %</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchTokenApy } from "@/helpers/collateralsApy";

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
    };
  },

  computed: {
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
      if(val.id === oldVal.id) return false;
      this.apy = ""
      this.apy = await fetchTokenApy(this.pool);
    },
  },

  async created() {
    this.apy = await fetchTokenApy(this.pool);
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
</style>
