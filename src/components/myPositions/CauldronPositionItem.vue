<template>
  <div
    :class="['position', isDeprecated ? 'deprecated' : positionHealth.status]"
  >
    <div class="status-flag" v-if="isDeprecated">Deprecated</div>
    <div class="position-header">
      <div class="position-token">
        <TokenChainIcon
          class="token-chain-icon"
          size="54px"
          :name="collateralSymbol"
          :icon="cauldron.config.icon"
          :chainId="cauldron.config.chainId"
        />
        <div class="token-info">
          <span class="token-name">{{ collateralSymbol }}</span>
          <span class="apr" v-if="cauldron.apr">
            <Tooltip
              tooltip="Annualised Percentage Return Range given by the collateral."
            />
            APR {{ formatPercent(cauldron.apr) }}
          </span>
        </div>
      </div>

      <div class="links-wrap">
        <OrderButton
          v-if="cauldron && cauldron.hasActiveGmOrder"
          :cauldronObject="cauldron"
        />

        <router-link class="manage" :to="goToPage(cauldron)">
          Manage
        </router-link>
      </div>
    </div>

    <div class="position-info">
      <ul class="position-indicators">
        <PositionIndicator
          tooltip="Current dollar value of the Collateral Deposited."
          :value="collateralPrice"
        >
          Collateral price
        </PositionIndicator>

        <PositionIndicator
          tooltip="Collateral Price at which your deposited collateral is eligible for liquidation."
          :positionRisk="positionHealth.status"
          :value="cauldron.liquidationPrice"
        >
          Liquidation price
        </PositionIndicator>

        <PositionIndicator
          tooltip="Price drop of the collateral to be eligible for liquidation."
          :value="leftToDrop"
        >
          Required Drop in price
        </PositionIndicator>
      </ul>
      <HealthProgress
        :positionHealth="formatPercent(100 - positionHealth.percent)"
        :positionRisk="positionHealth.status"
        :key="`${cauldron.id} - ${cauldron.chainId}`"
      />
    </div>

    <PositionAssets :assetsInfo="assetsInfo" />
  </div>
</template>

<script>
import {
  formatUSD,
  formatTokenBalance,
  formatPercent,
} from "@/helpers/filters";
import { mapGetters } from "vuex";
import { ethers, utils } from "ethers";
import mimIcon from "@/assets/images/tokens/MIM.png";
import Tooltip from "@/components/ui/icons/Tooltip.vue";
import OrderButton from "@/components/myPositions/OrderButton.vue";
import TokenChainIcon from "@/components/ui/icons/TokenChainIcon.vue";
import PositionAssets from "@/components/myPositions/PositionAssets.vue";
import HealthProgress from "@/components/myPositions/HealthProgress.vue";
import PositionIndicator from "@/components/myPositions/PositionIndicator.vue";

import {
  PERCENT_PRESITION,
  getLiquidationPrice,
  getPositionHealth,
} from "@/helpers/cauldron/utils";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";

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
      return this.cauldron.chainId === 42161 && this.cauldron.config.id === 2
        ? this.cauldron.config?.wrapInfo?.unwrappedToken?.name
        : this.cauldron.config?.collateralInfo.name;
    },

    oracleRate() {
      return ethers.utils.formatUnits(
        this.cauldron.oracleRate,
        this.cauldron.config?.collateralInfo.decimals
      );
    },

    collateralPrice() {
      return 1 / this.oracleRate;
    },

    leftToDrop() {
      return +this.collateralPrice - +this.cauldron.liquidationPrice;
    },

    // TODO: move to position helper
    positionHealth() {
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const { decimals } = this.cauldron.config.collateralInfo;

      const { borrowInfo, collateralInfo } = this.cauldron;

      const expectedLiquidationPrice = getLiquidationPrice(
        borrowInfo.userBorrowAmount,
        collateralInfo.userCollateralAmount,
        this.cauldron.config.mcr,
        this.cauldron.config.collateralInfo.decimals
      );

      const { percent, status } = getPositionHealth(
        expectedLiquidationPrice,
        oracleExchangeRate,
        decimals
      );

      if (percent.gt(expandDecimals(100, PERCENT_PRESITION)))
        return { percent: 100, status };

      return { percent: utils.formatUnits(percent, PERCENT_PRESITION), status };
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

    isDeprecated() {
      if (this.cauldron.config.cauldronSettings)
        return this.cauldron.config.cauldronSettings.isDepreciated;
      return false;
    },
  },

  methods: {
    formatUSD,
    formatPercent,
    formatTokenBalance,

    goToPage(cauldron) {
      const { chainId, id } = cauldron.config;
      return {
        name: "Market",
        params: { chainId, cauldronId: id },
      };
    },
  },

  components: {
    PositionAssets,
    HealthProgress,
    PositionIndicator,
    Tooltip,
    TokenChainIcon,
    OrderButton,
  },
};
</script>

<style lang="scss" scoped>
.position {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 620px;
  min-height: 373px;
  padding: 24px;
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
  gap: 4px;
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

.links-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-left: auto;
}

.manage {
  height: 39px;
  color: #7088cc;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  padding: 8px 24px;
  gap: 10px;
  border-radius: 12px;
  border: 2px solid #7088cc;
  background: rgba(255, 255, 255, 0.01);
  cursor: pointer;
  transition: all 0.7s ease;
}

.manage:hover {
  border-color: #86a2f1;
  background: rgba(255, 255, 255, 0.05);
}

.position-info {
  display: flex;
  gap: 24px;
  margin-bottom: 15px;
}

.position-indicators {
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 14px;
  width: 100%;
}

.safe {
  border-color: #355237;
}

.medium {
  border-color: #77681e;
}

.high {
  border-color: #4a2130;
}

.deprecated {
  border-color: #8c4040;
}

.status-flag {
  height: 25px;
  width: 290px;
  max-width: 60%;
  padding: 2px 12px;
  margin: -25px 0 0 -25px;
  border-radius: 16px 0px;
  background: linear-gradient(180deg, #8c4040 0%, #6b2424 100%), #8c4040;
  text-align: center;
}

@media screen and (max-width: 700px) {
  .position-info {
    flex-direction: column-reverse;
  }

  .token-name {
    font-size: 20px;
  }

  .apr {
    font-size: 14px;
  }
}

@media screen and (max-width: 550px) {
  .token-chain-icon {
    width: 50px;
  }

  .links-wrap {
    width: 117px;
  }
}
</style>
