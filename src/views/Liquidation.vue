<template>
  <div class="borrow" :class="{ 'borrow-loading': followLink }">
    <template v-if="!followLink">
      <div class="deposit-block">
        <h4>Choose Chain</h4>
        <div class="underline">
          <NetworksList />
        </div>

        <div class="collateral-input">
          <div class="select-wrap">
            <button class="select" @click="isOpenPollPopup = true">
              <BaseTokenIcon
                v-if="selectedPool"
                :name="selectedPool.name"
                :icon="selectedPool.icon"
              />
              <BaseTokenIcon v-else type="select" />
              <span class="select-text">
                {{ selectedPool ? selectedPool.name : "Select Cauldron" }}
              </span>
              <img
                class="select-arrow"
                src="@/assets/images/arrow.svg"
                alt="Arrow"
              />
            </button>
          </div>
        </div>

        <div class="borrow-input underline" v-if="selectedPool">
          <h4>
            Liquidate address
            <span v-if="account" class="insert-btn" @click="useConnectedAddress"
              >use connected</span
            >
          </h4>
          <div class="input-address-wrap">
            <input
              class="input-address"
              :class="{ error: liquidationAccountError }"
              v-model="liquidationAccount"
              type="text"
              placeholder="0x000...."
            />
            <p class="error-message">
              <span v-if="liquidationAccountError">{{
                liquidationAccountError
              }}</span>
              <span v-else>&nbsp;</span>
            </p>
          </div>

          <BaseTokenInput
            :name="mimInfo.name"
            :icon="mimInfo.icon"
            :value="borrowPart"
            :max="positionBorrowPart"
            :error="borrowPartError"
            :disabled="!selectedPool"
            @updateValue="updateBorrowPart"
          />
        </div>
      </div>

      <div class="info-block">
        <h1 class="title">Liquidation Helper</h1>

        <div class="stable-info">
          <div class="info-wrap"></div>
          <div class="stable-data">
            <template v-if="!selectedPool">
              <div class="empty-wrap">
                <div class="empty-text">
                  <p>
                    Please select cauldron to start interacting with the page
                  </p>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="stable-preview">
                <div class="item">
                  <p class="item-title">MIM Amount</p>
                  <p class="loader-wrap" v-if="isLoading">
                    <BaseLoader type="loader" />
                  </p>
                  <p v-else class="item-value">
                    {{ expectedLiquidationInfo.requiredMIMAmount }}
                  </p>
                </div>

                <div class="item">
                  <p class="item-title">Collateral To Receive</p>
                  <p class="loader-wrap" v-if="isLoading">
                    <BaseLoader type="loader" />
                  </p>
                  <p v-else class="item-value">
                    {{ expectedLiquidationInfo.returnedCollateralAmount }}
                  </p>
                </div>

                <div class="item">
                  <p class="item-title">MIM Value</p>
                  <p class="loader-wrap" v-if="isLoading">
                    <BaseLoader type="loader" />
                  </p>
                  <p v-else class="item-value">
                    {{ expectedLiquidationInfo.returnedMIMValue }}
                  </p>
                </div>
                <div class="item">
                  <p class="item-title">Collateral Value</p>
                  <p class="loader-wrap" v-if="isLoading">
                    <BaseLoader type="loader" />
                  </p>
                  <p v-else class="item-value">
                    {{ expectedLiquidationInfo.returnedCollateralValue }}
                  </p>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="btn-wrap" v-if="selectedPool">
          <BaseButton
            @click="approveTokenHandler"
            primary
            :disabled="!enableApprove"
            >Approve</BaseButton
          >
          <BaseButton
            @click="actionHandler"
            :disabled="disableActionButton"
            primary
            >Liquidate
          </BaseButton>
        </div>
      </div>
    </template>

    <BaseLoader v-else />

    <LocalPopupWrap
      :isOpened="isOpenPollPopup"
      @closePopup="isOpenPollPopup = false"
    >
      <MarketsListPopup
        @select="chosePool($event)"
        @close="isOpenPollPopup = false"
        :pools="sortedCauldrons"
        popupType="cauldron"
    /></LocalPopupWrap>
  </div>
</template>

