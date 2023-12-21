<template>
  <div class="farm-view">
    <div class="farm">
      <div class="farm-header">
        <div class="title-desc">
          <h3 class="title">Farm</h3>
          <p class="description">Stake LP tokens and earn rewards</p>
        </div>

        <MarketsSwitch
          :name="selectedTab"
          :items="items"
          @select="selectTab($event.name)"
          :isDepreciated="isDepreciated"
        />
      </div>

      <FarmingOpportunities
        :selectedFarm="selectedFarm"
        @openFarmsPopup="openFarmsPopup"
      />

      <FarmActionBlock
        :selectedFarm="selectedFarm"
        :inputTitleText="inputTitleText"
        :max="max"
        :inputAmount="inputAmount"
        :error="error"
        :buttonText="buttonText"
        :isButtonDisabled="isButtonDisabled"
        @updateValue="inputAmount = $event"
        @actionHandler="actionHandler"
      />

      <FarmPosition
        class="farm-position"
        :selectedFarm="selectedFarm"
        v-if="isUserPositionOpen"
      />
    </div>

    <LocalPopupWrap
      :isOpened="isFarmsPopupOpened"
      @closePopup="isFarmsPopupOpened = false"
    >
      <MarketsListPopup
        popupType="farms"
        @changeActiveMarket="changeActiveMarket"
      />
    </LocalPopupWrap>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MarketsSwitch from "@/components/markets/MarketsSwitch.vue";
import FarmingOpportunities from "@/components/farm/FarmingOpportunities.vue";
import FarmActionBlock from "@/components/farm/FarmActionBlock.vue";
import FarmPosition from "@/components/farm/FarmPosition.vue";
import LocalPopupWrap from "@/components/popups/LocalPopupWrap.vue";
import MarketsListPopup from "@/components/popups/MarketsListPopup.vue";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification.js";
import { createFarmItemConfig } from "@/helpers/farm/createFarmItemConfig";
import { parseUnits } from "viem";
import { approveTokenViem } from "@/helpers/approval";
import actions from "@/helpers/farm/actions";
import { switchNetwork } from "@/helpers/chains/switchNetwork";

