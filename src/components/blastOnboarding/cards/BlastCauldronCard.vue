<template>
  <div class="deposit-card cauldron">
    <div class="label">Minter</div>
    <div class="cauldron-info">
      <TokenChainIcon
        class="pool-icon"
        :icon="cauldronInfo.config.icon"
        :name="cauldronInfo.config.name"
        :chainId="cauldronInfo.config.chainId"
        size="42px"
      />
      <div class="cauldron-text">
        <p class="cauldron-name">WETH cauldron</p>
        <p class="cauldron-description">Deposited into the Cauldron</p>
      </div>
      <div class="token-part">
        <BaseTokenIcon
          :icon="cauldronInfo.config.icon"
          :name="cauldronInfo.config.name"
          size="32px"
        />
        {{ formatTokenBalance(cauldronInfo.userPosition.collateralDeposited) }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";

export default {
  props: {
    cauldronInfo: { type: Object },
  },
  methods: {
    formatTokenBalance(value) {
      return formatTokenBalance(formatUnits(value, 18));
    },
  },

  components: {
    TokenChainIcon: defineAsyncComponent(() =>
      import("@/components/ui/icons/TokenChainIcon.vue")
    ),
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.deposit-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 174px;
  width: 100%;
  border: 1px solid #fcfd02;
  border-radius: 16px;
  padding: 21px 14px 16px 14px;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  backdrop-filter: blur(12.5px);
  color: white;
  transition: all 0.5s ease-in-out;
}

.label {
  position: absolute;
  top: -1px;
  left: -1px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 117px;
  height: 25px;
  border-radius: 16px 0 8px 0px;
  background: #fcfd02;
  color: #000;
  font-size: 12px;
  font-weight: 500;
}

.cauldron-name {
  font-size: 20px;
}

.cauldron-description {
  font-size: 16px;
}

.cauldron-info,
.cauldron-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cauldron-info {
  gap: 4px;
}

.cauldron-info {
  font-size: 34px;
}
</style>
