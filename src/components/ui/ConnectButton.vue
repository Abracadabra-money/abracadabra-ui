<template>
  <div class="connect-wrap">
    <button
      class="connect-btn header-link"
      :class="{ 'connected-btn': !!account }"
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
  width: 146px;
  padding: 13px 0;
  text-align: center;
  background: #ffffff0f;
  backdrop-filter: blur(40px);
  border-radius: 20px;
  font-size: 16px;
  line-height: 24px;
  color: #fff;
  cursor: pointer;
  min-width: 80px;
}

.connect-wrap {
  position: relative;
  display: flex;

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
    cursor: pointer;
    &:hover {
      color: #62a1f9;
    }
  }

  &:hover {
    .disconnect-btn {
      display: flex;
    }

    .connect-btn {
      background: #55535d;
    }

    .connected-btn {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}
</style>
