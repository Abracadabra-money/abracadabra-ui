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
      <img class="chain-icon" :src="getChainIcon(1)" />
      <img class="chain-icon" :src="getChainIcon(1)" />
      <img class="chain-icon" :src="getChainIcon(1)" />
      <img class="chain-icon" :src="getChainIcon(1)" />
      <img class="chain-icon" :src="getChainIcon(1)" />
      <img class="chain-icon" :src="getChainIcon(1)" />
      <img class="chain-icon" :src="getChainIcon(1)" />
    </div>

    <div class="button-description">
      <BaseButton class="withdraw-button" @click="$emit('withdraw')">
        Withdraw
      </BaseButton>

      <div class="description">
        MIM Balance on {{ title }}
        <a class="link" target="_blank" rel="noreferrer noopener" :href="link">
          <span class="link-text"> Read More</span>
          <img class="link-arrow" src="@/assets/images/farm-lp-arrow.svg" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import degenIcon from "@/assets/images/degenbox.svg";
import bentoIcon from "@/assets/images/bento-box.jpeg";
import mimIcon from "@/assets/images/tokens/MIM.png";
import filters from "@/filters/index.js";
import { ethers, BigNumber } from "ethers";
import { formatUnits } from "viem";

import { getChainIcon } from "@/helpers/chains/getChainIcon";

export default {
  props: {
    isBento: { type: Boolean, default: false },
    balance: { type: [String, BigInt], default: "0" },
    mimPrice: { type: Number, default: 0 },
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
      return !this.balance;
    },

    boxIcon() {
      return this.isBento ? bentoIcon : degenIcon;
    },

    title() {
      return !this.isBento ? "DegenBox" : "BentoBox";
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
  },

  methods: {
    getChainIcon,

    formatUSD(value) {
      return filters.formatUSD(value);
    },

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },
  },

  components: {
    BaseTokenIcon,
    BaseButton,
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
  flex-grow: 1;
  border-radius: 15px;
  background-size: 120%;
  background-position: 40% 40%;
  background-repeat: no-repeat;
  border: 1px solid rgba(129, 128, 255, 0.2);
  box-shadow: 0 1px 10px rgba(1, 1, 1, 0.05);
  padding: 12px 9px;
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
  left: 27%;
  max-width: 200px;
}

.chain-icon {
  width: 24px;
  height: 24px;
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
}

.description {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 400;
  height: 20px;
}

.link {
  margin-top: 1px;
  display: flex;
  align-items: center;
  color: #7088cc;
  font-size: 14px;
  font-weight: 400;
}

.link-text {
  line-height: 20px;
}
</style>
