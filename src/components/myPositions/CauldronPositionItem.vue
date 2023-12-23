<template>
  <div class="position">

    <div class="position-header">
      <div class="position-token">
        <div class="token-icon">
          <BaseTokenIcon size="54px" />
          <img class="token-chain" :src="getChainIcon(1)" />
        </div>
        <div class="token-info">
          <span class="token-name">MIM-2Crv</span>
          <span class="apr">
            <Tooltip />
            APR 101.82%
          </span>
        </div>
      </div>

      <button class="manage">Manage</button>
    </div>

    <div class="position-info">
      <ul class="position-indicators">
        <PositionIndicator :value="0.54">Collateral price</PositionIndicator>
        <PositionIndicator positionRisk="high" :value="0.54">Liquidation price</PositionIndicator>
        <PositionIndicator :value="0.54">Required Drop in price</PositionIndicator>
      </ul>
      <HealthProgress />
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import mimIcon from "@/assets/images/tokens/MIM.png";
import PositionTokensInfo from "@/components/myPositions/PositionTokensInfo.vue";
import PositionLinks from "@/components/myPositions/PositionLinks.vue";
import PositionLiquidationPrice from "@/components/myPositions/PositionLiquidationPrice.vue";
import PositionAssets from "@/components/myPositions/PositionAssets.vue";
import HealthProgress from "@/components/myPositions/HealthProgress.vue";
import OrdersManager from "@/components/borrow/OrdersManager.vue";
import { ethers } from "ethers";
import { useImage } from "@/helpers/useImage";

import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue"
import BaseButton from "@/components/base/BaseButton.vue"
import PositionIndicator from "@/components/myPositions/PositionIndicator.vue"
import Tooltip from "@/components/ui/icons/Tooltip.vue"
import { getChainIcon } from "@/helpers/chains/getChainIcon"

export default {
  props: {
    opened: { type: Boolean, default: true },
    cauldron: { type: Object },
  },

  data() {
    return {
      tooltipText:
        "If your Collateral Price drops by this amount, you will be flagged for liquidation",
    };
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    collateralSymbol() {
      return this.chainId === 42161 && this.cauldron.config.id === 2
        ? this.cauldron.config?.wrapInfo?.unwrappedToken?.name
        : this.cauldron.config.collateralInfo.name;
    },

    oracleRate() {
      return ethers.utils.formatUnits(
        this.cauldron.oracleRate,
        this.cauldron.config.collateralInfo.decimals
      );
    },

    collateralPrice() {
      return 1 / this.oracleRate;
    },

    leftToDrop() {
      return +this.collateralPrice - +this.cauldron.liquidationPrice;
    },

    positionHealth() {
      const { liquidationPrice } = this.cauldron;
      const { healthMultiplier } = this.cauldron.config.cauldronSettings;
      const { userBorrowAmount } = this.cauldron.borrowInfo;

      if (userBorrowAmount.toString() === "0" || isNaN(+liquidationPrice))
        return 100;

      const priceToDrop = this.leftToDrop * healthMultiplier;
      const percent = (priceToDrop / this.collateralPrice) * 100;
      if (percent > 100) return 100;
      if (percent < 0) return 0;
      return parseFloat(percent).toFixed(2);
    },

    positionRisk() {
      if (this.positionHealth >= 0 && this.positionHealth <= 5) return "high";
      if (this.positionHealth > 5 && this.positionHealth <= 75) return "medium";
      return "safe";
    },

    userCollateralAmount() {
      return ethers.utils.formatUnits(
        this.cauldron.collateralInfo.userCollateralAmount,
        this.cauldron.config.collateralInfo.decimals
      );
    },

    userCollateralAmountUsd() {
      return this.userCollateralAmount / this.oracleRate;
    },

    userBorrowAmount() {
      return ethers.utils.formatUnits(
        this.cauldron.borrowInfo.userBorrowAmount,
        this.cauldron.config.mimInfo.decimals
      );
    },

    positionActions() {
      const defaultActions = [
        {
          title: "Add Collateral/ Borrow MIM",
          icon: useImage("assets/images/myposition/AddCollateral.png"),
          name: "BorrowId",
          id: this.cauldron.config.id,
        },
        {
          title: "Repay MIMs/ Remove Collateral",
          icon: useImage("assets/images/myposition/Repay.png"),
          name: "RepayId",
          id: this.cauldron.config.id,
        },
      ];

      if (this.cauldron.config.cauldronSettings.isSwappersActive) {
        const deleverageLink = {
          title: "Deleverage",
          icon: useImage("assets/images/myposition/Deleverage.png"),
          name: "DeleverageId",
          id: this.cauldron.config.id,
        };

        defaultActions.push(deleverageLink);
      }

      return defaultActions;
    },

    assetsInfo() {
      return [
        {
          title: "Collateral Deposited",
          symbol: this.collateralSymbol,
          icon: this.cauldron.config.icon,
          amount: this.formatTokenBalance(this.userCollateralAmount),
          amountUsd: this.formatUSD(this.userCollateralAmountUsd),
        },
        {
          title: "Borrowed",
          symbol: this.cauldron.config.mimInfo.name,
          icon: mimIcon,
          amount: this.formatTokenBalance(this.userBorrowAmount),
        },
      ];
    },
  },

  methods: {
    getChainIcon,

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },

    formatUSD(value) {
      return filters.formatUSD(value);
    },
  },

  components: {
    PositionTokensInfo,
    PositionLinks,
    PositionLiquidationPrice,
    PositionAssets,
    HealthProgress,
    OrdersManager,

    BaseTokenIcon,
    PositionIndicator,
    BaseButton,
    Tooltip
  },
};
</script>

<style lang="scss" scoped>
.position {
  display: flex;
  width: 628px;
  padding: 24px;
  flex-direction: column;
  gap: 15px;
  border-radius: 16px;
  border: 1px solid #223667;
  background: linear-gradient(146deg, rgba(0, 10, 35, 0.07) 0%, rgba(0, 80, 156, 0.07) 101.49%);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.position-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.position-token {
  display: flex;
  align-items: center;
}

.token-icon {
  position: relative;
}

.token-chain {
  position: absolute;
  top: -4px;
  right: 4px;
  width: 15px;
  height: 15px;
}

.token-info {
  display: flex;
  flex-direction: column;
}

.token-name {
  color: #fff;
  font-size: 24px;
  font-weight: 500;
}

.apr {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #FFF;
  text-shadow: 0px 0px 16px #AB5DE8;
  font-size: 16px;
  font-weight: 600;
}

.manage {
  color: #7088CC;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 24px;
  gap: 10px;
  border-radius: 12px;
  border: 2px solid #7088CC;
  background: rgba(255, 255, 255, 0.01);
  transition: opacity 0.7s ease;
}

.manage:hover {
  opacity: 0.7;
  cursor: pointer;
}

.position-info{
  display: flex;
  gap: 24px;
}

.position-indicators{
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}
</style>
