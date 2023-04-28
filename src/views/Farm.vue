<template>
  <div class="farm-view">
    <div class="farm">
      <div class="farm-wrap">
        <h3 class="title">Farm</h3>
        <h4 class="sub-title">Choose Chain</h4>
        <div class="wrap-networks underline">
          <NetworksList :activeList="activeNetworks" />
        </div>
        <div class="switcher">
          <MarketsSwitch
            :name="selectedTab"
            :items="items"
            @select="selectedTab = $event.name"
          />
        </div>
        <div class="select-wrap underline">
          <h4 class="sub-title">Farming Opportunities</h4>
          <button class="select" @click="isTokensOpened = true">
            <BaseTokenIcon
              v-if="selectedPool"
              :name="selectedPool.name"
              :icon="selectedPool.icon"
            />
            <BaseTokenIcon v-else type="select" />
            <span class="select-text">
              {{ selectedPool ? selectedPool.name : "Select Farm" }}
            </span>
            <img
              class="select-arrow"
              src="@/assets/images/arrow.svg"
              alt="Arrow"
            />
          </button>
        </div>

        <div class="input-wrap underline">
          <h4 class="sub-title">
            Deposit
            {{ selectedPool ? selectedPool.stakingTokenName : "" }} tokens
          </h4>
          <BaseTokenInput
            :value="amount"
            @updateValue="amount = $event"
            :name="selectedPool ? selectedPool.stakingTokenName : null"
            :icon="selectedPool ? selectedPool.icon : null"
            :max="max"
            :error="error"
            :disabled="!selectedPool"
          />
        </div>

        <div class="btn-wrap">
          <BaseButton
            v-if="!isAllowance && !isUnstake"
            @click="approveHandler"
            :disabled="!isValid || !!error || +selectedPool.poolRoi === 0"
            primary
            >Approve</BaseButton
          >
          <BaseButton
            v-if="isUnstake || isAllowance"
            @click="handler"
            :disabled="
              !isValid || !!error || (!isUnstake && +selectedPool.poolRoi === 0)
            "
            primary
            >{{ !isUnstake ? "Stake" : "Unstake" }}</BaseButton
          >
        </div>
      </div>
      <template v-if="selectedPool">
        <div class="info underline">
          <p class="info-text">
            <img
              src="@/assets/images/info.svg"
              alt=""
              v-tooltip="'Daily amount of SPELL per $1000 Staked'"
            />
            ~Yield per $1000
          </p>
          <p class="info-value">
            {{ formatTokenBalance(selectedPool.poolYield) }}
          </p>
        </div>

        <div class="info underline">
          <p class="info-text">
            <img
              src="@/assets/images/info.svg"
              alt=""
              v-tooltip="'Annual Return on Staked tokens at current price'"
            />
            ROI Annually
          </p>
          <p class="info-value">{{ formatPercent(selectedPool.poolRoi) }}</p>
        </div>

        <div class="info underline">
          <p class="info-text">
            <img
              src="@/assets/images/info.svg"
              alt=""
              v-tooltip="'Total Value Locked in the Farm'"
            />
            TVL
          </p>
          <p class="info-value">{{ formatUSD(selectedPool.poolTvl) }}</p>
        </div>

        <div class="farm-link-wrap">
          <a
            class="farm-link"
            :href="selectedPool.stakingTokenLink"
            target="_blank"
          >
            <img src="@/assets/images/farm-lp.svg" alt="" />
            <p>Get LP’s</p>
            <img src="@/assets/images/farm-lp-arrow.svg" alt="" />
          </a></div
      ></template>
    </div>
    <LocalPopupWrap
      :isOpened="isTokensOpened"
      @closePopup="isTokensOpened = false"
    >
      <MarketsListPopup
        :farmsList="pools"
        popupType="farms"
        @changeActiveMarket="changeActiveMarket"
      />
    </LocalPopupWrap>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import NetworksList from "@/components/ui/NetworksList.vue";
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import LocalPopupWrap from "@/components/popups/LocalPopupWrap.vue";
import MarketsListPopup from "@/components/popups/MarketsListPopup.vue";
import MarketsSwitch from "@/components/markets/MarketsSwitch.vue";
import farmPoolsMixin from "../mixins/farmPools";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification.js";

import filters from "@/filters/index.js";

