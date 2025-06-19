<template>
  <div class="page-view">
    <div class="content-wrap" v-if="bSpellInfo">
      <BSpellHeader
        :bSpellInfo="bSpellInfo"
        @changeActiveTab="changeActiveTab"
      />

      <TransitionWrapper appear v-if="activeTab === 'BSpellBlock'">
        <BSpellBlock
          :bSpellInfo="bSpellInfo"
          :selectedNetwork="selectedNetwork"
          :availableNetworks="availableNetworks"
          @changeNetwork="changeActiveNetwork"
          @updateBSpellInfo="createOrUpdateInfo"
        />
      </TransitionWrapper>

      <TransitionWrapper appear v-else>
        <SpellPowerBlock
          :aprInfo="aprInfo"
          :bSpellInfo="bSpellInfo"
          :selectedNetwork="selectedNetwork"
          :availableNetworks="availableNetworks"
          @changeNetwork="changeActiveNetwork"
          @updateBSpellInfo="createOrUpdateInfo"
        />
      </TransitionWrapper>

      <BSpellInfoBlock :bSpellInfo="bSpellInfo" />
    </div>

    <div class="loader-wrap" v-else>
      <BaseLoader large text="Loading stake" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { mapGetters, mapMutations } from "vuex";
import type { AprInfo } from "@/helpers/bSpell/types";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import { dataRefresher } from "@/helpers/dataRefresher";
import type { RefresherInfo } from "@/helpers/dataRefresher";
import type { BSpellInfo } from "@/helpers/bSpell/types";
import { getBSpellInfo } from "@/helpers/bSpell/getLockInfo";
import { getBSpellApr } from "@/helpers/bSpell/getBSpellAPR";
import ErrorHandler from "@/helpers/errorHandler/ErrorHandler";

export default {
  data() {
    return {
      activeTab: "BSpellBlock",
      bSpellInfoArr: [] as BSpellInfo[] | null,
      refresherInfo: {
        refresher: null as unknown as dataRefresher<BSpellInfo[]>,
        remainingTime: 0,
        isLoading: false,
        intervalTime: 60,
      } as RefresherInfo<BSpellInfo[]>,
      selectedNetwork: ARBITRUM_CHAIN_ID,
      availableNetworks: [ARBITRUM_CHAIN_ID],
      aprInfo: null as AprInfo | null,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      localStakeData: "getBSpellData",
    }),

    bSpellInfo() {
      if (!this.bSpellInfoArr) return null;

      const bSpellInfo = this.bSpellInfoArr.find(
        (info: BSpellInfo) => info.chainId === +this.selectedNetwork
      );

      if (!bSpellInfo) return null;
      return bSpellInfo;
    },
  },

  watch: {
    async account() {
      await this.createOrUpdateInfo();
    },

    async chainId() {
      await this.createOrUpdateInfo();
    },

    async selectedNetwork() {
      await this.createOrUpdateInfo();
    },

    async bSpellInfo() {
      await this.getAprInfo();
    },
  },

  methods: {
    ...mapMutations({
      setBSpellStakeData: "setBSpellStakeData",
    }),

    changeActiveTab(tabName: string) {
      this.activeTab = tabName;
    },

    changeActiveNetwork(chainId: number) {
      this.selectedNetwork = chainId;
    },

    async createBSpellInfo() {
      return await getBSpellInfo(this.account);
    },

    async createOrUpdateInfo() {
      const refresher = this.refresherInfo?.refresher;
      try {
        if (!refresher) this.bSpellInfoArr = await this.createBSpellInfo();
        else refresher.manualUpdate();
      } catch (error) {
        this.bSpellInfoArr = await this.createBSpellInfo();
      }
    },

    createDataRefresher() {
      this.refresherInfo.refresher = new dataRefresher(
        this.createBSpellInfo,
        this.refresherInfo.intervalTime,
        (time) => (this.refresherInfo.remainingTime = time),
        (loading) => (this.refresherInfo.isLoading = loading),
        (updatedData: BSpellInfo[] | null) => (this.bSpellInfoArr = updatedData)
      );
    },

    checkLocalData() {
      if (this.localStakeData.isCreated && this.account) {
        this.bSpellInfoArr = this.localStakeData.data;
      }
    },

    emptyArpInfo() {
      if (!this.bSpellInfo || !this.bSpellInfo.rewardTokensInfo)
        return { totalApr: 0, tokensApr: [] };

      const tokensApr = this.bSpellInfo.rewardTokensInfo.map((tokenInfo) => {
        return {
          address: tokenInfo.contract.address,
          price: tokenInfo.price,
          apr: 0,
          icon: tokenInfo.icon,
          name: tokenInfo.name,
        };
      });

      this.aprInfo = { totalApr: 0, tokensApr };
    },

    async getAprInfo() {
      try {
        if (
          !this.bSpellInfo ||
          !this.bSpellInfo.stakeInfo ||
          !this.bSpellInfo.rewardTokensInfo
        ) {
          this.emptyArpInfo();
        } else {
          this.aprInfo = await getBSpellApr(
            this.selectedNetwork,
            this.bSpellInfo.rewardTokensInfo,
            this.bSpellInfo.stakeInfo.totalSupply,
            this.bSpellInfo.stakeInfo.contract,
            this.bSpellInfo.spell.price
          );
        }
      } catch (error) {
        ErrorHandler.handleError(error as Error);
        this.emptyArpInfo();
      }
    },
  },

  async created() {
    this.checkLocalData();
    await this.createOrUpdateInfo();
    this.setBSpellStakeData(this.bSpellInfoArr);
    this.createDataRefresher();
    this.refresherInfo.refresher.start();

    await this.getAprInfo();
  },

  beforeUnmount() {
    this.refresherInfo.refresher.stop();
  },

  components: {
    BSpellHeader: defineAsyncComponent(
      () => import("@/components/bSpell/BSpellHeader.vue")
    ),
    BSpellBlock: defineAsyncComponent(
      () => import("@/components/bSpell/BSpellBlock.vue")
    ),
    SpellPowerBlock: defineAsyncComponent(
      () => import("@/components/bSpell/SpellPowerBlock.vue")
    ),
    TransitionWrapper: defineAsyncComponent(
      () => import("@/components/ui/TransitionWrapper.vue")
    ),
    BSpellInfoBlock: defineAsyncComponent(
      () => import("@/components/bSpell/BSpellInfoBlock.vue")
    ),
    BaseLoader: defineAsyncComponent(
      () => import("@/components/base/BaseLoader.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.page-view {
  min-height: 100vh;
}

.content-wrap {
  max-width: 1310px;
  width: 100%;
  padding: 124px 15px 90px;
  margin: 0 auto;
  position: relative;
  gap: 24px;
  display: flex;
  flex-direction: column;
}

.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

@media screen and (max-width: 600px) {
  .content-wrap {
    gap: 16px;
  }
}
</style>
