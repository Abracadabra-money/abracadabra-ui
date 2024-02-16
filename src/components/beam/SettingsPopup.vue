<template>
  <div class="settings-popup">
    <div>
      <div class="title-wrap">
        <p class="title">Gas on Destination Chain</p>
        <Tooltip :tooltip="tooltip" />
        <img
          class="popup-close"
          @click="$emit('closeSettings')"
          src="@/assets/images/cross.svg"
          alt="Close popup"
        />
      </div>

      <div class="btns-wrap">
        <button
          :class="['setting-btn', { active: isNone }]"
          @click="updateInputValue(0)"
        >
          None
        </button>
        <button
          :class="['setting-btn', { active: isDefaultValue }]"
          @click="updateInputValue(defaultValue)"
        >
          Default
        </button>
      </div>

      <div class="input-wrap">
        <input
          class="input"
          v-model="inputValue"
          type="text"
          placeholder="0.0"
        />

        <div class="input-token-info">
          <img
            class="input-icon"
            :src="config.icon"
            alt="Icon"
            @click="updateInputValue(max)"
          />
          {{ config.symbol }}
        </div>
      </div>
      <p class="value-error">
        <span v-if="error">{{ error }}</span>
        <span v-else>&nbsp;</span>
      </p>
    </div>

    <div class="popup-footer">
      <BaseButton primary @click="actionHandler" :disabled="isDisabledBtn"
        >Save</BaseButton
      >
      <p class="footer-text">
        <a
          class="bottom-link"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          >Learn more</a
        >
        <span>about MIM being an Omnichain Fungible Tokens</span>
      </p>
    </div>
  </div>
</template>

<script>
import Tooltip from "@/components/ui/icons/Tooltip.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { getEstimateSendFee } from "@/helpers/beam/getEstimateSendFee.ts";

export default {
  props: {
    value: {
      type: [Number, String],
      default: "",
    },
    mimAmount: {
      type: [Number, String],
      default: "",
    },
    config: {
      type: Object,
      required: true,
    },
    max: {
      type: [Number, String],
      default: 0,
    },
    defaultValue: {
      type: String,
      default: "0",
    },
  },

  data() {
    return {
      fee: 0,
      inputValue: this.value,
      tooltip:
        "The default amount allows you to perform a couple of transactions (e.g. Approve + Swap). Once you approve the transfer in your wallet, the transaction gas amount will be higher than a regular transaction as this includes the selected amount of destination gas to be sent.",
    };
  },

  computed: {
    isDefaultValue() {
      return this.inputValue == this.defaultValue;
    },

    isNone() {
      return this.inputValue === 0;
    },

    isDisabledBtn() {
      if (!this.inputValue.toString().length) return true;
      return !!this.error;
    },

    error() {
      if (+this.inputValue > +this.max) {
        this.$emit("errorSettings", true);
        return `Error max value ${this.max}`;
      }

      if (+this.fee > +this.config.nativeTokenBalance && this.inputValue) {
        this.$emit("errorSettings", true);
        return `Not enough gas ${+this.fee - +this.config.nativeTokenBalance} ${
          this.config.nativeSymbol
        } needed`;
      }

      this.$emit("errorSettings", false);
      return false;
    },
  },

  watch: {
    async inputValue(value, oldValue) {
      if (isNaN(value)) {
        this.inputValue = oldValue;
        return false;
      }

      this.fee = await this.updateFee(value);
    },
  },

  methods: {
    isDisableBtn() {
      return !!this.error;
    },

    actionHandler() {
      if (this.error || !this.inputValue.toString().length) return false;
      this.$emit("changeSettings", this.inputValue);
      this.$emit("closeSettings");
    },

    updateInputValue(value) {
      this.inputValue = value;
    },

    async updateFee(value) {
      if (!this.mimAmount || value > this.max) return 0;
      const { fees } = await getEstimateSendFee(
        this.config.contract,
        this.config.address,
        this.config.dstChainId,
        value,
        this.mimAmount || "0"
      );

      const additionalFee = fees[0].div(100);
      const updatedFee = fees[0].add(additionalFee); // add 1% from base fee to be sure tx success
      if (!updatedFee) return 0;
      return this.$ethers.utils.formatEther(updatedFee);
    },
  },

  components: {
    Tooltip,
    BaseButton,
  },
};
</script>

<style lang="scss" scoped>
.settings-popup {
  display: flex;
  flex-direction: column;
  gap: 40px;
  height: 100%;
  width: 100%;
  padding: 28px 28px 38px 28px;
  border-radius: 20px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 40px;
}

.popup-close {
  margin-left: auto;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.popup-close:hover {
  opacity: 0.7;
}

.btns-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 15px;
}

.setting-btn {
  width: 100%;
  padding: 12px 40px;
  border-radius: 16px;
  border: 2px solid #7088cc;
  background: rgba(255, 255, 255, 0.01);
  color: #7088cc;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.setting-btn:hover,
.setting-btn.active {
  color: #7088cc;
  border: 2px solid #86a2f1;
  background: rgba(255, 255, 255, 0.05);
}

.input-wrap {
  display: flex;
  align-items: center;
  height: 70px;
  align-self: stretch;
  padding: 0px 14px;
  border-radius: 16px;
  border: 1px solid rgba(73, 70, 97, 0.4);
  background: rgba(8, 14, 31, 0.6);
}

.input-icon {
  max-width: 30px;
  margin-left: 15px;
}

.input {
  width: 100%;
  padding: 0 15px;
  border: none;
  outline: none;
  color: #fff;
  background: transparent;
}

.settings-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.input-token-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.popup-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.footer-text {
  text-align: center;
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  max-width: 45%;
}

.bottom-link {
  text-decoration: underline;
  color: white;
  margin-right: 5px;
}

.value-error {
  color: $clrError;
  font-size: 10px;
  margin-top: 5px;
  margin-left: 10px;
}
</style>
