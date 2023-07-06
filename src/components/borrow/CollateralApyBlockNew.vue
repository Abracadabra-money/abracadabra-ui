<template>
  <div :class="{ 'no-apy': !isApyExist }">
    <div class="apy" v-if="isApyExist">
      <img class="apy-bg" :src="apyInfo.bg" />

      <div class="apy-content">
        <img
          class="coins-img"
          :class="{ 'coins-ape': isApe }"
          :src="apyInfo.coins"
          alt="Coins"
        />

        <div>
          <p class="title">Collateral APY</p>

          <div class="loader-wrap" v-if="isLoadingApy">
            <Loader type="loader" />
          </div>

          <p class="percent" v-else>
            {{ isTilde }} {{ calculateCollateralApy }} %
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import { useImage } from "@/helpers/useImage";
import { isApyCalcExist, fetchTokenApy } from "@/helpers/collateralsApy";
import Loader from "@/components/base/BaseLoader.vue";

export default {
  props: {
    expectedLeverage: {
      type: [String, Number],
      default: "",
    },
    cauldron: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isApyExist: false,
      isLoadingApy: true,
      collateralApy: null,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
    }),

    isApe() {
      return this.cauldron.config.id === 39 && +this.chainId === 1;
    },

    apyInfo() {
      if (this.isApe)
        return {
          bg: useImage("assets/images/ape/apy-bg.png"),
          coins: useImage("assets/images/ape/coins-ape.png"),
        };

      return {
        bg: useImage("assets/images/primary-apy-bg.png"),
        coins: useImage("assets/images/coins.png"),
      };
    },

    calculateCollateralApy() {
      return this.expectedLeverage
        ? filters.formatToFixed(+this.collateralApy * +this.expectedLeverage, 2)
        : filters.formatToFixed(this.collateralApy, 2);
    },

    isTilde() {
      return this.collateralApy < this.calculateCollateralApy ? "~" : "";
    },
  },

  watch: {
    async cauldron(newCauldron, oldCauldron) {
      if (newCauldron.config.id === oldCauldron.config.id) return false;
      await this.initApy();
    },
  },

  methods: {
    async initApy() {
      this.isApyExist = isApyCalcExist(this.chainId, this.cauldron.config.id);
      if (!this.isApyExist) return false;
      this.collateralApy = await fetchTokenApy(this.cauldron);
      this.isLoadingApy = false;
    },
  },

  async created() {
    await this.initApy();
  },

  components: {
    Loader,
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
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 16px 5px;
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

.coins-ape {
  max-width: 60px;
  width: 100%;
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
