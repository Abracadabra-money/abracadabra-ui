<template>
  <div class="stake-info-block">
    <div class="row">
      <span class="title">Ratio</span>
      <span class="value">
        <img class="icon" :src="mainToken.icon" alt="Token icon" />
        {{ tokensRate }}
      </span>
    </div>

    <div class="row">
      <span class="title">APR</span>
      <span class="value" v-if="apr">{{ apr }}%</span>
      <div class="loader-wrap" v-else>
        <BaseLoader type="loader" />
      </div>
    </div>

    <div class="underline"></div>

    <h5 class="subtitle">Your wallet balance</h5>

    <div class="row">
      <span class="title">
        <img class="icon" :src="mainToken.icon" alt="Token icon" />
        {{ mainToken.name }}
      </span>
      <span class="value">
        {{ formatUSD(mainToken.balance) }}
        <span class="price">({{ formatUSD(mainToken.balanceUsd) }})</span>
      </span>
    </div>

    <div class="row">
      <span class="title">
        <img class="icon" :src="stakeToken.icon" alt="Token icon" />
        {{ stakeToken.name }}
      </span>
      <span class="value">
        {{ formatUSD(stakeToken.balance) }}
        <span class="price">({{ formatUSD(stakeToken.balanceUsd) }})</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { formatUnits } from "viem";
//@ts-ignore
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
import { getMagicGlpApy } from "@/helpers/collateralsApy/getMagicGlpApy";
import { getMagicApeApy } from "@/helpers/collateralsApy/getMagicApeApy";
import { ANALYTICS_URK, MIM_PRICE, ONE_ETHER_VIEM } from "@/constants/global";

export default {
  props: {
    mainToken: {
      type: Object as any,
    },
    stakeToken: {
      type: Object as any,
    },
    selectedNetwork: {
      type: Number,
    },
    type: {
      type: String,
      default: "glp",
    },
  },

  data() {
    return {
      apr: 0,
    };
  },

  computed: {
    tokensRate() {
      const rate = formatUnits(
        (MIM_PRICE * this.mainToken.rate) / ONE_ETHER_VIEM,
        this.mainToken.decimals
      );
      return `1 ${this.mainToken.name} = ${filters.formatToFixed(rate, 4)} ${
        this.stakeToken.name
      }`;
    },
  },

  watch: {
    async selectedNetwork() {
      await this.fetchApr();
    },
  },

  methods: {
    formatUSD(value: bigint) {
      return filters.formatUSD(formatUnits(value, this.mainToken.decimals));
    },

    async fetchGlpApy() {
      if (!this.selectedNetwork) return false;
      this.apr = 0;
      const response = await getMagicGlpApy(this.selectedNetwork);
      this.apr = filters.formatToFixed(response.magicGlpApy, 2);
    },

    async fetchApeApy() {
      if (!this.selectedNetwork) return false;
      this.apr = 0;
      this.apr = await getMagicApeApy(this.selectedNetwork);
    },

    async fetchKlpApy() {
      const { data } = await axios.get(`${ANALYTICS_URK}/kinetix/info`);
      this.apr = filters.formatToFixed(data.apr, 2);
    },

    async fetchApr() {
      switch (this.type) {
        case "glp":
          await this.fetchGlpApy();
          break;
        case "ape":
          await this.fetchApeApy();
          break;
        case "klp":
          await this.fetchKlpApy();
          break;
        default:
          break;
      }
    },
  },

  async created() {
    await this.fetchApr();
  },

  components: {
    BaseLoader: defineAsyncComponent(
      () => import("@/components/base/BaseLoader.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.stake-info-block {
  gap: 16px;
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  gap: 8px;
  display: flex;
  align-items: center;
  line-height: 150%;
}

.value {
  gap: 4px;
  display: flex;
  align-items: center;
  font-weight: 500;
  line-height: 150%;
}

.loader-wrap {
  width: 30px;
  height: 24px;
}

.icon {
  width: 24px;
  height: 24px;
}

.price {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
}

.underline {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 51.04%,
    rgba(255, 255, 255, 0) 100%
  );
}
</style>
