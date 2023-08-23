<template>
  <div class="stake-view">
    <div class="deposit-block">
      <h4>Choose Chain</h4>

      <div class="underline">
        <NetworksList :active-list="[56]" />
      </div>

      <div class="loader-wrap" v-if="!isInfoLoading">
        <BaseLoader />
      </div>

      <div v-else-if="isUnsupportedChain">
        <h4 class="tranche-title">
          Select tranche
          <a
            class="tranche-link"
            href="https://docs.level.finance/tutorials/liquidity-tutorials/trading-pools-tranches"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Tooltip />
          </a>
        </h4>

        <div class="tranche-btns-wrap underline">
          <TrancheButton
            v-for="{ type, apr } in tranceBtnInfo"
            :type="type"
            :isActive="tokenType === type"
            :apr="apr"
            :key="type"
            @changeToken="changeToken(type)"
          />
        </div>

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
      <h1 class="title">Magic Level Tranches</h1>

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

          <TranchesStatistics :stakeInfo="stakeInfo" />
          <TokensBalancesBlock :stakeInfo="stakeInfo" />
        </div>
        <div class="empty-wrap" v-else>
          <EmptyBlock :warningType="'mlvl'" />
        </div>

        <div class="description">
          <p>
            Enjoy the benefits of compounding without having to worry about the
            tedious work! Simply deposit your Level Tranches into Magic Level
            and let it do its magic!
          </p>
          <p>Note: A 1% protocol fee is taken on the yields.</p>
        </div>

        <div class="links-wrap" v-if="isUnsupportedChain">
          <GetTokenLink
            :data="{
              href: `${trancheLinks[tokenType]}/buy`,
              label: 'Buy LVL',
            }"
            background="linear-gradient(90deg,rgba(157, 244, 255, 0.2) 0%,rgba(121, 129, 255, 0.2) 100%)"
          />

          <GetTokenLink
            :data="{
              href: `${trancheLinks[tokenType]}/sell`,
              label: 'Sell LVL',
            }"
            background="linear-gradient(90deg,rgba(157, 244, 255, 0.2) 0%,rgba(121, 129, 255, 0.2) 100%)"
          />
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
import actions from "@/helpers/stake/magicLvl/actions/";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { magicLvlConfig } from "@/utils/stake/magicLvlConfig";
import notification from "@/helpers/notification/notification.js";
import { getStakeInfo } from "@/helpers/stake/magicLvl/getStakeInfo";
import { getChartOptions } from "@/helpers/stake/magicLvl/getChartOptions";

