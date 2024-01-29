<template>
  <div class="card-background">
    <a
      class="card"
      href="https://curve.fi/#/arbitrum/pools/factory-stable-ng-11/deposit"
      target="_blank"
      rel="noreferrer noopener"
    >
      <p class="primary paragraph">
        <span class="card-title">NEW POOL</span>
        <span class="subtitle">On Curve finance</span>
        <span class="token-pair">crvUSD / MIM</span>
      </p>
      <ul class="secondary paragraph" v-if="tvl && apr">
        <li>
          <span class="title">TVL:</span>
          <span class="value">${{ formatLargeSum(tvl) }}</span>
        </li>
        <li>
          <span class="title">APR:</span>
          <span class="value">{{ apr }}</span>
        </li>
      </ul>
    </a>
  </div>
</template>

<script>
import { fetchCrvMimCardsInfo } from "@/helpers/fetchCrvMimCardsInfo";
import filters from "@/filters/index";

export default {
  data() {
    return {
      tvl: null,
      apr: null,
    };
  },

  methods: {
    formatLargeSum(value) {
      return filters.formatLargeSum(value);
    },

    formatPercent(value) {
      return filters.formatPercent(value);
    },

    async fetchData() {
      const { tvl, apr } = await fetchCrvMimCardsInfo();
      this.tvl = tvl;
      this.apr = this.formatPercent(apr);
    },
  },

  async created() {
    await this.fetchData();
  },
};
</script>

<style lang="scss" scoped>
.card-background {
  background: linear-gradient(146deg, #1a0604 0%, #000 101.49%);
  border-radius: 16px;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 20px 11px 20px;
  height: 201px;
  width: 302px;
  background-image: url("@/assets/images/cards/background-crv-usd-mim.png");
  border-radius: 16px;
  border: 1px solid #2d4a96;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
  background-position: 50% 50%;
  background-size: 100%;
  background-repeat: no-repeat;
  color: white;

  font-weight: 600;
  transition: 0.3s;
}

.card:hover {
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
  text-transform: uppercase;
}

.subtitle {
  color: #ffbc01;
  font-size: 20px;
  text-transform: uppercase;
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
