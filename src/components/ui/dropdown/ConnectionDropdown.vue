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
      <ConnectButton class="dropdown-title" isHide />

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
        <li class="list-item copy" @click="copyingHandler">
          <div class="account-image-wrap">
            <img
              class="user-icon"
              src="@/assets/images/header/account-image.png"
            />
          </div>
          {{ buttonText }}

          <img class="copy-icon" src="@/assets/images/connect/copy-icon.svg" />
        </li>

        <li class="list-item" @click="disconnectHandler">
          Disconnnect wallet
          <img
            class="disconnect-icon"
            src="@/assets/images/connect/disconnnect-icon.svg"
          />
        </li>

        <a class="list-item" :href="scanLink" target="_blank">
          View on Explorer
          <img class="link-icon" src="@/assets/images/connect/link-icon.svg" />
        </a>
      </ul>
    </TransitionWrapper>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { adjustDropdownPosition } from "@/helpers/dropdown";
import { disconnectHelper } from "@/helpers/walletClienHelper";
import { getViemConfigById } from "@/helpers/chains/getChainsInfo";

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
      chainId: "getChainId",
    }),

    buttonText() {
      if (!this.account) return "Connect wallet";
      return this.isCopied
        ? "Copied"
        : `${this.account.slice(0, 5)}...${this.account.slice(-4)}`;
    },

    scanLink() {
      const chainConfig = getViemConfigById(this.chainId);
      return `${chainConfig.blockExplorers.default.url}/address/${this.account}`;
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
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  gap: 16px;
  border-radius: 12px;
  background: #fff;
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  overflow-y: hidden;
  width: 233px;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  transition: all 0.3s;
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;
}

.list-item:not(.copy):hover {
  color: rgba(255, 255, 255, 0.6);
}

.copy {
  gap: 6px;
  color: var(--ffffff, #fff);
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px; /* 157.143% */
}

.account-image-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  height: 100%;
  padding: 0px 9px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.06);
  height: 24px;
  width: 24px;
  border-radius: 32px;
}

.user-icon {
  width: 14px;
  height: 14px;
  border-radius: 32px;
}

.copy-icon {
  width: 20px;
  height: 20px;
  margin: 0 0 0 auto;
}

.active .arrow {
  transform: rotate(180deg);
}

.disconnect-icon {
  width: 20px;
  height: 20px;
}

.link-icon {
  width: 20px;
  height: 20px;
}

@media screen and (max-width: 600px) {
  .list {
    left: -10px !important;
  }
}
</style>
