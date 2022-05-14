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
          <StatsSwitch
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
        <template>
          <div class="input-wrap underline">
            <h4 class="sub-title">
              Deposit
              {{ selectedPool ? selectedPool.stakingTokenName : "" }} tokens
            </h4>
            <BaseTokenInput
              v-model="amount"
              :name="selectedPool ? selectedPool.stakingTokenName : null"
              :icon="selectedPool ? selectedPool.icon : null"
              :max="max"
              :error="error"
            />
          </div>

          <div class="btn-wrap">
            <BaseButton
              v-if="!isAllowance && !isUnstake"
              @click="approveHandler"
              :disabled="!isValid || !!error"
              primary
              >Approve</BaseButton
            >
            <BaseButton
              v-if="isUnstake || isAllowance"
              @click="handler"
              :disabled="
                !isValid ||
                !!error ||
                (!isUnstake && +selectedPool.poolRoi === 0)
              "
              primary
              >{{ !isUnstake ? "Stake" : "Unstake" }}</BaseButton
            >
          </div></template
        >
      </div>
      <template v-if="selectedPool">
        <div class="info underline">
          <p class="info-text">
            <img
              src="@/assets/images/info.svg"
              alt=""
              v-tooltip="'MAGIC text here'"
            />
            ~Yield per $1000
          </p>
          <p class="info-value">
            {{ selectedPool.poolYield | formatTokenBalance }}
          </p>
        </div>

        <div class="info underline">
          <p class="info-text">
            <img
              src="@/assets/images/info.svg"
              alt=""
              v-tooltip="'MAGIC text here'"
            />
            ROI Annually
          </p>
          <p class="info-value">{{ selectedPool.poolRoi | formatPercent }}</p>
        </div>

        <div class="info underline">
          <p class="info-text">
            <img
              src="@/assets/images/info.svg"
              alt=""
              v-tooltip="'MAGIC text here'"
            />
            TVL
          </p>
          <p class="info-value">{{ selectedPool.poolTvl | formatUSD }}</p>
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
    <PopupWrap v-model="isTokensOpened" maxWidth="400px" height="600px">
      <SelectTokenPopup
        @select="selectPool"
        @close="isTokensOpened = false"
        :tokens="pools"
        :isUnstake="isUnstake"
      />
    </PopupWrap>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

const NetworksList = () => import("@/components/ui/NetworksList");
const BaseTokenInput = () => import("@/components/base/BaseTokenInput");
const BaseButton = () => import("@/components/base/BaseButton");
const PopupWrap = () => import("@/components/popups/PopupWrap");
const SelectTokenPopup = () => import("@/components/popups/SelectTokenPopup");
const StatsSwitch = () => import("@/components/stats/StatsSwitch");
import farmPoolsMixin from "../mixins/farmPools";
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");
import notification from "@/utils/notification/index.js";

export default {
  mixins: [farmPoolsMixin],
  props: {
    id: { type: [String, Number], default: null },
    unstake: { type: Boolean, default: false },
  },
  data() {
    return {
      activeNetworks: [1, 56, 250, 43114, 42161, 137],
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
  methods: {
    selectPool(pool) {
      if (+pool.id !== +this.id)
        this.$router.push({ name: "FarmPool", params: { id: pool.id } });
    },

    async stakeHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.transaction.pending
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
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.success
        );
      } catch (error) {
        console.log("stake err:", error);
        let msg;

        if (error.code === 4001) {
          msg = notification.userDenied;
        } else {
          msg = notification.transaction.error;
        }
        await this.$store.commit("notifications/delete", notificationId);

        await this.$store.dispatch("notifications/new", msg);
      }
    },
    handler() {
      if (!this.isUnstake) this.stakeHandler();
      else this.unstakeHandler();
    },
    async unstakeHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.transaction.pending
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
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.success
        );
      } catch (error) {
        console.log("unstakeHandler err:", error);

        let msg;

        if (error.code === 4001) {
          msg = notification.userDenied;
        } else {
          msg = notification.transaction.error;
        }
        await this.$store.commit("notifications/delete", notificationId);

        await this.$store.dispatch("notifications/new", msg);
      }
    },
    async approveHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.approve.pending
      );

      try {
        const tx = await this.selectedPool.stakingTokenContract.approve(
          this.selectedPool.contractAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );

        const receipt = await tx.wait();

        console.log(receipt);
        await this.$store.commit("notifications/delete", notificationId);
      } catch (error) {
        console.log("approve err:", error);
        let msg;

        if (error.code === 4001) {
          msg = notification.userDenied;
        } else {
          msg = notification.approve.error;
        }

        await this.$store.commit("notifications/delete", notificationId);

        await this.$store.dispatch("notifications/new", msg);
      }
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
  async created() {
    if (!this.pools.length) {
      await this.createFarmPools();
    }

    this.farmPoolsTimer = setInterval(async () => {
      await this.createFarmPools();
    }, 10000);
  },
  beforeDestroy() {
    clearInterval(this.farmPoolsTimer);
  },
  components: {
    BaseTokenIcon,
    NetworksList,
    BaseTokenInput,
    BaseButton,
    PopupWrap,
    SelectTokenPopup,
    StatsSwitch,
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
/*
.farm-link:hover {
  background: -webkit-linear-gradient(#5282fd, #76c3f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
*/
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
