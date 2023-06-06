<template>
  <div class="wrap">
    <div class="title-container">
      <h1 class="popup-title">Success</h1>
    </div>
    <div class="popup-content">
      <img src="@/assets/images/bridge/Check-line.png" class="check-line" />
      <div class="blocks">
        <div class="block-container">
          <h2 class="block-title">Send From</h2>
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
              <span class="link-block">
                <a :href="fromScanUrl" target="_blank" class="link-text"
                  >Explorer</a
                >
                <img
                  src="@/assets/images/bridge/arrow-link.png"
                  class="arrow-link"
                />
              </span>
            </div>
            <div class="lower">
              <ul class="transaction-info">
                <li>
                  <span class="tag">Amount</span>
                  <span class="value">
                    <span class="eth">{{ config.mimAmount }} MIM</span>
                    <span class="fiat">${{ mimToUsd }}</span>
                  </span>
                </li>
                <li>
                  <span class="tag">Beaming fee</span>
                  <span class="value">
                    <span class="eth">0</span>
                    <!-- <span class="fiat">$0.00</span> -->
                  </span>
                </li>
                <li class="convert-gas">
                  <span class="tag">Convert to gas token</span>
                  <span class="value">
                    <template v-if="isNone">None</template>
                    <template v-else>
                      <span class="eth"
                        >{{ config.tokenToGas }} {{ config.nativeSymbol }}</span
                      >
                      <span>
                        <img
                          src="@/assets/images/arrow_right.svg"
                          class="convert-arrow"
                        />
                      </span>
                      <span class="fiat"
                        >{{ destinationTokenAmount }}
                        {{ config.destinationSymbol }}</span
                      ></template
                    >
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="block-container">
          <h2 class="block-title">Send To</h2>
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
              <!-- <span class="link-block">
                <a href="" class="link-text">snowtrace.io</a>
                <img
                  src="@/assets/images/bridge/arrow-link.png"
                  class="arrow-link"
                />
              </span> -->
            </div>
            <div class="lower">
              <ul class="transaction-info">
                <li>
                  <span class="tag">You will receive</span>
                  <span class="value">
                    <span class="eth">{{ config.mimAmount }} MIM</span>
                    <span class="fiat">${{ mimToUsd }}</span>
                  </span>
                </li>
                <li>
                  <span class="tag"></span>
                  <span class="value" v-if="config.destinationTokenAmount">
                    <span class="eth"
                      >{{ config.destinationTokenAmount || "0.0" }}
                      {{ config.destinationSymbol }}</span
                    >
                    <!-- <span class="fiat">$0.00</span> -->
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="block-container">
          <h2 class="block-title">Transaction processing</h2>
          <div class="block-content-box">
            <div class="upper">
              <p>
                Transaction is processing. You may see it in the LayerZero
                explorer
              </p>
            </div>
            <div class="lower">
              <span class="link-block">
                <a :href="link" target="_blank" class="link-text">LayerZero</a>
                <img
                  src="@/assets/images/bridge/arrow-link.png"
                  class="arrow-link"
                />
              </span>
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

    fromScanTitle() {
      return scanConfig[this.config.originChain.chainId].name;
    },

    fromScanUrl() {
      return `${scanConfig[this.config.originChain.chainId].url}${
        this.config.transaction.hash
      }`;
    },

    mimToUsd() {
      return filters.formatToFixed(+this.config.mimAmount * +this.mimPrice, 2);
    },

    destinationTokenAmount() {
      return filters.formatToFixed(this.destinationTokenAmount || "0.0", 2);
    },

    isNone() {
      return !+this.config.tokenToGas && !+this.config.destinationTokenAmount;
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
};
</script>
<style lang="scss" scoped>
.wrap {
  margin: auto;
  margin-bottom: 20px;
  width: 440px;
  padding: 8px 20px 20px 20px;
  font-family: "Prompt";
  font-style: normal;
}

.title-container {
  padding-bottom: 19px;
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
.check-line {
  width: 20px;
  height: 400px;
  margin-top: 20px;
  margin-right: 22px;
}
.block-container {
  margin-top: 16px;
}
.block-title {
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

@media (max-width: 400px) {
  .check-line {
    display: none;
  }
  .upper {
    flex-direction: column;
  }
}
</style>
