<template>
  <div class="cauldron-view" :class="{ loading: isCauldronLoading }">
    <template v-if="!isCauldronLoading">
      <div class="cauldron-deposit" :style="backgroundInfo.deposit">
        <div class="underline">
          <h4>Choose Chain</h4>
          <NetworksList />
        </div>

        <div class="collateral-assets underline">
          <InputLabel :amount="activeToken.balance.value" />

          <BaseTokenInput
            :icon="activeToken.icon"
            :name="activeToken.name"
            :value="collateralValue"
            :max="activeToken.balance.value"
            :error="errorCollateralValue"
            :disabled="!cauldron"
            @updateValue="updateCollateralValue"
            @openTokensList="isOpenMarketListPopup = true"
            isChooseToken
          />

          <UseCheckbox
            v-if="cauldron"
            :config="cauldron.config"
            @toggle="changeToken"
          />
        </div>

        <div class="borrow-assets underline">
          <div class="header-balance">
            <h4>MIM to Borrow</h4>
          </div>
          <BaseTokenInput
            :name="borrowToken.name"
            :icon="borrowToken.icon"
            :value="borrowValue"
            :max="maxBorrowValue"
            :error="errorBorrowValue"
            :disabled="!cauldron"
            @updateValue="updateBorrowValue"
          />
        </div>

        <div class="ltv-wrap underline" v-if="cauldron">
          <LtvBlock :ltv="+calculateLtv" :positionRisk="positionRisk" />
        </div>

        <div class="percent-wrap" v-if="cauldron">
          <PercentageButtons
            :maxParcent="cauldron.config.mcr"
            :isDisabled="!collateralValue"
            @onchange="updatePercentValue"
          />
        </div>

        <BalanceBlock v-if="cauldron" :cauldron="cauldron" />

        <router-link class="position-link link" :to="{ name: 'MyPositions' }"
          >Go to Positions</router-link
        >
      </div>

      <div class="cauldron-stand" :style="backgroundInfo.stand">
        <h1 class="title">
          Borrow
          <MagicApeIcon v-if="cauldron" :cauldron="cauldron" />
          MIM
        </h1>

        <div class="stand-info">
          <div class="stand-tags">
            <SpecialInfoBlock v-if="cauldron" :cauldron="cauldron" />
            <Tooltip
              v-if="cauldron"
              @click="showAdditionalInfo = !showAdditionalInfo"
            />
          </div>
          <div>
            <template v-if="cauldron">
              <PositionInfoBlock
                v-if="showAdditionalInfo"
                :cauldron="cauldron"
                :positionRisk="positionRisk"
                :expectedCollateralAmount="expectedCollateralAmount"
                :expectedBorrowAmount="expectedBorrowAmount"
                :expectedLiquidationPrice="expectedLiquidationPrice"
              />

              <AdditionalInfoBlock v-else :cauldron="cauldron" />
            </template>
            <EmptyState v-else />
          </div>
        </div>

        <CollateralApyBlock v-if="cauldron" :cauldron="cauldron" />

        <template v-if="cauldron">
          <div class="btn-wrap">
            <BaseButton
              primary
              :disabled="isTokenApproved || isActionDisabled"
              @click="approveTokenHandler"
              >Approve</BaseButton
            >
            <BaseButton
              @click="actionHandler"
              :disabled="!isTokenApproved || isActionDisabled"
              >{{ actionInfo.buttonText }}
            </BaseButton>
          </div>

          <div class="main-info-wrap">
            <MainInfoBlock :cauldron="cauldron" />
          </div>

          <LeftToBorrowBlock
            :borrowLeft="cauldron.mainParams.mimLeftToBorrow"
          />
        </template>
      </div>
    </template>

    <BaseLoader v-else />

    <LocalPopupWrap
      :isOpened="isOpenMarketListPopup"
      @closePopup="isOpenMarketListPopup = false"
    >
      <MarketsListPopup
        popupType="borrow"
        @changeActiveMarket="changeActiveMarket($event)"
    /></LocalPopupWrap>
  </div>
</template>

<script>
import { utils, BigNumber } from "ethers";
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
import cookMixin from "@/mixins/borrow/cooksV2.js";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getChainInfo } from "@/helpers/chain/getChainInfo.ts";
import notification from "@/helpers/notification/notification.js";
import { getCauldronInfo } from "@/helpers/cauldron/getCauldronInfo";
import { approveToken } from "@/helpers/approval";
import {
  MAX_ALLOWANCE_VALUE,
  COLLATERAL_EMPTY_DATA,
  MIM_EMPTY_DATA,
} from "@/constants/cauldron.ts";

