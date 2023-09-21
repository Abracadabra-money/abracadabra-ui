<template>
  <div class="cauldron-top-up">
    <h3 class="title">Cauldron Top Up</h3>

    <div class="input-assets">
      <div class="fork-chain-info">
        <img class="chain-icon" :src="forkChainIcon" alt="Chain icon" />
        <span>{{ chainConfig.name }}</span>
      </div>
      <button class="use-custom">
        Use custom
        <CheckBox :value="useCustomFork" @update="toggleUseCustomFork" />
      </button>
    </div>

    <div class="input-assets">
      <InputUrl
        :targetUrl="tenderlyForkUrl"
        :isDisabled="isDisabledInputUrl"
        :error="errorForkUrl"
        @update-input="updateForkUrl"
      />
    </div>

    <div class="input-assets">
      <InputAddress
        :isDisabled="isDisabledCauldronaddress"
        :destinationAddress="destinationAddress"
        placeholder="Cauldron address"
        @update-input="updateCauldronAddress"
      />
    </div>

    <div class="input-assets">
      <InputNumber
        :isDisabled="isDisabledInputAmount"
        @changeInputNumber="updateCauldronAmount"
      />
    </div>

    <BaseButton :disabled="isDisabledActionHandler" @click="actionHandler"
      >Submit</BaseButton
    >
  </div>
</template>

<script>
import { providers } from "ethers";
import { defineAsyncComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import { TENDERLY_FORK_URL } from "@/constants/tenderly";
import { getForkInfo } from "@/helpers/tenderly/getForkInfo";
import { topUpCauldron } from "@/helpers/tenderly/topUpCauldron";
import { networksConfig } from "@/utils/networks/networksConfig";
export default {
  props: {
    activeFork: {
      type: Object,
    },
  },

  data() {
    return {
      useCustomFork: false,
      tenderlyForkUrl: "",
      forkChainId: this.activeFork?.forkChainId,
      errorForkUrl: "",
      cauldronAddress: "",
      cauldronAmount: null,
    };
  },

  computed: {
    ...mapGetters({
      provider: "getProvider",
      chainId: "getChainId",
    }),

    currentChainId() {
      return this.forkChainId ? this.forkChainId : this.chainId;
    },

    chainConfig() {
      return networksConfig.find(
        (network) => network.chainId === this.currentChainId
      );
    },

    forkChainIcon() {
      const activeChain = networksConfig.find(
        (network) => network.chainId === this.currentChainId
      );

      return activeChain?.icon;
    },

    isDisabledInputUrl() {
      if (!this.activeFork) return false;
      return !this.useCustomFork;
    },

    isDisabledCauldronaddress() {
      return !!this.errorForkUrl || !this.tenderlyForkUrl;
    },

    isDisabledInputAmount() {
      return this.isDisabledCauldronaddress || !this.cauldronAddress;
    },
    isDisabledActionHandler() {
      return this.isDisabledInputAmount || !this.cauldronAmount;
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),

    async updateForkUrl(url) {
      this.errorForkUrl = "";
      this.tenderlyForkUrl = url;
      const forkInfo = await getForkInfo(url);
      if (!forkInfo) {
        this.errorForkUrl = "Invalid tenderly fork URL";
      } else {
        this.forkChainId = +forkInfo.network_id;
      }
    },

    toggleUseCustomFork() {
      this.useCustomFork = !this.useCustomFork;
      this.errorForkUrl = "";

      if (this.useCustomFork) this.tenderlyForkUrl = "";
      else {
        this.tenderlyForkUrl = `${TENDERLY_FORK_URL}${this.activeFork.forkId}`;
        this.forkChainId = this.activeFork.forkChainId;
      }
    },

    updateCauldronAddress(address) {
      this.cauldronAddress = address;
    },

    updateCauldronAmount(amount) {
      this.cauldronAmount = amount;
    },

    async actionHandler() {
      if (this.isDisabledActionHandler) return false;

      const provider = this.activeFork
        ? this.provider
        : await new providers.JsonRpcProvider(this.tenderlyForkUrl);

      const { status, msg } = await topUpCauldron(
        this.cauldronAmount,
        this.cauldronAddress,
        this.forkChainId,
        provider
      );

      await this.createNotification({
        msg: msg,
        type: status,
      });
    },
  },

  created() {
    this.tenderlyForkUrl = this.activeFork?.forkId
      ? `${TENDERLY_FORK_URL}${this.activeFork?.forkId}`
      : "";
  },

  components: {
    CheckBox: defineAsyncComponent(() =>
      import("@/components/ui/CheckBox.vue")
    ),
    InputUrl: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputUrl.vue")
    ),
    InputAddress: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputAddress.vue")
    ),
    InputNumber: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputNumber.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.cauldron-top-up {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
}

.input-assets {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.fork-chain-info {
  height: 50px;
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 15px;
  border-radius: 20px;
  background-color: hsla(0, 0%, 100%, 0.06);
}

.chain-icon {
  width: 20px;
  max-height: 25px;
}

.use-custom {
  color: #fff;
  height: 50px;
  max-width: 160px;
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.06);
  justify-content: center;
  border: 2px solid #648fcc;
}
</style>
