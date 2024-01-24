<template>
  <div class="settings-wrap" v-click-outside="closePopup">
    <IconButton
      seting
      :width="26"
      :height="26"
      padding="4px"
      @click="() => (showPopup = !showPopup)"
    />

    <div class="slippage-popup" v-if="showPopup">
      <div class="title-wrap">
        <h3>Slippage settings</h3>

        <TooltipIcon
          :width="24"
          :height="24"
          tooltip="Transaction will revert if the leveraged amount changes by this percent."
        />
      </div>

      <div class="row">
        <input
          class="input"
          v-model="inputValue"
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
  </div>
</template>
<script lang="ts">
// @ts-ignore
import filters from "@/filters/index.js";
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { PERCENT_PRESITION } from "@/helpers/cauldron/utils";

export default {
  props: {
    amount: {
      type: BigNumber,
      default: utils.parseUnits("1", PERCENT_PRESITION),
    },
    defaultAmount: {
      type: BigNumber,
      default: utils.parseUnits("1", PERCENT_PRESITION),
    },
  },

  data() {
    return {
      showPopup: false,
      inputValue: this.getFormattedAmount(this.amount),
    };
  },

  computed: {
    isActiveAutoButton(): boolean {
      return this.inputValue !== this.defaultAmount;
    },
  },

  watch: {
    inputValue(value, oldValue) {
      if (!value) return this.$emit("updateSlippage", BigNumber.from(0));
      if (isNaN(value)) this.inputValue = Number(oldValue);
      if (Number(value) > 100) this.inputValue = 100;
      else this.inputValue = Number(value);

      this.$emit(
        "updateSlippage",
        utils.parseUnits(String(this.inputValue), PERCENT_PRESITION)
      );
    },
  },

  methods: {
    getDefaultSlippage() {
      this.inputValue = this.getFormattedAmount(this.defaultAmount);
    },

    getFormattedAmount(amount: BigNumber) {
      const parsedAmount = utils.formatUnits(amount, PERCENT_PRESITION);
      return Number(filters.formatToFixed(parsedAmount, PERCENT_PRESITION));
    },

    closePopup() {
      this.showPopup = false;
    },
  },

  components: {
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
    IconButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/IconButton.vue")
    ),
  },
};
</script>
<style lang="scss" scoped>
.slippage-popup {
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
  gap: 16px;
  position: absolute;
  top: 42px;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 10;
}

.title-wrap {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 150%;
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

.auto-button {
  border-radius: 10px;
  border: 2px solid var(--Primary-Solid, #7088cc);
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

@media screen and (max-width: 360px) {
  .slippage-popup {
    left: -10%;
    width: 120%;
  }
}
</style>
