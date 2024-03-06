<template>
  <div class="pool-view">
    <div class="pool">
      <PoolActionBlock
        :isUserPositionOpen="isUserPositionOpen"
        @openPosition="isMyPositionPopupOpened = true"
      />

      <PoolComposition />

      <PoolPosition
        :isMyPositionPopupOpened="isMyPositionPopupOpened"
        @closePopup="isMyPositionPopupOpened = false"
        v-if="isUserPositionOpen"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification";
import { parseUnits, formatUnits } from "viem";
import { approveTokenViem } from "@/helpers/approval";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { trimZeroDecimals } from "@/helpers/numbers";

export default {
  props: {
    id: { type: String },
    poolChainId: { type: String },
  },

  data() {
    return {
      isMyPositionPopupOpened: false,
      inputAmount: null,
      inputValue: "",
      activeTab: "deposit",
      tabItems: ["deposit", "remove"],
      poolsTimer: null,
      selectedPool: null,
      isActionProcessing: false,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      signer: "getSigner",
    }),

    isUserPositionOpen() {
      return true;
    },

    isRemove() {
      return this.activeTab === "remove";
    },

    isAllowed() {
      if (!this.account || !this.selectedpool) return false;
      return (
        parseUnits(this.selectedpool?.accountInfo?.allowance) >=
        this.inputAmount
      );
    },

    isValid() {
      return !!this.inputAmount;
    },

    isDeprecated() {
      return this.selectedPool?.isDeprecated;
    },

    max() {
      return 8888888888888888888n;
    },

    error() {
      return this.inputAmount > this.max
        ? `The value cannot be greater than ${formatUnits(this.max)}`
        : null;
    },

    buttonText() {
      if (!this.isProperNetwork) return "Switch network";
      if (!this.account) return "Connect wallet";
      if (this.error) return "Insufficient balance";
      if (this.inputValue == "") return "Enter amount";
      if (this.isActionProcessing) return "Processing...";
      const text = this.isRemove ? "Remove" : "Deposit";
      return !this.isAllowed && !this.isRemove ? "Approve" : text;
    },

    isButtonDisabled() {
      return (
        (!this.isValid || !!this.error || this.isActionProcessing) &&
        this.isProperNetwork &&
        !!this.account
      );
    },

    isProperNetwork() {
      return this.chainId == this.poolChainId;
    },
  },

  watch: {
    account: {
      immediate: true,
      async handler() {},
    },

    id: {
      immediate: true,
      async handler() {
        const action = this.$route.redirectedFrom?.query.action;
        if (action) this.selectTab(action);
      },
    },

    poolChainId: {
      immediate: true,
      async handler() {
        const action = this.$route.redirectedFrom?.query.action;
        if (action) this.selectTab(action);
      },
    },

    max() {
      this.inputAmount = BigInt(0);
    },

    isDeprecated(status) {
      this.activeTab = status ? "remove" : "deposit";
    },

    inputAmount(value) {
      if (value == 0) {
        this.inputValue = "";
        return false;
      }

      this.inputValue = trimZeroDecimals(formatUnits(value, 18));
    },
  },

  methods: {
    updateValue(value) {
      if (value === null) return (this.inputAmount = BigInt(0));
      this.inputAmount = value;
    },

    selectTab(action) {
      this.activeTab = action;
    },

    openMyPositionPopup() {
      this.isMyPositionPopupOpened = true;
    },
  },

  async created() {
    this.poolsTimer = setInterval(async () => {}, 60000);
  },

  beforeUnmount() {
    clearInterval(this.poolsTimer);
  },

  components: {
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    IconButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/IconButton.vue")
    ),
    PoolActionBlock: defineAsyncComponent(() =>
      import("@/components/pools/pool/PoolActionBlock.vue")
    ),
    PoolComposition: defineAsyncComponent(() =>
      import("@/components/pools/pool/PoolComposition.vue")
    ),
    PoolPosition: defineAsyncComponent(() =>
      import("@/components/pools/pool/PoolPosition.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-view {
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
  min-height: 100vh;
  padding: 100px 0 40px 0;
  margin: 0 auto;
}

.pool {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 30px;
  width: 593px;
}

@media (max-width: 1300px) {
  .pool {
    position: static;
  }
}

@media (max-width: 600px) {
  .pool-wrap {
    padding: 30px;
  }

  .pool {
    padding: 0 15px;
    width: 100% !important;
  }
}
</style>
