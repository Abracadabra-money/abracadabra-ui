<template>
  <div class="backdrop" @click.self="closePopup" ref="backdrop">
    <div :class="['box-popup', isBento ? 'bento-bg' : 'degen-bg']" ref="popup">
      <div class="box-header">
        <p class="title">
          <img class="bento-img" :src="boxIcon" alt="Box" />
          {{ title }} withdraw
        </p>

        <img
          class="close-img"
          src="@/assets/images/cross.svg"
          alt="Close popup"
          @click="closePopup"
        />
      </div>

      <p class="description">
        <span class="desc-line"> Withdraw your MIM from {{ title }} on </span>
        <span class="desc-line">
          <img :src="getChainIcon(infoObject.chainId)" class="mim-symbol" />
          {{ chainInfo?.chainName }} Network
        </span>
      </p>

      <BaseTokenInput
        class="withdraw-input"
        name="MIM"
        :icon="mimIcon"
        :decimals="18"
        :value="inputValue"
        @updateInputValue="onUpdateValue"
        :max="balance"
        :error="error"
      />

      <BaseButton @click="actionHandler" primary :disabled="isDisabled">
        {{ buttonText }}
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters, mapActions, mapMutations } from "vuex";
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import degenIcon from "@/assets/images/degenbox.svg";
import bentoIcon from "@/assets/images/bento-box.jpeg";
import mimIcon from "@/assets/images/tokens/MIM.png";
import { notificationErrorMsg } from "@/helpers/notification/notificationError";
import notification from "@/helpers/notification/notification";
import { formatTokenBalance } from "@/helpers/filters";
import actions from "@/helpers/bentoBox/actions";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import { getChainConfig } from "@/helpers/chains/getChainsInfo";
import { trimZeroDecimals } from "@/helpers/numbers";
import { formatUnits, parseUnits } from "viem";
import type { BentoBoxData } from "@/helpers/bentoBox/types";
import type { PropType } from "vue";
import gsap from "gsap";
import {
  backdropFadeIn,
  popupFadeIn,
  backdropFadeOut,
  popupFadeOut,
} from "@/helpers/animations/popup";

export default {
  props: {
    infoObject: {
      type: Object as PropType<BentoBoxData>,
      required: true,
    },
    isBento: { type: Boolean, default: false },
    isDeposit: { type: Boolean, default: false },
  },

  data() {
    return {
      inputValue: "",
      inputAmount: 0n,
      mimIcon,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
    }),

    parsedAmount() {
      return parseUnits(this.inputValue, 18);
    },

    boxIcon() {
      return this.isBento ? bentoIcon : degenIcon;
    },

    activeContract() {
      return this.isBento
        ? this.infoObject.bentoContractInfo
        : this.infoObject.degenContractInfo;
    },

    balance() {
      const balance = this.isDeposit
        ? this.infoObject.mimBalance
        : this.isBento
        ? this.infoObject.mimInBentoBalance
        : this.infoObject.mimInDegenBalance;

      return balance;
    },

    isDisabled() {
      return !this.isValid || !!this.error || !this.activeContract;
    },

    isValid() {
      return !!this.parsedAmount;
    },

    error() {
      if (Number(this.inputValue) > Number(formatUnits(this.balance, 18)))
        return `The value cannot be greater than ${formatUnits(
          this.balance,
          18
        )}`;
      return "";
    },

    title() {
      return `${this.isBento ? "BentoBox" : "DegenBox"} `;
    },

    buttonText() {
      return this.isDeposit ? "Deposit" : "Withdraw";
    },

    chainInfo() {
      return getChainConfig(this.infoObject.chainId);
    },
  },

  watch: {
    inputAmount(value: bigint) {
      if (value == 0n) {
        this.inputValue = "";
        return false;
      }

      this.inputValue = trimZeroDecimals(formatUnits(value, 18));
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    getChainIcon,
    formatTokenBalance,

    async actionHandler() {
      if (this.isDisabled) return false;
      await this.withdraw();
    },

    async withdraw() {
      const notificationId = await this.createNotification(
        notification.pending
      );
      const tokenAddress = this.infoObject.tokenInfo.address;
      const contractInfo = {
        address: this.activeContract!.address,
        abi: this.activeContract!.abi,
      };

      try {
        await actions.withdraw(
          contractInfo,
          tokenAddress,
          this.account,
          this.parsedAmount
        );
      } catch (error: any) {
        const errorNotification = {
          msg: await notificationErrorMsg(),
          type: "error",
        };
        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
        return;
      }

      await this.deleteNotification(notificationId);
      await this.createNotification(notification.success);
      this.closePopup();
    },

    setEmptyState() {
      this.inputAmount = 0n;
      this.inputValue = "";
    },

    onUpdateValue(value: bigint) {
      if (value === null) return this.setEmptyState();
      this.inputAmount = value;
    },

    openingAnimation() {
      backdropFadeIn(this.$refs.backdrop as gsap.TweenTarget);
      popupFadeIn(this.$refs.popup as gsap.TweenTarget);
    },

    closingAnimation() {
      backdropFadeOut(this.$refs.backdrop as gsap.TweenTarget);
      popupFadeOut(this.$refs.popup as gsap.TweenTarget);
    },

    closePopup() {
      this.closingAnimation();
      setTimeout(() => this.$emit("close"), 150);
    },
  },

  mounted() {
    this.openingAnimation();
  },

  components: { BaseTokenInput, BaseButton },
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

.bento-bg {
  background: url("../../assets/images/myPositions/bento-popup-img-big.png"),
    #101622;
}

.degen-bg {
  background: url("../../assets/images/myPositions/degen-popup-img-big.png"),
    #101622;
}

.box-popup {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 24px;
  padding: 32px;
  width: 533px;
  max-width: 100%;
  height: 351px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-repeat: no-repeat;
  background-position: 100% 100%;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  margin-top: 270px;
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.bento-img {
  width: 33px;
  object-fit: contain;
  margin-right: 8px;
}

.close-img {
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.close-img:hover {
  opacity: 0.7;
}

.title {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 24px;
}

.description {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}

.desc-line {
  display: flex;
  align-items: center;
  gap: 4px;
}

.withdraw-input {
  width: 100%;
}

@media screen and (max-width: 600px) {
  .bento-bg {
    background: url("../../assets/images/myPositions/bento-popup-img-small.png"),
      #101622;
  }

  .degen-bg {
    background: url("../../assets/images/myPositions/degen-popup-img-small.png"),
      #101622;
  }

  .box-popup {
    position: fixed;
    width: 100%;
    max-width: 100%;
    height: 100vh;
    border-radius: 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background-repeat: no-repeat;
    background-position: -80px 100%;
    box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
    backdrop-filter: blur(12.5px);
    margin-top: 0;
  }

  .title {
    font-size: 18px;
    font-weight: 500;
  }

  .desc-line {
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