<script>
import NetworksList from "@/components/ui/NetworksList.vue";
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseLoader from "@/components/base/BaseLoader.vue";
import LocalPopupWrap from "@/components/popups/LocalPopupWrap.vue";
import MarketsListPopup from "@/components/popups/MarketsListPopup.vue";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import cauldronsMixin from "@/mixins/borrow/cauldrons.js";
import cauldronsConfig from "@/utils/cauldronsConfig";
import notification from "@/helpers/notification/notification.js";
import MIMAbi from "@/utils/abi/tokensAbi/MIM";
import filters from "@/filters/index.js";
import { markRaw } from "vue";
import {
  getLiquidationHelperContract,
  liquidate,
  liquidateMax,
} from "@/helpers/liquidation";
import { getMIMPrice } from "@/helpers/getMIMPrice";
import { mapGetters } from "vuex";
import { approveToken, isTokenApprowed } from "@/utils/approveHelpers.js";

export default {
  mixins: [cauldronsMixin],
  data() {
    return {
      liquidationContract: null,
      liquidationAccount: "",
      isLiquidatable: null,
      positionBorrowPart: null,
      borrowPart: "",
      poolId: null,
      isOpenPollPopup: false,
      updateInterval: null,
      liquidationAccountError: "",
      expectedLiquidationInfo: {
        requiredMIMAmount: "0.0",
        returnedCollateralAmount: "0.0",
        returnedMIMValue: "0.0",
        returnedCollateralValue: "0.0",
      },
      mimPrice: null,
      isLoading: false,
      isTokenApproved: null
    };
  },

  computed: {
    ...mapGetters({
      pools: "getPools",
      chainId: "getChainId",
      account: "getAccount",
      signer: "getSigner",
    }),

    enableApprove() {
      if(this.isTokenApproved === false) return true;

      return false;
    },

    sortedCauldrons() {
      return this.pools.sort((a, b) =>
        a.cauldronSettings.isDepreciated ? 1 : -1
      );
    },

    selectedPool() {
      if (this.poolId) {
        let pool = this.$store.getters.getPoolById(+this.poolId);
        if (pool) return pool;
        return null;
      }
      return null;
    },

    mimInfo() {
      if (this.selectedPool)
        return {
          name: this.selectedPool.borrowToken.name,
          icon: this.selectedPool.borrowToken.icon,
        };

      return {
        name: "MIM",
        icon: this.$image("assets/images/tokens/MIM.png"),
      };
    },

    maxBorrowPart() {
      return 1;
    },

    borrowPartError() {
      if (+this.borrowPart && +this.borrowPart > +this.positionBorrowPart)
        return `The value cannot be greater than ${this.positionBorrowPart}`;

      return "";
    },

    disableActionButton() {
      if (!this.account) return true;
      if (!+this.borrowPart || this.borrowPartError) return true;
      if (this.liquidationAccountError) return true;
    },

    followLink() {
      return !!(this.$route.params.id && !this.pools.length);
    },

    selectedPoolId() {
      if (this.selectedPool) return this.selectedPool.id;

      return null;
    },
  },

  watch: {
    account(value) {
      this.createPools();
      this.clearData();
      this.liquidationContract = null;
      this.checkApprove(value);
    },

    pools() {
      if (this.poolId) {
        let pool = this.$store.getters.getPoolById(+this.poolId);
        if (!pool) this.$router.push(`/liquidation`);
      }

      return false;
    },

    liquidationAccount(value) {
      this.positionBorrowPart = null;
      this.borrowPart = "";
      this.expectedLiquidationInfo = {
        requiredMIMAmount: "0.0",
        returnedCollateralAmount: "0.0",
        returnedMIMValue: "0.0",
        returnedCollateralValue: "0.0",
      };
      this.checkAccount(value);
    },

    borrowPart(value) {
      this.computeExpectedLiquidation(value);
    },
  },

  methods: {
    clearData() {
      this.liquidationAccount = "";
      this.isLiquidatable = null;
      this.positionBorrowPart = null;
      this.borrowPart = "";
      this.expectedLiquidationInfo = {
        requiredMIMAmount: "0.0",
        returnedCollateralAmount: "0.0",
        returnedMIMValue: "0.0",
        returnedCollateralValue: "0.0",
      };
    },

    async approveTokenHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.approvePending
      );

      try {
        if (!this.liquidationContract) {
          this.liquidationContract = await getLiquidationHelperContract(
            this.contractProvider
          );
        }

        const mim = await this.liquidationContract.mim();
        const mimContract = markRaw(
          new this.$ethers.Contract(mim, MIMAbi, this.contractProvider)
        );

        const approved = await approveToken(
          mimContract,
          this.liquidationContract.address
        );

        this.isTokenApproved = !!+approved;

        await this.$store.commit("notifications/delete", notificationId);
      } catch (error) {
        console.log(error);
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.approveError
        );
      }
    },

    useConnectedAddress() {
      this.liquidationAccount = this.account;
    },

    async computeExpectedLiquidation(value) {
      this.expectedLiquidationInfo = {
        requiredMIMAmount: "0.0",
        returnedCollateralAmount: "0.0",
        returnedMIMValue: "0.0",
        returnedCollateralValue: "0.0",
      };
      if (!+value) return false;

      this.isLoading = true;

      const itsMax = this.value === this.positionBorrowPart;

      const cauldron = this.selectedPool.contractInstance.address;

      const previewResp = itsMax
        ? await this.liquidationContract.previewMaxLiquidation(
            cauldron,
            this.liquidationAccount
          )
        : await this.liquidationContract.previewLiquidation(
            cauldron,
            this.liquidationAccount,
            this.$ethers.utils.parseUnits(value)
          );

      this.expectedLiquidationInfo = await this.parseBoxInfo(previewResp);

      this.isLoading = false;
    },

    async parseBoxInfo(previewResp) {
      const collateralPrice = 1 / this.selectedPool.tokenOraclePrice;

      if (!this.mimPrice) {
        this.mimPrice = await getMIMPrice();
      }

      const requiredMIMAmount = filters.formatTokenBalance(
        this.$ethers.utils.formatUnits(previewResp.requiredMIMAmount)
      );

      const returnedCollateralAmount = filters.formatTokenBalance(
        this.$ethers.utils.formatUnits(
          previewResp.returnedCollateralAmount,
          this.selectedPool.collateralToken.decimals
        )
      );

      const returnedCollateralValue = filters.formatUSD(
        returnedCollateralAmount * collateralPrice
      );

      const returnedMIMValue = filters.formatUSD(
        requiredMIMAmount * this.mimPrice
      );

      return {
        requiredMIMAmount,
        returnedCollateralAmount,
        returnedMIMValue,
        returnedCollateralValue,
      };
    },

    async checkAccount(address) {
      this.liquidationAccountError = "";

      if (!address) {
        return false;
      }

      const isAddressValid =
        address && this.$ethers.utils.isAddress(address.toLowerCase());

      if (!isAddressValid) {
        this.liquidationAccountError = "Invalid address";
        return false;
      }

      if (!this.liquidationContract) {
        this.liquidationContract = await getLiquidationHelperContract(
          this.contractProvider
        );
      }

      const isLiquidatable = await this.liquidationContract.isLiquidatable(
        this.selectedPool.contractInstance.address,
        address
      );

      if (!isLiquidatable) {
        this.liquidationAccountError = "Address not liquidatable";
        // return false;
      }

      const userBorrowPart =
        await this.selectedPool.contractInstance.userBorrowPart(address);
      this.positionBorrowPart = this.$ethers.utils.formatUnits(userBorrowPart);
    },

    updateBorrowPart(value) {
      this.borrowPart = value;
    },

    async chosePool(pool) {
      this.clearData();
      this.poolId = pool.id;
      let duplicate = this.$route.fullPath === `/liquidation-helper/${pool.id}`;

      if (!duplicate) {
        this.$router.push(`/liquidation-helper/${pool.id}`);
      }
    },

    async actionHandler() {
      if (this.disableActionButton) return false;

      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

      try {
        const itsMax = this.borrowPart === this.positionBorrowPart;

        const contract = this.liquidationContract;
        const borrowPart = this.$ethers.utils.parseUnits(this.borrowPart);
        const account = this.liquidationAccount;
        const cauldron = this.selectedPool.contractInstance.address;
        const cauldronVersion = this.getCauldronVersion(cauldron);

        const result = itsMax
          ? await liquidateMax(contract, cauldron, account, cauldronVersion)
          : await liquidate(
              contract,
              cauldron,
              account,
              borrowPart,
              cauldronVersion
            );

        console.log("result", result);

        await this.$store.commit("notifications/delete", notificationId);
      } catch (error) {
        console.log(error);

        await this.$store.commit("notifications/delete", notificationId);
        const errorNotification = {
          msg: "Transaction encountered an Error",
          type: "error",
        };
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    // fix when migrate to new config
    getCauldronVersion(cauldron) {
      const configs = cauldronsConfig.filter(
        (config) => config.chainId === this.chainId
      );

      const cauldronInfo = configs.find(
        (config) =>
          config.contract.address.toLowerCase() === cauldron.toLowerCase()
      );

      return cauldronInfo.version;
    },
    async checkApprove(account) {
      try {
        if (!this.liquidationContract) {
          this.liquidationContract = await getLiquidationHelperContract(
            this.contractProvider
          );
        }

        const mim = await this.liquidationContract.mim();
        const mimContract = markRaw(
          new this.$ethers.Contract(mim, MIMAbi, this.contractProvider)
        );

        const isTokenApproved = await isTokenApprowed(
          mimContract,
          this.liquidationContract.address,
          account
        );

        this.isTokenApproved = !!+isTokenApproved;
      } catch (error) {
        console.log("checkApprove err:", error)
      }
    }
  },

  created() {
    this.poolId = this.$route.params.id;

    if(this.account) this.checkApprove(this.account);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    NetworksList,
    BaseTokenInput,
    BaseButton,
    BaseLoader,
    LocalPopupWrap,
    MarketsListPopup,
    BaseTokenIcon,
  },
};
</script>

