<template>
  <div class="farm-view">
    <div class="farm">
      <div class="farm-header">
        <div class="title-desc">
          <h3 class="title">Farm</h3>
          <p class="description">Stake LP Tokens and Earn Rewards</p>
        </div>

        <div class="farm-management">
          <MarketsSwitch
            :name="selectedTab"
            :items="items"
            @select="selectTab($event)"
            :isDeprecated="isDeprecated"
          />

          <button
            class="my-position-button"
            @click="openMyPositionPopup"
            v-if="isUserPositionOpen"
          >
            My position
          </button>
        </div>
      </div>

      <FarmingOpportunities
        :selectedFarm="selectedFarm"
        @openFarmsPopup="openFarmsPopup"
      />

      <FarmActionBlock
        :selectedFarm="selectedFarm"
        :inputTitleText="inputTitleText"
        :max="max"
        :value="inputValue"
        :error="error"
        :buttonText="buttonText"
        :isButtonDisabled="isButtonDisabled"
        @updateValue="updateValue"
        @actionHandler="actionHandler"
      />

      <FarmPosition
        :selectedFarm="selectedFarm"
        :isProperNetwork="isProperNetwork"
        @updateFarmData="getSelectedFarm()"
        v-if="isUserPositionOpen"
      />
    </div>

    <FarmPositionMobilePopup
      :selectedFarm="selectedFarm"
      :isProperNetwork="isProperNetwork"
      @updateFarmData="getSelectedFarm()"
      v-if="isUserPositionOpen && isMyPositionPopupOpened"
      @closePopup="isMyPositionPopupOpened = false"
    />

    <LocalPopupWrap
      :isOpened="isFarmsPopupOpened"
      :isFarm="true"
      @closePopup="isFarmsPopupOpened = false"
    >
      <FarmListPopup @changeActiveMarket="changeActiveMarket" />
    </LocalPopupWrap>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification";
import { createFarmData, emptyFarmData } from "@/helpers/farm/createFarmData";
import { parseUnits, formatUnits } from "viem";
import { approveTokenViem } from "@/helpers/approval";
import actions from "@/helpers/farm/actions";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { trimZeroDecimals } from "@/helpers/numbers";
import type { FarmItem } from "@/configs/farms/types";

