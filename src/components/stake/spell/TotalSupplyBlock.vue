<template>
  <div class="staking-apr">
    <img
      class="mim-icon"
      src="@/assets/images/market/m-icon.svg"
      alt="Mim icon"
    />

    <h3 class="title">
      Total Supply
      <Tooltip
        :tooltip="'Annualised Percentage Return Range.'"
        fill="#878B93"
        :width="20"
        :height="20"
      />
    </h3>
    <div class="value">${{ totalSupply }}</div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  props: {
    totalSupply: {
      type: [Number, String],
      required: true,
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
.staking-apr {
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

.mim-icon {
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
