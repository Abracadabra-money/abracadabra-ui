<template>
  <div class="send-from">
    <div class="title-wrap">
      <img class="progress-icon" :src="sendFromCheck" />
      <h2 class="title">Send From</h2>
    </div>

    <div class="info-wrap" :class="{ 'progress-line': fromScanUrl }">
      <div class="info">
        <div class="send-info-wrap">
          <div class="send-info">
            <div class="chain-info">
              <img class="chain-icon" :src="config.originChain.icon" />
              <span class="chain-symbol">{{ config.originChain.title }}</span>
            </div>

            <h3 class="user-address">{{ sendFrom }}</h3>
          </div>

          <ExplorerLink :link="fromScanUrl" />
        </div>

        <ul class="list">
          <li class="list-item">
            <span>Amount</span>
            <span class="item-value">
              <span>{{ config.mimAmount }} MIM</span>
              <span>{{ config.mimToUsd }}</span>
            </span>
          </li>

          <li class="list-item">
            <span>Beaming fee</span>
            <span class="item-value">
              <span>0</span>
            </span>
          </li>

          <li class="list-item">
            <span>Convert to gas token</span>
            <span class="item-value">
              <template v-if="isNone">None</template>
              <template v-else>
                <span>{{ originalTokenAmount }}</span>
                <span>
                  <img src="@/assets/images/arrow_right.svg" />
                </span>
                <span>{{ convertTokenAmount }}</span>
              </template>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import { useImage } from "@/helpers/useImage";
import { getChainInfo } from "@/helpers/chain/getChainInfo.ts";
import ExplorerLink from "@/components/beam/successPopup/ExplorerLink.vue";
export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },

  computed: {
    fromScanUrl() {
      if (!this.config.tx?.hash) return "";
      return `${getChainInfo(this.config.originChain.chainId).scanUrl}${
        this.config.tx.hash
      }`;
    },

    sendFromCheck() {
      if (this.fromScanUrl) return useImage("assets/images/beam/complete.png");
      return useImage("assets/images/beam/check.png");
    },

    sendFrom() {
      return `${this.config.sendFrom.slice(
        0,
        4
      )}...${this.config.sendFrom.slice(-3)}`;
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

  components: {
    ExplorerLink,
  },
};
</script>

<style lang="scss" scoped>
.title-wrap {
  display: flex;
  align-items: center;
  gap: 22px;
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

.info-wrap {
  padding: 0 0 10px 22px;
  transition: all 0.3s ease-in;
  border-left: 1px dashed rgba(255, 255, 255, 0.8);
  margin-left: 10px;
}

.info {
  padding: 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.progress-line {
  border-left: 1px dashed #63ff7b;
}

.send-info-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.send-info {
  display: flex;
  gap: 10px;
}

.chain-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.chain-icon {
  width: 32px;
  height: 32px;
  border-radius: 20px;
}

.chain-symbol {
  font-size: 10px;
  line-height: 150%;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

.user-address {
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.025em;
  margin-top: 6px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.025em;
}

.item-value span {
  margin-left: 8px;
}

@media (max-width: 400px) {
  .info-wrap {
    padding: 0;
    margin: 0;
    border-left: transparent;
  }

  .send-info {
    gap: 0;
    flex-direction: column;
  }
}
</style>