export default {
  props: {
    id: { type: String, required: true },
    farmChainId: { type: String, required: true },
  },

  data() {
    return {
      activeNetworks: [1, 250, 43114, 42161],
      isFarmsPopupOpened: false,
      isMyPositionPopupOpened: false,
      inputAmount: 0n as bigint,
      inputValue: "",
      selectedTab: "stake",
      items: ["stake", "unstake"],
      farmTimer: null as NodeJS.Timeout | null,
      selectedFarm: emptyFarmData as FarmItem,
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
      if (!this.selectedFarm?.accountInfo || !this.account) return false;
      const isOpenMultiReward = this.selectedFarm.isMultiReward
        ? Number(this.selectedFarm.accountInfo.depositedBalance) > 0 ||
          (this.selectedFarm.accountInfo?.rewardTokensInfo || []).filter(
            (item) => +item.earned > 0
          ).length > 0
        : false;

      const isOpenLegacyFarm =
        Number(this.selectedFarm.accountInfo?.userReward) != 0 ||
        Number(this.selectedFarm.accountInfo?.userInfo.amount) != 0;

      return this.selectedFarm.isMultiReward
        ? isOpenMultiReward
        : isOpenLegacyFarm;
    },

    isUnstake() {
      return this.selectedTab === "unstake";
    },

    isAllowed() {
      if (!this.account || !this.selectedFarm) return false;
      return (
        parseUnits(this.selectedFarm?.accountInfo?.allowance || "0", 18) >=
        this.inputAmount
      );
    },

    isValid() {
      return !!this.inputAmount;
    },

    isDeprecated() {
      return this.selectedFarm?.isDeprecated;
    },

    max() {
      if (!this.selectedFarm?.accountInfo) return 0n;
      if (this.selectedFarm?.isMultiReward) {
        return !this.isUnstake
          ? parseUnits(this.selectedFarm?.accountInfo.balance as string, 18)
          : parseUnits(
              this.selectedFarm?.accountInfo.depositedBalance as string,
              18
            );
      }
      return !this.isUnstake
        ? (this.selectedFarm?.accountInfo.balance as bigint)
        : this.selectedFarm?.accountInfo?.depositedBalanceBigInt || 0n;
    },
    error() {
      return this.inputAmount > this.max
        ? `The value cannot be greater than ${formatUnits(this.max, 18)}`
        : undefined;
    },

    buttonText() {
      if (!this.isProperNetwork) return "Switch network";
      if (!this.account) return "Connect wallet";
      if (this.error) return "Insufficient balance";
      if (this.inputValue == "") return "Enter amount";
      if (this.isActionProcessing) return "Processing...";
      const text = this.isUnstake ? "Unstake" : "Stake";
      return !this.isAllowed && !this.isUnstake ? "Approve" : text;
    },

    inputTitleText() {
      return `${this.isUnstake ? "Unstake" : "Deposit"} ${
        this.selectedFarm ? this.selectedFarm.stakingToken.name : ""
      } tokens`;
    },

    isButtonDisabled() {
      return (
        (!this.isValid || !!this.error || this.isActionProcessing) &&
        this.isProperNetwork &&
        !!this.account
      );
    },

    isProperNetwork() {
      return this.chainId == this.farmChainId;
    },
  },

  watch: {
    account: {
      immediate: true,
      async handler() {
        await this.getSelectedFarm();
      },
    },

    id: {
      immediate: true,
      async handler() {
        await this.getSelectedFarm();
        const action = this.$route.redirectedFrom?.query.action;
        if (action) this.selectTab(action.toString());
      },
    },

    farmChainId: {
      immediate: true,
      async handler() {
        await this.getSelectedFarm();
        const action = this.$route.redirectedFrom?.query.action;
        if (action) this.selectTab(action.toString());
      },
    },

    async chainId() {
      await this.getSelectedFarm();
    },

    max() {
      this.inputAmount = 0n;
    },

    isDeprecated(status) {
      this.selectedTab = status ? "unstake" : "stake";
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
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    updateValue(value: bigint) {
      if (value === null) return (this.inputAmount = 0n);
      this.inputAmount = value;
    },

    changeActiveMarket({ id, chainId }: { id: number; chainId: number }) {
      if (
        Number(id) != Number(this.id) ||
        Number(chainId) != Number(this.farmChainId)
      )
        this.$router.push({ path: `/farm/${id}/${chainId}` });

      this.isFarmsPopupOpened = false;
    },

    selectTab(action: string) {
      this.selectedTab = action;
    },

    async actionHandler() {
      if (this.isButtonDisabled || !this.selectedFarm) return false;
      if (!this.isProperNetwork) return switchNetwork(Number(this.farmChainId));
      if (!this.account) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      this.isActionProcessing = true;

      if (!this.isAllowed && !this.isUnstake) await this.approveHandler();
      else if (this.isUnstake) await this.unstakeHandler();
      else await this.stakeHandler();
      this.isActionProcessing = false;
    },

    async stakeHandler() {
      const notificationId = await this.createNotification(
        notification.pending
      );

      try {
        this.selectedFarm!.isMultiReward
          ? await actions.stake(
              this.selectedFarm!.contractInfo,
              this.inputAmount
            )
          : await actions.deposit(
              this.selectedFarm!.contractInfo,
              this.selectedFarm!.poolId!,
              this.inputAmount
            );

        await this.getSelectedFarm();

        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      } catch (error) {
        console.log("stake err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
    },

    async unstakeHandler() {
      const notificationId = await this.createNotification(
        notification.pending
      );
      try {
        const args = this.selectedFarm!.isMultiReward
          ? [this.inputAmount]
          : [this.selectedFarm!.poolId, this.inputAmount];

        const isExit =
          this.inputAmount === this.max && this.selectedFarm!.isMultiReward;

        isExit
          ? await actions.exit(this.selectedFarm!.contractInfo)
          : await actions.withdraw(this.selectedFarm!.contractInfo, args);

        await this.getSelectedFarm();

        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      } catch (error) {
        console.log("unstakeHandler err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
    },

    async approveHandler() {
      const notificationId = await this.createNotification(
        notification.approvePending
      );

      try {
        await approveTokenViem(
          this.selectedFarm!.stakingToken.contractInfo,
          this.selectedFarm!.contractInfo.address
        );
        await this.getSelectedFarm();

        await this.deleteNotification(notificationId);
      } catch (error) {
        console.log("approve err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
    },

    async getSelectedFarm() {
      console.log("getSelectedFarm");

      this.selectedFarm = await createFarmData(
        this.id,
        this.farmChainId,
        this.account
      );

      console.log("getSelectedFarm", this.selectedFarm);
    },

    openFarmsPopup() {
      this.isFarmsPopupOpened = true;
    },

    openMyPositionPopup() {
      this.isMyPositionPopupOpened = true;
    },
  },

  async created() {
    await this.getSelectedFarm();

    this.farmTimer = setInterval(async () => {
      await this.getSelectedFarm();
    }, 60000);
  },

  beforeUnmount() {
    if (this.farmTimer) clearInterval(this.farmTimer);
  },

  components: {
    LocalPopupWrap: defineAsyncComponent(
      () => import("@/components/popups/LocalPopupWrap.vue")
    ),
    FarmListPopup: defineAsyncComponent(
      () => import("@/components/farm/FarmListPopup.vue")
    ),
    FarmPositionMobilePopup: defineAsyncComponent(
      () => import("@/components/farm/FarmPositionMobilePopup.vue")
    ),
    MarketsSwitch: defineAsyncComponent(
      () => import("@/components/farm/MarketsSwitch.vue")
    ),
    FarmingOpportunities: defineAsyncComponent(
      () => import("@/components/farm/FarmingOpportunities.vue")
    ),
    FarmActionBlock: defineAsyncComponent(
      () => import("@/components/farm/FarmActionBlock.vue")
    ),
    FarmPosition: defineAsyncComponent(
      () => import("@/components/farm/FarmPosition.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.farm-view {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: 120px 0 50px 0;
  margin: 0 auto;
}

.farm {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 30px;
  width: 593px;
}

.farm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 66px;
  width: 100%;
  margin-bottom: 16px;
}

.title-desc {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-grow: 1;
}

.title-desc .title {
  color: #fff;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 10px;
}

.title-desc .description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}

.farm-management {
  display: flex;
  justify-content: space-between;
}

.my-position-button {
  display: none;
  color: inherit;
  padding: 8px 24px;
  gap: 10px;
  border-radius: 12px;
  border: 2px solid #7088cc;
  background: rgba(255, 255, 255, 0.01);
  color: #7088cc;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.my-position-button:hover {
  opacity: 0.7;
}

@media (max-width: 1300px) {
  .farm-header {
    flex-direction: column;
    align-items: start;
    gap: 16px;
  }

  .farm-management {
    width: 100%;
  }

  .my-position-button {
    display: block;
  }
}

@media (max-width: 600px) {
  .farm-wrap {
    padding: 30px;
  }

  .farm {
    padding: 0 15px;
    width: 100% !important;
  }

  .my-position-button {
    height: 39px;
    font-size: 14px;
  }
}

@media (max-width: 374px) {
  .my-position-button {
    font-size: 12px;
  }
}
</style>
