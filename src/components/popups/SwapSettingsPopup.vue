<template>
  <div class="settings-wrap" v-click-outside="closePopup">
    <button class="settings-button" @click="() => (showPopup = !showPopup)">
      <SetingIcon />
    </button>

    <div class="settings-popup" v-if="showPopup">
      <h3 class="title">Transaction Setting</h3>

      <div>
        <h4 class="subtitle">
          MEV protected slippage

          <TooltipIcon
            :width="20"
            :height="20"
            fill="#878B93"
            tooltip="tooltip"
          />
        </h4>

        <div class="row">
          <input
            class="input"
            v-model="slippageValue"
            min="0"
            max="100"
            step="1"
            type="text"
            placeholder="1 - 100"
          />

          <button
            :class="['auto-button', { active: isActiveAutoButton }]"
            @click="getDefaultSlippage"
          >
            Auto
          </button>
        </div>
      </div>

      <div>
        <h4 class="subtitle">
          Swap deadline

          <TooltipIcon
            :width="20"
            :height="20"
            fill="#878B93"
            tooltip="tooltip"
          />
        </h4>

        <input
          class="input deadline-input"
          v-model="deadlineValue"
          min="0"
          max="100"
          step="1"
          type="text"
          placeholder="0.10 min"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits, parseUnits } from "viem";
import { formatToFixed } from "@/helpers/filters";
import { defineAsyncComponent, type PropType } from "vue";
import { PERCENT_PRESITION } from "@/helpers/cauldron/utils";

export default {
  props: {
    slippage: {
      type: BigInt as unknown as PropType<bigint>,
      default: parseUnits("1", PERCENT_PRESITION),
    },
    defaultSlippage: {
      type: BigInt as unknown as PropType<bigint>,
      default: parseUnits("1", PERCENT_PRESITION),
    },
    deadline: {
      type: BigInt as unknown as PropType<bigint>,
      default: parseUnits("20", PERCENT_PRESITION),
    },
  },

  data() {
    return {
      showPopup: false,
      slippageValue: this.getFormattedAmount(this.slippage) as number,
      deadlineValue: this.getFormattedAmount(this.deadline) as number,
    };
  },

  computed: {
    isActiveAutoButton(): boolean {
      return (
        this.slippageValue !==
        +formatUnits(this.defaultSlippage, PERCENT_PRESITION)
      );
    },
  },

  watch: {
    slippageValue(value, oldValue): void {
      if (!value) return this.$emit("updateSlippageValue", 0n);
      if (isNaN(value)) this.slippageValue = Number(oldValue);
      if (Number(value) > 100) this.slippageValue = 100;
      else this.slippageValue = Number(value);

      this.$emit(
        "updateSlippageValue",
        parseUnits(String(this.slippageValue), PERCENT_PRESITION)
      );
    },

    deadlineValue(value, oldValue): void {
      if (!value) return this.$emit("updateDeadlineValue", 0n);
      if (isNaN(value)) this.deadlineValue = Number(oldValue);
      else this.deadlineValue = Number(value);

      this.$emit(
        "updateDeadlineValue",
        parseUnits(String(this.deadlineValue), PERCENT_PRESITION)
      );
    },
  },

  methods: {
    getDefaultSlippage(): void {
      this.slippageValue = this.getFormattedAmount(this.defaultSlippage);
    },

    getFormattedAmount(amount: bigint): number {
      const parsedAmount = formatUnits(amount, PERCENT_PRESITION);
      return Number(formatToFixed(parsedAmount, PERCENT_PRESITION));
    },

    closePopup(): void {
      this.showPopup = false;
    },
  },

  components: {
    SetingIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/SetingIcon.vue")
    ),
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.settings-button {
  width: 52px;
  height: 52px;
  outline: transparent;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #2d4a96;
  background: rgba(25, 31, 47, 0.38);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  cursor: pointer;
}

.settings-popup {
  position: absolute;
  top: 80px;
  right: 0;
  z-index: 10;
  max-width: 373px;
  width: 100%;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
}

.subtitle {
  gap: 8px;
  display: flex;
  align-items: center;
  color: #878b93;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 8px;
}

.row {
  gap: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.input {
  border-radius: 12px;
  border: 1px solid rgba(73, 70, 97, 0.4);
  background: rgba(8, 14, 31, 0.6);
  padding: 8px 22px;
  outline: transparent;
  color: #fff;
  height: 40px;
  max-width: 182px;
  width: 100%;
  font-weight: 500;
  line-height: 150%;
}

.deadline-input {
  max-width: 110px;
}

.auto-button {
  border-radius: 10px;
  border: 2px solid #7088cc;
  background: rgba(255, 255, 255, 0.01);
  padding: 8px 24px;
  color: #7088cc;
  font-size: 14px;
  font-weight: 600;
  height: 40px;
  max-width: 143px;
  width: 100%;
  cursor: pointer;
}

.active {
  color: #fff;
  background: #7088cc;
}
</style>
