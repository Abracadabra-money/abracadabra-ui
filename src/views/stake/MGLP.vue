<template>
  <div class="stake-view">
    <div class="deposit-block">
      <h4>Choose Chain</h4>

      <div class="underline">
        <NetworksList :active-list="[42161, 43114]" />
      </div>

      <div class="loader-wrap" v-if="!isInfoLoading">
        <BaseLoader />
      </div>

      <div v-else>
        <div class="input-assets">
          <InputLabel
            :amount="formatTokenBalance(fromToken.balance)"
            :title="action"
          />

          <BaseTokenInput
            :value="inputValue"
            :icon="fromToken.icon"
            :name="fromToken.name"
            :max="fromToken.balance"
            :error="errorMainValue"
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

        <div class="btns-wrap">
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

        <p class="leverage-link" v-if="stakeInfo.leverageInfo">
          {{ stakeInfo.leverageInfo.label }}
          <router-link
            class="link"
            v-if="stakeInfo.leverageInfo.id"
            :to="{
              name: 'LeverageId',
              params: { id: stakeInfo.leverageInfo.id },
            }"
            >here.
          </router-link>
        </p>
      </div>
    </div>

    <div
      class="stake-stand"
      :style="`background-image: url(${standBackground})`"
    >
      <h1 class="title">magicGLP</h1>

      <div class="loader-wrap" v-if="!isInfoLoading">
        <BaseLoader />
      </div>

      <div v-else>
        <div class="stand-info-wrap" v-if="isUnsupportedChain">
          <GlpChartBlock
            :chainId="chainId"
            :apy="apy"
            :feePercent="stakeInfo.feePercent"
          />

          <BalancesBlock :mainToken="mainToken" :stakeToken="stakeToken" />

          <AdditionalInfoBlock
            :mainToken="mainToken"
            :rewardToken="rewardToken"
          />
        </div>

        <div class="empty-wrap" v-else>
          <EmptyBlock :warningType="'mglp'" />
        </div>

        <div class="description">
          <p>
            Enjoy the benefits of compounding without having to worry about the
            tedious work! Simply deposit your GLP into MagicGLP and let it do
            its magic!
          </p>
          <p>Note: A 1% protocol fee is taken on the yields.</p>
        </div>

        <div class="links-wrap" v-if="isUnsupportedChain">
          <GetTokenLink
            :data="{ href: 'https://app.gmx.io/#/buy_glp', label: 'Buy GLP' }"
          />
          <GetTokenLink
            :data="{
              href: 'https://app.gmx.io/#/buy_glp#redeem',
              label: 'Sell GLP',
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
import { approveToken } from "@/helpers/approval";
import actions from "@/helpers/stake/magicGlp/actions/";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { magicGlpConfig } from "@/utils/stake/magicGlpConfig";
import notification from "@/helpers/notification/notification.js";
import { getStakeInfo } from "@/helpers/stake/magicGlp/getStakeInfo";
import { getMagicGlpApy } from "@/helpers/collateralsApy/getMagicGlpApy";
import { getTotalRewards } from "@/helpers/stake/magicGlp/subgraph/getTotalRewards";

export default {
  data() {
    return {
      apy: "",
      stakeInfo: null,
      action: "Stake",
      totalRewards: null,
      inputValue: "",
      updateInterval: null,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      provider: "getProvider",
      signer: "getSigner",
    }),

    isInfoLoading() {
      return !!this.stakeInfo;
    },

    isStakeAction() {
      return this.action === "Stake";
    },

    isTokenApproved() {
      if (!this.isStakeAction) return true;
      if (this.errorMainValue) return true;
      if (!this.account) return true;
      if (!this.isUnsupportedChain) return true;
      const { approvedAmount } = this.toToken;
      return approvedAmount > this.mainInputValue;
    },

    isActionDisabled() {
      if (!this.isTokenApproved) return true;
      return !!(!this.mainInputValue || this.errorMainValue);
    },

    isUnsupportedChain() {
      return !!magicGlpConfig[this.chainId];
    },

    stakeToken() {
      return this.stakeInfo?.stakeToken;
    },

    mainToken() {
      return this.stakeInfo?.mainToken;
    },

    fromToken() {
      return this.isStakeAction ? this.stakeToken : this.mainToken;
    },

    toToken() {
      return this.isStakeAction ? this.mainToken : this.stakeToken;
    },

    errorMainValue() {
      if (this.mainInputValue > this.fromToken.balance) {
        return `The value cannot be greater than ${this.fromToken.balance}`;
      }

      return "";
    },

    expectedAmount() {
      const amount = this.isStakeAction
        ? this.mainInputValue / this.mainToken.rate
        : this.mainInputValue * this.mainToken.rate;

      return filters.formatToFixed(amount, 6);
    },

    standBackground() {
      if (+this.chainId === 42161)
        return useImage("assets/images/glp/arbitrum-bg.png");
      if (+this.chainId === 43114)
        return useImage("assets/images/glp/avax-bg.png");
      return "";
    },

    rewardToken() {
      const { rewardToken, rewardTokenPrice } = this.stakeInfo;
      const amount = +this.totalRewards ? +this.totalRewards : 0;
      const amountUsd = this.totalRewards ? amount * rewardTokenPrice : 0;
      return { ...rewardToken, amount, amountUsd };
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
  },

  watch: {
    async account(value) {
      if (value) await this.createStakeInfo();
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

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

    async createStakeInfo() {
      this.stakeInfo = await getStakeInfo(
        this.provider,
        this.signer,
        this.chainId
      );
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
  },

  async created() {
    await this.createStakeInfo();

    if (!this.isUnsupportedChain) return false;

    this.updateInterval = setInterval(async () => {
      await this.createStakeInfo();
    }, 60000);

    this.totalRewards = await getTotalRewards(this.chainId);

    const response = await getMagicGlpApy(this.chainId);
    this.apy = parseFloat(response.magicGlpApy).toFixed(2);
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
    GlpChartBlock: defineAsyncComponent(() =>
      import("@/components/stake/GlpChartBlock.vue")
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
    GetTokenLink: defineAsyncComponent(() =>
      import("@/components/ui/links/GetTokenLink.vue")
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

.loader-wrap-mini {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35%;
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

.btns-wrap {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin: 30px 0;
}

.leverage-link {
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-size: 15px;
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
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 30px;
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

.links-wrap {
  display: flex;
  justify-content: center;
  gap: 24px;
}

@media (max-width: 1024px) {
  .stake-view {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .deposit-block,
  .stake-stand {
    padding: 30px 10px;
  }
}
</style>
