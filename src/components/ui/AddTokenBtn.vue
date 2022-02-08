<template>
  <button
    class="token-btn"
    @click="addToken"
    :class="{ disabled: !this.account }"
  >
    <img :src="tokenIcon" alt="" />
  </button>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    tokenInfo: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters({ account: "getAccount" }),

    tokenIcon() {
      return require(`@/assets/images/tokens-icon/MIM.svg`);
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
              address: this.tokenInfo.address, // The address that the token is at.
              symbol: this.tokenInfo.symbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: this.tokenInfo.decimals, // The number of decimals in the token
              image: this.tokenInfo.image, // A string url of the token logo
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
  },
};
</script>

<style lang="scss" scoped>
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
</style>
