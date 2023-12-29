<template>
  <div>
    <div class="row">
      <h3 class="title">Repay MIM</h3>
    </div>

    <h4 class="subtitle">Select the amount of MIM to repay</h4>
  </div>
  <TokenInput
    :value="inputValue"
    :name="borrowToken.name"
    :icon="borrowToken.icon"
    :max="maxToRepay"
    :decimals="borrowToken.decimals"
    :tokenPrice="borrowToken.price"
    isBigNumber
    @updateInputValue="onUpdateRepayValue"
  />

  <div class="dynamic-wrap">
    <DynamicallyEstimatedPrice
      v-if="chainId !== 2222"
      :isClose="true"
      :amount="inputValue"
      :mimAddress="cauldron.config.mimInfo.address"
    />

    <GmPriceImpact />
  </div>
</template>

<script lang="ts">
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
// @ts-ignore
import { mapGetters } from "vuex";
import { trimZeroDecimals } from "@/helpers/numbers";
const MIM_PRICE = 1;

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
    inputAmount: {
      type: BigNumber,
    },
    withdrawAmount: {
      type: BigNumber,
    },
  },

  emits: ["updateRepayAmount"],

  data() {
    return {
      inputValue: "",
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    borrowToken() {
      const { config, userTokensInfo } = this.cauldron;
      return {
        name: config.mimInfo.name,
        icon: config.mimInfo.icon,
        balance: userTokensInfo.mimBalance,
        decimals: 18,
        price: MIM_PRICE,
      };
    },

    maxToRepay() {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const { mimBalance } = this.cauldron.userTokensInfo;
      return userBorrowAmount.gt(mimBalance) ? mimBalance : userBorrowAmount;
    },
  },

  watch: {
    inputAmpunt(value) {
      if (value.eq(0)) {
        this.inputValue = "";
        return false;
      }

      this.inputValue = trimZeroDecimals(utils.formatUnits(value));
    },
  },

  methods: {
    setEmptyState() {
      this.$emit("updateRepayAmount", BigNumber.from(0));
      this.inputValue = "";
    },

    onUpdateRepayValue(value: BigNumber | null) {
      if (value === null) return this.setEmptyState();
      this.$emit("updateRepayAmount", value);
    },
  },

  components: {
    TokenInput: defineAsyncComponent(
      () => import("@/components/market/TokenInput.vue")
    ),
    DynamicallyEstimatedPrice: defineAsyncComponent(
      () => import("@/components/market/DynamicallyEstimatedPrice.vue")
    ),
    GmPriceImpact: defineAsyncComponent(
      () => import("@/components/market/GmPriceImpact.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.market-actions-wrap {
  @include font;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 410px;
  width: 100%;
}

.deposit-wrap {
  @include block-wrap;
}

.borrow-wrap {
  @include block-wrap;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 370px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.title {
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
}

.subtitle {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
}

.dynamic-fee {
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dynamic-fee-title {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  display: flex;
  gap: 4px;
  align-items: center;
}

.dynamic-fee-value {
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  text-transform: uppercase;
}

.dynamic-wrap {
  display: flex;
  padding: 5px 12px;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
}
</style>
