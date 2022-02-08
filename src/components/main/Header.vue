<template>
  <header class="header">
    <nav class="nav">
      <router-link class="link" to="/">Borrow</router-link>
      <router-link class="link" to="/about">Leverage</router-link>
      <router-link class="link" to="/about">Positions</router-link>
      <router-link class="link" to="/about">Farm</router-link>
      <Dropdown :options="dropdownLinks" />
      <ConnectButton />
      <DropdownSocial />
      <div class="mim-wrap">
        <TokenButton :tokenInfo="tokensData.MIM" />
        <p class="mim-price">{{ parseFloat(mimPrice.mim).toFixed(4) }}</p>
      </div>
    </nav>
  </header>
</template>

<script>
const Dropdown = () => import("@/components/ui/Dropdown");
const DropdownSocial = () => import("@/components/ui/DropdownSocial");
const ConnectButton = () => import("@/components/ui/ConnectButton");
const TokenButton = () => import("@/components/ui/AddTokenBtn");
import { tokenPrices } from "@/helpers/priceHelper.js";

import tokensInfo from "@/utils/tokens/addedTokens.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dropdownLinks: ["Stake", "Bridge", "Swap", "Analytics"],
      mimPrice: 0,
    };
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    tokensData() {
      return {
        MIM: this.getDataByNameAndChain("MIM"),
      };
    },
  },

  methods: {
    getDataByNameAndChain(name) {
      return tokensInfo.find(
        (token) => token.name === name && token.chain === this.chainId
      );
    },
  },

  async created() {
    this.mimPrice = await tokenPrices("mim");
  },

  components: { Dropdown, ConnectButton, DropdownSocial, TokenButton },
};
</script>

<style ConnectButtonland="scss" scoped>
.header {
  position: absolute;
  height: 80px;
  top: 15px;
  left: 0;
  right: 0;
  max-width: 860px;
  margin: 0 auto;
}

.nav {
  display: flex;
  justify-content: space-between;
}

.mim-wrap {
  display: flex;
  align-items: center;
}

.mim-price {
  margin-left: 10px;
}
</style>
