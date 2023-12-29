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

  <DynamicallyEstimatedPrice
    :isClose="true"
    :amount="inputValue"
    :cauldron="cauldron"
  />
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
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
  },
};
</script>

<style lang="scss" scoped>
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
</style>
