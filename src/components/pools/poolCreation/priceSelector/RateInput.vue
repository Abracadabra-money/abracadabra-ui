<template>
  <div class="wrap">
    <div class="val-input">
      <input
        name="tokenInput"
        class="text-field"
        v-model="inputValue"
        type="text"
        placeholder="0.0"
        :disabled="disabled"
      />

      <div class="token-info" v-tooltip="tooltip">
        <BaseTokenIcon :icon="icon" :name="name" size="24px" />
        <span class="token-name">{{ name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RATE_DECIMALS } from "@/constants/pools/poolCreation";
import { formatToFixed } from "@/helpers/filters";
import { parseUnits } from "viem";
import { defineAsyncComponent } from "vue";

export default {
  props: {
    value: { type: String, default: "" },
    icon: { type: String },
    name: { type: String, default: "Select Token" },
    decimals: { type: Number, default: RATE_DECIMALS },
    disabled: { type: Boolean, default: false },
  },

  data() {
    return {
      inputValue: this.value,
      tooltip: "",
    };
  },

  watch: {
    inputValue(value, oldValue) {
      if (!value) {
        this.$emit("updateInputValue", null);
        return;
      }

      if (isNaN(value)) {
        this.inputValue = oldValue;
        return false;
      }

      this.updateInputValue(value, this.decimals);
    },

    value(value) {
      this.inputValue = value;
    },
  },

  methods: {
    updateInputValue(value: string, decimals: number) {
      const emitValue = !value
        ? BigInt(0)
        : parseUnits(formatToFixed(value, decimals), decimals);

      this.$emit("updateInputValue", emitValue);
    },
  },

  mounted() {
    if (this.name.length > 12) {
      this.tooltip = this.name;
    }
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
}

.val-input {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 22px;
  border-radius: 16px;
  border: 1px solid rgba(73, 70, 97, 0.4);
  background: rgba(8, 14, 31, 0.6);
  width: 100%;
  min-height: auto;
}

.token-input-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
  height: 100%;
  max-width: 50%;
}

.text-field {
  height: 32px;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  background-color: transparent;
  border: none;
  max-width: 95%;
  width: 100%;
}

.text-field:focus {
  outline: none;
  border: none;
}

.token-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(111, 111, 111, 0.06);
  padding: 4px;
  height: 36px;
}

.token-name {
  text-wrap: nowrap;
}
</style>
