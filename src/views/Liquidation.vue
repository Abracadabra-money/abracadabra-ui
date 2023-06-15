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
                :icon="mainValueTokenName"
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

          <div
            class="checkbox-wrap"
            v-if="selectedPool"
            :class="{ active: useCheckBox }"
            @click="toggleCheckBox"
          >
            <img
              class="checkbox-img"
              src="@/assets/images/checkbox/active.svg"
              alt=""
              v-if="useCheckBox"
            />
            <img
              class="checkbox-img"
              src="@/assets/images/checkbox/default.svg"
              alt=""
              v-else
            />

            <p class="label-text">Max</p>
          </div>
        </div>

        <div class="borrow-input underline" v-if="selectedPool">
          <div class="input-address-wrap">
            <input
              class="input-address"
              :class="{ error: inputAddressError }"
              v-model="destinationAddress"
              type="text"
              placeholder="Add address"
            />
            <p class="error-message">
              <span v-if="inputAddressError">Invalid address</span>
              <span v-else>&nbsp;</span>
            </p>
          </div>

          <BaseTokenInput
            :name="borrowToken.name"
            :icon="borrowToken.icon"
            :value="borrowValue"
            :max="maxBorrowValue"
            :error="borrowError"
            :disabled="!selectedPool"
            @updateValue="updateBorrowValue"
          />
        </div>

        <router-link class="link choose-link" :to="{ name: 'MyPositions' }"
          >Go to Positions</router-link
        >
      </div>

      <div class="info-block">
        <h1 class="title">Borrow MIM</h1>

        <LiquidationStand
          :pool="selectedPool"
          :collateralExpected="collateralValue"
          :mimExpected="mimExpected"
          :liquidationPrice="depositExpectedLiquidationPrice"
          :emptyData="emptyData"
          :poolId="selectedPoolId"
        />

        <div class="btn-wrap">
          <BaseButton v-if="selectedPool" @click="actionHandler" primary
            >Liquidation
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
        :pools="filteredPool"
        popupType="cauldron"
    /></LocalPopupWrap>
  </div>
</template>

<script>
import NetworksList from "@/components/ui/NetworksList.vue";
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import LiquidationStand from "@/components/liquidation/LiquidationStand.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseLoader from "@/components/base/BaseLoader.vue";
import LocalPopupWrap from "@/components/popups/LocalPopupWrap.vue";
import MarketsListPopup from "@/components/popups/MarketsListPopup.vue";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import cauldronsMixin from "@/mixins/borrow/cauldrons.js";
import cookMixin from "@/mixins/borrow/cooksV2.js";
import { mapGetters } from "vuex";

