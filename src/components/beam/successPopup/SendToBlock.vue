<template>
  <div class="send-to">
    <div class="title-wrap">
      <img class="progress-icon" :src="sendToCheck" />
      <h2 class="title">Send To</h2>
    </div>

    <div class="info-wrap">
      <div class="info">
        <div class="send-info-wrap">
          <div class="send-info">
            <div class="chain-info">
              <img class="chain-icon" :src="config.dstChain.icon" />
              <span class="chain-symbol">{{ config.dstChain.title }}</span>
            </div>

            <h3 class="user-address">{{ sendTo }}</h3>
          </div>

          <ExplorerLink :link="dstScanUrl" />
        </div>

        <ul class="list">
          <li class="list-item">
            <span>You will receive</span>
            <span>
              <span>{{ config.mimAmount }} MIM</span>
              <span>{{ config.mimToUsd }}</span>
            </span>
          </li>

          <li class="list-item" v-if="config.dstTokenAmount">
            <span></span>
            <span>
              <span
                >{{ config.dstTokenAmount || "0.0" }}
                {{ config.dstTokenSymbol }}
              </span>
              <span>{{ destinationTokenUsd }}</span>
            </span>
          </li>
        </ul>
      </div>
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

    sendToCheck() {
      if (this.dstScanUrl) return useImage("assets/images/beam/complete.png");
      return useImage("assets/images/beam/check.png");
    },

    sendTo() {
      return `${this.config.sendTo.slice(0, 4)}...${this.config.sendTo.slice(
        -3
      )}`;
    },

    dstScanUrl() {
      const { txInfo, dstChain } = this.config;
      if (!txInfo || txInfo?.status === "INFLIGHT") return "";
      return `${
        this.getChainById(dstChain.chainId).blockExplorers.etherscan.url
      }/tx/${txInfo.dstTxHash}`;
    },

    destinationTokenUsd() {
      return filters.formatUSD(
        this.config.dstTokenAmount * this.config.dstTokenPrice || 0
      );
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
  margin-bottom: 8px;
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
  margin-left: 10px;
}

.info {
  padding: 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
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
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.025em;
}

.list-item span {
  margin-left: 8px;
}

@media (max-width: 400px) {
  .info-wrap {
    padding: 0;
    margin: 0;
  }

  .send-info {
    gap: 0;
    flex-direction: column;
  }
}
</style>
