<template>
  <div :class="['position', positionRisk]">
    <div class="position-header">
      <div class="position-token">
        <TokenChainIcon
          size="54px"
          :name="collateralSymbol"
          :icon="cauldron.config.icon"
          :chainId="cauldron.config.chainId"
        />
        <div class="token-info">
          <span class="token-name">{{ collateralSymbol }}</span>
          <span class="apr">
            <Tooltip />
            {{ formatPercent(cauldron.apr) }}
          </span>
        </div>
      </div>

      <button class="manage">Manage</button>
    </div>

    <div class="position-info">
      <ul class="position-indicators">
        <PositionIndicator :value="collateralPrice"
          >Collateral price</PositionIndicator
        >
        <PositionIndicator
          :positionRisk="positionRisk"
          :value="cauldron.liquidationPrice"
          >Liquidation price</PositionIndicator
        >
        <PositionIndicator :value="leftToDrop"
          >Required Drop in price</PositionIndicator
        >
      </ul>
      <HealthProgress
        :positionHealth="formatPercent(cauldron.positionHealth)"
        :positionRisk="positionRisk"
      />
    </div>

    <PositionAssets :assetsInfo="assetsInfo" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import mimIcon from "@/assets/images/tokens/MIM.png";
import PositionAssets from "@/components/myPositions/PositionAssets.vue";
import HealthProgress from "@/components/myPositions/HealthProgress.vue";
import OrdersManager from "@/components/borrow/OrdersManager.vue";
import { ethers } from "ethers";
import { useImage } from "@/helpers/useImage";

import PositionIndicator from "@/components/myPositions/PositionIndicator.vue";
import Tooltip from "@/components/ui/icons/Tooltip.vue";
import TokenChainIcon from "@/components/ui/icons/TokenChainIcon.vue";

export default {
  props: {
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

    positionRisk() {
      if (
        this.cauldron.positionHealth >= 0 &&
        this.cauldron.positionHealth <= 5
      )
        return "high";
      if (
        this.cauldron.positionHealth > 5 &&
        this.cauldron.positionHealth <= 75
      )
        return "medium";
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
    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },

    formatUSD(value) {
      return filters.formatUSD(value);
    },

    formatPercent(value) {
      return filters.formatPercent(value);
    },
  },

  components: {
    PositionAssets,
    HealthProgress,
    OrdersManager,

    PositionIndicator,
    Tooltip,
    TokenChainIcon,
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
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  color: white;
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
  color: #fff;
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 16px;
  font-weight: 600;
}

.manage {
  color: #7088cc;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 24px;
  gap: 10px;
  border-radius: 12px;
  border: 2px solid #7088cc;
  background: rgba(255, 255, 255, 0.01);
  transition: opacity 0.7s ease;
}

.manage:hover {
  opacity: 0.7;
  cursor: pointer;
}

.position-info {
  display: flex;
  gap: 24px;
}

.position-indicators {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}

.safe {
  border-color: #67a069;
}

.medium {
  border-color: #ddc237;
}

.high {
  border-color: #8c4040;
}
</style>
