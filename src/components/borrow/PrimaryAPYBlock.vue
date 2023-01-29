<template>
  <div class="primary-apy-block">
    <img class="bg-img" src="@/assets/images/primary-apy-bg.png" alt="" />
    <div class="wrapper">
      <img class="coins-img" src="@/assets/images/coins.png" alt="" />
      <div>
        <p class="title">{{ title }}</p>
        <p class="value" v-if="selfRepayingAPY">
          {{ isTilde }} {{ calculateApy }} %
        </p>
        <div class="loader-wrap" v-else>
          <p class="loader"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getGlpApr } from "@/helpers/glpApr";
import { mapGetters } from "vuex";
export default {
  props: {
    expectedLeverage: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      title: "Collateral APY",
      selfRepayingAPY: "",
    };
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    calculateApy() {
      let apy = null;
      if (+this.expectedLeverage)
        apy = parseFloat(
          +this.selfRepayingAPY * +this.expectedLeverage
        ).toFixed(2);
      else apy = parseFloat(this.selfRepayingAPY).toFixed(2);

      return this.isMagicGlp ? apy - 1 : apy;
    },

    isTilde() {
      return this.selfRepayingAPY < this.calculateApy ? "~" : "";
    },

    isMagicGlp() {
      return +this.$route?.params?.id === 3 && this.chainId === 42161;
    },
  },

  watch: {
    async $route() {
      this.selfRepayingAPY = "";
      const selfRepayingAPY = await getGlpApr(this.isMagicGlp);
      this.selfRepayingAPY = parseFloat(selfRepayingAPY).toFixed(2);
    }
  },

  async created() {
    const selfRepayingAPY = await getGlpApr(this.isMagicGlp);
    this.selfRepayingAPY = parseFloat(selfRepayingAPY).toFixed(2);
  },
};
</script>

<style lang="scss" scoped>
.primary-apy-block {
  width: 100%;
  max-width: 680px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 5px;
  position: relative;

  .bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .wrapper {
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

  .value {
    position: relative;
    font-weight: 700;
    font-size: 30px;
    line-height: 30px;
  }
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

    .value {
      font-size: 24px;
      line-height: 24px;
    }
  }
}

@media screen and (max-width: 375px) {
  .primary-apy-block {
    .title {
      font-size: 16px;
    }

    .value {
      font-size: 16px;
      line-height: 18px;
    }
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
