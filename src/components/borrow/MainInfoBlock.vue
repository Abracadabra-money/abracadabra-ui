<template>
  <div class="main-info-list">
    <div class="info-item" v-for="(item, i) in info" :key="i">
      <span class="item-name">
        <img
          class="info-tooltip"
          src="@/assets/images/info.svg"
          alt="info"
          v-tooltip="item.tooltip"
        />
        {{ item.name }}:
      </span>
      <span class="item-value">
        {{ item.value }}{{ item.name !== "Price" ? "%" : "" }}
      </span>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import { mapGetters } from "vuex";
import { getGlpApy } from "@/helpers/collateralsApy/getGlpApy";
import { getVeloManagementFee } from "@/helpers/collateralsApy/getVeloApy";
import { utils } from "ethers";

export default {
  props: {
    cauldron: {
      type: Object,
    },
  },

  data() {
    return {
      veloManagementFee: null,
      tokenApy: null,
    };
  },

  computed: {
    ...mapGetters({ chainId: "getChainId", signer: "getSigner" }),

    isGlpPool() {
      return this.chainId === 42161 && this.cauldron?.config.id === 2;
    },

    isVelodrome() {
      return this.chainId === 10 && this.cauldron?.config.id === 1;
    },

    isCollateralInterest() {
      return (
        this.chainId === 1 &&
        (this.cauldron?.config.id === 28 || this.cauldron?.config.id === 27)
      );
    },

    collateralToMim() {
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const { name, collateralInfo } = this.cauldron.config;
      const rate = utils.formatUnits(
        oracleExchangeRate,
        collateralInfo.decimals
      );
      const collateralToMim = 1 / rate;
      const decimals = name === "SHIB" ? 6 : 4;
      return filters.formatToFixed(collateralToMim, decimals);
    },

    info() {
      const { feePercent } = this.cauldron.additionalInfo;

      const info = [
        {
          name: "Maximum collateral ratio",
          value: this.cauldron.config.mcr,
          tooltip:
            "Maximum collateral ratio (MCR) - MCR represents the maximum amount of debt a user can borrow with a selected collateral token.",
        },
        {
          name: "Liquidation fee",
          value: this.cauldron.mainParams.liquidationFee,
          tooltip:
            "This is the discount a liquidator gets when buying collateral flagged for liquidation.",
        },
      ];

      const borrowFee = {
        name: "Borrow fee",
        value: this.cauldron.mainParams.borrowFee,
        tooltip: "This fee is added to your debt every time you borrow MIM.",
      };

      if (this.isVelodrome && this.veloManagementFee) {
        info.push({
          name: "Management fee",
          value: this.veloManagementFee,
          tooltip:
            "Percentage taken from rewards farmed through the Degenbox Strategy, as autocompounding fee.",
        });
      } else {
        info.push(borrowFee);
      }

      let interestText =
        "This is the annualized percent that your debt will increase each year.";
      if (this.isCollateralInterest)
        interestText =
          "This is the annualized percent that your collateral will decrease each year.";

      info.push({
        name: "Interest",
        value: this.cauldron.mainParams.interest,
        tooltip: interestText,
      });

      if (this.isGlpPool) {
        info.push({
          name: "Repayment Rate",
          value: `${this.tokenApy || 0}`,
          tooltip: `The approximate rate at which users borrowed MIM will diminsh, thanks to GLP rewards.`,
        });

        info.push({
          name: "Management Fee",
          value: `${feePercent || 0}`,
          tooltip: `Percentage of rewards taken by the protocol when harvesting WETH rewards. This value changes dynamically to ensure a 15% APR for Abracadabra.`,
        });
      }

      if (this.collateralToMim) {
        info.push({
          name: "Price",
          value: filters.formatExactPrice(this.collateralToMim),
          tooltip: "Price of one collateral token",
        });
      }

      return info;
    },
  },

  watch: {
    async cauldron() {
      if (this.isGlpPool) this.tokenApy = await getGlpApy();
    },
  },

  async created() {
    if (this.isGlpPool) this.tokenApy = await getGlpApy();

    if (this.isVelodrome)
      this.veloManagementFee = await getVeloManagementFee(
        this.cauldron,
        this.signer
      );
  },
};
</script>

<style lang="scss" scoped>
.info-item {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.item-name,
.item-value {
  display: flex;
  align-items: center;
}

.info-tooltip {
  margin-right: 5px;
  cursor: pointer;
}
</style>
