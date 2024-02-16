<template>
  <div class="input-address-wrap">
    <input
      class="input-address"
      :class="{ error: addressEntryError, disabled: isDisabled }"
      v-model="address"
      @input="updateInput"
      type="text"
      :placeholder="placeholder"
      :disabled="isDisabled"
    />
    <p
      class="error-message"
      :class="{ visibility: addressEntryError }"
      v-if="addressEntryError"
    >
      Invalid address
    </p>
  </div>
</template>

<script>
import { utils } from "ethers";

export default {
  props: {
    destinationAddress: {
      type: String,
      default: "",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "Add Destination Address",
    },
    validation: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      address: this.destinationAddress,
    };
  },

  watch: {
    destinationAddress() {
      this.address = this.destinationAddress;
    },
  },

  computed: {
    checkInputAddress() {
      if (!this.validation) return true;
      return this.address ? utils.isAddress(this.address.toLowerCase()) : false;
    },

    addressEntryError() {
      if (!this.address) return false;
      return !this.checkInputAddress;
    },
  },

  methods: {
    updateInput() {
      if (!this.addressEntryError)
        return this.$emit("update-input", this.address, this.addressEntryError);
      return this.$emit("error-input", this.addressEntryError);
    },
  },
};
</script>

<style lang="scss" scoped>
.input-address-wrap {
  width: 100%;
}

.input-address {
  width: 100%;
  height: 50px;
  background: rgba(8, 14, 31, 0.6);
  border: 1px solid rgba(73, 70, 97, 0.4);
  border-radius: 12px;
  outline: none;
  padding: 12px 20px;
  color: #fff;
  font-size: 15px;
}

.disabled {
  cursor: not-allowed;
}

.error {
  border-color: $clrErrorBorder;
}

.error-message {
  color: $clrError;
  font-size: 10px;
  margin-top: 5px;
  margin-left: 10px;
  height: 12px;
  opacity: 0;
}

.visibility {
  opacity: 1;
}
</style>
