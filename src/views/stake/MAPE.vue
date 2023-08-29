<template>
  <div class="stake-view">
    <div class="deposit-block" :style="depositBlockBackground">
      <h4>Choose Chain</h4>

      <div class="underline">
        <NetworksList :active-list="[1]" />
      </div>

      <div class="loader-wrap" v-if="!isInfoLoading">
        <BaseLoader />
      </div>

      <div v-else>
        <div class="input-assets">
          <InputLabel
            :amount="fromToken.balance"
            :title="action"
          />

          <BaseTokenInput
            :value="inputValue"
            :icon="fromToken.icon"
            :name="fromToken.name"
            :max="fromToken.balance"
            :error="errorMainValue"
            :disabled="!isUnsupportedChain"
            @updateValue="updateMainValue"
          />
        </div>

        <button class="swap-button">
          <img
            src="@/assets/images/swap.svg"
            @click="toggleAction"
            alt="Swap action"
          />
        </button>

        <div class="input-assets">
          <h4 class="input-labal">Receive</h4>

          <BaseTokenInput
            :icon="toToken.icon"
            :name="toToken.name"
            :value="expectedAmount"
            :disabled="true"
          />
        </div>

        <div class="actions-wrap">
          <BaseButton
            primary
            :disabled="isTokenApproved"
            @click="approveTokenHandler"
            >Approve
          </BaseButton>
          <BaseButton :disabled="isActionDisabled" @click="actionHandler">
            {{ action }}
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="stake-stand" :style="standBlockBackground">
      <h1 class="title">
        magic
        <img
          class="title-icon"
          src="@/assets/images/ape/ape.png"
          alt="Ape icon"
        />
        Ape
      </h1>

      <div class="loader-wrap" v-if="!isInfoLoading">
        <BaseLoader />
      </div>

      <template v-else>
        <div class="stand-info-wrap" v-if="isUnsupportedChain">
          <ChartBlock
            :chartConfig="chartConfig"
            :apyConfig="apyConfig"
            :getChartOptions="getChartOptions"
          />

          <BalancesBlock :mainToken="mainToken" :stakeToken="stakeToken" />

          <AdditionalInfoBlock
            :mainToken="mainToken"
            :rewardToken="rewardToken"
          />
        </div>
        <div class="empty-wrap" v-else>
          <EmptyBlock :warningType="'mape'" />
        </div>

        <div class="description">
          <p>
            Enjoy the benefits of compounding without having to worry about the
            tedious work! Simply deposit your APE into MagicAPE and let it do
            its magic!
          </p>

          <p>Note: A 1% protocol fee is taken on the yields.</p>
        </div>

        <div class="btns-wrap" v-if="isUnsupportedChain">
          <BaseButton @click="routeTo('BorrowId', 39)">
            <div class="btn-content">
              <img
                class="btn-img"
                src="@/assets/images/ape/ape.b.png"
                alt="Ape icon"
              />
              <span class="btn-text">Borrow Against MagicAPE</span>
            </div>
          </BaseButton>

          <BaseButton @click="routeTo('LeverageId', 39)">
            <span class="btn-text"
              >Leverage your Yield (up to ≈{{ expectedLeverageApy }}%)
            </span>
          </BaseButton>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
import { approveToken } from "@/helpers/approval";
import actions from "@/helpers/stake/magicApe/actions/";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { magicApeConfig } from "@/utils/stake/magicApeConfig";
import notification from "@/helpers/notification/notification.js";
import { getStakeInfo } from "@/helpers/stake/magicApe/getStakeInfo";
import { getMagicApeApy } from "@/helpers/collateralsApy/getMagicApeApy";
import { getChartOptions } from "@/helpers/stake/magicApe/getChartOptions";
import { getTotalRewards } from "@/helpers/stake/magicApe/subgraph/getTotalRewards";

