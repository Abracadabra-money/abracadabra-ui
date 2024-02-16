<template>
  <div :class="['bento-block', isBento ? 'bento-bg' : 'degen-bg']">
    <div class="bento-info">
      <img class="bento-img" :src="boxIcon" alt="Box" />
      <div class="bento-title-amount">
        <p class="bento-title">{{ title }}</p>
        <div class="bento-amount">
          <BaseTokenIcon :icon="mimIcon" name="MIM" size="24px" />
          <p class="token-balance">{{ formatTokenBalance(parsedBalance) }}</p>
        </div>
      </div>
    </div>

    <div class="bento-chains">
      <img
        :class="['chain-icon', { 'active-chain': chain == activeChain }]"
        v-for="chain in activeChains"
        :src="getChainIcon(chain)"
        :key="chain"
        @click="$emit('chooseActiveChain', chain)"
      />
    </div>

    <div class="button-description">
      <button
        class="withdraw-button"
        :disabled="isDisabled"
        @click="actionHandler"
      >
        {{ buttonText }}
      </button>

      <div class="description">
        <span class="description-text"> MIM Balance on {{ title }}</span>
        <a class="link" target="_blank" rel="noreferrer noopener" :href="link">
          <span class="link-text"> Read More</span>
          <img class="link-arrow" src="@/assets/images/farm-lp-arrow.svg" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { formatUnits } from "viem";
import degenIcon from "@/assets/images/degenbox.svg";
import mimIcon from "@/assets/images/tokens/MIM.png";
import bentoIcon from "@/assets/images/bento-box.jpeg";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";

export default {
  props: {
    isBento: { type: Boolean, default: false },
    balance: { type: [String, BigInt], default: "0" },
    mimPrice: { type: Number, default: 0 },
    activeChains: { type: Array },
    activeChain: { type: [Number, String] },
    currentChain: { type: [Number, String] },
  },

  data() {
    return {
      mimIcon,
      bentoLink: "intro/the-dashboard#mim-balance-on-bentobox",
      degenLink: "our-ecosystem/our-contracts#our-degenbox-contracts",
    };
  },

  computed: {
    isDisabled() {
      return !this.balance && this.isProperChain;
    },

    boxIcon() {
      return this.isBento ? bentoIcon : degenIcon;
    },

    title() {
      return !this.isBento ? "DegenBox" : "BentoBox";
    },

    buttonText() {
      return !this.isProperChain ? "Switch Network" : "Withdraw";
    },

    link() {
      const params = this.isBento ? this.bentoLink : this.degenLink;
      return `https://abracadabramoney.gitbook.io/${params}`;
    },

    parsedBalance() {
      return formatUnits(this.balance, 18);
    },

    balanceInUsd() {
      return this.parsedBalance * this.mimPrice;
    },

    isProperChain() {
      return this.currentChain == this.activeChain;
    },
  },

  methods: {
    formatUSD,
    getChainIcon,
    formatTokenBalance,

    actionHandler() {
      if (!this.isProperChain) {
        switchNetwork(this.activeChain);
        return;
      }
      if (this.isDisabled) return false;
      this.$emit("withdraw");
    },
  },

  components: {
    BaseTokenIcon,
  },
};
</script>

<style lang="scss" scoped>
.degen-bg {
  background: url("../../assets/images/myPositions/degenbox-item-background.png");
}

.bento-bg {
  background: url("../../assets/images/myPositions/bentobox-item-background.png");
}

.bento-block {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 81px;
  max-width: 50%;
  flex-grow: 1;
  border-radius: 15px;
  background-size: 120%;
  background-position: 40% 40%;
  background-repeat: no-repeat;
  border: 1px solid rgba(129, 128, 255, 0.2);
  box-shadow: 0 1px 10px rgba(1, 1, 1, 0.05);
  padding: 12px;
}

.disabled {
  background: linear-gradient(
    92.26deg,
    rgba(34, 203, 245, 0.05) 0%,
    rgba(255, 222, 104, 0.05) 40.06%,
    rgba(167, 255, 181, 0.05) 61.92%,
    rgba(122, 121, 250, 0.05) 100%
  );
}

.bento-info {
  display: flex;
  align-items: center;
}

.bento-img {
  width: 50px;
  height: 44px;
  object-fit: contain;
  margin-right: 8px;
}

.bento-title-amount {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bento-title {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.45px;
}

.bento-amount {
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}

.bento-chains {
  position: absolute;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  top: 12px;
  left: 176px;
  max-width: 200px;
}

.chain-icon {
  width: 24px;
  height: 24px;
  border-radius: 17px;
  transition: all 0.3s ease;
}

.chain-icon:hover {
  cursor: pointer;
  border: 1px solid #fff;
  box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 0.38);
}

.active-chain {
  border: 1px solid #fff;
  box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 0.38);
}

.button-description {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 4px;
}

.withdraw-button {
  display: flex;
  padding: 9px 24px;
  justify-content: center;
  align-items: center;
  width: 187px;
  height: 39px;
  border-radius: 10px;
  border: 2px solid #fff;
  background: rgba(255, 255, 255, 0.01);
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.withdraw-button:hover,
.withdraw-button:disabled {
  opacity: 0.5;
}

.description {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 400;
}

.link {
  margin-top: 1px;
  display: flex;
  flex-direction: row;
  color: #7088cc;
  font-size: 14px;
  font-weight: 400;
}

.link-text {
  line-height: 20px;
}

@media screen and (max-width: 1300px) {
  .bento-block {
    max-width: 100%;
  }
}

@media screen and (max-width: 700px) {
  .bento-chains {
    top: 12px;
    right: 12px;
    left: auto;
  }

  .degen-bg {
    background: linear-gradient(90deg, #302754 0%, rgba(45, 74, 150, 0.46) 100%),
      linear-gradient(
        1deg,
        rgba(0, 0, 0, 0.6) 0.52%,
        rgba(23, 6, 57, 0.44) 99.48%
      ),
      url("../../assets/images/myPositions/degenbox-item-background-mobile.png");
  }

  .bento-bg {
    background: linear-gradient(90deg, #302754 0%, rgba(45, 74, 150, 0.46) 100%),
      linear-gradient(
        1deg,
        rgba(0, 0, 0, 0.6) 0.52%,
        rgba(23, 6, 57, 0.44) 99.48%
      ),
      url("../../assets/images/myPositions/bentobox-item-background-mobile.png");
  }

  .bento-block {
    flex-direction: column;
    height: 125px;
    align-items: stretch;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }

  .bento-title,
  .token-balance {
    font-size: 16px;
  }

  .button-description {
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    gap: 0;
  }

  .description {
    flex-direction: column;
    align-items: start;
    text-align: start;
    gap: 0;
  }

  .link {
    justify-self: flex-start;
  }

  .withdraw-button {
    width: 122px;
    height: 37px;
    font-size: 14px;
  }
}

@media screen and (max-width: 400px) {
  .bento-block {
  }
}
</style>
