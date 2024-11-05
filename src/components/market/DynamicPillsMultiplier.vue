<template>
  <div class="dynamic-elixir-potions-wrap">
    <div class="dynamic-elixir-potions">
      <div class="row">
        <div class="title">
          Pills Multiplier
          <TooltipIcon
            :width="20"
            :height="20"
            fill="#FFF"
            tooltip="Leverage your position to gain bigger multiplier on Pills"
          />
        </div>
        <div class="value">{{ multiplier }}X</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { formatToFixed } from "@/helpers/filters";

export default {
  props: {
    multiplier: {
      type: Number,
      default: 1,
    },
  },

  components: {
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },

  methods: {
    formatToFixed,
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
  background: linear-gradient(90deg, #2d4a96 0%, rgba(116, 92, 210, 0) 100%);
}

.dynamic-elixir-potions {
  gap: 8px;
  display: flex;
  flex-direction: column;
  padding: 5px 12px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.385);
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.weekly {
  color: #99a0b2;
  font-size: 14px;
  line-height: 21px;
}

.weekly-value {
  color: #fff;
  font-weight: 500;
}
</style>