export default {
  data() {
    return {
      apy: "",
      inputValue: "",
      action: "Stake",
      stakeInfo: null,
      updateInterval: null,
      totalRewards: null,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      provider: "getProvider",
      signer: "getSigner",
    }),

    isInfoLoading() {
      return !!this.stakeInfo;
    },

    isStakeAction() {
      return this.action === "Stake";
    },

    isUnsupportedChain() {
      return !!magicApeConfig[this.chainId];
    },

    isTokenApproved() {
      if (!this.isStakeAction) return true;
      if (this.errorMainValue) return true;
      if (!this.account) return true;
      if (!this.isUnsupportedChain) return true;
      const { approvedAmount } = this.fromToken;

      return approvedAmount >= this.mainInputValue;
    },

    isActionDisabled() {
      if (!this.isTokenApproved) return true;
      return !!(!this.mainInputValue || this.errorMainValue);
    },

    expectedAmount() {
      const { tokensRate } = this.stakeInfo;

      const amount = this.isStakeAction
        ? this.mainInputValue / tokensRate
        : this.mainInputValue * tokensRate;

      return filters.formatToFixed(amount, 6);
    },

    expectedLeverageApy() {
      const multiplier = 16;
      const percentMultiplier = 0.7;
      const expectedLevearage =
        (1 - Math.pow(percentMultiplier, multiplier + 1)) /
        (1 - percentMultiplier);

      return Math.floor(expectedLevearage * this.apy);
    },

    errorMainValue() {
      if (this.mainInputValue > this.fromToken.balance) {
        return `The value cannot be greater than ${this.fromToken.balance}`;
      }

      return "";
    },

    stakeToken() {
      return this.stakeInfo?.stakeToken;
    },

    mainToken() {
      return this.stakeInfo?.mainToken;
    },

    rewardToken() {
      const { rewardToken } = this.stakeInfo;
      const amount = +this.totalRewards ? +this.totalRewards : 0;
      const amountUsd = this.totalRewards ? amount * this.stakeToken.price : 0;
      return { ...rewardToken, amount, amountUsd };
    },

    fromToken() {
      return this.isStakeAction ? this.stakeToken : this.mainToken;
    },

    toToken() {
      return this.isStakeAction ? this.mainToken : this.stakeToken;
    },

    mainInputValue() {
      return Number(this.inputValue);
    },

    actionInfo() {
      const amount = this.$ethers.utils.parseEther(
        filters.formatToFixed(this.inputValue || 0, 18)
      );

      const options = [amount, this.account];

      return this.isStakeAction
        ? { methodName: "deposit", options }
        : { methodName: "redeem", options };
    },

    depositBlockBackground() {
      return `background-image: url(${useImage("assets/images/ape/bg.png")})`;
    },

    standBlockBackground() {
      return `background-image: url(${useImage(
        "assets/images/ape/bg-info.png"
      )})`;
    },

    chartConfig() {
      return {
        title: "Statistics",
        type: "Yield",
        apy: this.apy,
        typeButtons: ["Yield", "TVL", "Price"],
        intervalButtons: [
          { label: "1m", time: 1 },
          { label: "3m", time: 3 },
          { label: "6m", time: 6 },
          { label: "1y", time: 12 },
        ],
      };
    },

    apyConfig() {
      return {
        icon: useImage("assets/images/ape/apr.png"),
        color: "#c0c53f",
      };
    },
  },

  watch: {
    async account(value) {
      if (value) await this.createStakeInfo();
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),
    getChartOptions,

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },

    updateMainValue(amount) {
      this.inputValue = amount;
    },

    toggleAction() {
      this.inputValue = "";
      this.action = this.action === "Stake" ? "Unstake" : "Stake";
    },

    async approveTokenHandler() {
      if (!this.isUnsupportedChain) return false;
      if (this.isTokenApproved) return false;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveToken(
        this.stakeToken.contract,
        this.mainToken.contract.address
      );

      if (approve) await this.createStakeInfo();
      await this.deleteNotification(notificationId);
      if (!approve) await this.createNotification(notification.approveError);
      return false;
    },

    async actionHandler() {
      if (this.isActionDisabled) return false;
      if (!this.actionInfo.methodName) return false;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error } = await actions[this.actionInfo.methodName](
        this.mainToken.contract,
        ...this.actionInfo.options
      );

      if (error) {
        await this.deleteNotification(notificationId);
        await this.createNotification(error);
      } else {
        await this.createStakeInfo();
        this.inputValue = "";
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      }
    },

    async createStakeInfo() {
      this.stakeInfo = await getStakeInfo(
        this.provider,
        this.signer,
        this.chainId
      );

      if (this.isUnsupportedChain) {
        this.apy = await getMagicApeApy(this.provider);
        this.totalRewards = await getTotalRewards();
      }
    },

    routeTo(name, id) {
      this.$router.push({ name, params: { id } });
    },
  },

  async created() {
    this.createStakeInfo();
    if (!this.isUnsupportedChain) return false;

    this.updateInterval = setInterval(async () => {
      await this.createStakeInfo();
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    NetworksList: defineAsyncComponent(() =>
      import("@/components/ui/NetworksList.vue")
    ),
    BaseLoader: defineAsyncComponent(() =>
      import("@/components/base/BaseLoader.vue")
    ),
    InputLabel: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputLabel.vue")
    ),
    BaseTokenInput: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenInput.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    ChartBlock: defineAsyncComponent(() =>
      import("@/components/stake/ChartBlock.vue")
    ),
    BalancesBlock: defineAsyncComponent(() =>
      import("@/components/stake/BalancesBlock.vue")
    ),
    AdditionalInfoBlock: defineAsyncComponent(() =>
      import("@/components/stake/AdditionalInfoBlock.vue")
    ),
    EmptyBlock: defineAsyncComponent(() =>
      import("@/components/stake/EmptyBlock.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.stake-view {
  display: grid;
  grid-template-columns: 550px 1fr;
  width: 1320px;
  max-width: calc(100% - 20px);
  grid-gap: 15px;
  margin: 0 auto;
  padding: 100px 0;
}

.deposit-block {
  padding: 30px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
  background-position: center;
  background-size: cover;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 10px;
}

.input-assets {
  padding: 22px 0 14px;
}

.swap-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
}

.input-labal {
  margin-bottom: 6px;
}

.actions-wrap {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin: 30px 0;
}

.stake-stand {
  padding: 30px 15px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
  background-position: center;
  background-size: cover;
}

.title {
  font-weight: 600;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.025em;
  margin: 0 0 30px;
  text-transform: uppercase;
}

.title-icon {
  max-width: 28px;
  margin: 0 10px;
}

.stand-info-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.empty-wrap {
  margin-bottom: 20px;
}

.description {
  line-height: 24px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 24px;
  text-align: center;
}

.btns-wrap {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-img {
  width: 22px;
}

.btn-text {
  font-weight: 600;
  font-size: 14px;
  line-height: 150%;
  display: flex;
  align-items: center;
  letter-spacing: 0.025em;
  background: linear-gradient(90deg, #9df4ff 0%, #7981ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

@media (max-width: 1200px) {
  .btns-wrap {
    flex-direction: column;
  }
}

@media (max-width: 1024px) {
  .stake-view {
    grid-template-columns: 1fr;
  }

  .btns-wrap {
    flex-direction: row;
  }
}

@media (max-width: 600px) {
  .deposit-block,
  .stake-stand {
    padding: 30px 10px;
  }

  .btns-wrap {
    flex-direction: column;
  }
}
</style>
