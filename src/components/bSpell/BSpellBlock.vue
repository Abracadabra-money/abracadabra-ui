<template>
  <div class="wrapper" v-if="bSpellInfo">
    <div class="action-form">
      <div class="networks-wrap">
        <div class="network-title">Available on:</div>
        <AvailableNetworksBlock
          :selectedNetwork="selectedNetwork"
          :availableNetworks="availableNetworks"
          @changeNetwork="$emit('changeNetwork')"
        />
      </div>

      <TabsBlock
        :tabsInfo="tabsInfo"
        :activeTab="activeTab"
        @changeActiveTab="changeActiveTab"
      />

      <MintForm
        v-if="activeTab === 'MintForm'"
        :bSpellInfo="bSpellInfo"
        :selectedNetwork="selectedNetwork"
        @updateBSpellInfo="$emit('updateBSpellInfo')"
      />

      <RedeemForm
        v-else
        :bSpellInfo="bSpellInfo"
        :selectedNetwork="selectedNetwork"
        @updateBSpellInfo="$emit('updateBSpellInfo')"
      />
    </div>

    <div class="info-wrap">
      <ClaimBlock
        :bSpellInfo="bSpellInfo"
        :selectedNetwork="selectedNetwork"
        @updateBSpellInfo="$emit('updateBSpellInfo')"
      />

      <SpellLockTable :bSpellInfo="bSpellInfo" />
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import type { BSpellInfo } from "@/helpers/bSpell/types";
import { defineAsyncComponent, type PropType } from "vue";

export default {
  emits: ["updateBSpellInfo", "changeNetwork"],

  props: {
    selectedNetwork: {
      type: Number,
      required: true,
    },

    availableNetworks: {
      type: Array as () => number[],
      required: true,
    },

    bSpellInfo: {
      type: Object as PropType<BSpellInfo | null>,
      required: true,
    },
  },

  data() {
    return {
      activeTab: "MintForm",
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

  methods: {
    changeActiveTab(tabName: string) {
      this.activeTab = tabName;
    },
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
