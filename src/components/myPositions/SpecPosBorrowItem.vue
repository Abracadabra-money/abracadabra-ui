<template>
  <div class="pos-item">
    <div class="header">
      <div class="header-token">
        <BaseTokenIcon
          :name="pool.collateralToken.name"
          :icon="poolIcon"
          size="80px"
        />
        <div>
          <p class="header-token-title">{{ tokenName }}</p>
          <p class="header-token-price">
            1 {{ tokenName }} =
            {{ tokenToMim | formatToFixed(4) }}
            {{ pool.borrowToken.name }}
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
    <HealthWrap
      :isSafe="liquidationRisk > 75"
      :isMedium="liquidationRisk > 5 && liquidationRisk <= 75"
      :isHigh="liquidationRisk >= 0 && liquidationRisk <= 5"
    >
      <div class="liq-price">
        <div>
          <span class="liq-price-text">Liquidation price</span>
          <span class="liq-price-value">{{ liqPrice }}</span>
        </div>
        <StatusName
          class="status-name"
          :isSafe="liquidationRisk > 75"
          :isMedium="liquidationRisk > 5 && liquidationRisk <= 75"
          :isHigh="liquidationRisk >= 0 && liquidationRisk <= 5"
          :bordered="true"
        /></div
    ></HealthWrap>
    <div class="lp-data">
      <div>
        <div class="lp-data-item">
          <div class="lp-data-title">Collateral Deposited</div>
          <div class="lp-data-wrap">
            <div class="lp-data-info">
              <BaseTokenIcon
                :name="tokenName"
                :icon="initialIcon"
                size="50px"
              />
              <p class="lp-data-token">{{ tokenName }}</p>
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
                :name="pool.borrowToken.name"
                :icon="borrowedIcon"
                size="50px"
              />
              <p class="lp-data-token">{{ pool.borrowToken.name }}</p>
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
import HealthWrap from "@/components/ui/HealthWrap.vue";
import HealthLine from "@/components/ui/HealthLine.vue";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import StatusName from "@/components/ui/StatusName.vue";
import mimIcon from "@/assets/images/tokens/MIM.png";

export default {
  name: "SpecPosBorrowItem",
  components: { HealthWrap, HealthLine, BaseTokenIcon, StatusName },
  props: {
    opened: { type: Boolean, default: true },
    pool: { type: Object, required: true },
  },
  computed: {
    chainId() {
      return this.$store.getChainId;
    },
    tokenName() {
      return this.chainId === 42161 && this.pool?.id === 2
        ? this.pool.lpLogic.name
        : this.pool.collateralToken.name;
    },

    isDeleverageAccepted() {
      return this.pool.isSwappersActive && !!this.pool.liqSwapperContract;
    },
    openedItems() {
      const openedItems = [];

      const addCollateralLink = {
        title: "Add Collateral/ Borrow MIM",
        icon: require("@/assets/images/myposition/AddCollateral.png"),
        name: "BorrowId",
      };

      openedItems.push(addCollateralLink);

      const repayLink = {
        title: "Repay MIMs/ Remove Collateral",
        icon: require("@/assets/images/myposition/Repay.png"),
        name: "RepayId",
      };

      openedItems.push(repayLink);

      const deleverageLink = {
        title: "Deleverage",
        icon: require("@/assets/images/myposition/Deleverage.png"),
        name: "DeleverageId",
      };

      if (this.isDeleverageAccepted) openedItems.push(deleverageLink);

      return openedItems;
    },
    initialInUsd() {
      return (
        this.pool.userInfo.userCollateralShare /
        this.pool.borrowToken.exchangeRate
      );
    },
    tokenToMim() {
      return 1 / this.pool.borrowToken.exchangeRate;
    },
    poolIcon() {
      return this.pool.icon;
    },
    stableCoinMultiplayer() {
      return this.pool.cauldronSettings.healthMultiplier;
    },
    tokenPrice() {
      return 1 / this.pool.borrowToken.exchangeRate;
    },
    liquidationRisk() {
      if (
        +this.pool.userInfo.userBorrowPart === 0 ||
        isNaN(this.liquidationPrice)
      )
        return 100;

      const riskPercent =
        ((this.minPrice * this.stableCoinMultiplayer) / this.tokenPrice) * 100;

      if (riskPercent > 100) {
        return 100;
      }

      if (riskPercent < 0) {
        return 0;
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
    liqPrice() {
      return Vue.filter("formatExactPrice")(this.liquidationPrice);
    },
    valuesList() {
      return [
        {
          title: "Required Drop in price",
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
  padding: 20px;

  .liq-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;

    padding: 6px 11px;

    &-text {
      font-weight: 400;
    }
    &-value {
      font-weight: 700;
      margin-left: 1em;
    }
  }

  .status-name {
    height: 20px;
  }

  .header {
    display: grid;
    grid-template-columns: 1fr;
    grid-row-gap: 20px;
    justify-content: space-between;
    align-items: center;

    box-sizing: content-box;
    margin-bottom: 16px;

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
    margin-top: 16px;

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
        cursor: pointer;
      }
    }
  }
}

@media (min-width: 640px) {
  .header {
    grid-template-columns: 1fr auto !important;
  }
}

@media (max-width: 640px) {
  .pos-item .header-content .header-opened-item {
    height: auto;
  }

  .pos-item .lp-data-token {
    font-size: 16px;
  }

  .pos-item .lp-data-balance {
    font-size: 15px;
  }

  .pos-item {
    padding: 20px 10px;
  }

  .pos-item .footer-list-title,
  .pos-item .footer-list-value {
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  .lp-data {
    grid-template-columns: 1fr 1fr !important;
  }
}
</style>