export default {
  mixins: [farmPoolsMixin],
  props: {
    id: { type: [String, Number], default: null },
    unstake: { type: Boolean, default: false },
  },
  data() {
    return {
      activeNetworks: [1, 56, 250, 43114, 42161, 137, 10],
      isTokensOpened: false,
      amount: "",
      selectedTab: "stake",
      items: [
        { title: "Stake", name: "stake" },
        { title: "Unstake", name: "unstake" },
      ],
      farmPoolsTimer: null,
    };
  },
  computed: {
    ...mapGetters({
      address: "getAccount",
      loading: "getFarmPoolLoading",
    }),
    isUnstake() {
      return this.selectedTab === "unstake";
    },
    selectedPool() {
      return this.pools.find(({ id }) => +id === +this.id) || null;
    },

    isAllowance() {
      return !!this.selectedPool?.accountInfo?.allowance;
    },
    max() {
      return !this.isUnstake
        ? this.selectedPool?.accountInfo?.balance
        : this.selectedPool?.accountInfo?.depositedBalance;
    },
    isValid() {
      return !!+this.amount;
    },
    error() {
      return Number(this.amount) > Number(this.max)
        ? `The value cannot be greater than ${this.max}`
        : null;
    },
  },
  watch: {
    async address() {
      if (this.address) {
        await this.createFarmPools();
      }
    },
    max() {
      this.amount = "";
    },
    unstake: {
      immediate: true,
      handler(value) {
        if (value) this.selectedTab = "unstake";
      },
    },
  },
  methods: {
    formatUSD(value) {
      return filters.formatUSD(value);
    },
    formatPercent(value) {
      return filters.formatPercent(value);
    },
    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },
    changeActiveMarket(marketId) {
      if (+marketId !== +this.id)
        this.$router.push({ name: "FarmPool", params: { id: marketId } });

      this.isTokensOpened = false;
    },

    async stakeHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );
      try {
        const parseAmount = this.$ethers.utils.parseEther(
          this.amount.toString()
        );

        const tx = await this.selectedPool.contractInstance.deposit(
          this.selectedPool.poolId,
          parseAmount
        );

        const receipt = await tx.wait();

        console.log("stake success:", receipt);
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
    handler() {
      if (!this.isUnstake) this.stakeHandler();
      else this.unstakeHandler();
    },
    async unstakeHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );
      try {
        const parseAmount = this.$ethers.utils.parseEther(
          this.amount.toString()
        );

        const tx = await this.selectedPool.contractInstance.withdraw(
          this.selectedPool.poolId,
          parseAmount
        );

        const receipt = await tx.wait();

        console.log("unstakeHandler success:", receipt);

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
          await this.selectedPool.stakingTokenContract.estimateGas.approve(
            this.selectedPool.contractAddress,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          );

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.selectedPool.stakingTokenContract.approve(
          this.selectedPool.contractAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          {
            gasLimit,
          }
        );

        const receipt = await tx.wait();

        console.log(receipt);
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
  },
  async created() {
    if (!this.pools.length) {
      await this.createFarmPools();
    }

    this.farmPoolsTimer = setInterval(async () => {
      await this.createFarmPools();
    }, 10000);
  },
  beforeUnmount() {
    clearInterval(this.farmPoolsTimer);
  },
  components: {
    BaseTokenIcon,
    NetworksList,
    BaseTokenInput,
    BaseButton,
    LocalPopupWrap,
    MarketsListPopup,
    MarketsSwitch,
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

.farm {
  margin: 0 auto;
  padding: 30px 95px;
  background: #2a2835;
  backdrop-filter: blur(100px);
  border-radius: 30px;
}

.farm-wrap {
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
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  margin-bottom: 10px;
}

.wrap-networks {
  margin-bottom: 17px;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.select-wrap {
  padding-bottom: 15px;
  margin-bottom: 30px;
}

.select {
  width: 100%;
  height: 70px;
  outline: transparent;
  background: rgba(129, 126, 166, 0.2);
  border: 1px solid #494661;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  &:disabled {
    cursor: default;
  }
}

.select-text {
  margin-right: 10px;
}

.select-arrow {
  width: 16px;
  height: 16px;
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

.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 13px;
  margin-bottom: 35px;
}

.info-text {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);

  img {
    margin-right: 10px;
    cursor: pointer;
  }
}

.farm-link-wrap {
  display: flex;
  justify-content: center;
}

.farm-link {
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-column-gap: 7px;
  justify-content: center;
  align-items: center;
  padding: 3px 10px;
  background: rgba(157, 244, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
  border-radius: 30px;
  font-size: 14px;
  color: #63caf8;
}

.switcher {
  margin-bottom: 27px;
}

.loader-wrap {
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .farm {
    padding: 30px;
  }
  .farm-wrap {
    padding: 0 15px;
  }
}

@media (max-width: 600px) {
  .farm {
    padding: 30px 15px;
  }
  .farm-wrap {
    padding: 0;
  }
}
</style>
