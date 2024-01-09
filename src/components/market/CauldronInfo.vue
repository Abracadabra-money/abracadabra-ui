<template>
  <div class="cauldron-info">
    <div class="row head-row">
      <h3 class="title">Cauldron Stats</h3>
      <div class="apr">
        <TooltipIcon :width="20" :height="20" fill="#878B93" tooltip="APR" />
        <span>APR:</span>
        <span>{{ loopApr }}</span>
      </div>
    </div>

    <div class="cauldron-fees">
      <!-- <h3 class="fees-title">Cauldron Fees</h3> -->

      <div class="fees-row">
        <div class="fees-title">
          <PercentIcon />
          Borrow fee
          <TooltipIcon
            :width="20"
            :height="20"
            fill="#878B93"
            tooltip="Borrow fee"
          />
        </div>
        <div class="fees-percent">{{ cauldron.mainParams.borrowFee }}%</div>
      </div>
      <div class="fees-row">
        <div class="fees-title">
          <PercentIcon />
          Interest fee
          <TooltipIcon
            :width="20"
            :height="20"
            fill="#878B93"
            tooltip="Interest fee"
          />
        </div>
        <div class="fees-percent">{{ cauldron.mainParams.interest }}%</div>
      </div>
      <div class="fees-row">
        <div class="fees-title">
          <PercentIcon />
          Liquidation fee
          <TooltipIcon
            :width="20"
            :height="20"
            fill="#878B93"
            tooltip="Liquidation fee"
          />
        </div>
        <div class="fees-percent">
          {{ cauldron.mainParams.liquidationFee }}%
        </div>
      </div>
      <div class="fees-row">
        <div class="fees-title">
          <PercentIcon />
          MCR
          <TooltipIcon
            :width="20"
            :height="20"
            fill="#878B93"
            tooltip="Liquidation fee"
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
import { getCollateralApr } from "@/helpers/collateralsApy";

// @ts-ignore
import filters from "@/filters/index.js";

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
        return `${this.aprInfo.value}% - ${filters.formatToFixed(
          this.aprInfo.value * this.aprInfo.multiplier,
          2
        )}%`;
      }
      return "-";
    },
    chartData() {
      return {
        max: 200,
        data: [{ value: 135.54 }],
      };
    },
  },

  async created() {
    this.aprInfo = await getCollateralApr(this.cauldron);
  },

  components: {
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
    PercentIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/PercentIcon.vue")
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
  .cauldron-info{
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
  .fees-title, .fees-percent {
    font-size: 14px;
  }
}
</style>
