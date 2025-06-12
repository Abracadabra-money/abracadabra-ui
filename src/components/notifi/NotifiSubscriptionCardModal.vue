<template>
  <div
    class="notifi-card-overlay"
    v-if="isOpenNotifiModal && !!account"
    @click="toggleNotifiModal"
  ></div>
  <div class="notifi-modal-container"> 
    <div class="notifi-card">
      <Context
        :key="`${account}-${notifiCardId}-${notifiWalletBlockchain}`"
        tenantId="4zfoga0vjqh90ahg8apd"
        env="Production"
        :walletPublicKey="account ?? '0x'"
        :walletBlockchain="notifiWalletBlockchain ?? 'ETHEREUM'"
        :signMessage="signMessage"
        :cardId="notifiCardId" 
        :inputs="{ walletAddress: [{ label: '', value: account }] }"
      >
        <Card v-if="isOpenNotifiModal && !!account" :darkMode="true" />
      </Context>
    </div>
  </div>
</template>

<script>
// TODO: ⬆ Replace tenantId with "abracadabra"
// TODO: ⬆ Replace walletBlockchain with `:walletBlockchain="notifiWalletBlockchain"`
// TODO: ⬆ Make sure the input key must be `walletAddress` instead of legacy `userWallet`
import { mapGetters } from "vuex";
import {
  NotifiContextProvider,
  NotifiCardModal,
} from "@notifi-network/notifi-react";
import { applyReactInVue, applyPureReactInVue } from "veaury";

export default {
  props: {
    isOpenNotifiModal: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["toggleNotifiModal"],
  computed: {
    ...mapGetters({
      account: "getAccount",
      notifiCardId: "getNotifiCardId", // TODO: ⬆ Use this to replace dummy card ID `cardId="019743e6bae573129355b7ddc6a11b49"` -> `:cardId="notifiCardId"`
      notifiWalletBlockchain: "getNotifiWalletBlockchain",
      signMessage: "getNotifiSignMessage",
      walletConnection: "getWalletIsConnected",
      wagmiConfig: "getWagmiConfig",
    }),
  },
  methods: {
    toggleNotifiModal() {
      this.$emit("toggleNotifiModal");
    },
  },
  components: {
    Card: applyPureReactInVue(NotifiCardModal),
    Context: applyReactInVue(NotifiContextProvider),
  },
};
</script>
<style lang="scss" scoped>
.notifi-modal-container {
  position: relative;
  margin-left: -4px;
}
.notifi-card {
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-63%) translateY(18%);
  position: absolute;
  z-index: 10;
}

.notifi-card:has(.notifi-connect) {
  transform: translateX(-63%) translateY(30%);
}


.notifi-card-overlay {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0);
  z-index: 9;
  position: fixed;
  top: 0;
  left: 0;
}
@media screen and (max-width: 1024px) {
  .notifi-card {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .notifi-card:has(.notifi-connect),
  .notifi-card:has(.notifi-ftu) {
    transform: translate(-50%, -50%);
  }
}
</style>
