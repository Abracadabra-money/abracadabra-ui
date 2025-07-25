<template>
  <div class="backdrop" @click.self="closePopup">
    <div class="slippage-coefficient-popup">
      <div class="popup-header">
        <h3 class="title">Slippage Coefficient</h3>

        <img
          class="close-img"
          src="@/assets/images/cross.svg"
          alt="Close popup"
          @click="closePopup"
        />
      </div>

      <p class="description">
        As a Founder, you're eligible to migrate your MLP from Blast to Arbitrum
      </p>

      <ul class="slippage-coefficient-options">
        <li
          :class="['slippage-coefficient-option', type]"
          v-for="{ value, type, description, index } in slippageCoefficients"
          :key="index"
          @click="selectOption(value, index)"
        >
          <div class="status-flag" v-if="type != 'default'">
            <span class="status-text"> Safe </span>
          </div>
          <span class="slippage-coefficient-value"
            >K={{ formatKValue(value) }}</span
          >
          <p class="slippage-coefficient-description">
            {{ description }}
          </p>
          <RadioButton
            :active="checkActiveOption(index) && !isCustomCoefficient"
          />
        </li>

        <li class="slippage-coefficient-option custom" @click="selectCustom">
          <span class="slippage-coefficient-value">Custom</span>
          <input
            :class="['custom-slippage-input', { 'error-input': !!error }]"
            placeholder="0.00"
            min="0"
            max="0.1"
            v-model="customCoefficient"
          />
          <p class="error-message" v-if="error">{{ error }}</p>
          <RadioButton :active="isCustomCoefficient" />
        </li>
      </ul>

      <BaseButton primary :disabled="!!error" @click="selectKvalue">
        Select
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type Prop } from "vue";
import { formatUnits, parseUnits } from "viem";
import { K_VALUE_DECIMALS } from "@/constants/pools/poolCreation";

export default {
  props: {
    kValue: BigInt as Prop<bigint>,
  },

  data() {
    return {
      currentCoefficientIndex: 0,
      isCustomCoefficient: false,
      customCoefficient: "",
      coefficientToEmit: this.kValue || 0n,
    };
  },

  computed: {
    slippageCoefficients() {
      return [
        {
          value: this.parseCoefficientToBigint("0.0001"),
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing",
          type: "safe",
          index: 0,
        },
        {
          value: this.parseCoefficientToBigint("0.00025"),
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing",
          type: "default",
          index: 1,
        },
        {
          value: this.parseCoefficientToBigint("0.002"),
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing",
          type: "default",
          index: 2,
        },
      ];
    },

    error() {
      if (
        !this.customCoefficient ||
        (Number(this.customCoefficient) > 0 &&
          Number(this.customCoefficient) <= 0.1)
      )
        return null;
      return "The slippage coefficient needs to be greater then 0, and less than 0.1";
    },
  },

  watch: {
    customCoefficient(value, oldValue) {
      if (!this.isCustomCoefficient) return;

      if (!value) {
        this.customCoefficient = "";
        return;
      }

      if (isNaN(value)) {
        this.customCoefficient = oldValue;
        return false;
      }

      this.coefficientToEmit = this.parseCoefficientToBigint(value);
    },

    kValue: {
      handler(kValue) {
        const chosenOption = this.slippageCoefficients.find(
          ({ value }) => value == this.kValue
        );

        if (!chosenOption) {
          this.isCustomCoefficient = true;
        } else {
          this.currentCoefficientIndex = chosenOption.index;
        }

        this.customCoefficient = this.isCustomCoefficient
          ? this.formatKValue(kValue || 0n)
          : "";
      },
      immediate: true,
    },
  },

  methods: {
    checkActiveOption(optionIndex: number) {
      return this.currentCoefficientIndex == optionIndex;
    },

    selectOption(value: bigint, optionIndex: number) {
      this.isCustomCoefficient = false;
      this.currentCoefficientIndex = optionIndex;
      this.coefficientToEmit = value;
    },

    selectCustom() {
      if (this.isCustomCoefficient) return;
      this.isCustomCoefficient = true;
      this.coefficientToEmit = 0n;
    },

    formatKValue(KValue: bigint | null) {
      if (!KValue) return "";
      return formatUnits(KValue, K_VALUE_DECIMALS);
    },

    closePopup() {
      this.$emit("close");
    },

    parseCoefficientToBigint(coefficient: string | number) {
      return parseUnits(coefficient.toString(), K_VALUE_DECIMALS);
    },

    selectKvalue() {
      this.$emit("selectKValue", this.coefficientToEmit);
      this.closePopup();
    },
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    RadioButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/RadioButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 300;
  display: flex;
  justify-content: center;
  background: rgba(25, 25, 25, 0.1);
  backdrop-filter: blur(10px);
}

.slippage-coefficient-popup {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  height: fit-content;
  width: 533px;
  margin-top: 163px;
  padding: 32px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  overflow-y: auto;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.close-img {
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.close-img:hover {
  opacity: 0.7;
}

.slippage-coefficient-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.slippage-coefficient-option {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.slippage-coefficient-value {
  font-size: 18px;
  font-weight: 500;
}

.slippage-coefficient-description {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
}

.slippage-coefficient-option.active {
  border: 1px solid #2d4a96;
}

.slippage-coefficient-option.safe {
  color: white;
  border: 1px solid #67a069;
}

.status-flag {
  position: relative;
  top: -12px;
  left: -12px;
  width: 86px;
  height: 26px;
  border-radius: 12px 0px 16px 0px;
  background: #67a069;
  text-align: center;
}

.radio-button {
  position: absolute;
  top: 8px;
  right: 8px;
}

.custom-slippage-input {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  align-self: stretch;
  gap: 10px;
  height: 62px;
  padding: 0px 14px;
  border-radius: 16px;
  border: 1px solid rgba(73, 70, 97, 0.4);
  background: rgba(8, 14, 31, 0.6);
  color: white;
}

.error-input {
  border: 1px solid #8c4040;
}

.error-message {
  padding: 0 8px;
  color: #8c4040;
  font-family: Prompt;
  font-size: 14px;
  font-weight: 400;
}

.default-button {
  min-height: fit-content;
}

@media (max-width: 600px) {
  .slippage-coefficient-popup {
    width: 100%;
    height: 100%;
    margin-top: 0;
    padding: 20px 16px;
    border-radius: 0;
  }
}
</style>
