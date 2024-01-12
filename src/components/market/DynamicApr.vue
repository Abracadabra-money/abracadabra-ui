<template>
  <div class="dynamic-apr" v-if="isShowDynamicApr">
    <div class="title">
      Leverage APR
      <TooltipIcon
        :width="20"
        :height="20"
        fill="#878B93"
        tooltip="Leverage APR"
      />
    </div>
    <div class="value">{{ openingApr }}%</div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
// @ts-ignore
import { getCollateralApr } from "@/helpers/collateralsApy";

export default {
  props: {
    cauldron: {
      type: Object,
      required: true,
    },
    multiplier: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      aprInfo: { value: 0, multiplier: 0 },
    };
  },

  computed: {
    isShowDynamicApr() {
      return this.aprInfo.value && this.multiplier;
    },

    openingApr() {
      return filters.formatToFixed(this.aprInfo.value * this.multiplier, 2);
    },
  },

  async created() {
    this.aprInfo = await getCollateralApr(this.cauldron);
  },

  components: {
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.dynamic-apr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
}

.title {
  gap: 4px;
  display: flex;
  align-items: center;
  color: #878b93;
}

.value {
  text-transform: uppercase;
}
</style>
