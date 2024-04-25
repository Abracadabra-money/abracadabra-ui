<template>
  <div class="backdrop" @click.self="$emit('close-popup')">
    <div class="wrapper">
      <h1 class="title">
        Transaction overview
        <img
          class="popup-close"
          @click="$emit('close-popup')"
          src="@/assets/images/cross.svg"
          alt="Close popup"
        />
      </h1>
      <BeamProcess :successData="successData" :lzTxInfo="lzTxInfo" />

      <BeamInfo
        :successData="successData"
        :originChainNativeToken="originChainNativeToken"
        :dstChainNativeToken="dstChainNativeToken"
      />

      <TransactionProgressBlock
        :successData="successData"
        :lzTxInfo="lzTxInfo"
      />
    </div>
  </div>
</template>

<script>
import BeamProcess from "@/components/beam/successPopup/BeamProcess.vue";
import BeamInfo from "@/components/beam/successPopup/BeamInfo.vue";
import TransactionProgressBlock from "@/components/beam/successPopup/TransactionProgressBlock.vue";

import { waitForMessageReceived } from "@layerzerolabs/scan-client";

import { chainsConfigs } from "@/helpers/chains/configs";

export default {
  props: {
    beamInfoObject: {
      type: Object,
      required: true,
    },
    successData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      lzTxInfo: null,
    };
  },
  computed: {
    originChainNativeToken() {
      if (!this.beamInfoObject) return null;

      const chainInfo = chainsConfigs.find(
        (chain) => chain.chainId === this.successData.originChain.chainId
      );

      return {
        symbol: chainInfo.baseTokenSymbol,
        icon: chainInfo.baseTokenIcon,
        price: this.beamInfoObject.nativePrice,
      };
    },
    dstChainNativeToken() {
      if (!this.beamInfoObject) return null;

      const chainInfo = chainsConfigs.find(
        (chain) => chain.chainId === this.successData.dstChain.chainId
      );

      const dstChainInfoUpdated =
        this.beamInfoObject.destinationChainsInfo.find(
          (chain) =>
            chain.chainConfig.chainId === this.successData.dstChain.chainId
        );

      return {
        symbol: chainInfo.baseTokenSymbol,
        icon: chainInfo.baseTokenIcon,
        price: dstChainInfoUpdated.nativePrice,
      };
    },
  },
  methods: {
    async waitForTransaction() {
      const sourceChain = this.successData.originChain.settings.lzChainId;
      const hash = this.successData.txHash;

      const messageResult = await waitForMessageReceived(sourceChain, hash);

      this.lzTxInfo = messageResult;
    },
  },
  created() {
    this.waitForTransaction();
  },
  components: {
    BeamProcess,
    BeamInfo,
    TransactionProgressBlock,
  },
};
</script>

<style lang="scss" scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(25, 25, 25, 0.41);
  backdrop-filter: blur(3px);
  overflow-y: auto;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 533px;
  width: 100%;
  padding: 32px;
  gap: 24px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 24px;
  font-weight: 500;
}

.popup-close {
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.popup-close:hover {
  opacity: 0.5;
}

@media (max-width: 600px) {
  .wrapper {
    position: fixed;
    max-width: 100%;
    height: 100%;
    border-radius: 0;
  }
}
</style>