export default {
  mixins: [cookMixin],
  data() {
    return {
      cauldron: "",
      useOtherToken: false,
      collateralValue: "",
      isOpenMarketListPopup: false,
      borrowValue: "",
      showAdditionalInfo: true,
      cauldronId: null,
      updateInterval: null,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      provider: "getProvider",
      signer: "getSigner",
    }),

    isCauldronLoading() {
      return !!(this.$route.params.id && !this.cauldron);
    },

    isTokenApproved() {
      if (!this.account) return true;

      const allowance = +utils.formatUnits(
        this.activeToken.allowance,
        this.activeToken.decimals
      );

      return allowance > +this.collateralValue;
    },

    isActionDisabled() {
      if (this.errorCollateralValue || this.errorBorrowValue) return true;
      if (!this.collateralValue && !this.borrowValue) return true;
      return false;
    },

    parseCollateralAmount() {
      const { decimals } = this.activeToken;

      return utils.parseUnits(
        filters.formatToFixed(this.collateralValue || 0, decimals),
        decimals
      );
    },

    parseBorrowAmount() {
      return utils.parseUnits(filters.formatToFixed(this.borrowValue || 0, 18));
    },

    expectedCollateralAmount() {
      const { tokensRate } = this.cauldron.additionalInfo;
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;
      const { decimals } = this.cauldron.config.collateralInfo;
      const wrapInfo = this.cauldron.config?.wrapInfo;

      const collateralDeposit = +utils.formatUnits(
        userCollateralAmount,
        decimals
      );
      const rates = +utils.formatUnits(tokensRate, decimals);

      if (wrapInfo && !this.useOtherToken) {
        return collateralDeposit + +this.collateralValue / rates;
      } else return collateralDeposit + +this.collateralValue;
    },

    expectedBorrowAmount() {
      const { borrowFee } = this.cauldron.mainParams;
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const borrowAmount = +utils.formatUnits(userBorrowAmount);
      const debt = (+this.borrowValue / 100) * +borrowFee;

      if (borrowFee) return +this.borrowValue + debt + borrowAmount;
      return +this.borrowValue + borrowAmount;
    },

    expectedLiquidationPrice() {
      if (!this.expectedCollateralAmount) return 0;

      return (
        this.expectedBorrowAmount /
        this.expectedCollateralAmount /
        (+this.cauldron.config.mcr / 100)
      );
    },

    errorCollateralValue() {
      if (isNaN(this.collateralValue)) return "Please input valid value";
      if (+this.collateralValue > +this.activeToken.balance.value)
        return `The value cannot be greater than ${this.activeToken.balance.value}`;
      return "";
    },

    errorBorrowValue() {
      if (isNaN(this.borrowValue)) return "Please input valid value";
      if (+this.borrowValue > +this.maxBorrowValue)
        return `The value cannot be greater than ${this.maxBorrowValue}`;

      return "";
    },

    nativeToken() {
      const { symbol, icon } = getChainInfo(this.chainId);
      const { nativeTokenBalance } = this.cauldron.userTokensInfo;

      return {
        name: symbol,
        icon,
        balance: {
          hex: nativeTokenBalance,
          value: utils.formatUnits(nativeTokenBalance),
        },
        decimals: 18,
        allowance: BigNumber.from(MAX_ALLOWANCE_VALUE),
        isNative: true,
      };
    },

    collateralToken() {
      const { name, decimals } = this.cauldron.config.collateralInfo;
      const { icon } = this.cauldron.config;
      const { collateral } = this.cauldron.contracts;
      const { collateralBalance, collateralAllowance } =
        this.cauldron.userTokensInfo;

      return {
        name,
        icon,
        balance: {
          hex: collateralBalance,
          value: utils.formatUnits(collateralBalance, decimals),
        },
        decimals,
        allowance: collateralAllowance,
        contract: collateral,
      };
    },

    unwrappedToken() {
      const { name, icon } = this.cauldron.config.wrapInfo.unwrappedToken;
      const { decimals } = this.cauldron.config.collateralInfo;
      const { unwrappedToken } = this.cauldron.contracts;
      const { unwrappedTokenBalance, unwrappedTokenAllowance } =
        this.cauldron.userTokensInfo;

      return {
        name,
        icon,
        balance: {
          hex: unwrappedTokenBalance,
          value: utils.formatUnits(unwrappedTokenBalance, decimals),
        },
        decimals,
        allowance: unwrappedTokenAllowance,
        contract: unwrappedToken,
      };
    },

    borrowToken() {
      if (!this.cauldron) return MIM_EMPTY_DATA;
      const { name, icon } = this.cauldron.config.mimInfo;
      return { name, icon };
    },

    activeToken() {
      if (!this.cauldron) return COLLATERAL_EMPTY_DATA;

      const { acceptUseDefaultBalance } = this.cauldron.config.cauldronSettings;
      const useUnwrappedByDefault =
        this.cauldron.config?.wrapInfo?.useUnwrappedByDefault;

      if (acceptUseDefaultBalance && this.useOtherToken)
        return this.nativeToken;
      if (useUnwrappedByDefault && !this.useOtherToken)
        return this.unwrappedToken;
      return this.collateralToken;
    },

    collateralInUsd() {
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const { decimals } = this.cauldron.config.collateralInfo;
      const exchangeRate = +utils.formatUnits(oracleExchangeRate, decimals);
      return this.expectedCollateralAmount / exchangeRate;
    },

    maxBorrowValue() {
      if (!this.cauldron) return 0;

      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const { mcr } = this.cauldron.config;
      const borrowAmount = +utils.formatUnits(userBorrowAmount);
      const maxBorrow = (this.collateralInUsd / 100) * (mcr - 1) - borrowAmount;
      return maxBorrow < 0 ? 0 : maxBorrow;
    },

    calculateLtv() {
      const { mcr } = this.cauldron.config;
      if (!this.expectedBorrowAmount) return 0;

      const ltv =
        Math.round((this.expectedBorrowAmount / this.collateralInUsd) * 100) +
        1;

      if (ltv <= +mcr) return parseFloat(ltv).toFixed(0);
      return +mcr;
    },

    liquidationRisk() {
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const { decimals } = this.cauldron.config.collateralInfo;
      const exchangeRate = +utils.formatUnits(oracleExchangeRate, decimals);

      const priceDifferens = 1 / exchangeRate - this.expectedLiquidationPrice;

      const riskPersent =
        priceDifferens *
        this.cauldron.config.cauldronSettings.healthMultiplier *
        exchangeRate *
        100;

      if (riskPersent > 100) return 100;

      if (riskPersent <= 0) return 0;

      return parseFloat(riskPersent).toFixed(2);
    },

    positionRisk() {
      if (!this.expectedLiquidationPrice) return "";
      if (this.liquidationRisk >= 0 && this.liquidationRisk <= 5) return "high";
      if (this.liquidationRisk > 5 && this.liquidationRisk <= 75)
        return "medium";

      if (this.liquidationRisk > 75) return "safe";

      return "";
    },

    actionInfo() {
      const { isCollateralLocked } = this.cauldron.additionalInfo;

      const info = {
        methodName: null,
        buttonText: "Nothing to do",
      };

      if (this.isActionDisabled) return info;
      if (isCollateralLocked) return info;

      if (+this.borrowValue && +this.collateralValue) {
        info.methodName = "addCollateralAndBorrowHandler";
        info.buttonText = "Add collateral and borrow";
      } else if (+this.borrowValue) {
        info.methodName = "borrowHandler";
        info.buttonText = "Borrow";
      } else if (+this.collateralValue) {
        info.methodName = "addCollateralHandler";
        info.buttonText = "Add collateral";
      }

      return info;
    },

    backgroundInfo() {
      if (!this.cauldron) return false;
      const { id } = this.cauldron.config;
      if (id === 39)
        return {
          deposit: `background-image: url(${useImage(
            "assets/images/ape/bg.png"
          )})`,
          stand: `background-image: url(${useImage(
            "assets/images/ape/bg-info.png"
          )})`,
        };
      return false;
    },
  },

  watch: {
    async cauldronId() {
      await this.createCauldronInfo();
    },

    cauldron() {
      if (this.cauldron === null) this.$router.push(`/borrow`);
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    clearInputs() {
      this.collateralValue = "";
      this.borrowValue = "";
    },

    changeToken(value) {
      this.collateralValue = "";
      this.borrowValue = "";
      this.useOtherToken = value;
    },

    async changeActiveMarket(marketId) {
      clearInterval(this.updateInterval);
      this.cauldronId = marketId;
      this.cauldron = "";
      this.useOtherToken = false;
      this.collateralValue = "";
      this.borrowValue = "";

      const duplicate = this.$route.fullPath === `/borrow/${marketId}`;
      if (!duplicate) this.$router.push(`/borrow/${marketId}`);

      this.isOpenMarketListPopup = false;
    },

    updateCollateralValue(value) {
      this.collateralValue = value;
    },

    updateBorrowValue(value) {
      this.borrowValue = value;
    },

    updatePercentValue(value) {
      if (!value) this.borrowValue = "";
      const { mcr } = this.cauldron.config;
      const amount = (this.maxBorrowValue * value) / +mcr;
      if (amount > +this.maxBorrowValue) this.borrowValue = this.maxBorrowValue;
      this.borrowValue = !amount ? "" : amount;
    },

    async approveTokenHandler() {
      if (this.isTokenApproved || this.isActionDisabled) return false;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const { address } = this.cauldron.contracts.bentoBox;
      const approve = await approveToken(this.activeToken.contract, address);

      if (approve) await this.createCauldronInfo();
      await this.deleteNotification(notificationId);

      if (!approve) await this.createNotification(notification.approveError);

      return false;
    },

    async actionHandler() {
      if (!this.isTokenApproved || this.isActionDisabled) return false;

      if (!this[this.actionInfo.methodName]) return false;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const isPermissionToCook = await this.checkPermissionToCook(
        notificationId,
        this.borrowValue || 0
      );

      if (!isPermissionToCook) return false;

      await this[this.actionInfo.methodName](notificationId);

      this.clearInputs();
    },

    async addCollateralAndBorrowHandler(notificationId) {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { updatePrice } = this.cauldron.mainParams;

      const payload = {
        collateralAmount: this.parseCollateralAmount,
        amount: this.parseBorrowAmount,
        updatePrice,
        itsDefaultBalance: !!this.activeToken.isNative,
      };

      await this.cookAddCollateralAndBorrow(
        payload,
        isMasterContractApproved,
        this.cauldron,
        notificationId,
        !!this.cauldron.config?.wrapInfo,
        !this.useOtherToken
      );

      return await this.createCauldronInfo();
    },

    async addCollateralHandler(notificationId) {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { updatePrice } = this.cauldron.mainParams;

      const payload = {
        amount: this.parseCollateralAmount,
        updatePrice,
        itsDefaultBalance: !!this.activeToken.isNative,
      };

      await this.cookAddCollateral(
        payload,
        isMasterContractApproved,
        this.cauldron,
        notificationId,
        !!this.cauldron.config?.wrapInfo,
        !this.useOtherToken
      );

      return await this.createCauldronInfo();
    },

    async borrowHandler(notificationId) {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { updatePrice } = this.cauldron.mainParams;

      const payload = {
        amount: this.parseBorrowAmount,
        updatePrice,
      };

      await this.cookBorrow(
        payload,
        isMasterContractApproved,
        this.cauldron,
        notificationId
      );

      return await this.createCauldronInfo();
    },

    async checkPermissionToCook(notificationId, borrowAmount) {
      const { userMaxBorrow, mimLeftToBorrow } = this.cauldron.mainParams;
      const { id } = this.cauldron.config;
      const { whitelistedInfo } = this.cauldron.additionalInfo;
      const leftToBorrow = utils.formatUnits(mimLeftToBorrow);
      const borrowLimit = utils.formatUnits(userMaxBorrow);

      if (+leftToBorrow < +borrowAmount) {
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.allowBorrow);
        return false;
      }

      if (+borrowAmount > +borrowLimit) {
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.borrowLimit);
        return false;
      }

      if (!whitelistedInfo && this.chainId === 1 && id === 33) {
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.whitelisted);
        return false;
      }

      const allowance = await this.checkAllowance(this.parseCollateralAmount);

      if (!allowance) {
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.approveError);
        return false;
      }

      return true;
    },

    async checkAllowance(amount) {
      const { isNative, contract } = this.activeToken;
      const { bentoBox } = this.cauldron.contracts;
      if (!isNative) {
        const allowance = await contract.allowance(
          this.account,
          bentoBox.address
        );

        if (allowance.lt(amount)) {
          return await approveToken(contract, bentoBox.address);
        }
      }

      return true;
    },

    async createCauldronInfo() {
      if (!this.cauldronId) return false;

      const userSigner = this.account ? this.signer : this.provider;
      this.cauldron = await getCauldronInfo(
        this.cauldronId,
        this.chainId,
        this.provider,
        userSigner
      );

      this.updateInterval = await setInterval(async () => {
        this.cauldron = await getCauldronInfo(
          this.cauldronId,
          this.chainId,
          this.provider,
          this.signer
        );
      }, 60000);
    },
  },

  async created() {
    this.cauldronId = this.$route.params.id;
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    NetworksList: defineAsyncComponent(() =>
      import("@/components/ui/NetworksList.vue")
    ),
    InputLabel: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputLabel.vue")
    ),
    BaseTokenInput: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenInput.vue")
    ),
    UseCheckbox: defineAsyncComponent(() =>
      import("@/components/ui/checkboxes/UseCheckbox.vue")
    ),
    LtvBlock: defineAsyncComponent(() =>
      import("@/components/borrow/LtvBlock.vue")
    ),
    Tooltip: defineAsyncComponent(() =>
      import("@/components/ui/icons/Tooltip.vue")
    ),
    PercentageButtons: defineAsyncComponent(() =>
      import("@/components/borrow/PercentageButtons.vue")
    ),
    BalanceBlock: defineAsyncComponent(() =>
      import("@/components/borrow/BalanceBlock.vue")
    ),
    MagicApeIcon: defineAsyncComponent(() =>
      import("@/components/icons/MagicApe.vue")
    ),
    SpecialInfoBlock: defineAsyncComponent(() =>
      import("@/components/borrow/SpecialInfoBlock.vue")
    ),
    PositionInfoBlock: defineAsyncComponent(() =>
      import("@/components/borrow/PositionInfoBlock.vue")
    ),
    AdditionalInfoBlock: defineAsyncComponent(() =>
      import("@/components/borrow/AdditionalInfoBlock.vue")
    ),
    EmptyState: defineAsyncComponent(() =>
      import("@/components/borrow/EmptyState.vue")
    ),
    CollateralApyBlock: defineAsyncComponent(() =>
      import("@/components/borrow/CollateralApyBlock.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    MainInfoBlock: defineAsyncComponent(() =>
      import("@/components/borrow/MainInfoBlock.vue")
    ),
    LeftToBorrowBlock: defineAsyncComponent(() =>
      import("@/components/borrow/LeftToBorrowBlock.vue")
    ),
    BaseLoader: defineAsyncComponent(() =>
      import("@/components/base/BaseLoader.vue")
    ),
    LocalPopupWrap: defineAsyncComponent(() =>
      import("@/components/popups/LocalPopupWrap.vue")
    ),
    MarketsListPopup: defineAsyncComponent(() =>
      import("@/components/popups/MarketsListPopup.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.cauldron-view {
  display: grid;
  grid-gap: 20px;
  margin: 0 auto;
  max-width: calc(100% - 20px);
  padding: 100px 0;
  grid-template-columns: 550px 1fr;
  width: 1320px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.cauldron-deposit {
  padding: 30px 30px 50px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
  position: relative;
  background-position: center;
  background-size: cover;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.collateral-assets {
  padding-top: 27px;
  padding-bottom: 24px;
}

.borrow-assets {
  padding-top: 27px;
  padding-bottom: 14px;
}

.ltv-wrap {
  padding: 15px 0;
}

.percent-wrap {
  padding: 30px 0;
}

.position-link {
  position: absolute;
  bottom: 10px;
  right: 0;
  left: 0;
  margin: 0 auto;
}

.cauldron-stand {
  min-height: 520px;
  padding: 30px 20px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
  background-position: center;
  background-size: cover;
}

.title {
  font-size: 24px;
  text-transform: uppercase;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stand-info {
  background-color: #23212d4d;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 30px;
}

.stand-tags {
  display: flex;
  justify-content: space-between;
  padding: 9px 30px 7px;
  min-height: 40px;
  gap: 15px;
}

.btn-wrap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-bottom: 30px;
}

.main-info-wrap {
  margin-bottom: 20px;
}

@media (max-width: 1024px) {
  .cauldron-view {
    grid-template-columns: 1fr;
    width: 95%;
  }

  .cauldron-deposit {
    padding: 30px 15px 50px;
  }
}

@media (max-width: 600px) {
  .collateral-assets {
    padding: 20px 0 15px;
  }

  .position-link {
    bottom: 15px;
  }

  .cauldron-stand {
    padding: 20px 10px;
    min-height: auto;
  }

  .title {
    margin-bottom: 20px;
  }

  .btn-wrap {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 375px) {
  .btn-wrap {
    grid-gap: 10px;
  }
}
</style>
