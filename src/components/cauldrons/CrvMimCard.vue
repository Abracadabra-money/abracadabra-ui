<template>
  <a
    class="camelot-card"
    href="https://curve.fi/#/arbitrum/pools/factory-stable-ng-11/deposit"
    target="_blank"
    rel="noreferrer noopener"
  >
    <p class="primary paragraph">
      <span class="card-title">NEW V3 POOL</span>
      <span class="on-camelot">ON CURVE</span>
      <span class="token-pair">CRV / MIM</span>
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
.camelot-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 20px 10px 20px;
  height: 160px;
  max-width: 416px;
  width: 100%;
  background-image: url("@/assets/images/cauldrons/background_camelot.png");
  border-radius: 16px;
  border: 1px solid #2d4a96;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
  background-position: 100% 50%;
  background-size: 100%;
  background-size: cover;
  background-repeat: no-repeat;
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
