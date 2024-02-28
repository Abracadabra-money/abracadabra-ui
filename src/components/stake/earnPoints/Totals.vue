<template>
  <div class="totals-wrap">
    <div class="total">
      <img class="m-icon" src="@/assets/images/market/m-icon.svg" />

      <h3 class="title">
        Total deposited
        <Tooltip
          :tooltip="'Total deposited.'"
          fill="#878B93"
          :width="20"
          :height="20"
        />
      </h3>
      <div class="value">$ {{ totalDeposited }}</div>
    </div>

    <div class="total">
      <img
        class="m-icon"
        src="@/assets/images/market/m-icon.svg"
        alt="Mim icon"
      />

      <h3 class="title">
        Total Point Distributed
        <Tooltip
          :tooltip="'Total Point Distributed.'"
          fill="#878B93"
          :width="20"
          :height="20"
        />
      </h3>
      <div class="value">10000000</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";

export default {
  props: {
    stakeInfo: {
      type: Object,
      required: true,
    },
  },

  computed: {
    totalDeposited() {
      let totalDeposited = 0n;
      this.stakeInfo.tokensInfo.forEach(
        (token: any) => (totalDeposited += token.totals.total)
      );
      return this.formatTokenBalance(totalDeposited);
    },
  },

  methods: {
    formatTokenBalance(value: bigint) {
      return formatTokenBalance(formatUnits(value, 18));
    },
  },

  components: {
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.totals-wrap {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total {
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  padding: 24px;
  width: 100%;
  height: 150px;
  position: relative;
  overflow: hidden;
  gap: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.m-icon {
  position: absolute;
  top: 17px;
  left: -11px;
}

.title {
  color: #99a0b2;
  font-weight: 500;
  line-height: 150%;
  gap: 4px;
  display: flex;
  align-items: center;
}

.value {
  font-size: 32px;
  font-weight: 500;
  line-height: 32px;
}
</style>
