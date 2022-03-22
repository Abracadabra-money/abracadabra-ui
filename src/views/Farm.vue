<template>
  <div class="farm-view">
    <div class="farm">
      <div class="farm-wrap">
        <h3 class="title">Farm</h3>
        <h4 class="sub-title">Choose Chain</h4>
        <div class="wrap-networks underline">
          <NetworksList />
        </div>

        <div class="select-wrap underline">
          <h4 class="sub-title">Farming Opportunities</h4>
          <button class="select" @click="isTokensOpened = true">
            <img class="select-icon" :src="selectedPoolIcon" alt="" />
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
          <h4 class="sub-title">Deposit LP tokens</h4>
          <ValueInput :disabled="!selectedPool" v-model="amount" />
        </div>

        <div class="btn-wrap" v-if="selectedPool">
          <DefaultButton v-if="!isAllowance" @click="approveHandler"
            >Approve</DefaultButton
          >
          <DefaultButton v-else @click="stakeHandler" :disabled="!amount">Stake</DefaultButton>
        </div>
      </div>

      <div class="info underline">
        <p class="info-text">
          <img src="@/assets/images/info.svg" alt="" />
          Approximate staking APR
        </p>
        <p class="info-value">26.9887</p>
      </div>

      <a class="farm-link" href="#" target="_blank">Get LP’s</a>
    </div>

    <PopupWrap v-model="isTokensOpened" maxWidth="400px" height="600px">
      <SelectTokenPopup
        @select="poolId = $event.id"
        @close="isTokensOpened = false"
        :tokens="pools"
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
import farmPoolsMixin from "../mixins/farmPools";

export default {
  mixins: [farmPoolsMixin],
  data() {
    return {
      poolId: null,
      isTokensOpened: false,
      amount: ''
    };
  },
  computed: {
    ...mapGetters({
      address: "getAccount",
    }),
    selectedPool() {
      return this.pools.find(({ id }) => id === this.poolId) || null;
    },

    selectedPoolIcon() {
      return this.selectedPool?.icon || require("@/assets/images/select.svg");
    },
    isAllowance() {
      return !!this.selectedPool?.userData?.allowance;
    },
  },
  methods: {
    async stakeHandler() {
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
      } catch (error) {
        console.log("stake err:", error);
      }
    },
    async approveHandler() {
      try {
        const tx = await this.selectedPool.erc20ContractInstance.approve(
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
  },
  async created() {
    if (!this.pools.length) {
      await this.createFarmPools();
    }

    this.farmPoolsTimer = setInterval(async () => {
      await this.createFarmPools();
    }, 10000);
  },
  components: {
    NetworksList,
    ValueInput,
    DefaultButton,
    PopupWrap,
    SelectTokenPopup,
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
  margin-bottom: 30px;
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
}

.select-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 10px;
  background-color: white;
}

.select-text {
  margin: 0 10px;
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
  margin-bottom: 150px;
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