<template>
  <div class="camelot-card-background">
    <a
      class="camelot-card"
      href="https://app.camelot.exchange/pools/0xb4E0a7698c7cfB03508787C80647419364CcB8D0"
      target="_blank"
      rel="noreferrer noopener"
    >
      <p class="primary paragraph">
        <span class="card-title">NEW V3 POOL</span>
        <span class="on-camelot">ON CAMELOT</span>
        <span class="token-pair">ARB / MIM</span>
      </p>
      <ul class="secondary paragraph">
        <li>
          <span class="title">TVL:</span>
          <span class="value">{{ formattedTvl }}</span>
        </li>
        <li>
          <span class="title">APR:</span>
          <span class="value">{{ formattedApr }}</span>
        </li>
      </ul>
    </a>
  </div>
</template>
<script>
import axios from "axios";
import filters from "@/filters/index";

export default {
  data() {
    return {
      tvl: 0,
      apr: 0,
    };
  },

  computed: {
    formattedTvl() {
      return filters.formatLargeSum(this.tvl);
    },
    formattedApr() {
      return filters.formatPercent(this.apr);
    },
  },

  methods: {
    async fetchTVL() {
      const res = await axios.get(
        `https://wire2.gamma.xyz/camelot/arbitrum/hypervisors/allData`
      );
      const { tvlUSD } = Object.values(res.data).find(
        (element) =>
          element.poolAddress == "0xb4e0a7698c7cfb03508787c80647419364ccb8d0"
      );
      this.tvl = +tvlUSD;
    },

    async fetchAPR() {
      const res = await axios.get(
        `https://api.camelot.exchange/v2/liquidity-v3-data`
      );

      this.apr =
        res.data.data.pools[
          "0xb4E0a7698c7cfB03508787C80647419364CcB8D0"
        ].activeTvlAverageAPR;
    },
  },

  created() {
    this.fetchTVL();
    this.fetchAPR();
  },
};
</script>
<style lang="scss" scoped>
.camelot-card-background {
  background: linear-gradient(146deg, #1a0604 0%, #000 101.49%);
  border-radius: 16px;
}

.camelot-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 20px 11px 20px;
  height: 201px;
  width: 302px;
  background-image: url("../../../assets/images/background_camelot.png");
  border-radius: 16px;
  border: 1px solid #ffbc01;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
  background-position: 50% 50%;
  background-size: 704px 522px;
  background-repeat: no-repeat;
  color: white;
  text-transform: uppercase;
  font-weight: 600;
  transition: 0.3s;
}

.camelot-card:hover {
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.21);
}

.primary {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.card-title {
  font-size: 26px;
}

.on-camelot {
  color: #ffbc01;
  font-size: 20px;
}

.token-pair {
  font-size: 13px;
  line-height: normal;
}

.secondary {
  display: flex;
  flex-direction: column;
  gap: 6px;
  list-style: none;
}

.title {
  font-size: 16px;
  font-weight: 500;
}

.value {
  margin-left: 5px;
  color: #ffbc01;
  font-size: 16px;
}
</style>
