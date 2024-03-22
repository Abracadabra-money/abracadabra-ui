<template>
  <div class="farms-info">
    <div class="title-desc">
      <h3 class="title">MIM Pools</h3>
      <h4 class="subtitle">
        Use your favourite assets as collateral to borrow
      </h4>
      <h4 class="subtitle">
        <img
          class="mim-icon"
          src="@/assets/images/PixelMIM.svg"
          alt="Mim icon"
        />
        Magic Internet Money, a leading decentralised and collateral-backed
        stablecoin.
      </h4>
    </div>

    <div class="info-cards">
      <div class="info-card">
        <h4 class="card-title">Total Value Locked</h4>
        <div class="card-values">
          <span class="token-amount">
            {{ formattedTvl.amount }}
          </span>
          <span class="token-usd-equivalent">{{ formattedTvl.usd }}</span>
        </div>
      </div>

      <div class="info-card">
        <h4 class="card-title">Total Fees Generated</h4>
        <div class="card-values">
          <span class="token-amount">
            {{ formattedFeesGenerated.amount }}
          </span>
          <span class="token-usd-equivalent">
            {{ formattedFeesGenerated.usd }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";

export default {
  props: {
    totalAssetsData: {
      type: Object,
    },
  },

  computed: {
    ...mapGetters({ account: "getAccount" }),

    formattedTvl() {
      return {
        amount: formatTokenBalance(100),
        usd: formatUSD(100),
      };
    },

    formattedFeesGenerated() {
      return {
        amount: formatTokenBalance(100),
        usd: formatUSD(100),
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.farms-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  line-height: 150%;
}

.subtitle {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  line-height: 150%;
}

.mim-icon {
  width: 24px;
  height: 24px;
}

.info-cards {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.info-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 24px;
  width: 262px;
  height: 102px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: url("../../assets/images/farm/reward-card-background.png"),
    linear-gradient(
      146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%
    );
  background-repeat: no-repeat;
  background-position: 0 16px;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.card-title {
  color: #99a0b2;
  font-size: 16px;
  font-weight: 500;
}

.card-values {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.token-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  color: #fff;
  font-size: 28px;
  font-weight: 500;
}

.token-usd-equivalent {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
}

@media screen and (max-width: 1050px) {
  .farms-info {
    flex-direction: column;
    gap: 16px;
  }

  .info-cards {
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media screen and (max-width: 620px) {
  .info-card {
    width: 100%;
    height: 90px;
  }
}
</style>
