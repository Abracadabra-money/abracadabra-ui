<template>
  <div class="cauldron-view" :class="{ loading: isCauldronLoading }">
    <template v-if="!isCauldronLoading">
      <div class="cauldron-deposit" :style="backgroundInfo.deposit">
        <div class="underline">
          <h4>
            Choose Chain
            <button @click="removeAndRepayHandler">
              removeAndRepayHandler
            </button>
          </h4>
          <NetworksList />
        </div>

        <div class="collateral-assets underline">
          <!-- todo activeToken.balance.value-->
          <InputLabel
            title="Remove collateral"
            :amount="formatTokenBalance(maxCollateralValue)"
          />

          <!-- todo BaseTokenInput-->
          <BaseTokenInput
            :icon="activeToken.icon"
            :name="activeToken.name"
            :value="collateralValue"
            :max="activeToken.max"
            :error="errorCallateralValue"
            :disabled="!cauldron"
            @updateValue="updateCollateralValue"
            @openTokensList="isOpenMarketListPopup = true"
            isChooseToken
          />
        </div>

        <div class="borrow-assets underline">
          <div class="header-balance">
            <h4>Repay MIM</h4>
          </div>
          <BaseTokenInput
            :name="mimInfo.name"
            :icon="mimInfo.icon"
            :value="borrowValue"
            :max="maxBorrowValue"
            :error="errorBorrowValue"
            :disabled="!cauldron"
            @updateValue="updateBorrowValue"
          />
        </div>

        <BalanceBlock v-if="cauldron" :cauldron="cauldron" />
      </div>

      <div class="cauldron-stand" :style="backgroundInfo.stand">
        <h1 class="title">
          Repay
          <MagicApeIcon v-if="cauldron" :cauldronId="cauldron.config.id" />
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
          <div class="stand-data">
            <template v-if="cauldron">
              <PositionInfoBlock
                v-if="showAdditionalInfo"
                :cauldron="cauldron"
                :expectedCollateralAmount="expectedCollateralAmount"
                :expectedBorrowedAmount="expectedBorrowedAmount"
                :expectedLiquidationPrice="expectedLiquidationPrice"
              />

              <AdditionalInfoBlock v-else :cauldron="cauldron" />
            </template>
            <EmptyState v-else />
          </div>
        </div>

        <CollateralApyBlockNew v-if="cauldron" :cauldron="cauldron" />

        <template v-if="cauldron">
          <div class="btn-wrap">
            <BaseButton
              primary
              :disabled="isTokenApproved"
              @click="approveTokenHandler"
              >Approve</BaseButton
            >
            <BaseButton @click="actionHandler" :disabled="isActionDisabled"
              >{{ actionInfo.buttonText }}
            </BaseButton>
          </div>

          <div class="info-wrap">
            <MainInfoBlock :cauldron="cauldron" />
          </div>
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
import { utils } from "ethers";
import filters from "@/filters/index.js";
import { useImage } from "@/helpers/useImage";
import cookMixin from "@/mixins/borrow/cooksV2.js";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getChainInfo } from "@/helpers/chain/getChainInfo.ts";
import notification from "@/helpers/notification/notification.js";
import { getCauldronInfo } from "@/helpers/cauldron/getCauldronInfo";
import { approveToken } from "@/helpers/approval";
import NetworksList from "@/components/ui/NetworksList.vue";
import InputLabel from "@/components/ui/inputs/InputLabel.vue";
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import Tooltip from "@/components/ui/icons/Tooltip.vue";
import BalanceBlock from "@/components/borrow/BalanceBlockNew.vue";
import MagicApeIcon from "@/components/icons/MagicApe.vue";
import SpecialInfoBlock from "@/components/borrow/SpecialInfoBlock.vue";
import PositionInfoBlock from "@/components/borrow/PositionInfoBlock.vue";
import AdditionalInfoBlock from "@/components/borrow/AdditionalInfoBlock.vue";
import EmptyState from "@/components/borrow/EmptyState.vue";
import CollateralApyBlockNew from "@/components/borrow/CollateralApyBlockNew.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import MainInfoBlock from "@/components/borrow/MainInfoBlock.vue";
import BaseLoader from "@/components/base/BaseLoader.vue";
import LocalPopupWrap from "@/components/popups/LocalPopupWrap.vue";
import MarketsListPopup from "@/components/popups/MarketsListPopup.vue";

