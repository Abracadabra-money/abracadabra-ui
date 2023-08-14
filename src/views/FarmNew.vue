<template>
  <div class="farm-view">
    <div class="farm-wrap">
      <div class="farm">
        <h3 class="title">Farm</h3>

        <h4 class="sub-title">Choose Chain</h4>

        <div class="networks-list-wrap underline">
          <NetworksList :activeList="activeNetworks" />
        </div>

        <div class="stake-unstake-switch" v-if="!isDepreciated">
          <MarketsSwitch
            :name="selectedTab"
            :items="items"
            @select="selectTab($event.name)"
          />
        </div>

        <h4 class="sub-title">Farming Opportunities</h4>

        <SelectFarm
          class="underline"
          :selectedFarm="selectedFarm"
          @openFarmsPopup="openFarmsPopup"
        />

        <h4 class="sub-title">
          {{ inputTitleText }}
          <span class="deposit-balance" v-if="max">Balance: {{ max }}</span>
        </h4>

        <div class="input-wrap underline">
          <BaseTokenInput
            :value="inputAmount"
            @updateValue="inputAmount = $event"
            :name="selectedFarm?.stakingToken?.name"
            :icon="selectedFarm?.icon"
            :max="max"
            :error="error"
            :disabled="!selectedFarm"
          />
        </div>

        <div class="btn-wrap">
          <BaseButton
            @click="actionHandler"
            :disabled="isButtonDisabled"
            primary
            >{{ buttonText }}
          </BaseButton>
        </div>

        <FarmInfoBlock :selectedFarm="selectedFarm" v-if="selectedFarm" />
      </div>
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
import NetworksList from "@/components/ui/NetworksList.vue";
import MarketsSwitch from "@/components/markets/MarketsSwitch.vue";
import SelectFarm from "@/components/farm/SelectFarm.vue";
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import LocalPopupWrap from "@/components/popups/LocalPopupWrap.vue";
import MarketsListPopup from "@/components/popups/MarketsListPopup.vue";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import FarmInfoBlock from "@/components/farm/FarmInfoBlock.vue";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification.js";
import { createFarmItemConfig } from "@/helpers/farm/createFarmItemConfig";
import { utils } from "ethers";

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
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      signer: "getSigner",
    }),

    isUnstake() {
      return this.selectedTab === "unstake";
    },

    isAllowed() {
      if (!this.account || !this.selectedFarm) return false;
      return (
        utils.formatUnits(this.selectedFarm?.accountInfo?.allowance) >=
        this.inputAmount
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

    error() {
      return Number(this.inputAmount) > Number(this.max)
        ? `The value cannot be greater than ${this.max}`
        : null;
    },

    buttonText() {
      const text = this.isUnstake ? "Unstake" : "Stake";
      return !this.isAllowed && !this.isUnstake ? "Approve" : text;
    },

    inputTitleText() {
      return `${this.isUnstake ? "Unstake" : "Deposit"} ${
        this.selectedFarm ? this.selectedFarm.stakingToken.name : ""
      } tokens`;
    },

    isButtonDisabled() {
      return !this.isValid || !!this.error;
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
      if (!this.isAllowed) this.approveHandler();
      else if (this.isUnstake) this.unstakeHandler();
      else this.stakeHandler();
    },

    async stakeHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );
      try {
        const parseAmount = this.$ethers.utils.parseEther(
          this.inputAmount.toString()
        );

        const tx = await this.selectedFarm.contractInstance.deposit(
          this.selectedFarm.farmId,
          parseAmount
        );

        await tx.wait();

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
        const parseAmount = this.$ethers.utils.parseEther(
          this.inputAmount.toString()
        );

        const tx = await this.selectedFarm.contractInstance.withdraw(
          this.selectedFarm.farmId,
          parseAmount
        );

        await tx.wait();

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
        const estimateGas =
          await this.selectedFarm.stakingToken.contract.estimateGas.approve(
            this.selectedFarm.contractAddress,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          );

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.selectedFarm.stakingToken.contract.approve(
          this.selectedFarm.contractAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          {
            gasLimit,
          }
        );

        await tx.wait();

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
        this.signer,
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
    NetworksList,
    BaseTokenInput,
    BaseButton,
    LocalPopupWrap,
    MarketsListPopup,
    MarketsSwitch,
    SelectFarm,
    FarmInfoBlock,
  },
};
</script>

<style lang="scss" scoped>
.farm-view {
  max-width: calc(100% - 20px);
  width: 740px;
  padding: 100px 0;
  margin: 0 auto;
}

.farm-wrap {
  margin: 0 auto;
  padding: 30px 95px;
  background: #2a2835;
  backdrop-filter: blur(100px);
  border-radius: 30px;
}

.farm {
  padding: 0 30px;
}

.title {
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 30px;
}

.sub-title {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  margin-bottom: 10px;
}

.deposit-balance {
  font-size: 14px;
  font-weight: 400;
}

.networks-list-wrap {
  margin-bottom: 17px;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.input-wrap {
  padding-bottom: 20px;
  margin-bottom: 40px;
}

.btn-wrap {
  display: grid;
  grid-template-rows: repeat(auto-fill, 1fr);
  row-gap: 1rem;
  margin-bottom: 119px;
}

.stake-unstake-switch {
  margin-bottom: 27px;
}

.loader-wrap {
  display: flex;
  justify-content: center;
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
