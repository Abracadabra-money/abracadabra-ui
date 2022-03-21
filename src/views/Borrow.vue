<template>
  <div class="borrow">
    <div class="choose">
      <h4>Choose Chain</h4>
      <div class="underline">
        <NetworksList />
      </div>

      <div class="first-input underline">
        <div class="header-balance">
          <h4>Collateral assets</h4>
          <p v-if="selectedPool">
            {{ collateralBalance }}
          </p>
        </div>

        <ValueInput
          :icon="selectedPool ? selectedPool.icon : null"
          :name="selectedPool ? selectedPool.name : null"
          v-model="inputValue"
          :max="selectedPool ? collateralBalance : 0"
          :error="collateralError"
          isChooseToken
          @openTokensList="isTokensOpened = true"
          @input="changeInput"
        />
      </div>
      <div class="second-input underline">
        <div class="header-balance">
          <h4>MIM to Borrow</h4>
        </div>
        <ValueInput
          :icon="require('@/assets/images/tokens-icon/Token_MIM.svg')"
          name="MIM"
        />
      </div>

      <div class="ltv underline" v-if="selectedPool">
        <span>LTV</span>
        <span>{{ selectedPool.ltv }} %</span>
      </div>
    </div>
    <StableCoins />

    <PopupWrap v-model="isTokensOpened" maxWidth="400px" height="600px">
      <SelectPoolPopup
        @select="selectedPool = $event"
        @close="isTokensOpened = false"
        :pools="pools"
    /></PopupWrap>
  </div>
</template>

<script>
const NetworksList = () => import("@/components/ui/NetworksList");
const ValueInput = () => import("@/components/UIComponents/ValueInput");
const StableCoins = () => import("@/components/borrow/StableCoins");
const PopupWrap = () => import("@/components/ui/PopupWrap");
const SelectPoolPopup = () => import("@/components/popups/SelectPoolPopup");
import borrowPoolsMixin from "@/mixins/borrowPools.js";

import { mapGetters } from "vuex";
export default {
  mixins: [borrowPoolsMixin],
  data() {
    return {
      firstTokenIndex: 0,
      firstTokenValue: null,
      isTokensOpened: false,
      selectedPool: null,
      inputValue: null,
      collateralValue: null,
    };
  },
  computed: {
    ...mapGetters({ pools: "getPools" }),
    collateralError() {
      if (this.selectedPool) {
        if (this.collateralValue > this.collateralBalance) {
          return `The value cannot be greater than ${this.collateralBalance}`;
        } else {
          return null;
        }
      }

      return null;
    },
    collateralBalance() {
      return this.$ethers.utils.formatUnits(
        this.selectedPool.userInfo.userBalance
      );
    },
  },

  methods: {
    changeInput(value) {
      this.collateralValue = value;
      console.log(value);
    },
  },

  components: {
    NetworksList,
    ValueInput,
    StableCoins,
    PopupWrap,
    SelectPoolPopup,
  },
};
</script>

<style lang="scss" scoped>
.borrow {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  margin: 0 auto;
  width: 100%;
  padding: 160px 0;
}

// choose
.choose {
  padding: 20px 16px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
}

.first-input {
  padding-top: 27px;
  padding-bottom: 24px;
}

.second-input {
  padding-top: 27px;
  padding-bottom: 14px;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ltv {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
  padding-bottom: 12px;
}

@media (min-width: 1024px) {
  .choose {
    padding: 30px;
  }
}
// end choose

@media (min-width: 1024px) {
  .borrow {
    grid-template-columns: 550px 1fr;
    width: 1320px;
    max-width: 100%;
  }
}
</style>
