<template>
  <div class="farm-view">
    <div class="farm">
      <div class="farm-header">
        <div class="title-desc">
          <h3 class="title">Farm</h3>
          <p class="description">Send your MIM across networks</p>
        </div>

        <MarketsSwitch
          :name="selectedTab"
          :items="items"
          @select="selectTab($event.name)"
          v-if="!isDepreciated"
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
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import LocalPopupWrap from "@/components/popups/LocalPopupWrap.vue";
import MarketsListPopup from "@/components/popups/MarketsListPopup.vue";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import FarmInfoBlock from "@/components/farm/FarmInfoBlock.vue";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification.js";
import { createFarmItemConfig } from "@/helpers/farm/createFarmItemConfig";
import { parseUnits } from "viem";
import { approveTokenViem } from "@/helpers/approval";
import actions from "@/helpers/farm/actions";

export default {
  props: {
    id: { type: String },
  },

  data() {
    return {
      activeNetworks: [1, 250, 43114, 42161],
      isFarmsPopupOpened: false,
      inputAmount: "",
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
        Number(this.inputAmount)
      );
    },

    isValid() {
      return !!+this.inputAmount;
    },

    isDepreciated() {
      return this.selectedFarm?.isDepreciated;
    },

    max() {
      return !this.isUnstake
        ? this.selectedFarm?.accountInfo?.balance
        : this.selectedFarm?.accountInfo?.depositedBalance;
    },

    parsedInputAmount() {
      return parseUnits(this.inputAmount, 18);
    },

    error() {
      return Number(this.inputAmount) > Number(this.max)
        ? `The value cannot be greater than ${this.max}`
        : null;
    },

    buttonText() {
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
      return !this.isValid || !!this.error || this.isActionProcessing;
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
      this.inputAmount = "";
    },

    isDepreciated(status) {
      this.selectedTab = status ? "unstake" : "stake";
    },
  },

  methods: {
    changeActiveMarket(marketId) {
      if (+marketId !== +this.id)
        this.$router.push({ name: "Farm", params: { id: marketId } });

      this.isFarmsPopupOpened = false;
    },

    selectTab(action) {
      this.selectedTab = action;
    },

    async actionHandler() {
      if (this.isButtonDisabled) return false;

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
              this.parsedInputAmount
            )
          : await actions.deposit(
              this.selectedFarm.contractInfo,
              this.selectedFarm.poolId,
              this.parsedInputAmount
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
          ? [this.parsedInputAmount]
          : [this.selectedFarm.poolId, this.parsedInputAmount];

        const isExit = this.inputAmount === this.max;

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
        this.chainId,
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
    BaseTokenIcon,
    BaseTokenInput,
    BaseButton,
    LocalPopupWrap,
    MarketsListPopup,
    MarketsSwitch,
    FarmInfoBlock,

    FarmingOpportunities,
    FarmActionBlock,
  },
};
</script>

<style lang="scss" scoped>
.farm-view {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: calc(100% - 20px);
  width: 533px;
  height: 100vh;
  padding: 100px 0;
  margin: 0 auto;
}

.farm {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 30px;
  width: 100%;
}

.farm-header {
  display: flex;
  align-items: center;
  gap: 25px;
  width: 100%;
  margin-bottom: 16px;
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
