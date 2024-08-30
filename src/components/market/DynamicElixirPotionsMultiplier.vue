<template>
  <div class="dynamic-elixir-potions-wrap">
    <div class="dynamic-elixir-potions">
      <div class="title">
        Elixir Potions Multiplier
        <TooltipIcon
          :width="20"
          :height="20"
          fill="#FFF"
          tooltip="Leverage your position to gain bigger multiplier on Elixir Potions"
        />
      </div>
      <div class="value">{{ estimationResult }}X</div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatToFixed } from "@/helpers/filters";
import { defineAsyncComponent } from "vue";

const ELIXIR_POTIONS_BASE_MULTIPLIER = 5;

export default {
  props: {
    multiplier: {
      type: Number,
      default: 1,
    },
  },

  computed: {
    estimationResult() {
      return formatToFixed(ELIXIR_POTIONS_BASE_MULTIPLIER * this.multiplier, 2);
    },
  },

  components: {
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.dynamic-elixir-potions-wrap {
  display: flex;
  padding: 1px;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  background: linear-gradient(
    270deg,
    rgb(255, 229, 124) 0%,
    rgb(255, 67, 195) 52.6%,
    rgb(65, 86, 224) 100%
  );
}

.dynamic-elixir-potions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 12px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.385);
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
}

.title {
  gap: 4px;
  display: flex;
  align-items: center;
  color: #ffffff;
}

.value {
  text-transform: uppercase;
}
</style>
