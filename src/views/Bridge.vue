<template>
  <div class="bridge-view">
    <div class="bridge" v-if="bridgeObject">
      <h3 class="title">Bridge</h3>
      <SelectChainsWrap
        @handlerNetwork="openNetworkPopup"
        @switchHandle="switchChain"
        :fromChain="activeFrom"
        :toChain="activeTo"
      />
      <div class="input-wrap">
        <div class="input-balance">
          <p class="input-title">Collateral assets</p>
          <div class="balance">
            <div>Balance: 2000.00</div>
          </div>
        </div>
        <ValueInput />
      </div>

      <div class="info">
        <p class="info-title">Expected MIM</p>
        <p class="info-value">~490987.9876</p>
      </div>

      <div class="btn-wrap">
        <DefaultButton>{{ actionBtnText }}</DefaultButton>
      </div>
      <div class="info">
        <p class="info-title">
          <img class="info-icon" src="@/assets/images/info.svg" alt="Icon" />
          Maximum Bridgeable Amount
        </p>
        <p class="info-value">50000000 MIM</p>
      </div>
      <div class="info">
        <p class="info-title">
          <img class="info-icon" src="@/assets/images/info.svg" alt="Icon" />
          Minimum Bridgeable Amount
        </p>
        <p class="info-value">12 MIM</p>
      </div>
      <div class="info">
        <p class="info-title">
          <img class="info-icon" src="@/assets/images/info.svg" alt="Icon" />
          Minimum Bridging Fee
        </p>
        <p class="info-value">0.9 MIM</p>
      </div>
      <div class="link-wrap">
        <a class="link" href="https://app.multichain.org/" target="_blank"
          >Powered by Anyswap</a
        >
      </div>
    </div>
    <NetworkPopup
      :isOpen="isOpenNetworkPopup"
      @closePopup="closeNetworkPopup"
      @enterChain="changeChain"
      :networksArr="popupNetworksArr"
      :activeChain="activeChainPopup"
      :popupType="popupType"
    />
  </div>
</template>

<script>
const ValueInput = () => import("@/components/UIComponents/ValueInput");
const DefaultButton = () => import("@/components/main/DefaultButton");
const SelectChainsWrap = () => import("@/components/Bridge/SelectChainsWrap");
const NetworkPopup = () => import("@/components/Bridge/NetworkPopup");
import bridgeMixin from "@/mixins/bridge";
import chainSwitch from "@/mixins/chainSwitch";
import { mapGetters } from "vuex";
export default {
  mixins: [bridgeMixin, chainSwitch],
  data() {
    return {
      isOpenNetworkPopup: false,
      popupType: null,
      toChainId: null,
      fromChainId: null,
    };
  },

  computed: {
    ...mapGetters({
      bridgeObject: "getBridgeObject",
      activeChain: "getChainId",
      address: "getAccount",
    }),

    popupNetworksArr() {
      if (this.popupType === "from") {
        return this.bridgeObject?.fromChains;
      } else {
        return this.bridgeObject?.toChains;
      }
    },

    activeChainPopup() {
      if (this.popupType === "from") {
        return this.activeFrom;
      } else {
        return this.activeTo;
      }
    },

    targetFromChain() {
      if (this.fromChainId) return this.fromChainId;

      return this.activeChain;
    },

    activeFrom() {
      return this.bridgeObject?.fromChains.find(
        (chain) => chain.chainId === this.targetFromChain
      );
    },

    targetToChain() {
      if (this.toChainId) return this.toChainId;

      return this.bridgeObject.chainsInfo[0].chainId;
    },

    activeTo() {
      return this.bridgeObject?.toChains.find(
        (chain) => chain.chainId === this.targetToChain
      );
    },

    actionBtnText() {
      if (!this.bridgeObject.isTokenApprove && this.chainId === 1)
        return "Approve";

      return "Bridge";
    },
  },

  methods: {
    openNetworkPopup(type) {
      this.popupType = type;
      this.isOpenNetworkPopup = !this.isOpenNetworkPopup;
    },

    closeNetworkPopup() {
      this.isOpenNetworkPopup = false;
    },

    changeChain(chainId, type) {
      if (type === "to") {
        this.toChainId = chainId;
      } else {
        this.switchNetwork(chainId);
        this.fromChainId = chainId;
      }
    },

    switchChain() {
      this.switchNetwork(this.activeTo.chainId);
    },
  },

  async created() {
    if (!this.address) {
      // const notification = {
      //   msg: "Connect wallet first",
      // };

      alert("Connect wallet first");

      // this.$store.commit("addNotification", notification);
      //   this.$router.push({ name: "Home" });
      return false;
    }

    const acceptedNetworks = [43114, 1, 250, 56, 42161, 137];

    if (acceptedNetworks.indexOf(this.chainId) === -1) {
      // const notification = {
      //   msg: "The bridge is not available on this network",
      // };

      alert("The bridge is not available on this network");

      // this.$store.commit("addNotification", notification);
      // this.$router.push({ name: "Home" });
      return false;
    }

    await this.createBridgeConfig();
  },

  components: {
    ValueInput,
    DefaultButton,
    SelectChainsWrap,
    NetworkPopup,
  },
};
</script>

<style lang="scss" scoped>
.bridge-view {
  padding-top: 100px;
}

.bridge {
  background: #2a2835;
  backdrop-filter: blur(100px);
  border-radius: 30px;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  padding: 30px 65px 20px;
}

.title {
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
  text-align: center;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  margin-bottom: 40px;
}

.input-wrap {
  margin-bottom: 30px;
}

.input-balance {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;

  .balance {
    font-size: 14px;
  }
}

.input-title {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
}

.info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: 50px;
}

.info-title {
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
}

.info-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.btn-wrap {
  margin: 30px 0;
}

.link-wrap {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.link {
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  color: #fff;
}
</style>
