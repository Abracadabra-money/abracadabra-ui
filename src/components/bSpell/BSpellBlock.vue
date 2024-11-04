<template>
  <div class="wrapper" v-if="lockerInfo">
    <div class="action-form">
      <div class="networks-wrap">
        <div class="network-title">Available on:</div>
        <AvailableNetworksBlock
          :selectedNetwork="selectedChain"
          :availableNetworks="availableNetworks"
          @changeNetwork="changeNetwork"
        />
      </div>

      <TabsBlock
        :tabsInfo="tabsInfo"
        :activeTab="activeTab"
        @changeActiveTab="changeActiveTab"
      />

      <component
        :is="activeTab"
        :lockerInfo="lockerInfo"
        :selectedChain="selectedChain"
        @updateBSpellInfo="createStakeInfo"
      />
    </div>

    <div class="info-wrap">
      <ClaimBlock
        :lockerInfo="lockerInfo"
        :selectedChain="selectedChain"
        @updateBSpellInfo="createStakeInfo"
      />

      <SpellLockTable :lockerInfo="lockerInfo" />
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { formatTokenBalance } from "@/helpers/filters";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import type { LockerInfo } from "@/helpers/bSpell/types";
import { getLockInfo } from "@/helpers/bSpell/getLockInfo";

export default {
  data() {
    return {
      activeTab: "MintForm",
      selectedChain: ARBITRUM_CHAIN_ID,
      lockerInfo: null as null | LockerInfo,
      availableNetworks: [ARBITRUM_CHAIN_ID],
      updateInterval: null as null | NodeJS.Timeout,
      tabsInfo: [
        {
          name: "MintForm",
          title: "Get bSpell",
        },
        {
          name: "RedeemForm",
          title: "Redeem",
        },
      ],
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount" }),
  },

  watch: {
    async account() {
      await this.createStakeInfo();
    },

    async selectedChain() {
      await this.createStakeInfo();
    },
  },

  methods: {
    formatTokenBalance,

    changeActiveTab(tabName: string) {
      this.activeTab = tabName;
    },

    changeNetwork(chainId: number) {
      this.selectedChain = chainId;
    },

    async createStakeInfo() {
      this.lockerInfo = await getLockInfo(this.account, this.selectedChain);
    },
  },

  async created() {
    await this.createStakeInfo();

    this.updateInterval = setInterval(async () => {
      await this.createStakeInfo();
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(Number(this.updateInterval));
  },

  components: {
    AvailableNetworksBlock: defineAsyncComponent(
      () => import("@/components/stake/AvailableNetworksBlock.vue")
    ),
    TabsBlock: defineAsyncComponent(
      () => import("@/components/bSpell/TabsBlock.vue")
    ),
    MintForm: defineAsyncComponent(
      () => import("@/components/bSpell/MintForm.vue")
    ),
    RedeemForm: defineAsyncComponent(
      () => import("@/components/bSpell/RedeemForm.vue")
    ),
    ClaimBlock: defineAsyncComponent(
      () => import("@/components/bSpell/ClaimBlock.vue")
    ),
    SpellLockTable: defineAsyncComponent(
      () => import("@/components/bSpell/SpellLockTable.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: grid;
  grid-template-columns: 524px 1fr;
  grid-gap: 24px;
}

.action-form {
  gap: 16px;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.networks-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.network-title {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.45px;
}

.info-wrap {
  gap: 24px;
  display: flex;
  flex-direction: column;
}
</style>
