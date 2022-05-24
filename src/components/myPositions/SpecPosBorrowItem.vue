<template>
  <div class="pos-item">
    <div class="header">
      <div class="header-token">
        <BaseTokenIcon :name="pool.token.name" :icon="poolIcon" size="80px" />
        <div>
          <p class="header-token-title">{{ pool.token.name }}</p>
          <p class="header-token-price">
            1 {{ pool.token.name }} = {{ tokenToMim | formatToFixed(4) }}
            {{ pool.pairToken.name }}
          </p>
        </div>
      </div>

      <div class="header-content">
        <router-link
          v-for="(item, i) in openedItems"
          :key="i"
          class="header-opened-item"
          :to="{ name: item.name, params: { id: pool.id } }"
        >
          <img :src="item.icon" alt="Hammer" class="header-opened-img" />
          <p class="header-opened-title">{{ item.title }}</p>
        </router-link>
      </div>
    </div>
    <div class="lp-data">
      <div>
        <div class="lp-data-item">
          <div class="lp-data-title">Initial collateral deposited</div>
          <div class="lp-data-wrap">
            <div class="lp-data-info">
              <BaseTokenIcon
                :name="pool.token.name"
                :icon="initialIcon"
                size="50px"
              />
              <p class="lp-data-token">{{ pool.token.name }}</p>
            </div>
            <div class="lp-data-balance-wrap" v-if="pool.userInfo">
              <p class="lp-data-balance">
                {{ pool.userInfo.userCollateralShare | formatTokenBalance }}
              </p>
              <p class="lp-data-price">{{ initialInUsd | formatUSD }}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="lp-data-item">
          <div class="lp-data-title">Borrowed</div>
          <div class="lp-data-wrap">
            <div class="lp-data-info">
              <BaseTokenIcon
                :name="pool.pairToken.name"
                :icon="borrowedIcon"
                size="50px"
              />
              <p class="lp-data-token">{{ pool.pairToken.name }}</p>
            </div>
            <div class="lp-data-balance-wrap">
              <p class="lp-data-balance">
                {{ pool.userInfo.userBorrowPart | formatTokenBalance }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-if="opened">
      <div class="footer">
        <div class="footer-title">
          <p>Position health</p>
          <StatusName
            :isSafe="liquidationRisk > 75"
            :isMedium="liquidationRisk > 5 && liquidationRisk <= 75"
            :isHigh="liquidationRisk > 0 && liquidationRisk <= 5"
            :bordered="true"
          />
        </div>
        <div class="footer-range">
          <HealthLine
            :isSafe="liquidationRisk > 75"
            :isMedium="liquidationRisk > 5 && liquidationRisk <= 75"
            :isHigh="liquidationRisk > 0 && liquidationRisk <= 5"
            :percent="liquidationRisk"
          />
        </div>

        <p class="range-value">{{ liquidationRisk }}% of 100%</p>
        <div class="footer-list">
          <div
            v-for="(item, i) in valuesList"
            :key="i"
            class="footer-list-item"
          >
            <div class="footer-list-title">
              <img
                v-tooltip="item.tooltipText"
                class="info-img"
                src="@/assets/images/info.svg"
                alt="info"
              />

              <p>{{ item.title }}</p>
            </div>
            <p
              class="footer-list-value"
              :style="{ color: item.color || 'white' }"
            >
              {{ item.value }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Vue from "vue";
const HealthLine = () => import("@/components/ui/HealthLine");
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");
const StatusName = () => import("@/components/ui/StatusName");
const mimIcon = require("@/assets/images/tokens/MIM.png");

export default {
  name: "SpecPosBorrowItem",
  components: { HealthLine, BaseTokenIcon, StatusName },
  props: {
    opened: { type: Boolean, default: true },
    pool: { type: Object, required: true },
  },
  computed: {
    isDeleverageAccepted() {
      return this.pool.isSwappersActive && !!this.pool.reverseSwapContract;
    },
    openedItems() {
      const openedItems = [];

      const repayLink = {
        title: "Repay MIMs",
        icon: require("@/assets/images/myposition/Repay.png"),
        name: "RepayId",
      };

      openedItems.push(repayLink);

      // const removeLink = {
      //   title: "Remove Collateral",
      //   icon: require("@/assets/images/myposition/hammer.svg"),
      //   name: "RepayId",
      // };

      // openedItems.push(removeLink);

      const deleverageLink = {
        title: "Deleverage",
        icon: require("@/assets/images/myposition/Deleverage.png"),
        name: "DeleverageId",
      };

      if (this.isDeleverageAccepted) openedItems.push(deleverageLink);

      return openedItems;
    },
    initialInUsd() {
      return this.pool.userInfo.userCollateralShare / this.pool.tokenPrice;
    },
    tokenToMim() {
      return 1 / this.pool.tokenPrice;
    },
    poolIcon() {
      return this.pool.icon;
    },
    stableCoinMultiplayer() {
      return this.pool?.healthMultiplier;
    },
    tokenPrice() {
      return 1 / this.pool.tokenPrice;
    },
    liquidationRisk() {
      if (
        +this.pool.userInfo.userBorrowPart === 0 ||
        isNaN(this.liquidationPrice)
      )
        return 0;

      const riskPercent =
        ((this.minPrice * this.stableCoinMultiplayer) / this.tokenPrice) * 100;

      if (riskPercent > 100) {
        return 100;
      }

      return parseFloat(riskPercent).toFixed(2);
    },
    liquidationPrice() {
      return this.pool.userInfo.liquidationPrice;
    },
    minPrice() {
      return this.tokenPrice - this.liquidationPrice;
    },
    initialIcon() {
      return this.pool.icon;
    },
    borrowedIcon() {
      return mimIcon;
    },
    valuesList() {
      return [
        {
          title: "Liquidation price",
          tooltipText:
            "Collateral Price at which your Position will be Liquidated",
          value: Vue.filter("formatLiquidationPrice")(this.liquidationPrice),
        },
        {
          title: "Min price",
          tooltipText:
            "If your Collateral Price drops by this amount, you will be flagged for liquidation",
          value: Vue.filter("formatUSD")(this.minPrice),
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.pos-item {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  border-radius: 20px;
  padding: 18px 20px;

  .header {
    display: grid;
    grid-template-columns: 1fr;
    grid-row-gap: 20px;
    justify-content: space-between;
    align-items: center;
    min-height: 96px;
    box-sizing: content-box;

    &-content {
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;

      .header-opened-item {
        flex: 0 0 67px;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        height: 60px;
      }

      .header-opened-img {
        flex: 0 0 24px;
        width: 24px;
        height: 24px;
        box-sizing: content-box;
        padding: 9px;
        background-color: rgba(255, 255, 255, 0.06);
        border-radius: 10px;
      }
      .header-opened-title {
        margin-top: 8px;
        font-weight: 400;
        font-size: 10px;
        line-height: 100%;
        color: rgba(255, 255, 255, 0.4);
        text-align: center;
      }
    }

    &-token {
      display: flex;
      align-items: center;
      &-title {
        font-weight: 600;
        font-size: 18px;
        line-height: 27px;
      }
      &-price {
        font-weight: 400;
        font-size: 14px;
        line-height: 21px;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  .lp-data {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 37px;
    margin-top: 20px;

    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 20px 13px 20px 20px;

    &-item {
      display: grid;
      grid-template-rows: repeat(auto-fill, auto);
      grid-row-gap: 10px;
    }

    &-title {
      font-weight: 400;
      font-size: 18px;
      color: rgba(255, 255, 255, 0.8);
    }

    &-wrap {
      display: flex;
      justify-content: space-between;
    }

    &-info {
      display: flex;
      align-items: center;
    }

    &-icon {
      width: 50px;
    }

    &-token {
      font-weight: 400;
      font-size: 18px;
      text-transform: uppercase;
    }

    &-balance-wrap {
      text-align: right;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 400;
    }
    &-balance {
      font-size: 16px;
      line-height: 24px;
    }
    &-price {
      font-size: 12px;
      line-height: 18px;
    }
  }
  .footer {
    padding-top: 20px;

    &-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 400;
      font-size: 18px;
      line-height: 27px;
      color: rgba(255, 255, 255, 0.8);
    }
    .range-value {
      margin-top: 7px;
      text-align: right;
    }
    &-range {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 20px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
    }

    &-list {
      margin-top: 14px;

      &-item {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 0;

        &:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 32px;
          right: 32px;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.1);
        }
      }

      &-title {
        display: flex;
        align-items: center;
        color: rgba(255, 255, 255, 0.8);
        font-weight: 400;
        font-size: 18px;
        line-height: 27px;
      }
      &-value {
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;
      }
      .info-img {
        width: 20px;
        margin-right: 12px;
      }
    }
  }
}

@media (min-width: 640px) {
  .header {
    grid-template-columns: 1fr auto !important;
  }
}
@media (min-width: 1024px) {
  .lp-data {
    grid-template-columns: 1fr 1fr !important;
  }
}
</style>