export default {
  props: {
    id: { type: String },
    farmChainId: { type: String },
  },

  data() {
    return {
      activeNetworks: [1, 250, 43114, 42161],
      isFarmsPopupOpened: false,
      inputAmount: null,
      selectedTab: "stake",
      items: [
        { title: "Stake", name: "stake" },
        { title: "Unstake", name: "unstake" },
      ],
      farmsTimer: null,
      selectedFarm: null,
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
      if (!this.selectedFarm || !this.account) return false;
      const isOpenMultiReward = this.selectedFarm.isMultiReward
        ? +this.selectedFarm.accountInfo.depositedBalance > 0 ||
          this.selectedFarm.accountInfo.rewardTokensInfo.filter(
            (item) => +item.earned > 0
          ).length > 0
        : false;

      const isOpenLegacyFarm =
        this.selectedFarm.accountInfo?.userReward != 0 ||
        this.selectedFarm.accountInfo?.userInfo.amount != 0;

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
        Number(this.selectedFarm?.accountInfo?.allowance) >=
        Number(this.inputAmount) / 1e18
      );
    },

    isValid() {
      return !!Number(this.inputAmount);
    },

    isDepreciated() {
      return this.selectedFarm?.isDepreciated;
    },

    max() {
      if (this.selectedFarm?.isMultiReward) {
        return !this.isUnstake
          ? BigInt(Number(this.selectedFarm?.accountInfo?.balance) * 1e18)
          : BigInt(
              Number(this.selectedFarm?.accountInfo?.depositedBalance) * 1e18
            );
      }
      return !this.isUnstake
        ? this.selectedFarm?.accountInfo?.balance
        : this.selectedFarm?.accountInfo?.depositedBalanceBigInt;
    },

    parsedInputAmount() {
      return parseUnits(this.inputAmount, 18);
    },

    error() {
      return Number(this.inputAmount) > Number(this.max)
        ? `The value cannot be greater than ${Number(this.max) / 1e18}`
        : null;
    },

    buttonText() {
      if (!this.isProperNetwork) return "Switch network";
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
        this.isProperNetwork
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
        if (this.account) await this.getSelectedFarm();
      },
    },

    id: {
      immediate: true,
      async handler(value) {
        await this.getSelectedFarm();
        const action = this.$route.redirectedFrom?.query.action;
        if (action) this.selectTab(action);
      },
    },

    max() {
      this.inputAmount = BigInt(0);
    },

    isDepreciated(status) {
      this.selectedTab = status ? "unstake" : "stake";
    },
  },

  methods: {
    changeActiveMarket({ id, chainId }) {
      if (+id != +this.id || +chainId != +this.chainId)
        this.$router.push({ path: `/farm/${id}/${chainId}` });

      this.isFarmsPopupOpened = false;
    },

    selectTab(action) {
      this.selectedTab = action;
    },

    async actionHandler() {
      if (this.isButtonDisabled) return false;
      if (!this.isProperNetwork) return switchNetwork(this.farmChainId);

      this.isActionProcessing = true;

      if (!this.isAllowed & !this.isUnstake) await this.approveHandler();
      else if (this.isUnstake) await this.unstakeHandler();
      else await this.stakeHandler();
      this.isActionProcessing = false;
    },

    async stakeHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );
      try {
        const { error, result } = this.selectedFarm.isMultiReward
          ? await actions.stake(
              this.selectedFarm.contractInfo,
              this.inputAmount
            )
          : await actions.deposit(
              this.selectedFarm.contractInfo,
              this.selectedFarm.poolId,
              this.inputAmount
            );

        await this.getSelectedFarm();

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", notification.success);
      } catch (error) {
        console.log("stake err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    async unstakeHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );
      try {
        const args = this.selectedFarm.isMultiReward
          ? [this.inputAmount]
          : [this.selectedFarm.poolId, this.inputAmount];

        const isExit =
          this.inputAmount === this.max && this.selectedFarm.isMultiReward;

        const { error, result } = isExit
          ? await actions.exit(this.selectedFarm.contractInfo)
          : await actions.withdraw(this.selectedFarm.contractInfo, args);

        await this.getSelectedFarm();

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", notification.success);
      } catch (error) {
        console.log("unstakeHandler err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    async approveHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.approvePending
      );

      try {
        await approveTokenViem(
          this.selectedFarm.stakingToken.contractInfo,
          this.selectedFarm.contractInfo.address
        );
        await this.getSelectedFarm();

        await this.$store.commit("notifications/delete", notificationId);
      } catch (error) {
        console.log("approve err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    async getSelectedFarm() {
      this.selectedFarm = await createFarmItemConfig(
        this.id,
        this.farmChainId,
        this.account
      );
    },

    openFarmsPopup() {
      this.isFarmsPopupOpened = true;
    },
  },

  async created() {
    await this.getSelectedFarm();

    this.farmsTimer = setInterval(async () => {
      await this.getSelectedFarm();
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.farmsTimer);
  },

  components: {
    LocalPopupWrap,
    MarketsListPopup,
    MarketsSwitch,
    FarmingOpportunities,
    FarmActionBlock,
    FarmPosition,
  },
};
</script>

<style lang="scss" scoped>
.farm-view {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  padding: 100px 0;
  margin: 0 auto;
  background: url("../assets/images/farm/farm-page-background.png");
  background-repeat: no-repeat;
  background-size: cover;
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
  width: 100%;
  margin-bottom: 16px;
}

.farm-position {
  position: absolute;
  top: 82px;
  right: -300px;
}

.title-desc {
  flex-grow: 1;
}

.title-desc .title {
  color: #fff;
  font-size: 32px;
  font-weight: 600;
}

.title-desc .description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}

@media (max-width: 768px) {
  .farm-wrap {
    padding: 30px;
  }

  .farm {
    padding: 0 15px;
  }
}

@media (max-width: 600px) {
  .farm-wrap {
    padding: 30px 15px;
  }

  .farm {
    padding: 0;
  }
}
</style>
