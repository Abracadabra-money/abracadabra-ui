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
        <div v-if="!pools.length && loading" class="loader-wrap">
          <Loader />
        </div>
        <div v-else class="select-wrap underline">
          <h4 class="sub-title">Farming Opportunities</h4>
          <button class="select" @click="isTokensOpened = true">
            <TokenIcon
              v-if="selectedPool"
              :name="selectedPool.name"
              :icon="selectedPool.icon"
            />
            <TokenIcon v-else type="select" />
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
        <template v-if="selectedPool">
          <div class="input-wrap underline">
            <h4 class="sub-title">
              Deposit {{ selectedPool.stakingTokenName }} tokens
            </h4>
            <ValueInput
              v-model="amount"
              :name="selectedPool.stakingTokenName"
              :icon="selectedPool.icon"
              :max="max"
              :error="error"
            />
          </div>

          <div class="btn-wrap" v-if="selectedPool">
            <DefaultButton
              v-if="!isAllowance && !isUnstake"
              @click="approveHandler"
              >Approve</DefaultButton
            >
            <DefaultButton
              v-if="isUnstake || isAllowance"
              @click="handler"
              :disabled="!isValid || !!error"
              >{{ !isUnstake ? "Stake" : "Unstake" }}</DefaultButton
            >
          </div></template
        >
      </div>
      <template v-if="selectedPool">
        <div v-for="(item, i) in bottomItems" :key="i" class="info underline">
          <p class="info-text">
            <img src="@/assets/images/info.svg" alt="" />
            {{ item.title }}
          </p>
          <p class="info-value">{{ item.value }}</p>
        </div>

        <a
          class="farm-link"
          :href="selectedPool.stakingTokenLink"
          target="_blank"
          >Get LP’s</a
        ></template
      >
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
const ValueInput = () => import("@/components/UIComponents/ValueInput");
const DefaultButton = () => import("@/components/main/DefaultButton.vue");
const PopupWrap = () => import("@/components/ui/PopupWrap");
const SelectTokenPopup = () => import("@/components/popups/SelectTokenPopup");
const StatsSwitch = () => import("@/components/stats/StatsSwitch");
import farmPoolsMixin from "../mixins/farmPools";
import Loader from "../components/Loader";
const TokenIcon = () => import("@/components/ui/TokenIcon");

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
    bottomItems() {
      return [
        { title: "~Yield per $1000", value: this.selectedPool.poolYield },
        { title: "ROI Annually", value: this.selectedPool.poolRoi },
        { title: "TVL", value: this.selectedPool.poolTvl },
      ];
    },
    selectedPool() {
      console.log(this.pools.find(({ id }) => +id === +this.id));
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
      try {
        const parseAmount = this.$ethers.utils.parseEther(
          this.amount.toString()
        );

        const tx = await this.selectedPool.contractInstance.deposit(
          this.selectedPool.id,
          parseAmount
        );

        const receipt = await tx.wait();

        console.log("stake success:", receipt);
      } catch (error) {
        console.log("stake err:", error);
      }
    },
    handler() {
      if (!this.isUnstake) this.stakeHandler();
      else this.unstakeHandler();
    },
    async unstakeHandler() {
      try {
        const parseAmount = this.$ethers.utils.parseEther(
          this.amount.toString()
        );

        const tx = await this.selectedPool.contractInstance.withdraw(
          this.selectedPool.id,
          parseAmount
        );

        const receipt = await tx.wait();

        console.log("unstakeHandler success:", receipt);
      } catch (error) {
        console.log("unstakeHandler err:", error);
      }
    },
    async approveHandler() {
      try {
        const tx = await this.selectedPool.stakingTokenContract.approve(
          this.selectedPool.contractAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );

        const receipt = await tx.wait();

        console.log(receipt);
      } catch (error) {
        console.log("approve err:", error);
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
    Loader,
    TokenIcon,
    NetworksList,
    ValueInput,
    DefaultButton,
    PopupWrap,
    SelectTokenPopup,
    StatsSwitch,
  },
};
</script>

<style lang="scss" scoped>
.farm-view {
  padding: 100px 0;
}

.farm {
  max-width: 740px;
  width: 100%;
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
  border: none;
  outline: transparent;
  background: rgba(255, 255, 255, 0.06);
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

.farm-link {
  display: block;
  max-width: 55px;
  margin: 0 auto;
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  text-transform: uppercase;
  color: #fff;
}

.farm-link:hover {
  background: -webkit-linear-gradient(#5282fd, #76c3f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
