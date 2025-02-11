<template>
  <div class="expected-block">
    <div class="row">
      <p class="title">Estimated Gas Cost:</p>
      <RowSkeleton v-if="isLoading" />
      <p class="value" v-else>
        <span class="token">
          <img
            :src="fromChainInfo.icon"
            v-if="fromChainInfo"
            class="token-icon"
          />
          {{ fromGasText }}
        </span>
        <span class="usd" v-if="fromChainInfo?.price">{{
          estimatedGasCostUsd
        }}</span>
      </p>
    </div>

    <div class="row">
      <p class="title pointer" @click="$emit('open-settings')">
        Gas on Destination:
      </p>
      <p class="value pointer" @click="$emit('open-settings')">
        <span class="token">
          <img :src="toChainInfo.icon" class="token-icon" v-if="toChainInfo" />
          {{ dstNativeTokenText }}
        </span>
        <span class="usd" v-if="toChainInfo?.price">{{
          gasOnDestinationUsd
        }}</span>
      </p>
    </div>

    <div class="row">
      <p class="title">Beaming Fee:</p>
      <p class="value">$ 1.00</p>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import type { PropType } from "vue";
import { defineAsyncComponent } from "vue";
import { chainsConfigs } from "@/helpers/chains/configs";
import type { BeamInfo } from "@/helpers/beam/types";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";

export default {
  props: {
    toChain: {
      type: Object as PropType<BeamInfo | undefined>,
    },
    fromChain: {
      type: Object as PropType<BeamInfo | undefined>,
    },
    isLoading: { type: Boolean, default: false },
    gasFee: { type: BigInt as any as PropType<bigint>, default: 0n },
    dstNativeTokenAmount: {
      type: BigInt as any as PropType<bigint>,
      default: 0n,
    },
  },

  computed: {
    fromChainInfo() {
      if (!this.fromChain) return null;

      const chainInfo = chainsConfigs.find(
        (chain) => this.fromChain && chain.chainId === this.fromChain.chainId
      );

      if (!chainInfo) return null;

      return {
        symbol: chainInfo.baseTokenSymbol,
        icon: chainInfo.baseTokenIcon,
        price: this.fromChain.nativePrice,
      };
    },

    toChainInfo() {
      if (!this.toChain) return null;

      const chainInfo = chainsConfigs.find(
        (chain) => this.toChain && chain.chainId === this.toChain.chainId
      );

      if (!chainInfo) return null;

      return {
        symbol: chainInfo.baseTokenSymbol,
        icon: chainInfo.baseTokenIcon,
        price: this.toChain?.nativePrice || 0,
      };
    },

    parsedGasFee() {
      return formatUnits(this.gasFee, 18);
    },

    parsedDstNativeTokenAmount() {
      return formatUnits(this.dstNativeTokenAmount, 18);
    },

    fromGasText() {
      if (this.fromChainInfo === null)
        return formatTokenBalance(this.parsedGasFee);
      return `${formatTokenBalance(this.parsedGasFee)} ${
        this.fromChainInfo.symbol
      }`;
    },

    dstNativeTokenText() {
      if (this.toChainInfo === null)
        return formatTokenBalance(this.parsedDstNativeTokenAmount);
      return `${formatTokenBalance(this.parsedDstNativeTokenAmount)} ${
        this.toChainInfo.symbol
      }`;
    },

    estimatedGasCostUsd() {
      if (this.gasFee === 0n || !this.fromChainInfo) return formatUSD(0);

      const estimatedGasCostUsd =
        Number(formatUnits(this.gasFee, 18)) * this.fromChainInfo.price;
      return formatUSD(estimatedGasCostUsd);
    },

    gasOnDestinationUsd() {
      if (this.dstNativeTokenAmount === 0n || !this.toChainInfo)
        return formatUSD(0);

      const gasOnDestinationUsd =
        Number(formatUnits(this.dstNativeTokenAmount, 18)) *
        this.toChainInfo.price;
      return formatUSD(gasOnDestinationUsd);
    },
  },

  components: {
    RowSkeleton: defineAsyncComponent(
      () => import("@/components/ui/skeletons/RowSkeleton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.expected-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  padding: 12px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #99a0b2;
  font-size: 16px;
  font-weight: 400;
}

.title {
  color: rgba(255, 255, 255, 0.6);
}

.pointer {
  cursor: pointer;
}

.value {
  display: flex;
  flex-direction: column;
  align-items: end;
}

.token {
  display: flex;
  align-items: center;
  gap: 4px;
}

.usd {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
}

.token-icon {
  width: 20px;
  height: 20px;
  border-radius: 6px;
}

@media (max-width: 600px) {
  .row {
    font-size: 14px;
    font-weight: 400;
  }

  .value {
    text-align: right;
  }
}
</style>
