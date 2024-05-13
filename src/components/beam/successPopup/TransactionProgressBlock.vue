<template>
  <div class="progress-wrap">
    <div class="title-wrap">
      <h2 class="title">Transaction status</h2>
      <span :class="['progress-indicator', transactionText]">
        {{ transactionText }}
      </span>
    </div>

    <div class="description">
      <p class="text">You may see it in the</p>
      <ExplorerLink :link="layerZeroLink" title="LayerZero" />
    </div>
  </div>
</template>

<script>
import ExplorerLink from "@/components/beam/successPopup/ExplorerLink.vue";
export default {
  props: {
    successData: {
      type: Object,
      required: true,
    },
    lzTxInfo: {
      type: Object,
    },
  },

  computed: {
    isTxComplete() {
      return !this.lzTxInfo || this.lzTxInfo?.status === "INFLIGHT"
        ? false
        : true;
    },

    transactionText() {
      return this.isTxComplete ? "completed" : "processing";
    },

    layerZeroLink() {
      if (!this.successData.txHash) return false;
      return `https://layerzeroscan.com/tx/${this.successData.txHash}`;
    },
  },

  components: {
    ExplorerLink,
  },
};
</script>

<style lang="scss" scoped>
.progress-wrap {
  width: 100%;
}

.title-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
}

.title {
  font-weight: 500;
  font-size: 18px;
  color: #fff;
}

.progress-indicator {
  padding: 2px 12px;
  border-radius: 10px;
  text-transform: capitalize;
  font-size: 12px;
  font-weight: 400;
}

.processing {
  background: rgba(254, 216, 79, 0.12);
  color: #fed84f;
}

.completed {
  background: rgba(103, 160, 105, 0.12);
  color: #67a069;
}

.description {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 400px) {
  .progress-wrap {
    margin: 0;
  }
}
</style>
