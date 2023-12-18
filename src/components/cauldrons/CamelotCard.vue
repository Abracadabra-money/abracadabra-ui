<template>
  <div class="camelot-card-background">
    <a
      class="camelot-card"
      href="https://app.camelot.exchange/liquidity/?token1=0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A&token2=0x912CE59144191C1204E64559FE8253a0e49E6548&mode=auto&provider=gamma"
      target="_blank"
      rel="noreferrer noopener"
    >
      <p class="primary paragraph">
        <span class="card-title">NEW V3 POOL</span>
        <span class="on-camelot">ON CAMELOT</span>
        <span class="token-pair">ARB / MIM</span>
      </p>
      <ul class="secondary paragraph" v-if="tvl && aprRange">
        <li>
          <span class="title">TVL:</span>
          <span class="value">{{ formattedTvl }}</span>
        </li>
        <li>
          <span class="title">APR:</span>
          <span class="value">{{ aprRange }}</span>
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
      tvl: null,
      aprRange: null,
    };
  },

  computed: {
    formattedTvl() {
      return filters.formatLargeSum(this.tvl);
    },
  },

  methods: {
    async fetchData() {
      const nitroRes = await axios.get(`https://api.camelot.exchange/nitros/`);
      const rangeRes = await axios.get(
        `https://api.camelot.exchange/nft-pools/`
      );
      const strategyRes = await axios.get(
        `https://wire2.gamma.xyz/camelot/arbitrum/hypervisors/allData`
      );

      const nitroApr =
        nitroRes.data.data.nitros["0x4B081b3600B3B1bcE242cDc291f85e475532B0B4"]
          .incentivesApr;

      const strategyApr =
        strategyRes.data["0x1164191754f726edb85466f84ae5f14f43c111a9"].returns
          .daily.feeApr * 100;

      const { minIncentivesApr, maxIncentivesApr, tvlUSD } =
        rangeRes.data.data.nftPools[
          "0xDe6f99A9e63a8528fF43C3c1f13A07F541f761e5"
        ];

      const minApr = minIncentivesApr + nitroApr + strategyApr;
      const maxApr = maxIncentivesApr + nitroApr + strategyApr;

      this.aprRange = `${filters.formatPercent(
        minApr
      )} - ${filters.formatPercent(maxApr)}`;

      this.tvl = tvlUSD;
    },
  },

  created() {
    this.fetchData();
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
  height: 160px;
  max-width: 416px;
  background-image: url("@/assets/images/background_camelot.png");
  border-radius: 16px;
  border: 1px solid #2d4a96;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
  background-position: 50% 50%;
  background-size: 100%;
  background-repeat: no-repeat;
  color: white;
  text-transform: uppercase;
  font-weight: 600;
  transition: 0.3s;
}

.camelot-card:hover {
  border: 1px solid #526fbc;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06),
    0px 4px 32px 0px rgba(103, 103, 103, 0.21);
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
