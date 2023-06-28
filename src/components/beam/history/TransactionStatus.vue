<template>
  <div class="progress-wrap">
    <div class="title-wrap">
      <img class="progress-icon" :src="transactionCheck" />
      <h2 class="title">{{ transactionText }}</h2>
    </div>
    <ExplorerLink :link="layerZeroLink" title="LayerZero" />
  </div>
</template>

<script>
import { useImage } from "@/helpers/useImage";
import ExplorerLink from "@/components/beam/successPopup/ExplorerLink.vue";
export default {
  props: {
    config: {
      type: Object,
    },
  },

  computed: {
    isTxComplete() {
      return true;
    },

    transactionCheck() {
      if (this.config?.txInfo?.status === "DELIVERED")
        return useImage("assets/images/beam/transaction-complete.png");
      return useImage("assets/images/beam/transaction-check.png");
    },

    transactionText() {
      return "complete";
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 10px 15px;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-icon {
  width: 21px;
  height: 21px;
}

.title {
  text-transform: capitalize;
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