export default {
  mixins: [cauldronsMixin, cookMixin],
  data() {
    return {
      collateralValue: "",
      borrowValue: "",
      poolId: null,
      isOpenPollPopup: false,
      useDefaultBalance: false,
      updateInterval: null,
      emptyData: {
        img: this.$image(`assets/images/empty_borrow.png`),
        text: "Choose the asset and amount you want to use as collateral as well as the amount of MIM you want to Borrow",
        bottom: "If you want to learn more read our docs",
        link: "https://abracadabramoney.gitbook.io/intro/lending-markets",
      },
      useCheckBox: false,
    };
  },

  computed: {
    ...mapGetters({
      pools: "getPools",
      account: "getAccount",
    }),

    filteredPool() {
      if (this.account && this.pools[0]?.userInfo) {
        return this.pools
          .filter((pool) => !pool.cauldronSettings.isDepreciated)
          .sort((a, b) =>
            a.userInfo.balanceUsd < b.userInfo.balanceUsd ? 1 : -1
          );
      }

      return this.pools.filter((pool) => !pool.cauldronSettings.isDepreciated);
    },

    selectedPool() {
      if (this.poolId) {
        let pool = this.$store.getters.getPoolById(+this.poolId);
        if (pool) return pool;
        return null;
      }
      return null;
    },

    borrowToken() {
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

    collateralError() {
      if (isNaN(this.collateralValue)) return "Please input valid value";

      if (
        parseFloat(this.collateralValue) > parseFloat(this.maxCollateralValue)
      )
        return `The value cannot be greater than ${this.maxCollateralValue}`;

      return "";
    },

    borrowError() {
      if (isNaN(this.borrowValue)) return "Please input valid value";

      if (parseFloat(this.borrowValue) > parseFloat(this.maxBorrowValue))
        return `The value cannot be greater than ${this.maxBorrowValue}`;

      return "";
    },

    isLpLogic() {
      return !!this.selectedPool.lpLogic;
    },

    maxCollateralValue() {
      if (this.selectedPool?.userInfo && this.account) {
        if (this.isLpLogic && !this.useCheckBox) {
          return this.$ethers.utils.formatUnits(
            this.selectedPool.userInfo.lpInfo.balance,
            this.selectedPool.lpLogic.lpDecimals
          );
        }

        if (this.useDefaultBalance) {
          return this.$ethers.utils.formatUnits(
            this.selectedPool.userInfo.networkBalance,
            this.selectedPool.collateralToken.decimals
          );
        }

        return this.$ethers.utils.formatUnits(
          this.selectedPool.userInfo.userBalance,
          this.selectedPool.collateralToken.decimals
        );
      }

      return 0;
    },

    maxBorrowValue() {
      if (this.selectedPool?.userInfo && this.account) {
        let valueInDolars;
        let maxPairValue;

        if (this.collateralValue) {
          valueInDolars =
            this.collateralValue / this.selectedPool.borrowToken.exchangeRate;
          maxPairValue = (valueInDolars / 100) * (this.selectedPool.ltv - 1);
        } else {
          valueInDolars =
            this.selectedPool.userInfo.userCollateralShare /
            this.selectedPool.borrowToken.exchangeRate;
          maxPairValue =
            (valueInDolars / 100) * (this.selectedPool.ltv - 1) -
            this.selectedPool.userInfo?.userBorrowPart;
        }

        if (maxPairValue < 0) {
          return 0;
        }

        return maxPairValue;
      }

      return 0;
    },

    actionBtnText() {
      if (!this.isTokenApprove) return "Nothing to do";

      if (+this.collateralValue > 0) return "Nothing to do";

      if (this.collateralError || this.borrowError) return "Nothing to do";

      if (
        +this.borrowValue > 0 &&
        +this.collateralValue > 0 &&
        !this.collateralError &&
        !this.borrowError
      )
        return "Add collateral and borrow";

      if (
        +this.collateralValue > 0 &&
        !this.collateralError &&
        !this.borrowError
      )
        return "Add collateral";

      if (+this.borrowValue > 0 && !this.collateralError && !this.borrowError)
        return "Borrow";

      return "Nothing to do";
    },

    mimExpected() {
      if (!this.borrowError) return this.borrowValue;

      return 0;
    },

    depositExpectedLiquidationPrice() {
      if (this.selectedPool && this.account) {
        return (
          +this.depositExpectedBorrowed /
            +this.depositExpectedCollateral /
            this.liquidationMultiplier || 0
        );
      }
      return 0;
    },

    depositExpectedBorrowed() {
      if (this.borrowError || this.collateralError)
        return +this.selectedPool.userInfo?.userBorrowPart;
      return +this.borrowValue + +this.selectedPool.userInfo?.userBorrowPart;
    },

    depositExpectedCollateral() {
      if (this.borrowError || this.collateralError)
        return +this.selectedPool.userInfo?.userCollateralShare;
      return (
        +this.collateralValue + +this.selectedPool.userInfo?.userCollateralShare
      );
    },

    liquidationMultiplier() {
      return this.selectedPool.ltv / 100;
    },

    followLink() {
      return !!(this.$route.params.id && !this.pools.length);
    },

    networkValuteName() {
      if (this.chainId === 1) return "ETH";
      if (this.chainId === 250) return "FTM";
      if (this.chainId === 137) return "MATIC";
      if (this.chainId === 43114) return "AVAX";
      if (this.chainId === 42161) return "ETH";
      if (this.chainId === 56) return "BNB";

      return false;
    },

    mainValueTokenName() {
      if (this.selectedPool) {
        if (this.networkValuteName === "FTM" && this.useDefaultBalance)
          return this.$image(
            `assets/images/tokens/${this.networkValuteName}2.png`
          );

        return this.selectedPool.icon;
      }
      return "";
    },

    mainTokenFinalText() {
      if (this.selectedPool) {
        if (this.networkValuteName && this.useDefaultBalance)
          return this.networkValuteName;

        if (this.selectedPool.lpLogic && !this.useCheckBox)
          return this.selectedPool.lpLogic.name;

        return this.selectedPool.collateralToken.name;
      }
      return "";
    },

    isTokenApprove() {
      if (this.selectedPool && this.selectedPool.userInfo && this.account) {
        if (this.isLpLogic && !this.useCheckBox)
          return this.selectedPool.userInfo.lpInfo.isApprove;

        return this.selectedPool.userInfo.isApproveTokenCollateral;
      }

      return true;
    },

    ltv() {
      if (this.selectedPool) {
        return this.selectedPool.ltv;
      }
      return 0;
    },

    selectedPoolId() {
      if (this.selectedPool) return this.selectedPool.id;

      return null;
    },
  },

  watch: {
    account() {
      this.createPools();
    },

    pools() {
      if (this.poolId) {
        let pool = this.$store.getters.getPoolById(+this.poolId);
        if (!pool) this.$router.push(`/borrow`);
      }

      return false;
    },
  },

  methods: {
    updateBorrowValue(value) {
      this.borrowValue = value;
    },

    async chosePool(pool) {
      this.clearData();
      this.poolId = pool.id;
      let duplicate = this.$route.fullPath === `/borrow/${pool.id}`;

      if (!duplicate) {
        this.$router.push(`/liquidation/${pool.id}`);
      }
    },

    async actionHandler() {
      console.log("actionHandler");
    },

    clearData() {
      this.collateralValue = "";
      this.borrowValue = "";
    },

    toggleCheckBox() {
      this.clearData();
      this.useCheckBox = !this.useCheckBox;
    },
  },

  created() {
    this.poolId = this.$route.params.id;

    this.updateInterval = setInterval(async () => {
      this.createPools();
    }, 15000);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    NetworksList,
    BaseTokenInput,
    LiquidationStand,
    BaseButton,
    BaseLoader,
    LocalPopupWrap,
    MarketsListPopup,
    BaseTokenIcon,
  },
};
</script>

<style lang="scss" scoped>
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
  margin-bottom: 30px;
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
  padding-top: 27px;
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
</style>
