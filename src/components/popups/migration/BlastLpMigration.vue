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

    <MlpAvailableStep
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

    <MigrateStep v-if="steap === 4" :userInfo="userInfo" :poolInfo="poolInfo" />
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { BLAST_CHAIN_ID } from "@/constants/global";
import { getPoolInfo } from "@/helpers/pools/getPoolInfo";
import { getUserInfo } from "@/helpers/blastLpMigration/getUserInfo";
import type { UserInfo } from "@/helpers/blastLpMigration/getUserInfo";

const MIM_USDB_POOL_ID = 1;

export default {
  data() {
    return {
      userData: null as null | UserInfo,
      poolData: null as any,
      steap: 1,
      updateInterval: null as any,
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
  },

  async created() {
    await this.createInfo();

    this.updateInterval = setInterval(async () => {
      await this.createInfo();
    }, 30000);
  },

  beforeUnmount() {
    clearInterval(Number(this.updateInterval));
  },

  components: {
    BaseStep: defineAsyncComponent(
      () => import("@/components/popups/migration/BaseStep.vue")
    ),
    MlpAvailableStep: defineAsyncComponent(
      () => import("@/components/popups/migration/MlpAvailableStep.vue")
    ),
    UnstakeStep: defineAsyncComponent(
      () => import("@/components/popups/migration/UnstakeStep.vue")
    ),
    MigrateStep: defineAsyncComponent(
      () => import("@/components/popups/migration/MigrateStep.vue")
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
    padding: 32px 24px;
    gap: 12px;
  }

  .close-btn {
    top: 16px;
    right: 16px;
  }
}
</style>
