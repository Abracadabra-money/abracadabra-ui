<template>
  <button class="connect-btn header-link" @click="walletBtnHandler">
    {{ walletBtnText }}
  </button>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      ensName: "getEnsName",
    }),

    walletBtnText() {
      if (this.account) {
        if (this.ensName) return this.ensName;
        return `${this.account.slice(0, 6)}...${this.account.slice(-6)}`;
      } else {
        return "Connect wallet";
      }
    },
    isWalletConnected() {
      return this.$store.getters.getAccount;
    },
  },
  methods: {
    async walletBtnHandler() {
      if (this.account) {
        return false;
      }
      await this.$connectWallet();
    },
  },
};
</script>

<style lang="scss" scoped>
.connect-btn {
  border: none;
  outline: transparent;
  width: 146px;
  padding: 13px 0;
}
</style>
