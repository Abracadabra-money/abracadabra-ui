<template>
  <div class="msr-view">
    <div class="msr-head">
      <h3 class="title">MIM Saving Rate</h3>
      <ActionsTabs
        :items="actions"
        :name="activeAction"
        activeColor="white"
        @select="selectAction"
      />
      <p class="subtitle">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor
      </p>
    </div>

    <TotalTVL
      :mimSavingRateInfo="mimSavingRateInfo"
      :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
    />

    <ActionBlock
      :activeAction="activeAction"
      :mimSavingRateInfo="mimSavingRateInfo"
      :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
      @updateMimSavingRateInfo="createMimSavingRateInfo"
    />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import {
  getMimSavingRateInfo,
  type MimSavingRateInfo,
  emptyMimSavingRateInfo,
} from "@/helpers/mimSavingRate/getMimSavingRateInfo";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";

export type MSRActionName = "Stake" | "Claim";

export default {
  data() {
    return {
      actions: ["Stake", "Claim"],
      mimSavingRateInfo: emptyMimSavingRateInfo as MimSavingRateInfo,
      isMimSavingRateInfoLoading: true,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      getChainById: "getChainById",
    }),

    activeAction() {
      return (this.$route.query.action as MSRActionName) || "Stake";
    },
  },

  watch: {
    async account() {
      await this.createMimSavingRateInfo();
    },

    async chainId() {
      await this.createMimSavingRateInfo();
    },
  },

  methods: {
    selectAction(action: MSRActionName, isPromo = false) {
      const query: { action: string; promo?: string } = {
        action: `${action}`,
      };
      if (isPromo) query.promo = "promo";

      this.$router.replace({
        name: "MSR",
        query,
      });
    },

    async createMimSavingRateInfo() {
      const publicClient = this.getChainById(ARBITRUM_CHAIN_ID).publicClient;

      this.isMimSavingRateInfoLoading = true;

      this.mimSavingRateInfo = await getMimSavingRateInfo(
        this.account,
        publicClient
      );

      this.isMimSavingRateInfoLoading = false;
    },
  },

  async created() {
    await this.createMimSavingRateInfo();
  },

  components: {
    ActionBlock: defineAsyncComponent(
      () => import("@/components/msr/ActionBlock.vue")
    ),
    ActionsTabs: defineAsyncComponent(
      () => import("@/components/msr/ActionsTabs.vue")
    ),
    TotalTVL: defineAsyncComponent(
      () => import("@/components/msr/totalInfo/TotalTVL.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.msr-view {
  position: relative;
  display: grid;
  grid-template-areas:
    "head total"
    "action action";
  grid-template-columns: auto;
  gap: 32px;
  min-height: 100vh;
  max-width: 1310px;
  width: 100%;
  padding: 128px 15px;
  margin: auto;
}

.msr-head {
  grid-area: head;
  display: grid;
  grid-template-areas:
    "title switch"
    "subtitle subtitle";
  gap: 12px;
  width: 100%;
}

.title {
  grid-area: title;
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 32px;
  font-weight: 600;
}

.switch {
  grid-area: switch;
  align-self: end;
}

.subtitle {
  grid-area: subtitle;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}

.tvl-card {
  grid-area: total;
  align-self: start !important;
}

.action-block {
  grid-area: action;
}

@media (max-width: 1000px) {
  .msr-view {
    grid-template-areas:
      "head"
      "action"
      "total";
    gap: 16px;
  }

  .msr-head {
    grid-template-areas:
      "title"
      "subtitle"
      "switch";
  }
}

@media (max-width: 500px) {
  .title {
    font-size: 24px;
  }

  .subtitle{
    font-size: 14px;
  }
}
</style>
