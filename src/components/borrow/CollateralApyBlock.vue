<template>
  <div
    :class="{
      'apy-is-not-exist': !isShowApyBlock,
    }"
  >
    <div class="apy-wrap" v-if="isShowApyBlock">
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
            {{ isApproximate }} {{ calculateCollateralApy }} %
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
      type: Number,
      default: null,
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
      provider: "getProvider",
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

    isApproximate() {
      return this.collateralApy < this.calculateCollateralApy ? "≈" : "";
    },

    isShowApyBlock() {
      return this.isApyExist && this.collateralApy;
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
      this.isLoadingApy = true;
      this.collateralApy = await fetchTokenApy(
        this.cauldron,
        this.chainId,
        this.provider
      );
      this.isApyExist = isApyCalcExist(this.chainId, this.cauldron.config.id);
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
.apy-is-not-exist {
  margin-bottom: 32px;
}

.apy-wrap {
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

@media screen and (max-width: 1220px) {
  .percent {
    font-size: 24px;
    line-height: 24px;
  }
}

@media screen and (max-width: 1024px) {
  .apy-is-not-exist {
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
