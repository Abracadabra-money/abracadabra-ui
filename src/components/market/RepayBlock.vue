<template>
  <div>
    <div class="row">
      <h3 class="title">Repay MIM</h3>

      <Toggle
        v-if="isDeleverageAllowed"
        :selected="useDeleverage"
        text="Deleverge"
        @updateToggle="onToggleDeleverage"
      />
    </div>

    <h4 class="subtitle">Select the amount of MIM to Repay</h4>
  </div>
  <BaseTokenInput
    :value="inputValue"
    :name="borrowToken.name"
    :icon="borrowToken.icon"
    :max="maxToRepay"
    :decimals="borrowToken.decimals"
    :tokenPrice="borrowToken.price"
    isBigNumber
    primary-max
    @updateInputValue="onUpdateRepayValue"
  />
</template>

<script lang="ts">
import { BigNumber, utils } from "ethers";
import { trimZeroDecimals } from "@/helpers/numbers";
import { defineAsyncComponent, type PropType } from "vue";
import type { CauldronInfo } from "@/helpers/cauldron/types";

const MIM_PRICE = 1;

export default {
  emits: ["updateRepayAmount", "updateToggle"],

  props: {
    cauldron: {
      type: Object as PropType<CauldronInfo>,
      required: true,
    },
    inputAmount: {
      type: BigNumber,
      default: BigNumber.from(0),
    },
    withdrawAmount: {
      type: BigNumber,
      default: BigNumber.from(0),
    },
    useDeleverage: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      inputValue: "",
    };
  },

  computed: {
    isDeleverageAllowed(): boolean {
      const { isSwappersActive } = this.cauldron.config.cauldronSettings;

      return isSwappersActive && this.cauldron.contracts.liquidationSwapper;
    },

    borrowToken() {
      const { config } = this.cauldron;
      return {
        name: config.mimInfo.name,
        icon: config.mimInfo.icon,
        balance: this.cauldron.userTokensInfo?.mimBalance || BigNumber.from(0),
        decimals: 18,
        price: MIM_PRICE,
      };
    },

    maxToRepay() {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const mimBalance =
        this.cauldron.userTokensInfo?.mimBalance || BigNumber.from(0);
      return userBorrowAmount.gt(mimBalance) ? mimBalance : userBorrowAmount;
    },
  },

  watch: {
    inputAmount(value: BigNumber) {
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

    onToggleDeleverage() {
      this.$emit("updateToggle", "useDeleverage", true);
    },
  },

  components: {
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
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
