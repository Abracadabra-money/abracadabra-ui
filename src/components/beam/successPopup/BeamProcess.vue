<template>
  <div class="beam-process">
    <div :class="['beam-chain', sendFromCheck]">
      <div class="indicator-icon-wrap">
        <img class="indicator-icon" :src="config.originChain.icon" />
      </div>
      <p :class="['address', sendFromCheck]">
        {{ formatAddress(config.sendFrom) }}
      </p>
    </div>

    <div class="beam-amount-wrap">
      <img class="beam-gif" src="@/assets/gifs/beam.gif" />
      <div class="process-title">Beaming</div>
      <div class="beam-amount">
        <img class="mim-icon" src="@/assets/images/tokens/MIM.png" />
        {{ config.mimAmount }}
      </div>
    </div>

    <div :class="['beam-chain', sendToCheck]">
      <div class="indicator-icon-wrap">
        <img class="indicator-icon" :src="config.dstChain.icon" />
      </div>
      <p :class="['address', sendToCheck]">
        {{ formatAddress(config.sendTo) }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import { useImage } from "@/helpers/useImage";
import ExplorerLink from "@/components/beam/successPopup/ExplorerLink.vue";
export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters({ getChainById: "getChainById" }),

    fromScanUrl() {
      if (!this.config.tx?.hash) return "";
      return `${
        this.getChainById(this.config.originChain.chainId).blockExplorers
          .etherscan.url
      }/tx/${this.config.tx.hash}`;
    },

    sendFromCheck() {
      return this.fromScanUrl ? "completed" : "";
    },

    sendToCheck() {
      return this.dstScanUrl ? "completed" : "";
    },

    dstScanUrl() {
      const { txInfo, dstChain } = this.config;
      if (!txInfo || txInfo?.status === "INFLIGHT") return "";
      return `${
        this.getChainById(dstChain.chainId).blockExplorers.etherscan.url
      }/tx/${txInfo.dstTxHash}`;
    },

    isNone() {
      return !+this.config.gasOnDst && !+this.config.dstTokenAmount;
    },

    originalTokenAmount() {
      if (!+this.config.gasOnDst) return `<0.001 ${this.config.nativeSymbol}`;
      return `${this.config.gasOnDst} ${this.config.nativeSymbol}`;
    },

    destinationTokenAmount() {
      return filters.formatToFixed(this.config.dstTokenAmount || "0.0", 3);
    },

    convertTokenAmount() {
      if (!+this.destinationTokenAmount)
        return `<0.001 ${this.config.dstTokenSymbol}`;
      return `${this.destinationTokenAmount} ${this.config.dstTokenSymbol}`;
    },
  },

  methods: {
    formatAddress(address) {
      return `${address.slice(0, 4)}...${address.slice(-3)}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.beam-process {
  display: flex;
  justify-content: center;
  align-items: end;
  width: 100%;
}

.beam-chain {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.indicator-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 94px;
  height: 94px;
  padding: 12px;
  gap: 10px;
  border-radius: 58px;
  border: 1px solid rgba(45, 74, 150, 0);
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.2) 0%,
    rgba(116, 92, 210, 0.2) 100%
  );
  box-shadow: 0px 4px 29.4px 0px rgba(85, 82, 253, 0.24);
}

.completed .indicator-icon-wrap {
  border: 1px solid #67a069;
  box-shadow: 0px 4px 29.4px 0px rgba(103, 160, 105, 0.24);
}

.indicator-icon {
  width: 100%;
  height: 100%;
}

.completed {
  color: #67a069;
}

.address {
  font-size: 16px;
  font-weight: 500;
}

.beam-amount-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.process-title {
  font-size: 14px;
  font-weight: 400;
}

.beam-amount {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
}

.mim-icon {
  width: 24px;
  height: 24px;
}

.beam-gif {
  max-width: 100%;
}

@media screen and (max-width: 600px) {
  .indicator-icon {
    width: 64px;
    height: 64px;
  }

  .beam-gif {
    margin-bottom: 10px;
  }
}
</style>