const MAX_ALLOWANCE_VALUE =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
const EMPTY_DATA = {
  name: "",
  icon: "",
  balance: { value: 0 },
};
const MIM_INFO = {
  name: "MIM",
  icon: useImage(`assets/images/tokens/MIM.png`),
};

export default {
  mixins: [cookMixin],
  data() {
    return {
      cauldron: "",
      borrowValue: "",
      collateralValue: "",
      cauldronId: null,
      maxWithdrawAmount: 0,
      updateInterval: null,
      showAdditionalInfo: true,
      isOpenMarketListPopup: false,
      // ------
      useOtherToken: false,
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
      console.log("cauldron", this.cauldron);
      if (!this.account) return true;

      const { mimAllowance } = this.cauldron.userTokensInfo;
      const allowance = +utils.formatUnits(mimAllowance);
      // todo
      return true;
      // return allowance > 0;
    },

    isActionDisabled() {
      if (!this.isTokenApproved) return true;
      if (this.errorCallateralValue || this.errorBorrowValue) return true;
      if (!this.collateralValue && !this.borrowValue) return true;
      return false;
    },

    maxCollateralValue() {
      if (!this.cauldron) return 0;
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;
      const { decimals } = this.cauldron.config.collateralInfo;
      const borrowAmount = +utils.formatUnits(userBorrowAmount);
      const collateralAmount = +utils.formatUnits(userCollateralAmount);
      const maxWithdrawAmount = +parseFloat(this.maxWithdrawAmount).toFixed(20);

      if (+this.borrowValue === borrowAmount || !borrowAmount) {
        if (maxWithdrawAmount && maxWithdrawAmount < collateralAmount) {
          return filters.formatToFixed(maxWithdrawAmount, decimals);
        }

        return collateralAmount;
      }

      return this.maxRemoveValue;
    },

    maxRemoveValue() {
      const { mcr, collateralInfo } = this.cauldron.config;
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const { decimals } = collateralInfo;

      const collateralAmount = +utils.formatUnits(
        userCollateralAmount,
        decimals
      );

      const exchangeRate = +utils.formatUnits(oracleExchangeRate, decimals);

      // todo to computed
      const tokenInUsd = collateralAmount / exchangeRate;

      const maxMimBorrow = (tokenInUsd / 100) * (mcr - 1);

      const borrowAmount = +utils.formatUnits(userBorrowAmount);

      const maxBorrowLeft =
        +this.borrowValue && !this.errorBorrowValue
          ? +maxMimBorrow - borrowAmount + +this.borrowValue
          : +maxMimBorrow - borrowAmount;

      const borrowLeft = parseFloat(
        ((maxBorrowLeft * exchangeRate) / mcr) * 100
      ).toFixed(20);

      if (+borrowLeft < 0) return "0";

      if (+this.maxWithdrawAmount && +this.maxWithdrawAmount < +borrowLeft) {
        return filters.formatToFixed(
          +parseFloat(this.maxWithdrawAmount).toFixed(20),
          decimals
        );
      }

      return filters.formatToFixed(borrowLeft, decimals);
    },

    maxBorrowValue() {
      if (!this.cauldron) return 0;

      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      // todo mimBalance to mimInfo
      const { mimBalance } = this.cauldron.userTokensInfo;
      const borrowAmount = +utils.formatUnits(userBorrowAmount);
      const userMimBalance = +utils.formatUnits(mimBalance);
      if (borrowAmount > userMimBalance) return userMimBalance;

      return borrowAmount;
    },

    errorCallateralValue() {
      if (isNaN(this.collateralValue)) return "Please input valid value";
      if (+this.collateralValue > +this.maxCollateralValue)
        return `The value cannot be greater than ${this.maxCollateralValue}`;
      return "";
    },

    errorBorrowValue() {
      if (isNaN(this.borrowValue)) return "Please input valid value";
      if (+this.borrowValue > +this.maxBorrowValue)
        return `The value cannot be greater than ${this.maxBorrowValue}`;

      return "";
    },

    expectedCollateralAmount() {
      const { userCollateralAmount, decimals } =
        this.cauldron.userPosition.collateralInfo;
      const collateralAmount = +utils.formatUnits(
        userCollateralAmount,
        decimals
      );

      if (this.errorCallateralValue) return collateralAmount;

      return collateralAmount - +this.collateralValue;
    },

    expectedBorrowedAmount() {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const borrowAmount = +utils.formatUnits(userBorrowAmount);

      if (this.errorBorrowValue) return borrowAmount;
      return borrowAmount - +this.borrowValue;
    },

    expectedLiquidationPrice() {
      if (!this.expectedCollateralAmount) return 0;

      return (
        this.expectedBorrowedAmount /
        this.expectedCollateralAmount /
        (+this.cauldron.config.mcr / 100)
      );
    },

    activeToken() {
      if (!this.cauldron) return EMPTY_DATA;

      const { name } = this.cauldron.config.collateralInfo;
      const { icon } = this.cauldron.config;
      return { name, icon, max: this.maxCollateralValue };
    },

    mimInfo() {
      if (!this.cauldron) return MIM_INFO;
      const { name, icon } = this.cauldron.config.mimInfo;
      return { name, icon };
    },

    actionInfo() {
      const info = {
        methodName: null,
        buttonText: "Nothing to do",
      };

      if (this.isActionDisabled) return info;

      if (+this.borrowValue && +this.collateralValue) {
        info.methodName = "removeAndRepayHandler";
        info.buttonText = "Remove and Repay";
      } else if (+this.borrowValue) {
        info.methodName = "repayHandler";
        info.buttonText = "Repay";
      } else if (+this.collateralValue) {
        info.methodName = "removeCollateralHandler";
        info.buttonText = "Remove collateral";
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
      if (this.cauldron === null) this.$router.push(`/repayTest`);
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    async getMaxWithdrawAmount() {
      const { hasWithdrawableLimit } = this.cauldron.config.cauldronSettings;
      const { collateral, bentoBox } = this.cauldron.contracts;
      const { decimals } = this.cauldron.config.collateralInfo;
      if (hasWithdrawableLimit) {
        const withdrawAmount = await collateral.balanceOf(bentoBox.address);
        return utils.formatUnits(withdrawAmount, decimals);
      }

      return 0;
    },

    updateCollateralValue(value) {
      this.collateralValue = value;
    },
    // todo потрібно оновлювати collateralValue???
    updateBorrowValue(value) {
      this.borrowValue = value;
    },

    async approveTokenHandler() {
      if (this.isTokenApproved) return false;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const { mim, bentoBox } = this.cauldron.contracts.bentoBox;
      const approve = await approveToken(mim, bentoBox.address);

      if (approve) await this.createCauldronInfo();
      await this.deleteNotification(notificationId);

      if (!approve) await this.createNotification(notification.approveError);

      return false;
    },

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
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

      this.maxWithdrawAmount = await this.getMaxWithdrawAmount();

      this.updateInterval = await setInterval(async () => {
        this.cauldron = await getCauldronInfo(
          this.cauldronId,
          this.chainId,
          this.provider,
          this.signer
        );
      }, 15000);
    },

    async changeActiveMarket(marketId) {
      clearInterval(this.updateInterval);
      this.cauldronId = marketId;
      this.cauldron = "";
      this.collateralValue = "";
      this.borrowValue = "";

      // todo
      // const duplicate = this.$route.fullPath === `/repay/${marketId}`;
      // if (!duplicate) this.$router.push(`/repay/${marketId}`);
      const duplicate = this.$route.fullPath === `/repayTest/${marketId}`;
      if (!duplicate) this.$router.push(`/repayTest/${marketId}`);

      this.isOpenMarketListPopup = false;
    },

    async actionHandler() {
      this[this.actionInfo.methodName]();
    },

    //----- fef

    async checkAllowance(amount) {
      const { bentoBox, mim } = this.cauldron.contracts;

      const isApproved = await mim.allowance(this.account, bentoBox.address);

      if (isApproved.lt(amount)) {
        return await approveToken(mim, bentoBox.address);
      }

      return true;
    },

    async repayHandler() {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const borrowAmount = +utils.formatUnits(userBorrowAmount);

      const parsedAmount = utils.parseUnits(
        filters.formatToFixed(this.borrowValue, 18)
      );

      const payload = {
        amount: parsedAmount,
        // todo updatePrice: this.selectedPool.askUpdatePrice,
        updatePrice: true,
        itsMax: +this.borrowValue === borrowAmount,
      };

      const isTokenToCookApprove = checkAllowance(parsedAmount);

      if (+isTokenToCookApprove) {
        await this.cookRepay(
          payload,
          isMasterContractApproved,
          this.cauldron,
          notificationId
        );

        return await this.createCauldronInfo();
      }

      await this.deleteNotification(notificationId);
      return await this.createNotification(notification.approveError);
    },

    async removeCollateralHandler() {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { decimals, address } = this.cauldron.config.collateralInfo;
      const { bentoBox } = this.cauldron.contracts;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const parsedAmount = utils.parseUnits(
        this.collateralValue.toString(),
        decimals
      );

      const share = await bentoBox.toShare(address, parsedAmount, true);

      const payload = {
        amount: share,
        // rodo  updatePrice: this.selectedPool.askUpdatePrice,
        updatePrice: true,
      };

      await this.cookRemoveCollateral(
        payload,
        isMasterContractApproved,
        this.cauldron,
        notificationId
      );

      return await this.createCauldronInfo();
    },

    async removeAndRepayHandler() {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { decimals: mimDecimals } = this.cauldron.config.mimInfo;
      const { decimals, address } = this.cauldron.config.collateralInfo;
      const { bentoBox } = this.cauldron.contracts;
      const { userBorrowPart } = this.cauldron.userPosition.borrowInfo;
      const { userCollateralShare } = this.cauldron.userPosition.collateralInfo;

      const borrowPart = +utils.formatUnits(userBorrowPart);
      const collateralShare = +utils.formatUnits(userCollateralShare, decimals);

      const notificationId = await this.createNotification(
        notification.pending
      );

      let parsedAmount = utils.parseUnits(
        filters.formatToFixed(this.borrowValue, mimDecimals)
      );

      let parsedPair = utils.parseUnits(
        this.collateralValue.toString(),
        decimals
      );

      const payload = {
        collateralAmount: parsedAmount,
        amount: await bentoBox.toShare(address, parsedPair, true),
        //todo updatePrice: this.selectedPool.askUpdatePrice,
        updatePrice: true,
      };

      if (
        +this.borrowValue === borrowPart &&
        +this.collateralValue === collateralShare
      ) {
        payload.itsMax = true;
        payload.collateralAmount = userBorrowPart;
        // todo  updatePrice: this.selectedPool.askUpdatePrice,
        payload.updatePrice = true;

        parsedAmount = userBorrowPart;
        parsedPair = userCollateralShare;

        payload.amount = await bentoBox.toShare(
          address,
          userCollateralShare,
          true
        );
      }

      const isTokenToCookApprove = checkAllowance(payload.collateralAmount);

      if (+isTokenToCookApprove) {
        await this.cookRemoveCollateralAndRepay(
          payload,
          isMasterContractApproved,
          this.cauldron,
          notificationId
        );

        return await this.createCauldronInfo();
      }

      await this.deleteNotification(notificationId);
      return await this.createNotification(notification.approveError);
    },

    // ---------
  },

  async created() {
    this.cauldronId = this.$route.params.id;
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    NetworksList,
    InputLabel,
    BaseTokenInput,
    Tooltip,
    BalanceBlock,
    MagicApeIcon,
    SpecialInfoBlock,
    PositionInfoBlock,
    AdditionalInfoBlock,
    EmptyState,
    CollateralApyBlockNew,
    BaseButton,
    MainInfoBlock,
    BaseLoader,
    LocalPopupWrap,
    MarketsListPopup,
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
  margin-bottom: 30px;
}

.position-link {
  position: absolute;
  bottom: 10px;
  right: 0;
  left: 0;
  margin: 0 auto;
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

.cauldron-stand {
  min-height: 520px;
  padding: 30px 20px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
  background-position: center;
  background-size: cover;
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

.ape-icon {
  max-width: 27px;
  margin: 0 10px;
}

.btn-wrap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-bottom: 30px;
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

  .title {
    margin-bottom: 20px;
  }

  .cauldron-stand {
    padding: 20px 10px;
    min-height: auto;
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
