<template>
  <div class="beam-info">
    <div class="info-tag">
      <span class="tag-title">Beaming Fee</span>
      <div class="tag-values">
        <span class="usd">{{ config.mimToUsd }}</span>
      </div>
    </div>

    <div class="info-tag">
      <span class="tag-title">Total gas cost</span>
      <div class="tag-values">
        <span class="token"
          >{{ config.totalGas }} {{ config.nativeSymbol }}</span
        >
        <span class="usd">{{ totalGasUsd }}</span>
      </div>
    </div>

    <div class="info-tag" v-if="!isNone">
      <span class="tag-title"
        >Convert to gas token
        <div class="convert-to-gas">
          <span class="gas-token">
            <img class="gas-token-icon" :src="config.srcTokenIcon" />
            <span class="gas-token-value">
              {{ originalTokenAmount }}
            </span>
          </span>

          <span>
            <img src="@/assets/images/arrow_right.svg" />
          </span>

          <span class="gas-token">
            <img class="gas-token-icon" :src="config.dstTokenIcon" />
            <span class="gas-token-value">
              {{ convertTokenAmount }}
            </span>
          </span>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index";

export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },

  computed: {
    totalGasUsd() {
      const totalGasUsd = this.config.totalGas * this.config.srcTokenPrice;
      return filters.formatUSD(totalGasUsd);
    },

    isNone() {
      return !+this.config.gasOnDst && !+this.config.dstTokenAmount;
    },

    originalTokenAmount() {
      if (!+this.config.gasOnDst) return `<0.001 ${this.config.nativeSymbol}`;
      return `${this.config.gasOnDst} ${this.config.nativeSymbol}`;
    },

    destinationTokenAmount() {
      return filters.formatToFixed(this.config.dstTokenAmount || "0.0", 3);
    },

    convertTokenAmount() {
      if (!+this.destinationTokenAmount)
        return `<0.001 ${this.config.dstTokenSymbol}`;
      return `${this.destinationTokenAmount} ${this.config.dstTokenSymbol}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.beam-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-self: stretch;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: rgba(58, 58, 58, 0.07);
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.info-tag {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag-title {
  color: #878b93;
  font-size: 14px;
  font-weight: 400;
}

.tag-values {
  display: flex;
  flex-direction: column;
  align-items: end;
}

.token {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.usd {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 400;
}

.convert-to-gas {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.gas-token {
  display: flex;
  align-items: center;
  gap: 6px;
}

.gas-token-icon {
  width: 20px;
  height: 20px;
}

.gas-token-value {
  color: #fff;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
}
</style>
