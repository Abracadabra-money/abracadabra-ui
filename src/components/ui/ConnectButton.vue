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
  watch: {
    ensName(value) {
      if (value) this.funnyGreeting(value);
    },
  },
  methods: {
    funnyGreeting(ensName) {
      let msg = "Glad to see you in this magical place!👀🔮";
      let title = `OMG!🧙`;
      let discription = "Description text!";
      let accept = false;

      if (ensName === "georgiyxo.eth") {
        discription = "Greetings G!👋";
        accept = true;
      }
      if (ensName === "romy.eth") {
        discription = "Greetings Romy!👋";
        accept = true;
      }
      if (ensName === "hotromy.eth") {
        discription = "Greetings Romy!🔥🔥🔥";
        accept = true;
      }

      if (!accept) return false;
      this.$store.dispatch("notifications/new", {
        title,
        msg,
        discription,
        type: "info",
      });
    },
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
