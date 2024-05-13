<template>
  <div
    class="notifi-card-overlay"
    v-if="isOpenNotifiModal && !!account"
    @click="toggleNotifiModal"
  ></div>
  <div class="notifi-modal-container">
    <div class="notifi-card">
      <Context
        v-if="isOpenNotifiModal && !!account"
        dappAddress="abracadabra"
        env="Production"
        :walletPublicKey="account"
        :walletBlockchain="notifiWalletBlockchain"
        :signMessage="signMessage"
      >
        <Card
          :cardId="notifiCardId"
          :darkMode="true"
          :inputs="{ userWallet: account }"
          :copy="{
            FetchedStateCard: {
              SubscriptionCardV1: {
                EditCard: {
                  AlertListPreview: {
                    description:
                      'Get real-time alerts to the destinations of your choice',
                  },
                },
              },
            },
          }"
          :inputSeparators="{
            smsSeparator: {
              content: 'OR',
            },
            telegramSeparator: {
              content: 'OR',
            },
          }"
        />
      </Context>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  NotifiSubscriptionCard,
  NotifiContext,
} from "@notifi-network/notifi-react-card";
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
      notifiCardId: "getNotifiCardId",
      notifiWalletBlockchain: "getNotifiWalletBlockchain",
      signMessage: "getNotifiSignMessage",
    }),
  },
  methods: {
    toggleNotifiModal() {
      this.$emit("toggleNotifiModal");
    },
  },
  components: {
    Card: applyPureReactInVue(NotifiSubscriptionCard),
    Context: applyReactInVue(NotifiContext),
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
  z-index: 1;
}
.notifi-card-overlay {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0);
  z-index: 1;
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
}
</style>