export default {
  data() {
    return {
      stakeInfo: null,
      action: "Stake",
      tokenType: "senior",
      inputValue: "",
      updateInterval: null,
      trancheLinks: {
        junior: "https://app.level.finance/liquidity/junior-tranche",
        mezzanine: "https://app.level.finance/liquidity/mezzanine-tranche",
        senior: "https://app.level.finance/liquidity/senior-tranche",
      },
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      provider: "getProvider",
      signer: "getSigner",
      chainId: "getChainId",
    }),

    mainInputValue() {
      return Number(this.inputValue);
    },

    parseMainInputValue() {
      return this.$ethers.utils.parseUnits(
        filters.formatToFixed(this.inputValue || 0, 18)
      );
    },

    isInfoLoading() {
      return !!this.stakeInfo;
    },

    isStakeAction() {
      return this.action === "Stake";
    },

    isUnsupportedChain() {
      return !!magicLvlConfig[this.chainId];
    },

    isTokenApproved() {
      if (!this.isStakeAction) return true;
      if (this.errorMainValue) return true;
      if (!this.account) return true;
      if (!this.isUnsupportedChain) return true;
      const { approvedAmount } = this.fromToken;

      return approvedAmount.gte(this.parseMainInputValue);
    },

    isActionDisabled() {
      if (!this.isTokenApproved) return true;
      return !!(!this.mainInputValue || this.errorMainValue);
    },

    expectedAmount() {
      const { tokensRate } = this.stakeInfo[this.tokenType];

      const amount = this.isStakeAction
        ? this.mainInputValue / tokensRate
        : this.mainInputValue * tokensRate;

      return filters.formatToFixed(amount, 6);
    },

    errorMainValue() {
      if (this.mainInputValue > +this.fromToken.balance) {
        return `The value cannot be greater than ${this.fromToken.balance}`;
      }

      return "";
    },

    fromToken() {
      return this.isStakeAction ? this.stakeToken : this.mainToken;
    },

    stakeToken() {
      return this.stakeInfo[this.tokenType].stakeToken;
    },

    mainToken() {
      return this.stakeInfo[this.tokenType].mainToken;
    },

    toToken() {
      return this.isStakeAction ? this.mainToken : this.stakeToken;
    },

    tranceBtnInfo() {
      const { seniorApy, mezzanineApy, juniorApy } =
        this.stakeInfo.tranchesStatistics;

      return [
        { type: "senior", apr: filters.formatPercent(seniorApy) },
        { type: "mezzanine", apr: filters.formatPercent(mezzanineApy) },
        { type: "junior", apr: filters.formatPercent(juniorApy) },
      ];
    },

    actionInfo() {
      const options = [this.parseMainInputValue, this.account];

      return this.isStakeAction
        ? { methodName: "deposit", options }
        : { methodName: "redeem", options };
    },

    chartConfig() {
      return {
        title: "APY Chart",
        type: "magicLvlApy",
        apy: this.tokensApy,
        feePercent: this.stakeInfo[this.tokenType].feePercent,
        intervalButtons: [{ label: "3m", time: 3 }],
      };
    },

    apyConfig() {
      const apyColors = {
        senior: "#37caff",
        mezzanine: "#c345fe",
        junior: "#ff7100",
      };

      return {
        icon: useImage(`assets/images/stake/${this.tokenType}-apy.png`),
        color: apyColors[this.tokenType],
      };
    },

    tokensApy() {
      const { seniorApy, mezzanineApy, juniorApy } =
        this.stakeInfo.tranchesStatistics;

      switch (this.tokenType) {
        case "senior":
          return seniorApy;
        case "mezzanine":
          return mezzanineApy;
        default:
          return juniorApy;
      }
    },

    standBlockBackground() {
      return `background-image: url(${useImage(
        "assets/images/stake/mGLPprofileBg.png"
      )})`;
    },
  },

  watch: {
    async account(value) {
      if (value) await this.createStakeInfo();
    },
  },

  methods: {
    getChartOptions,
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({
      deleteNotification: "notifications/delete",
      updateNotification: "notifications/updateTitle",
    }),

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },

    updateMainValue(amount) {
      this.inputValue = amount;
    },

    changeToken(type) {
      this.tokenType = type;
      this.inputValue = "";
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

      const isWithdrawAction = this.stakeToken.walletBalance.lt(
        this.parseMainInputValue
      );

      if (isWithdrawAction) {
        const { error } = await this.withdrawHandler(notificationId);
        if (error) {
          await this.deleteNotification(notificationId);
          return await this.createNotification(error);
        }
      }

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

    async withdrawHandler(notificationId) {
      this.updateNotification({
        title: "1/2 withdrawing Lps",
        id: notificationId,
      });

      const { levelMasterContract, stakeToken } =
        this.stakeInfo[this.tokenType];

      const withdrawAmount = this.parseMainInputValue.sub(
        stakeToken.walletBalance
      );

      const { error, result } = await actions.withdraw(
        levelMasterContract,
        withdrawAmount,
        this.account,
        stakeToken.pid
      );

      if (error) return { error };

      this.updateNotification({
        title: "2/2 staking to magicLVL",
        id: notificationId,
      });

      return { result };
    },

    async createStakeInfo() {
      this.stakeInfo = await getStakeInfo(
        this.provider,
        this.signer,
        this.chainId
      );
    },
  },

  async created() {
    await this.createStakeInfo();

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
    Tooltip: defineAsyncComponent(() =>
      import("@/components/ui/icons/Tooltip.vue")
    ),
    TrancheButton: defineAsyncComponent(() =>
      import("@/components/stake/TrancheButton.vue")
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
    TranchesStatistics: defineAsyncComponent(() =>
      import("@/components/stake/TranchesStatistics.vue")
    ),
    TokensBalancesBlock: defineAsyncComponent(() =>
      import("@/components/stake/TokensBalancesBlock.vue")
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

.tranche-title {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 0 6px;
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  letter-spacing: 0.025em;
}

.tranche-link {
  display: flex;
}

.tranche-btns-wrap {
  display: flex;
  gap: 10px;
  padding-bottom: 15px;
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
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 30px;
  letter-spacing: 0.025em;
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
  margin-bottom: 20px;
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

  .tranche-btns-wrap {
    flex-direction: column;
  }
}
</style>
