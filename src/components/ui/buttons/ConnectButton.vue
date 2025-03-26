<template>
  <button
    class="connect-btn"
    :class="{ connected: !!account }"
    :disabled="isWalletCheckInProcess"
    @click="openConnectPopup"
  >
    <div class="account-image-wrap" v-if="walletBtnIcon">
      <img
        class="account-image"
        src="@/assets/images/header/account-image.png"
      />
    </div>

    <div class="account-image-wrap wallet-icon" v-else>
      <img
        class="account-image"
        src="@/assets/images/header/connect-wallet-icon.svg"
      />
    </div>
    <span :class="['btn-text', { 'hide-btn-text': isHide }]">
      {{ walletBtnText }}
    </span>
  </button>
</template>

<script>
import { mapGetters } from "vuex";
import { openConnectPopup } from "@/helpers/connect/utils";

export default {
  props: {
    isHide: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      isWalletCheckInProcess: "getIsWalletCheckInProcess",
      ensName: "getEnsName",
    }),

    walletBtnText() {
      if (this.isWalletCheckInProcess) {
        return "Connecting...";
      } else if (this.account) {
        if (this.ensName) return this.ensName;
        return `${this.account.slice(0, 6)}...${this.account.slice(-6)}`;
      } else {
        return "Connect wallet";
      }
    },

    walletBtnIcon() {
      return this.account;
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
    openConnectPopup,

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

.account-image-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
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

.wallet-icon {
  display: none;
}

@media (max-width: 1200px) {
  .wallet-icon {
    display: flex;
  }

  .hide-btn-text {
    display: none;
  }
}

@media (max-width: 1100px) {
  .connect-btn {
    padding: 4px 4px;
    border-radius: 50px;
  }

  .connected {
    background: rgba(111, 111, 111, 0);
  }
}
</style>
