<template>
  <div class="input-address-wrap" v-click-outside="closeDropdown">
    <div class="dropdown-wrap">
      <img
        class="token-icon"
        :src="
          activeTokenInfo?.icon ||
          useImage('assets/images/base_select_icon.png')
        "
        alt=""
      />

      <input
        class="input-address"
        :class="{
          error: addressEntryError,
          disabled: isDisabled,
          'selected-token': isOpenDropdown,
        }"
        type="text"
        v-model="address"
        :disabled="isDisabled"
        :placeholder="placeholder"
        @input="updateInput"
      />

      <div class="dropdown">
        <button
          class="dropdown-button"
          :class="{ disabled: isDisabled }"
          @click="toggleDropdown"
        >
          <img
            src="@/assets/images/arrow-down.svg"
            :class="{ disabled: isDisabled }"
            alt="Arrow"
          />
        </button>
        <div class="dropdown-list" v-show="isOpenDropdown">
          <template v-if="filteredList.length">
            <button
              class="dropdown-item"
              v-for="(data, i) in filteredList"
              @click="changeDropdownValue(data)"
              :key="i"
            >
              <span class="dropdown-item-info">
                <img class="dropdown-item-icon" :src="data.icon" alt="" />
                <span> {{ data.name }}</span>
              </span>
              <span>
                {{
                  `${data.address.slice(0, 6)}...${data.address.slice(-6)}`
                }}</span
              >
            </button>
          </template>
          <p class="dropdown-item" v-else>
            There are no results for "{{ address }}"
          </p>
        </div>
      </div>
    </div>

    <p class="error-message" :class="{ visibility: addressEntryError }">
      Invalid address
    </p>
  </div>
</template>

<script>
import { utils } from "ethers";
import { useImage } from "@/helpers/useImage";

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
    dropdownList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      address: this.destinationAddress,
      activeTokenInfo: null,
      isOpenDropdown: false,
      searchValue: "",
    };
  },

  watch: {
    destinationAddress() {
      this.address = this.destinationAddress;
      const tokenInfo = this.dropdownList.find(
        ({ address }) => address === this.destinationAddress
      );

      this.activeTokenInfo = !tokenInfo ? null : tokenInfo;
    },
  },

  computed: {
    checkInputAddress() {
      return this.address ? utils.isAddress(this.address.toLowerCase()) : false;
    },

    addressEntryError() {
      if (!this.address) return false;
      return !this.checkInputAddress;
    },

    filteredList() {
      return this.dropdownList.filter((item) => {
        return (
          item.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
          item.address.toLowerCase().includes(this.searchValue.toLowerCase())
        );
      });
    },
  },

  methods: {
    useImage,
    updateInput({ target }) {
      this.searchValue = target.value;
      this.isOpenDropdown = true;
      if (!this.addressEntryError)
        return this.$emit("update-input", this.address, this.addressEntryError);
      return this.$emit("error-input", this.addressEntryError);
    },

    toggleDropdown() {
      if (this.isDisabled) return false;
      this.isOpenDropdown = !this.isOpenDropdown;
    },

    closeDropdown() {
      this.isOpenDropdown = false;
    },

    changeDropdownValue(data) {
      this.searchValue = "";
      this.activeTokenInfo = data;
      this.$emit("changeTokenAddress", data);
      this.closeDropdown();
    },
  },
};
</script>

<style lang="scss" scoped>
.input-address-wrap {
  width: 100%;
}

.dropdown-wrap {
  position: relative;
}

.token-icon {
  position: absolute;
  width: 30px;
  left: 25px;
  top: 50%;
  transform: translateY(-50%);
}

.input-address {
  width: 100%;
  height: 50px;
  background: rgba(129, 126, 166, 0.2);
  border: 1px solid #494661;
  border-radius: 12px;
  outline: none;
  padding: 12px 20px 12px 65px;
  color: #fff;
  font-size: 14px;
}

.error {
  border-color: $clrErrorBorder;
}

.disabled {
  cursor: not-allowed;
}

.selected-token {
  border-radius: 12px 12px 0 0;
  background-color: #55535d;
}

.dropdown {
  width: 100%;
}

.dropdown-button {
  background: none;
  outline: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}

.dropdown-list {
  position: absolute;
  width: 100%;
  z-index: 1;
  top: 50px;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 0 0 20px 20px;
}

.dropdown-item {
  height: 50px;
  width: 100%;
  border: none;
  color: white;
  cursor: pointer;
  background-color: #55535d;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 15px 25px;
}

.dropdown-item :hover {
  color: #76c3f5;
}

.dropdown-item-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-item-icon {
  max-width: 20px;
  width: 100%;
  max-height: 25px;
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
