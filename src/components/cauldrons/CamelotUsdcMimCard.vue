<template>
  <a
    class="camelot-card"
    href="https://app.camelot.exchange/liquidity/?type=v3&token1=0xaf88d065e77c8cc2239327c5edb3a432268e5831&token2=0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a"
    target="_blank"
    rel="noreferrer noopener"
  >
    <p class="primary paragraph">
      <span class="card-title">Stable V3 Pool</span>
      <span class="on-camelot">ON CAMELOT</span>
      <span class="token-pair">USDC / MIM</span>
    </p>

    <ul class="secondary paragraph" v-if="tvl && aprRange">
      <li>
        <span class="title">TVL:</span>
        <span class="value">${{ formatLargeSum(tvl) }}</span>
      </li>
      <li>
        <span class="title">APR:</span>
        <span class="value">{{ aprRange }}</span>
      </li>
    </ul>
  </a>
</template>

<script lang="ts">
import { formatPercent, formatLargeSum } from "@/helpers/filters";
import { fetchCamelotUsdcInfo } from "@/helpers/fetchCamelotCardsInfo";

export default {
  data() {
    return {
      tvl: null as any,
      aprRange: null as any,
    };
  },

  methods: {
    formatLargeSum,

    async fetchData() {
      const { tvl, apr } = await fetchCamelotUsdcInfo();
      this.tvl = tvl;
      this.aprRange = formatPercent(apr);
    },
  },

  async created() {
    await this.fetchData();
  },
};
</script>

<style lang="scss" scoped>
.camelot-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 20px 10px 20px;
  height: 160px;
  max-width: 416px;
  width: 100%;
  background-image: url("@/assets/images/cauldrons/background-usdc-mim.png");
  border-radius: 16px;
  border: 1px solid #2d4a96;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
  background-position: 100% 50%;
  background-repeat: no-repeat;
  background-size: cover;
  text-transform: uppercase;
  font-weight: 600;
  transition: 0.3s;
  color: #fff;
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
  font-size: 24px;
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
  gap: 10px;
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

@media screen and (max-width: 1024px) {
  .camelot-card {
    max-width: 100%;
  }
}
</style>
