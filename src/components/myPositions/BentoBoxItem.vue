<template>
  <div class="bento-block" :class="{ disabled: isDisabled }">
    <div class="bento-header">
      <img class="bento-img" :src="boxIcon" alt="Box" />
      <p>{{ title }}</p>
    </div>

    <div class="balances-wrap">
      <BaseTokenIcon :icon="mimIcon" name="MIM" size="50px" />
      <div>
        <p class="balance">{{ formatTokenBalance(parsedBalance) }}</p>
        <p class="balance-usd">{{ formatUSD(balanceInUsd) }}</p>
      </div>
    </div>

    <div class="btns-wrap">
      <BaseButton @click="$emit('withdraw')" :disabled="isDisabled">
        Withdraw
      </BaseButton>
      <BaseButton @click="$emit('deposit')" selected>Deposit</BaseButton>
    </div>

    <div class="description">
      <p>MIM Balance on {{ title }}</p>
      <a class="link" target="_blank" rel="noreferrer noopener" :href="link"
        >Read More Here</a
      >
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

import { ethers } from "ethers";

export default {
  props: {
    isBento: { type: Boolean, default: false },
    balance: { default: "0" },
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
      return !+this.balance;
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
      return ethers.utils.formatEther(this.balance);
    },

    balanceInUsd() {
      return this.parsedBalance * this.mimPrice;
    },
  },

  methods: {
    formatUSD(value) {
      return filters.formatUSD(value);
    },

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },
  }

  components: {
    BaseTokenIcon,
    BaseButton,
  },
};
</script>

<style lang="scss" scoped>
.bento-block {
  background: linear-gradient(
    92.26deg,
    rgba(34, 203, 245, 0.1) 0%,
    rgba(255, 222, 104, 0.1) 40.06%,
    rgba(167, 255, 181, 0.1) 61.92%,
    rgba(122, 121, 250, 0.1) 100%
  );
  border: 1px solid rgba(129, 128, 255, 0.2);
  box-shadow: 0 1px 10px rgba(1, 1, 1, 0.05);
  border-radius: 20px;
  padding: 13px 10px 25px;
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

.bento-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 0 13px 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.bento-img {
  width: 24px;
  height: auto;
  object-fit: contain;
  margin-right: 8px;
}

.balances-wrap {
  display: flex;
  gap: 14px;
  padding: 16px 0;
}

.balance {
  font-weight: 600;
  font-size: 30px;
  line-height: 30px;
}
.balance-usd {
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
}

.btns-wrap {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.description {
  line-height: 20px;
}

.link {
  color: #9695f8;
}
</style>
