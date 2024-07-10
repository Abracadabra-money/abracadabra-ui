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
          v-for="(
            { value, valueBigint, type, description }, index
          ) in slippageCoefficients"
          :key="index"
          @click="selectOption(valueBigint)"
        >
          <div class="status-flag" v-if="type != 'default'">
            <span class="status-text"> Safe </span>
          </div>
          <span class="slippage-coefficient-value">K={{ value }}</span>
          <p class="slippage-coefficient-description">
            {{ description }}
          </p>
          <RadioButton :active="checkActiveOption(valueBigint)" />
        </li>

        <li
          class="slippage-coefficient-option custom"
          @click="selectOption(BigInt(customCoefficient))"
        >
          <span class="slippage-coefficient-value">Custom %</span>
          <input
            class="custom-slippage-input"
            type="number"
            placeholder="0.00"
            v-model="customCoefficient"
          />
          <RadioButton :active="currentCoefficientIndex == 3" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type Prop } from "vue";

export default {
  props: {
    kValue: BigInt as Prop<bigint>,
  },

  data() {
    return {
      currentCoefficientIndex: 0,
      customCoefficient: 0,
    };
  },

  computed: {
    slippageCoefficients() {
      return [
        {
          value: 0.0001,
          valueBigint: 100000000000000n,
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing",
          type: "safe",
        },
        {
          value: 0.00025,
          valueBigint: 250000000000000n,
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing",
          type: "default",
        },
        {
          value: 0.002,
          valueBigint: 2000000000000000n,
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing",
          type: "default",
        },
      ];
    },
  },

  methods: {
    checkActiveOption(valueBigint: bigint) {
      return this.kValue == valueBigint;
    },

    selectOption(valueBigint: bigint) {
      this.$emit("selectKValue", valueBigint);
    },

    closePopup() {
      this.$emit("close");
    },
  },

  components: {
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
</style>
