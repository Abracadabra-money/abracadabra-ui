<template>
  <div class="connect-wrap">
    <button
      class="connect-btn header-link"
      :class="{ connected: !!account }"
      @click="walletBtnHandler"
    >
      {{ walletBtnText }}
    </button>
    <button v-if="account" class="disconnect-btn" @click="$disconnectWallet">
      Disconnect
    </button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({ chainId: "getChainId", account: "getAccount" }),

    walletBtnText() {
      if (this.account) {
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
        //  this.$router.push({ name: "Dashboard" });
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

    .connected {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
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
