<template>
  <div class="wrap">
    <div class="title-container">
      <h1 class="popup-title">Transaction overview</h1>
    </div>
    <div class="popup-content">
      <div class="blocks">
        <div class="block-container">
          <h2 class="block-title">
            <img :src="sendFromCheck" class="check" />
            Send From
          </h2>
          <div class="box-wrap" :class="{ 'box-line': fromScanUrl }">
            <div class="block-content-box">
              <div class="upper">
                <span class="logo-address">
                  <div class="token-info">
                    <div class="token-logo">
                      <img :src="config.originChain.icon" class="token-icon" />
                      <span class="token-symbol">{{
                        config.originChain.title
                      }}</span>
                    </div>
                  </div>
                  <h3 class="address">{{ sendFrom }}</h3>
                </span>
                <span class="link-block" v-if="fromScanUrl">
                  <a :href="fromScanUrl" target="_blank" class="link-text"
                    >Explorer</a
                  >
                  <img
                    src="@/assets/images/bridge/arrow-link.png"
                    class="arrow-link"
                  />
                </span>
                <div class="loader-wrap" v-else>
                  <BaseLoader type="loader" />
                </div>
              </div>
              <div class="lower">
                <ul class="transaction-info">
                  <li>
                    <span class="tag">Amount</span>
                    <span class="value">
                      <span class="eth">{{ config.mimAmount }} MIM</span>
                      <span class="fiat">{{ mimToUsd }}</span>
                    </span>
                  </li>
                  <li>
                    <span class="tag">Beaming fee</span>
                    <span class="value">
                      <span class="eth">0</span>
                    </span>
                  </li>
                  <li class="convert-gas">
                    <span class="tag">Convert to gas token</span>
                    <span class="value">
                      <template v-if="isNone">None</template>
                      <template v-else>
                        <span class="eth">{{ originalTokenAmount }}</span>
                        <span>
                          <img
                            src="@/assets/images/arrow_right.svg"
                            class="convert-arrow"
                          />
                        </span>
                        <span class="fiat">{{
                          convertTokenAmount
                        }}</span></template
                      >
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="block-container">
          <h2 class="block-title">
            <img :src="sendToCheck" class="check" /> Send To
          </h2>
          <div class="box-wrap">
            <div class="block-content-box">
              <div class="upper">
                <span class="logo-address">
                  <div class="token-info">
                    <div class="token-logo">
                      <img
                        :src="config.destinationchain.icon"
                        class="token-icon"
                      />
                      <span class="token-symbol">{{
                        config.destinationchain.title
                      }}</span>
                    </div>
                  </div>
                  <h3 class="address">{{ sendTo }}</h3>
                </span>

                <span class="link-block" v-if="dstScanUrl">
                  <a class="link-text" :href="dstScanUrl" target="_blank"
                    >Explorer</a
                  >
                  <img
                    src="@/assets/images/bridge/arrow-link.png"
                    class="arrow-link"
                  />
                </span>
                <div class="loader-wrap" v-else>
                  <BaseLoader type="loader" />
                </div>
              </div>
              <div class="lower">
                <ul class="transaction-info">
                  <li>
                    <span class="tag">You will receive</span>
                    <span class="value">
                      <span class="eth">{{ config.mimAmount }} MIM</span>
                      <span class="fiat">{{ mimToUsd }}</span>
                    </span>
                  </li>
                  <li>
                    <span class="tag"></span>
                    <span class="value">
                      <span class="eth"
                        >{{ config.destinationTokenAmount || "0.0" }}
                        {{ config.destinationSymbol }}</span
                      >
                      <span class="fiat">{{ destinationTokenUsd }}</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="block-container">
          <h2 class="block-title">
            <img :src="transactionCheck" class="check" />
            Transaction {{ transactionText }}
          </h2>
          <div class="box-wrap">
            <div class="block-content-box">
              <div class="upper">
                <p>
                  Transaction is processing. You may see it in the LayerZero
                  explorer
                </p>
              </div>
              <div class="lower">
                <span class="link-block" v-if="link">
                  <a :href="link" target="_blank" class="link-text"
                    >LayerZero</a
                  >
                  <img
                    src="@/assets/images/bridge/arrow-link.png"
                    class="arrow-link"
                  />
                </span>
                <div class="loader-wrap" v-else>
                  <BaseLoader type="loader" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ethers, providers } from "ethers";
import { priceAbi } from "@/utils/farmPools/abi/priceAbi";
import scanConfig from "@/utils/bridge/scanConfig.ts";
import filters from "@/filters/index.js";
import BaseLoader from "@/components/base/BaseLoader.vue";
import { useImage } from "@/helpers/useImage";

