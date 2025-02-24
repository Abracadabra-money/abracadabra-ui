<template>
  <div
    class="dropdown"
    :class="{ active: showDropdownList, connected: !!account }"
    v-click-outside="closeDropdown"
  >
    <div
      class="dropdown-title"
      :class="{ 'active-dropdown': showDropdownList }"
      @click="toggleDropdown"
    >
      <ConnectButton class="dropdown-title" />

      <svg
        class="arrow"
        v-if="account"
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.16675 6L8.50008 11.3333L13.8334 6"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <TransitionWrapper animation-type="roll">
      <ul class="list" ref="dropdownList" v-show="showDropdownList">
        <!-- <li class="list-item copy" @click="copyingHandler">
          <img class="user-icon" src="@/assets/images/wallets/userIcon.svg" />
          {{ buttonText }}

          <img class="copy-icon" src="@/assets/images/copy-icon.svg" />
        </li> -->

        <li class="list-item" @click="disconnectHandler">
          <!-- <img
            class="disconnect-icon"
            src="@/assets/images/disconnect-icon.svg"
          /> -->
          Disconnnect wallet
        </li>

        <!-- <a class="list-item" :href="scanLink" target="_blank">
          <img class="link-icon" src="@/assets/images/link-icon.svg" />
          View on Explorer
        </a> -->
      </ul>
    </TransitionWrapper>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { adjustDropdownPosition } from "@/helpers/dropdown";
import { disconnectHelper } from "@/helpers/walletClienHelper";

export default {
  data() {
    return {
      showDropdownList: false,
      isCopied: false,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
    }),

    buttonText() {
      return this.isCopied
        ? "Copied"
        : `${this.account.slice(0, 5)}...${this.account.slice(-4)}`;
    },

    scanLink() {
      return `https://arbiscan.io/address/${this.account}`;
    },
  },

  methods: {
    toggleDropdown() {
      if (this.account) {
        this.showDropdownList = !this.showDropdownList;
        adjustDropdownPosition(this.$refs.dropdownList as HTMLElement);
      }
    },

    disconnectHandler() {
      disconnectHelper();
      this.closeDropdown();
    },

    closeDropdown() {
      this.showDropdownList = false;
    },

    async copyingHandler() {
      if (this.isCopied) return;

      await this.copyAddress();
      this.setAndResetIsCopiedStatus();
    },

    async copyAddress() {
      await navigator.clipboard.writeText(this.account);
    },

    setAndResetIsCopiedStatus(delay: number = 1000) {
      this.isCopied = true;
      setTimeout(() => (this.isCopied = false), delay);
    },
  },

  components: {
    TransitionWrapper: defineAsyncComponent(
      () => import("@/components/ui/TransitionWrapper.vue")
    ),
    ConnectButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/ConnectButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  z-index: 2;
  font-size: 14px;
  font-weight: 600;
  line-height: 150%;
  color: #000000;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 8px;
}

.connected {
  background: rgba(111, 111, 111, 0.06);
}

.dropdown-title {
  display: flex;
  align-items: center;
  text-transform: capitalize;
  transition: all 0.3s;
  padding-right: 5px;
}

.arrow {
  margin-left: 5px;
  transition: all 0.3s;
}

.dropdown:hover {
  background: rgba(111, 111, 111, 0.06);
}

.arrow {
  path {
    stroke: #fff;
  }
}

.list {
  position: absolute;
  top: calc(100% + 12.5px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 11px 13px;
  gap: 16px;
  border-radius: 12px;
  background: #fff;
  background: #0d1425;
  box-shadow: 0px 4px 14.1px 0px rgba(0, 0, 0, 0.1);
  overflow-y: hidden;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  line-height: 20.5px;
  color: #fff;
  transition: all 0.3s;
}

.list-item:not(.copy):hover {
  color: rgba(255, 255, 255, 0.6);
}

.copy {
  gap: 6px;
  padding: 0 0 8px 0;
  border-bottom: 1px solid #0000001f;
  font-size: 16px;
  font-weight: 700;
  line-height: 20.5px;
}

.copy-icon {
  margin: 0 0 0 auto;
}

.copy-icon:hover {
  margin: 0 0 0 auto;
  cursor: pointer;
}

.active .arrow {
  transform: rotate(180deg);
}
</style>
