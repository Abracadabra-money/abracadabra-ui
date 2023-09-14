<template>
  <div class="gas-top-up-block">
    <h3 class="title">Get Gas</h3>
    <div class="input-assets">
      <InputAddress
        :destinationAddress="destinationAddress"
        :isDisabled="!useCustomAddress"
      />

      <button class="use-custom">
        Use custom
        <CheckBox :value="useCustomAddress" @update="toggleActiveMarkets" />
      </button>
    </div>

    <div class="input-assets">
      <!-- :disabled="!useCustomAddress" -->
      <input
        class="input"
        v-model="gasInputValue"
        type="number"
        placeholder="1000"
      />

      <BaseButton width="160px" @click="actionHandler">Get Gas</BaseButton>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getAccount } from "@wagmi/core";
import { defineAsyncComponent } from "vue";
import notification from "@/helpers/notification/notification.js";

import { tenderlyAddBalance } from "@/helpers/tenderly/tenderlyAddBalance";

const account = getAccount();

export default {
  data() {
    return {
      gasInputAddress: account.address,
      gasInputValue: "",
      useCustomAddress: false,
    };
  },

  computed: {
    ...mapGetters({ provider: "getProvider" }),

    destinationAddress() {
      if (this.useCustomAddress) return "";
      return account.address;
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),

    toggleActiveMarkets() {
      this.useCustomAddress = !this.useCustomAddress;

      if (this.useCustomAddress) this.gasInputAddress = "";
      else this.gasInputAddress = account.address;
    },

    async actionHandler() {
      const response = await tenderlyAddBalance(
        account.address,
        this.gasInputValue,
        this.provider
      );

      await this.createNotification(notification[response]);
    },
  },

  components: {
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    CheckBox: defineAsyncComponent(() =>
      import("@/components/ui/CheckBox.vue")
    ),
    InputAddress: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputAddress.vue")
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

.input {
  background-color: rgba(255, 255, 255, 0.1);
  height: 50px;
  text-align: center;
  width: 70%;
  font-size: 16px;
  border-radius: 20px;
  border: none;
  outline: none;
  color: white;
  width: 100%;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
}
</style>