export default {
  props: {
    config: {
      type: Object,
      default: null,
    },

    link: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      mimPrice: 1,
      transactionComplete: false,
    };
  },

  computed: {
    sendFrom() {
      return `${this.config.sendFrom.slice(
        0,
        4
      )}...${this.config.sendFrom.slice(-3)}`;
    },

    sendTo() {
      return `${this.config.sendTo.slice(0, 4)}...${this.config.sendTo.slice(
        -3
      )}`;
    },

    sendFromCheck() {
      if (this.fromScanUrl)
        return useImage("assets/images/bridge/complete.png");
      return useImage("assets/images/bridge/check.png");
    },

    sendToCheck() {
      if (this.dstScanUrl) return useImage("assets/images/bridge/complete.png");
      return useImage("assets/images/bridge/check.png");
    },

    transactionCheck() {
      if (this.config.transactionInfo)
        return useImage("assets/images/bridge/transaction-complete.png");
      return useImage("assets/images/bridge/transaction-check.png");
    },

    transactionText() {
      return this.config.transactionInfo ? "complete" : "processing";
    },

    fromScanTitle() {
      return scanConfig[this.config.originChain.chainId].name;
    },

    fromScanUrl() {
      if (!this.config.transaction?.hash) return "";
      return `${scanConfig[this.config.originChain.chainId].url}${
        this.config.transaction.hash
      }`;
    },

    mimToUsd() {
      return filters.formatUSD(+this.config.mimAmount * +this.mimPrice);
    },

    destinationTokenAmount() {
      return filters.formatToFixed(
        this.config.destinationTokenAmount || "0.0",
        3
      );
    },

    destinationTokenUsd() {
      return filters.formatUSD(
        this.config.destinationTokenAmount *
          this.config.destinationTokenPrice || 0
      );
    },

    isNone() {
      return !+this.config.tokenToGas && !+this.config.destinationTokenAmount;
    },

    originalTokenAmount() {
      if (!+this.config.tokenToGas) return `<0.001 ${this.config.nativeSymbol}`;
      return `${this.config.tokenToGas} ${this.config.nativeSymbol}`;
    },

    convertTokenAmount() {
      if (!+this.destinationTokenAmount)
        return `<0.001 ${this.config.destinationSymbol}`;
      return `${this.destinationTokenAmount} ${this.config.destinationSymbol}`;
    },

    dstScanUrl() {
      if (!this.config.transactionInfo) return "";
      return `${scanConfig[this.config.destinationchain.chainId].url}${
        this.config.transactionInfo.dstTxHash
      }`;
    },
  },

  methods: {
    async getMimPrice() {
      const defaultProvider = new providers.StaticJsonRpcProvider(
        "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
      );

      const contract = await new ethers.Contract(
        "0x7A364e8770418566e3eb2001A96116E6138Eb32F",
        JSON.stringify(priceAbi),
        defaultProvider
      );

      const price = await contract.latestAnswer();
      this.mimPrice = this.$ethers.utils.formatUnits(price.toString(), 8);
    },
  },

  async created() {
    await this.getMimPrice();
  },

  components: {
    BaseLoader,
  },
};
</script>
<style lang="scss" scoped>
.wrap {
  margin: auto;
  margin-bottom: 20px;
  padding: 8px 20px 20px 20px;
  font-family: "Prompt";
  font-style: normal;
}

.title-container {
  padding-bottom: 19px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-title {
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 0.025em;
  color: #ffffff;
}

.close-button {
  width: 14px;
  height: 14px;
}

.popup-content {
  display: flex;
}

.check {
  position: absolute;
  left: -42px;
  top: 4px;
}

.check-line {
  width: 20px;
  height: 400px;
  margin-top: 20px;
  margin-right: 22px;
}
.block-container {
  margin-top: 4px;
  .box-wrap {
    padding-left: 32px;
    padding-bottom: 10px;
    transition: all 0.3s ease-in;
  }
}

.block-container:first-child {
  .box-wrap {
    border-left: 1px dashed rgba(255, 255, 255, 0.8);
  }

  .box-line {
    border-left: 1px dashed #63ff7b;
  }
}

.block-container:last-child {
  .block-title {
  }
  .check {
    position: static;
    margin-right: 10.5px;
  }
}
.block-title {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 32px;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.025em;
  color: #ffffff;
}

.block-content-box {
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
}
.upper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 10px;
  margin-bottom: 11px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.logo-address {
  display: flex;
  gap: 10px;
}
.token-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.token-icon {
  width: 32px;
  height: 32px;

  border-radius: 20px;
}
.token-symbol {
  font-weight: 400;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}
.address {
  margin-top: 6px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.025em;
}
.link-block {
  display: flex;
  align-items: center;
  gap: 12.5px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #5282fd;
}
.link-text {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  background: linear-gradient(107.5deg, #5282fd -3.19%, #76c3f5 101.2%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
.arrow-link {
  width: 16px;
  height: 16px;
}
.lower li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.025em;
}
.value {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.value span {
  margin-left: 8px;
}

.upper p {
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
}

.loader-wrap {
  width: 50px;
  display: flex;
  justify-content: center;
}

@media (max-width: 400px) {
  .block-title {
    margin-left: 0;
  }
  .block-container {
    .box-wrap {
      padding-left: 0;
      border-left: none !important;
    }
  }
  .block-container:not(:last-child) {
    .check {
      display: none;
    }
  }
  .upper {
    flex-direction: column;
  }
}
</style>
