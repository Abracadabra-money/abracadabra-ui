<template>
  <div class="popup">
    <img
      class="close-btn"
      @click="closePopup"
      src="@/assets/images/close.svg"
      alt="close"
    />

    <BaseStep
      v-if="steap === 1"
      :poolInfo="poolInfo"
      :availableAmount="availableAmount"
      @changeSteap="changeSteap"
    />

    <BalancesStep
      v-if="steap === 2"
      :poolInfo="poolInfo"
      :userInfo="userInfo"
      :availableAmount="availableAmount"
      @changeSteap="changeSteap"
    />

    <UnstakeStep
      v-if="steap === 3"
      :poolInfo="poolInfo"
      :userInfo="userInfo"
      @changeSteap="changeSteap"
      @updateInfo="updateInfo"
    />

    <MigrateStep
      v-if="steap === 4"
      :userInfo="userInfo"
      :poolInfo="poolInfo"
      :availableAmount="availableAmount"
      :arbBridgeBalanceUsdt="arbBridgeBalanceUsdt"
      @changeSteap="changeSteap"
      @updateSuccessData="updateSuccessData"
    />

    <SuccessStep
      v-if="steap === 5"
      :poolInfo="poolInfo"
      :successData="successData"
      :availableAmount="availableAmount"
      @changeSteap="changeSteap"
      @closePopups="closePopup"
    />
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import tokensAbi from "@/abis/tokensAbi/index";
import { getPoolInfo } from "@/helpers/pools/getPoolInfo";
import { ARB_USDT_ADDRESS } from "@/constants/blastLpMigration";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { ARB_BRIDGE_ADDRESS } from "@/constants/blastLpMigration";
import { getUserInfo } from "@/helpers/blastLpMigration/getUserInfo";
import type { UserInfo } from "@/helpers/blastLpMigration/getUserInfo";
import { ARBITRUM_CHAIN_ID, BLAST_CHAIN_ID } from "@/constants/global";

const MIM_USDB_POOL_ID = 1;

export default {
  data() {
    return {
      userData: null as null | UserInfo,
      poolData: null as any,
      steap: 1,
      updateInterval: null as any,
      usdtUpdateInterval: null as any,
      arbBridgeBalanceUsdt: 0n,
      successData: null as any,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", popupData: "getPopupData" }),

    availableAmount() {
      if (!this.userInfo) return 0n;

      const { amountAllowed, amountAllowedInitial } = this.userInfo;
      const { initialized, amount } = amountAllowed;

      if (initialized) return amount;

      return amountAllowedInitial;
    },

    userInfo() {
      return !this.userData ? this.popupData.userInfo : this.userData;
    },

    poolInfo() {
      return !this.poolData ? this.popupData.poolInfo : this.poolData;
    },
  },

  methods: {
    closePopup() {
      store.commit("closePopups");
    },

    changeSteap(steap: number) {
      this.steap = steap;
    },

    async createInfo() {
      if (!this.account) return;

      this.userData = await getUserInfo(this.account);

      this.poolData = await getPoolInfo(
        BLAST_CHAIN_ID,
        MIM_USDB_POOL_ID,
        this.account
      );
    },

    async updateInfo() {
      await this.createInfo();
    },

    async checkUsdtAmount() {
      const publicClient = getPublicClient(ARBITRUM_CHAIN_ID);

      this.arbBridgeBalanceUsdt = await publicClient.readContract({
        address: ARB_USDT_ADDRESS,
        abi: tokensAbi.USDT,
        functionName: "balanceOf",
        args: [ARB_BRIDGE_ADDRESS],
      });
    },

    updateSuccessData(data: any) {
      this.successData = data;
    },
  },

  async created() {
    await this.createInfo();
    await this.checkUsdtAmount();

    this.updateInterval = setInterval(async () => {
      await this.createInfo();
    }, 30000);

    this.usdtUpdateInterval = setInterval(async () => {
      await this.checkUsdtAmount();
    }, 5000);
  },

  beforeUnmount() {
    clearInterval(Number(this.updateInterval));
    clearInterval(Number(this.usdtUpdateInterval));
  },

  components: {
    BaseStep: defineAsyncComponent(
      () => import("@/components/popups/migration/BaseStep.vue")
    ),
    BalancesStep: defineAsyncComponent(
      () => import("@/components/popups/migration/BalancesStep.vue")
    ),
    UnstakeStep: defineAsyncComponent(
      () => import("@/components/popups/migration/UnstakeStep.vue")
    ),
    MigrateStep: defineAsyncComponent(
      () => import("@/components/popups/migration/MigrateStep.vue")
    ),
    SuccessStep: defineAsyncComponent(
      () => import("@/components/popups/migration/SuccessStep.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.popup {
  position: relative;
  gap: 24px;
  display: flex;
  flex-direction: column;
  min-width: 534px;
  max-width: 534px;
  width: 100%;
  padding: 32px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.close-btn {
  width: 24px;
  height: 24px;
  cursor: pointer;
  position: absolute;
  top: 32px;
  right: 32px;
}

@media screen and (max-width: 600px) {
  .popup {
    min-width: 95vw;
    padding: 32px 24px;
    gap: 12px;
  }

  .close-btn {
    top: 16px;
    right: 16px;
  }
}
</style>
