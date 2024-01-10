<template>
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
        <span class="value">${{ formatLargeSum(tvl) }}</span>
      </li>
      <li>
        <span class="title">APR:</span>
        <span class="value">{{ aprRange }}</span>
      </li>
    </ul>
  </a>
</template>

<script>
import { fetchCamelotArbInfo } from "@/helpers/fetchCamelotCardsInfo";
import filters from "@/filters/index";

export default {
  data() {
    return {
      tvl: null,
      aprRange: null,
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
      const { tvl, apr } = await fetchCamelotArbInfo();
      this.tvl = tvl;
      this.aprRange = `${this.formatPercent(apr.min)} - ${this.formatPercent(
        apr.max
      )}`;
    },
  },

  async created() {
    await this.fetchData();
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.camelot-card {
  @include font;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 20px 10px 20px;
  height: 160px;
  max-width: 416px;
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
