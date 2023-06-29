<template>
  <div class="connect-wrap">
    <button
      class="connect-btn header-link"
      :class="{ connected: !!account }"
      @click="walletBtnHandler"
    >
      {{ walletBtnText }}
    </button>
  </div>
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
      await this.$openWeb3modal();
    },
  },
};
</script>

<style lang="scss" scoped>
.connect-btn {
  border: none;
  outline: transparent;
  width: 100%;
  text-align: center;
  border-radius: 20px;
  color: white;
  background-color: transparent;
  cursor: pointer;
  padding: 15px 0;
}

.connect-wrap {
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;

  .disconnect-btn {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    display: none;
    justify-content: center;
    background-color: #55535d;
    border: none;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    padding: 13px 18px;
    font-size: 16px;
    line-height: 24px;
    color: #fff;

    &:hover {
      color: #62a1f9;
      cursor: pointer;
    }
  }
  &:hover {
    .disconnect-btn {
      display: flex;
    }

    .connect-btn {
      background: #55535d;
    }

    // .connected {
      // border-bottom-left-radius: 0;
      // border-bottom-right-radius: 0;
    // }
  }
}

@media (max-width: 980px) {
  .connect-wrap {
    &:hover {
      .disconnect-btn {
        display: none;
      }

      .connect-btn {
        background: transparent;
        border-radius: 0;
      }
    }
  }
}
</style>
