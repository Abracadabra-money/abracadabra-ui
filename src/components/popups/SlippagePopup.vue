<template>
  <div class="slippage-popup">
    <div class="title-wrap">
      <h3 class="title">Transaction overview</h3>

      <TooltipIcon :width="24" :height="24" tooltip=" Collateral Deposit" />
    </div>

    <div class="row">
      <input class="input" v-model="inputValue" type="text" placeholder="0.0" />

      <button
        :class="['auto-button', { active: isActiveAutoButton }]"
        @click="getDefaultSlippage"
      >
        Auto
      </button>
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
  },
};
</script>
<style lang="scss" scoped>
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
}

.title-wrap {
  display: flex;
  gap: 4px;
  align-items: center;
}

.title {
  color: #fff;
  font-weight: 500;
  line-height: 150%;
}

.row {
  display: flex;
  gap: 16px;
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
