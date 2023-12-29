<template>
  <div class="settings-wrap">
    <IconButton
      seting
      :width="26"
      :height="26"
      padding="4px"
      @click="() => (showSlippagePopup = !showSlippagePopup)"
    />

    <div class="slippage-popup" v-if="showSlippagePopup">
      <div class="title-wrap">
        <h3>Transaction overview</h3>

        <TooltipIcon :width="24" :height="24" tooltip=" Collateral Deposit" />
      </div>

      <div class="row">
        <input
          class="input"
          v-model="inputValue"
          type="text"
          placeholder="0.0"
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
import { utils } from "ethers";
import { defineAsyncComponent } from "vue";

export default {
  props: {
    defaultValue: {
      type: String,
      default: "0.1",
    },
  },

  data() {
    return {
      inputValue: this.defaultValue,
      showSlippagePopup: false,
    };
  },

  computed: {
    isActiveAutoButton() {
      return this.inputValue !== this.defaultValue;
    },
  },

  watch: {
    inputValue(value, oldValue) {
      if (isNaN(value)) this.inputValue = oldValue;
      else {
        this.inputValue = value;
        this.$emit("updateValue", utils.parseUnits(String(value), 2));
      }
    },
  },

  methods: {
    getDefaultSlippage() {
      this.inputValue = this.defaultValue;
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
.settings-wrap {
  position: relative;
}

.slippage-popup {
  max-width: 360px;
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
  width: 373px;
  position: absolute;
  top: 42px;
  left: 0;
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
</style>
