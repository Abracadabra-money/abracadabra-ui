<template>
  <div class="cauldron-top-up">
    <h3 class="title">Wallet Top Up</h3>

    <h4>Token address</h4>
    <div class="input-assets">
      <InputDropdown
        :destinationAddress="tokensInfo?.address"
        :dropdownList="tokenList"
        :isDisabled="!activeFork"
        placeholder="Enter the token address or select from the list"
        @changeTokenAddress="changeTokenAddress"
        @update-input="updateTokenAddress"
      />
    </div>

    <h4>To address</h4>
    <div class="input-assets">
      <InputAddress
        :destinationAddress="destinationAddress"
        :isDisabled="!useCustomDestinationAddress"
        @update-input="updateDestinationAddress"
      />

      <button class="use-custom" :class="{ disabled: !account }">
        Use custom
        <CheckBox
          :value="useCustomDestinationAddress"
          :disabled="!account"
          @update="toggleUseDestinationAddress"
        />
      </button>
    </div>

    <h4>Amount</h4>
    <div class="input-assets">
      <InputNumber
        :max="holdersAmount"
        :isValidation="true"
        :isDisabled="!tokensInfo?.address"
        @changeInputNumber="updateAmountValue"
      />
    </div>
    <div class="row">
      <p>Available amount</p>
      <p>{{ holdersAmount }}</p>
    </div>

    <div class="input-assets">
      <InputAddress
        :destinationAddress="holdersAddresses"
        :isDisabled="!tokensInfo?.address"
        placeholder="Holder addresses must be separated by commas"
        :validation="false"
        @update-input="updateHoldersAddresses"
      />
    </div>

    <BaseButton
      :disabled="!isDisabledGetGasBtn"
      :primary="isDisabledGetGasBtn"
      @click="actionHandler"
      >Top Up</BaseButton
    >
  </div>
</template>

<script>
import { providers } from "ethers";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
import cauldronsConfig from "@/configs/cauldrons";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { tokenTransfer } from "@/helpers/tenderly/tokenTransfer";
import notification from "@/helpers/notification/notification.js";
import { getTotalAmountByHolders } from "@/helpers/tenderly/getTotalAmountByHolders";

export default {
  props: {
    activeFork: {
      type: Object,
    },
  },

  data() {
    return {
      useCustomDestinationAddress: false,
      toAddress: this.account,
      tokensInfo: null,
      holdersAmount: 0,
      holdersAddresses: "",
      amount: 0,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      provider: "getProvider",
    }),

    isDisabledGetGasBtn() {
      return !!this.tokensInfo?.address && this.amount > 0;
    },

    destinationAddress() {
      if (this.account && !this.useCustomDestinationAddress)
        return this.account;
      return "";
    },

    tokenList() {
      const filteredCauldron = cauldronsConfig.filter(
        (config) => config.chainId === +this.chainId
      );

      return filteredCauldron.map((config) => {
        return {
          name: config.collateralInfo.name,
          icon: config.icon,
          address: config.collateralInfo.address,
        };
      });
    },
  },

  watch: {
    async tokensInfo() {
      if (!this.tokensInfo?.address) this.holdersAmount = 0;

      this.holdersAmount = await getTotalAmountByHolders(
        this.chainId,
        this.tokensInfo.address,
        this.holdersAddresses
      );
    },

    async holdersAddresses() {
      this.holdersAmount = await getTotalAmountByHolders(
        this.chainId,
        this.tokensInfo.address,
        this.holdersAddresses
      );
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    updateTokenAddress(address) {
      this.tokensInfo = {
        icon: useImage("assets/images/base_select_icon.png"),
        address: address,
        name: "",
      };
    },

    toggleUseDestinationAddress() {
      this.useCustomDestinationAddress = !this.useCustomDestinationAddress;
      this.toAddress = "";
    },

    updateDestinationAddress(address) {
      this.toAddress = address;
    },

    updateHoldersAddresses(address) {
      this.holdersAddresses = address;
    },

    changeTokenAddress(tokensInfo) {
      this.tokensInfo = tokensInfo;
    },

    updateAmountValue(value) {
      this.amount = value;
    },

    async actionHandler() {
      if (!this.isDisabledGetGasBtn) return false;
      const notificationId = await this.createNotification(
        notification.tenderlyPending
      );

      const provider = this.account
        ? this.provider
        : await new providers.JsonRpcProvider(this.activeFork.rpcUrl);

      await tokenTransfer(
        this.chainId,
        this.tokensInfo.address,
        this.toAddress ? this.toAddress : this.account,
        this.amount,
        provider,
        this.holdersAddresses
      );

      this.holdersAmount = await getTotalAmountByHolders(
        this.chainId,
        this.tokensInfo.address
      );

      await this.deleteNotification(notificationId);
      await this.createNotification(notification.success);
    },
  },

  created() {
    if (!this.account) this.useCustomDestinationAddress = true;
  },

  components: {
    InputDropdown: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputDropdown.vue")
    ),
    InputAddress: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputAddress.vue")
    ),
    CheckBox: defineAsyncComponent(() =>
      import("@/components/ui/checkboxes/CheckBox.vue")
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

.disabled {
  cursor: not-allowed;
  color: rgba(255, 255, 255, 0.6);
}

.row {
  display: flex;
  justify-content: space-between;
}
</style>
