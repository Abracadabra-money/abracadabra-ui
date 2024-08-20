<template>
  <div class="settings-popup" ref="popup">
    <div>
      <div class="title-wrap">
        <p class="title">Gas on Destination Chain</p>
        <Tooltip :tooltip="tooltip" />
        <img
          class="popup-close"
          @click="closePopup"
          src="@/assets/images/cross.svg"
          alt="Close popup"
        />
      </div>

      <div class="btns-wrap">
        <button
          :class="['setting-btn', { active: isNone }]"
          @click="updateInputValue('0')"
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
            :src="dstNativeTokenInfo.icon"
            alt="Icon"
            @click="updateInputValue(maxAmount)"
          />
          {{ dstNativeTokenInfo.symbol }}
        </div>
      </div>
      <p class="value-error">
        <span v-if="error">{{ error }}</span>
        <span v-else>&nbsp;</span>
      </p>
    </div>

    <div class="popup-footer">
      <BaseButton primary @click="actionHandler" :disabled="isDisableBtn"
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

<script lang="ts">
import Tooltip from "@/components/ui/icons/Tooltip.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { getEstimateSendFee } from "@/helpers/beam/getEstimateSendFeeNew";
import { trimZeroDecimals } from "@/helpers/numbers";
import { formatUnits, parseUnits } from "viem";
import type { BeamInfo, BeamConfig } from "@/helpers/beam/types";
import type { PropType } from "vue";
import { chainsConfigs } from "@/helpers/chains/configs";
import { mapGetters } from "vuex";
import gsap from "gsap";

export default {
  emits: ["onUpdateAmount", "closeSettings"],
  props: {
    beamInfoObject: {
      type: Object as PropType<BeamInfo>,
      required: true,
    },

    dstChainInfo: {
      type: Object as PropType<BeamConfig>,
      required: true,
    },

    dstNativeTokenAmount: {
      type: BigInt as any as PropType<bigint>,
      default: 0n,
    },

    mimAmount: {
      type: BigInt as any as PropType<bigint>,
      default: 0n,
    },
  },

  data() {
    return {
      fee: 0n,
      inputValue: trimZeroDecimals(
        formatUnits(
          this.dstNativeTokenAmount,
          this.beamInfoObject.tokenConfig.decimals
        )
      ),
      tooltip:
        "The default amount allows you to perform a couple of transactions (e.g. Approve + Swap). Once you approve the transfer in your wallet, the transaction gas amount will be higher than a regular transaction as this includes the selected amount of destination gas to be sent.",
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
    }),

    dstUpdatedInfo() {
      return this.beamInfoObject.destinationChainsInfo.find(
        (chain) => chain.chainConfig.chainId === this.dstChainInfo.chainId
      );
    },

    dstNativeTokenInfo() {
      const chainInfo = chainsConfigs.find(
        (chain) => chain.chainId === this.dstChainInfo.chainId
      );

      return {
        icon: chainInfo!.baseTokenIcon,
        symbol: chainInfo!.baseTokenSymbol,
        decimals: 18,
      };
    },

    fromNativeTokenInfo() {
      const chainInfo = chainsConfigs.find(
        (chain) => chain.chainId === this.beamInfoObject.fromChainConfig.chainId
      );

      return {
        icon: chainInfo!.baseTokenIcon,
        symbol: chainInfo!.baseTokenSymbol,
        balance: this.beamInfoObject.userInfo.nativeBalance,
        decimals: 18,
      };
    },

    isDefaultValue() {
      return this.inputValue == this.defaultValue;
    },

    defaultValue() {
      return this.beamInfoObject.fromChainConfig.defaultValue[
        this.dstChainInfo.chainId
      ];
    },

    maxAmount() {
      return formatUnits(this.dstUpdatedInfo!.dstConfigLookupResult, 18);
    },

    isNone() {
      return +this.inputValue === 0;
    },

    isValueChanged() {
      return this.parsedValue !== this.dstNativeTokenAmount;
    },

    tokenDecimal() {
      return this.beamInfoObject.tokenConfig.decimals;
    },

    parsedValue() {
      return parseUnits(this.inputValue, this.tokenDecimal);
    },

    isExceedMax() {
      return this.parsedValue > this.dstUpdatedInfo!.dstConfigLookupResult;
    },

    error() {
      if (isNaN(+this.inputValue)) return "Invalid value";

      if (this.isExceedMax)
        return `Error max value ${formatUnits(
          this.dstUpdatedInfo!.dstConfigLookupResult,
          18
        )}`;

      if (this.fee > this.fromNativeTokenInfo.balance && this.inputValue) {
        const gasAmount = parseFloat(
          formatUnits(this.fee - this.fromNativeTokenInfo.balance, 18)
        ).toFixed(4);

        return `Not enough gas ${gasAmount} ${this.fromNativeTokenInfo.symbol} needed`;
      }

      return false;
    },

    isDisableBtn() {
      return !!this.error || !this.isValueChanged;
    },
  },

  watch: {
    async inputValue(value, oldValue) {
      if (isNaN(value)) {
        this.inputValue = oldValue;
        return false;
      }

      this.updateFee();
    },
  },

  methods: {
    actionHandler() {
      this.$emit("onUpdateAmount", this.parsedValue);
      this.closePopup();
    },

    updateInputValue(value: any) {
      this.inputValue = value;
    },

    async updateFee() {
      if (this.isExceedMax) return 0;
      // @ts-ignore
      const { fees } = await getEstimateSendFee(
        this.beamInfoObject,
        this.dstChainInfo,
        this.account,
        this.parsedValue,
        this.mimAmount
      );

      const additionalFee = fees[0] / 100n;
      const updatedFee = fees[0] + additionalFee; // add 1% from base fee to be sure tx success
      if (!updatedFee) {
        this.fee = 0n;
        return;
      }
      this.fee = updatedFee;
    },

    closePopup() {
      this.closingAnimation();
      setTimeout(() => this.$emit("closeSettings"), 300);
    },

    openingAnimation() {
      gsap.fromTo(
        this.$refs.popup as gsap.TweenTarget,
        { scale: 0, opacity: 0 },
        { duration: 0.3, scale: 1, opacity: 1, ease: "power2.out" }
      );
    },

    closingAnimation() {
      gsap.to(this.$refs.popup as gsap.TweenTarget, {
        duration: 0.3,
        scale: 0,
        opacity: 0,
        ease: "power2.in",
      });
    },
  },

  mounted() {
    this.openingAnimation();
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
