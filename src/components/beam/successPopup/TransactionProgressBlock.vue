<template>
  <div class="progress-wrap">
    <div class="title-wrap">
      <img class="progress-icon" :src="transactionCheck" />
      <h2 class="title">Transaction {{ transactionText }}</h2>
    </div>

    <div class="description">
      <p class="text">
        Transaction is processing. You may see it in the LayerZero explorer
      </p>
      <ExplorerLink :link="layerZeroLink" title="LayerZero" />
    </div>
  </div>
</template>

<script>
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
    isTxComplete() {
      return !this.config.txInfo || this.config.txInfo?.status === "INFLIGHT"
        ? false
        : true;
    },

    transactionCheck() {
      if (this.isTxComplete)
        return useImage("assets/images/beam/transaction-complete.png");
      return useImage("assets/images/beam/transaction-check.png");
    },

    transactionText() {
      return this.isTxComplete ? "complete" : "processing";
    },

    layerZeroLink() {
      if (!this.config.tx) return false;
      return `https://layerzeroscan.com/tx/${this.config.tx.hash}`;
    },
  },

  components: {
    ExplorerLink,
  },
};
</script>

<style lang="scss" scoped>
.progress-wrap {
  margin-left: 32px;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.progress-icon {
  width: 21px;
  height: 21px;
}

.title {
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.025em;
  color: #fff;
}

.description {
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
}

.text {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 12px;
  line-height: 18px;
}

@media (max-width: 400px) {
  .progress-wrap {
    margin: 0;
  }
}
</style>
