<template>
  <div class="expected-block">
    <div class="row">
      <p class="title">Estimated Gas Cost:</p>
      <p class="value">
        <span class="token">
          <img :src="data.srcTokenIcon" class="token-icon" /> {{ data.gasCost }}
          {{ data.srcTokenSymbol }}
        </span>
        <span class="usd">{{ estimatedGasCostUsd }}</span>
      </p>
    </div>

    <div class="row">
      <p class="title pointer" @click="$emit('open-settings')">
        Gas on Destination:
      </p>
      <p class="value pointer" @click="$emit('open-settings')">
        <span class="token">
          <img
            :src="data.dstTokenIcon"
            class="token-icon"
            v-if="data.dstTokenIcon"
          />
          {{ data.dstTokenAmount || "0.0" }}
          {{ data.dstTokenSymbol }}
        </span>
        <span class="usd">{{ gasOnDestinationUsd }}</span>
      </p>
    </div>

    <div class="row">
      <p class="title">Beaming Fee:</p>
      <p class="value">$ 1.00</p>
    </div>
  </div>
</template>

<script>
import { formatUSD } from "@/helpers/filters";

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },

  computed: {
    estimatedGasCostUsd() {
      const estimatedGasCostUsd = this.data.gasCost * this.data.srcTokenPrice;
      return formatUSD(estimatedGasCostUsd);
    },

    gasOnDestinationUsd() {
      const gasOnDestinationUsd =
        this.data.dstTokenAmount * this.data.dstTokenPrice;
      return formatUSD(gasOnDestinationUsd);
    },
  },
};
</script>

<style lang="scss" scoped>
.expected-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  padding: 12px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #99a0b2;
  font-size: 16px;
  font-weight: 400;
}

.title {
  color: rgba(255, 255, 255, 0.6);
}

.pointer {
  cursor: pointer;
}

.value {
  display: flex;
  flex-direction: column;
  align-items: end;
}

.token {
  display: flex;
  align-items: center;
  gap: 4px;
}

.usd {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
}

.token-icon {
  width: 20px;
  height: 20px;
  border-radius: 6px;
}

@media (max-width: 600px) {
  .row {
    font-size: 14px;
    font-weight: 400;
  }

  .value {
    text-align: right;
  }
}
</style>
