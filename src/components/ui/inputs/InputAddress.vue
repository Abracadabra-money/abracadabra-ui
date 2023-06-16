<template>
  <div>
    <input
      class="input-address"
      :class="{ error: addressEntryError }"
      v-model="address"
      @input="updateInput"
      type="text"
      placeholder="Add destination address"
    />
    <p class="error-message" :class="{ visibility: addressEntryError }">
      Invalid address
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      address: null,
    };
  },

  computed: {
    checkInputAddress() {
      return this.address
        ? this.$ethers.utils.isAddress(this.address.toLowerCase())
        : false;
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
.input-address {
  width: 100%;
  height: 50px;
  background: rgba(129, 126, 166, 0.2);
  border: 1px solid #494661;
  border-radius: 12px;
  outline: none;
  padding: 12px 20px;
  color: #fff;
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
