<template>
  <div class="box" :class="{ 'box-disabled': isDisabled }">
    <div class="box-header">
      <img
        v-if="isBento"
        class="box-header-img"
        src="@/assets/images/bento-box.jpeg"
        alt="Box"
      />
      <img
        v-else
        class="box-header-img"
        src="@/assets/images/degenbox.svg"
        alt="Box"
      />
      <p class="box-header-title">{{ title }}</p>
    </div>
    <div class="box-data">
      <BaseTokenIcon :icon="mimIcon" name="MIM" size="50px" />
      <div>
        <p class="box-balance1">{{ parsedBalance | formatTokenBalance }}</p>
        <p class="box-balance2">{{ balanceInUsd | formatUSD }}</p>
      </div>
    </div>
    <div class="box-actions">
      <template>
        <BaseButton @click="$emit('withdraw')" :disabled="isDisabled"
          >Withdraw</BaseButton
        >
        <BaseButton @click="$emit('deposit')" selected
          >Deposit</BaseButton
        ></template
      >
    </div>
    <div class="box-desc">
      {{ description }}
      <br />
      <a
        target="_blank"
        rel="noreferrer noopener"
        href="https://wizard69.gitbook.io/abracadabra-money/"
        class="box-desc-more"
        >Read More Here</a
      >
    </div>
  </div>
</template>

<script>
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");
const BaseButton = () => import("@/components/base/BaseButton");
const mimIcon = require("@/assets/images/tokens/MIM.png");

export default {
  name: "BalanceBox",
  components: { BaseTokenIcon, BaseButton },
  props: {
    isBento: { type: Boolean, default: false },
    balance: { default: "0" },
    mimPrice: { type: Number, default: 0 },
  },
  data() {
    return {
      mimIcon,
    };
  },
  computed: {
    parsedBalance() {
      return this.$ethers.utils.formatEther(this.balance);
    },
    balanceInUsd() {
      return this.parsedBalance * this.mimPrice;
    },
    title() {
      return !this.isBento ? "DegenBox" : "BentoBox";
    },
    description() {
      return `MIM Balance on ${this.title}`;
    },
    isDisabled() {
      return !+this.balance;
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  background: linear-gradient(
    92.26deg,
    rgba(34, 203, 245, 0.1) 0%,
    rgba(255, 222, 104, 0.1) 40.06%,
    rgba(167, 255, 181, 0.1) 61.92%,
    rgba(122, 121, 250, 0.1) 100%
  );
  border: 1px solid rgba(129, 128, 255, 0.2);
  box-sizing: border-box;
  box-shadow: 0 1px 10px rgba(1, 1, 1, 0.05);

  border-radius: 20px;
  padding: 13px 10px 25px 10px;

  &-disabled {
    background: linear-gradient(
      92.26deg,
      rgba(34, 203, 245, 0.05) 0%,
      rgba(255, 222, 104, 0.05) 40.06%,
      rgba(167, 255, 181, 0.05) 61.92%,
      rgba(122, 121, 250, 0.05) 100%
    );
  }

  &-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-bottom: 13px;
    padding-left: 4px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &-img {
      width: 24px;
      height: auto;
      object-fit: contain;
    }
    &-title {
      margin-left: 8px;
    }
  }

  &-data {
    display: grid;
    grid-template-columns: auto 1fr;
    padding: 16px 0;
    column-gap: 14px;
  }

  &-balance1 {
    font-weight: 600;
    font-size: 30px;
    line-height: 30px;
  }
  &-balance2 {
    font-weight: 400;
    font-size: 20px;
    line-height: 20px;
  }

  &-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 15px;
  }

  &-desc {
    margin-top: 20px;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    &-more {
      color: #9695f8;
    }
  }
}
</style>
