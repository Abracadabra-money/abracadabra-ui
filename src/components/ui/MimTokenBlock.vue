<template>
  <div class="mim-wrap">
    <button
      class="token-btn"
      @click="addToken"
      :class="{ disabled: !this.account }"
    >
      <img src="@/assets/images/PixelMIM.svg" alt="MIM" />
    </button>
    <p class="mim-price">{{ mimPrice | formatUSD }}</p>
  </div>
</template>

<script>
import tokensInfo from "@/utils/tokens/addedTokens.js";
import { mapGetters } from "vuex";
import { ethers } from "ethers";
import { priceAbi } from "@/utils/farmPools/abi/priceAbi";
export default {
  data() {
    return {
      mimPrice: 0,
      updateMimPrice: null,
      contract: null,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      signer: "getSigner",
    }),

    mimInfo() {
      let id = 1;

      if (this.chainId) id = this.chainId;

      return tokensInfo.find(
        (token) => token.name === "MIM" && token.chain === id
      );
    },
  },

  methods: {
    async addToken() {
      if (!this.account) {
        return false;
      }

      const { ethereum } = window;

      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address: this.mimInfo.address, // The address that the token is at.
              symbol: this.mimInfo.symbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: this.mimInfo.decimals, // The number of decimals in the token
              image: this.mimInfo.image, // A string url of the token logo
            },
          },
        });

        if (wasAdded) {
          console.log("Thanks for your interest!");
        } else {
          console.log("Your loss!");
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getMimPrice() {
      if (this.contract) {
        const price = await this.contract.latestAnswer();

        this.mimPrice = this.$ethers.utils.formatUnits(price.toString(), 8);
      }
    },

    async initContract() {
      this.contract = new ethers.Contract(
        "0x7A364e8770418566e3eb2001A96116E6138Eb32F",
        JSON.stringify(priceAbi),
        this.signer
      );
      await this.getMimPrice();
    },
  },

  async created() {
    this.updateMimPrice = setInterval(async () => {
      await this.getMimPrice();
    }, 30000);
  },

  watch: {
    signer: {
      immediate: true,
      handler(signer, oldSigner) {
        if (!oldSigner && signer) this.initContract();
      },
    },
  },

  beforeDestroy() {
    clearInterval(this.updateMimPrice);
  },
};
</script>

<style lang="scss">
.mim-wrap {
  display: flex;
  align-items: center;
}

.mim-price {
  margin-left: 10px;
}

.token-btn {
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;

  img {
    max-width: 100%;
    height: auto;
  }
}

.disabled {
  cursor: initial;
}

@media (max-width: 980px) {
  .mim-wrap {
    z-index: 11;
  }
}
</style>