<style lang="scss" scoped>
.insert-btn {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    color: white;
    text-decoration: underline;
  }
}

.stable-info {
  background-color: rgba(35, 33, 45, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 30px;

  .empty-wrap {
    background: #2b2b3c;
    box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.05);
    backdrop-filter: blur(100px);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 30px;
    padding: 23px 65px;
    min-height: 280px;

    img {
      max-width: 160px;
      width: 90%;
      height: auto;
    }
  }

  .empty-bottom {
    margin-top: 15px;
  }

  .empty-text {
    font-size: 18px;
    line-height: 27px;
    color: rgba(255, 255, 255, 0.6);
  }

  .empty-link {
    color: #759ffa;
  }

  .info-wrap {
    display: flex;
    justify-content: space-between;
    padding: 9px 30px 7px 30px;
    min-height: 40px;
  }

  .strategy {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .strategy a {
    color: #fff;
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(3, auto);
    align-items: center;
  }

  .deposit-wrap {
    display: flex;
  }

  .deposit {
    background: rgba(157, 244, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 30px;
    padding: 3px 8px;
    color: #63caf8;
    display: flex;
    align-items: center;
    margin-right: 15px;
    cursor: pointer;

    img {
      margin-right: 5px;
    }
  }

  .info-btn {
    background-color: transparent;
    cursor: pointer;
    border: none;
    /* margin: 9px 30px 7px 0;*/
    width: 24px;
    height: 24px;

    &:disabled {
      cursor: default;
    }
  }

  .info-icon {
    cursor: pointer;
    width: 24px;
    height: 24px;
  }

  .stable-data {
    position: relative;
    box-sizing: border-box;
    background: #2b2b3c;
    backdrop-filter: blur(100px);
    border-radius: 30px;
  }

  .stable-preview {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 30px;
    background: #2b2b3c;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(100px);
    border-radius: 30px;
  }

  .item {
    text-align: center;
    border-bottom: 1px rgba(255, 255, 255, 0.1) solid;
    padding-top: 14px;
    padding-bottom: 14px;

    &:nth-child(odd) {
      border-right: 1px rgba(255, 255, 255, 0.1) solid;
    }

    &:nth-last-child(-n + 2) {
      border-bottom: none;
      padding-bottom: 0;
    }
    &:nth-child(-n + 2) {
      padding-top: 0;
    }
  }

  .item-title {
    font-size: 18px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 12px;
  }

  .item-value {
    font-size: 30px;
    font-weight: 700;

    &.safe {
      color: #75c9ee;
    }

    &.medium {
      color: #ffb800;
    }

    &.high {
      color: #fe1842;
    }
  }

  .info-list-wrap {
    padding: 20px 15px;
  }

  .info-list-bottom {
    background-color: rgba(255, 255, 255, 0.04);
    border-radius: 30px;
    padding: 0 17px 10px 17px;
    margin-top: 10px;
  }

  .info-bottom {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 52px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .info-list-subitem {
    display: flex;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.6);
    line-height: 25px;
  }

  .info-list-value {
    font-weight: 700;
    color: white;
  }

  .info-list {
    background-color: rgba(255, 255, 255, 0.04);
    border-radius: 30px;
    padding: 0 17px 10px 17px;
    overflow-y: auto;
    height: 210px;
  }

  .info-list-item {
    display: flex;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.6);
    line-height: 25px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .info-list-name {
    flex: 1 1 auto;
    text-align: left;
  }

  .info-list-icon {
    padding-right: 12px;
    cursor: pointer;
  }

  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 1200px) {
    .stable-preview {
      padding: 30px 5px;
    }

    .item-value {
      font-size: 24px;
    }
  }

  @media (max-width: 600px) {
    .empty-wrap {
      padding: 20px 10px;
    }

    .item-value {
      font-size: 22px;
    }
  }

  @media (max-width: 375px) {
    .item-title {
      font-size: 16px;
    }

    .item-value {
      font-size: 16px;
    }
  }
}

.select-wrap {
  margin-bottom: 15px;
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

.input-address-wrap {
  padding-top: 10px;
  margin-bottom: 20px;
}

.input-address {
  width: 100%;
  height: 50px;
  background: rgba(129, 126, 166, 0.2);
  border: 1px solid #494661;
  border-radius: 12px;
  outline: none;
  padding: 12px 20px;
  color: #fff;
}

.error {
  border-color: #e54369;
}

.error-message {
  color: $clrError;
  font-size: 10px;
  margin-top: 5px;
  margin-left: 10px;
}

//--------

.borrow {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  margin: 0 auto;
  max-width: calc(100% - 20px);
  width: 95%;
  padding: 100px 0;
}

.primary-api {
  margin: 16px 0;
}

.borrow-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.deposit-block {
  padding: 30px 30px 50px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
  position: relative;
}

.ape-bg {
  background-position: center;
  background-size: cover;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.collateral-input {
  padding-top: 27px;
  padding-bottom: 24px;
}

.borrow-input {
  padding-bottom: 14px;
}

.deposit-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
  padding-bottom: 12px;
}

.deposit-info span {
  display: flex;
  align-items: center;
  line-height: 24px;
}

.tooltip-icon {
  margin-right: 5px;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.percent-wrap {
  padding: 30px 0;
}

.choose-link {
  position: absolute;
  bottom: 10px;
  right: 0;
  left: 0;
  margin: 0 auto;
}

.info-block {
  min-height: 520px;
  padding: 30px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
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

.title-ape {
  max-width: 27px;
  margin: 0 10px;
}

.btn-wrap {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-bottom: 30px;
}

.checkbox-wrap {
  background: #333141;
  border-radius: 20px;
  padding: 8px 16px;
  display: inline-flex;
  align-items: center;
  border: 2px solid transparent;
  cursor: pointer;

  &.active {
    border: 2px solid #8180ff;
  }

  .label-text {
    cursor: pointer;
  }

  .checkbox-img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
}

.info-wrap {
  margin-bottom: 20px;
}

@media (max-width: 1200px) {
  .borrow {
    grid-gap: 15px;
  }

  .info-block {
    padding: 30px 20px;
  }

  .deposit-block {
    padding: 30px 15px 50px;
  }
}

@media (max-width: 600px) {
  .borrow {
    grid-gap: 20px;
  }

  .collateral-input {
    padding: 20px 0 15px;
  }

  .choose-link {
    bottom: 15px;
  }

  .info-block {
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

    .default-button {
      padding: 0 10px;
    }
  }
}

@media (min-width: 1024px) {
  .borrow {
    grid-template-columns: 550px 1fr;
    width: 1320px;
  }

  .choose {
    padding: 30px;
  }
}

.loader {
  margin-left: 19px;
  position: relative;
  top: 2px;
  display: block;
  width: 10px;
  height: 30px;
  animation: rectangle infinite 1s ease-in-out -0.2s;

  background-color: #fff;
}
.loader:before,
.loader:after {
  position: absolute;

  width: 8px;
  height: 8px;

  content: "";

  background-color: #fff;
}
.loader:before {
  left: -10px;
  animation: rectangle infinite 1s ease-in-out -0.4s;
}
.loader:after {
  right: -10px;
  animation: rectangle infinite 1s ease-in-out;
}

@keyframes rectangle {
  0%,
  80%,
  100% {
    height: 6px;
  }
  40% {
    height: 8px;
  }
}

.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
