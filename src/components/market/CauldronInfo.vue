<template>
  <div class="cauldron-info">
    <div class="row head-row">
      <h3 class="title">Cauldron Stats</h3>
      <div class="apr" v-if="loopApr">
        <TooltipIcon
          :width="20"
          :height="20"
          fill="#878B93"
          tooltip="Annualised Percentage Return Range given by the collateral."
        />
        <span>APR:</span>
        <span>{{ loopApr }}</span>
      </div>
    </div>

    <div class="cauldron-fees">
      <div class="fees-row">
        <div class="fees-title">
          Mint Fee
          <TooltipIcon
            :width="20"
            :height="20"
            fill="#878B93"
            tooltip="Fee charged on the amount of MIM minted from the cauldron."
          />
        </div>
        <div class="fees-percent">{{ cauldron.mainParams.borrowFee }}%</div>
      </div>
      <div class="fees-row">
        <div class="fees-title">
          Interest Fee
          <TooltipIcon
            :width="20"
            :height="20"
            fill="#878B93"
            tooltip="Annualised percent that your debt will increase each year."
          />
        </div>
        <div class="fees-percent">{{ cauldron.mainParams.interest }}%</div>
      </div>
      <div class="fees-row">
        <div class="fees-title">
          Liquidation Fee
          <TooltipIcon
            :width="20"
            :height="20"
            fill="#878B93"
            tooltip="The discount that a liquidator will receive when repaying open borrow positions that are flagged for liquidation."
          />
        </div>
        <div class="fees-percent">
          {{ cauldron.mainParams.liquidationFee }}%
        </div>
      </div>
      <div class="fees-row">
        <div class="fees-title">
          MCR
          <TooltipIcon
            :width="20"
            :height="20"
            fill="#878B93"
            tooltip="Maximum collateral ratio (MCR) represents the maximum amount of debt a user can borrow against the current value of the collateral token."
          />
        </div>
        <div class="fees-percent">{{ cauldron.config.mcr }}%</div>
      </div>
    </div>

    <div class="chart-wrap">
      <MimLeftToBorrow :cauldron="cauldron" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { formatToFixed } from "@/helpers/filters";
// @ts-ignore
import { getCollateralApr } from "@/helpers/collateralsApy";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
  },

  data() {
    return {
      aprInfo: { value: 0, multiplier: 0 },
    };
  },

  computed: {
    loopApr() {
      if (this.aprInfo.value) {
        return `${this.aprInfo.value}% - ${formatToFixed(
          this.aprInfo.value * this.aprInfo.multiplier,
          2
        )}%`;
      }
      return false;
    },
    chartData() {
      return {
        max: 200,
        data: [{ value: 135.54 }],
      };
    },
  },

  async created() {
    this.aprInfo = await getCollateralApr(this.cauldron, true);
  },

  components: {
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
    MimLeftToBorrow: defineAsyncComponent(
      () => import("@/components/market/MimLeftToBorrow.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.cauldron-info {
  display: flex;
  padding: 24px;
  flex-direction: column;
  gap: 24px;
  max-height: 577px;
  border-radius: 16px;
  align-self: stretch;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.title {
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
}

.apr {
  gap: 4px;
  display: flex;
  align-items: center;
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 14px;
  font-weight: 600;
  line-height: 150%;
}

.cauldron-fees {
  width: 100%;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fees-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
}

.fees-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fees-title {
  display: flex;
  gap: 4px;
  align-items: center;
  color: #878b93;
  line-height: 150%;
}

.fees-percent {
  font-weight: 500;
  line-height: 18px;
}

.chart-wrap {
  height: 240px;
  width: 100%;
}

@media screen and (max-width: 1024px) {
  .cauldron-info {
    max-width: 640px;
    width: 100%;
    margin: 0 auto;
  }

  .head-row {
    flex-wrap: wrap;
    gap: 5px;
  }
}

@media screen and (max-width: 640px) {
  .fees-title,
  .fees-percent {
    font-size: 14px;
  }
}
</style>
