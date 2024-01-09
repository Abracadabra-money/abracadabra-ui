<template>
  <button
    class="connect-btn"
    :class="{ connected: !!account }"
    @click="walletBtnHandler"
  >
    <div class="account-image-wrap" v-if="walletBtnIcon">
      <img
        class="account-image"
        src="@/assets/images/header/account-image.png"
      />
    </div>
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

    walletBtnIcon() {
      return true;
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
      await this.$openWeb3modal();
    },
  },
};
</script>

<style lang="scss" scoped>
.connect-btn {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 4px 10px;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;

  border: none;
  outline: transparent;
  text-align: center;
  border-radius: 8px;
  color: white;
  background-color: transparent;
  cursor: pointer;
}

.connect-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
}

.connected {
  border-radius: 8px;
  background: rgba(111, 111, 111, 0.06);
}

.account-image-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0px 9px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.06);
}

.account-image {
  width: 24px;
  height: 24px;
  border-radius: 32px;
}
</style>
