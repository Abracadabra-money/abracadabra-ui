<template>
  <div class="gas-top-up-block">
    <h3 class="title">Get Gas</h3>
    <div class="input-assets">
      <InputAddress
        :destinationAddress="destinationAddress"
        :isDisabled="!useCustomAddress"
        @update-input="updateDestinationAddress"
      />
      <button class="use-custom" :class="{ disabled: isDisabledCheckbox }">
        Use custom
        <CheckBox
          :value="useCustomAddress"
          :disabled="isDisabledCheckbox"
          @update="toggleUseCustomAddress"
        />
      </button>
    </div>

    <div class="input-assets">
      <InputNumber
        :isDisabled="!activeFork"
        @changeInputNumber="updateGasValue"
      />

      <BaseButton
        width="160px"
        :primary="!isDisabledGetGasBtn"
        :disabled="isDisabledGetGasBtn"
        @click="actionHandler"
        >Get Gas</BaseButton
      >
    </div>
  </div>
</template>

<script>
import { providers } from "ethers";
import { getAccount } from "@wagmi/core";
import { defineAsyncComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import notification from "@/helpers/notification/notification.js";
import { tenderlyAddBalance } from "@/helpers/tenderly/tenderlyAddBalance";

const account = getAccount();

export default {
  props: {
    activeFork: {
      type: Object,
    },
  },

  data() {
    return {
      inputGasValue: "",
      useCustomAddress: false,
      destinationAddress: account.address,
    };
  },

  computed: {
    ...mapGetters({ provider: "getProvider" }),

    isDisabledCheckbox() {
      if (!account.address) return true;
      return false;
    },

    isDisabledGetGasBtn() {
      return !this.destinationAddress || !this.inputGasValue;
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),

    updateGasValue(value) {
      this.inputGasValue = value;
    },

    updateDestinationAddress(address) {
      this.destinationAddress = address;
    },

    toggleUseCustomAddress() {
      this.useCustomAddress = !this.useCustomAddress;

      if (this.useCustomAddress) this.destinationAddress = "";
      else this.destinationAddress = account.address;
    },

    async actionHandler() {
      if (!this.destinationAddress || this.isDisabledGetGasBtn) return false;
      const provider = account.address
        ? this.provider
        : new providers.StaticJsonRpcProvider(this.activeFork.rpcUrl);

      const response = await tenderlyAddBalance(
        this.destinationAddress,
        this.inputGasValue,
        provider
      );

      await this.createNotification(notification[response]);
    },
  },

  mounted() {
    if (!account.address) this.useCustomAddress = true;
  },

  components: {
    InputAddress: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputAddress.vue")
    ),
    CheckBox: defineAsyncComponent(() =>
      import("@/components/ui/CheckBox.vue")
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
.gas-top-up-block {
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
</style>
