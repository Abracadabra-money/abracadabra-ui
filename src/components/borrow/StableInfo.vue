<template>
  <div class="stable-info">
    <div class="info-wrap">
      <div class="strategy">
        <template v-if="isDegenBox">
          <img src="@/assets/images/degenbox.svg" alt="degenbox" />
          <span>Degenbox strategy</span>
          <img src="@/assets/images/arrow_right.svg" alt="degenbox"
        /></template>
      </div>
      <button
        v-if="!isEmpty"
        class="info-btn"
        @click="isInfoPressed = !isInfoPressed"
      >
        <img class="info-icon" src="@/assets/images/info.svg" alt="info" />
      </button>
    </div>
    <div class="stable-data">
      <template v-if="isEmpty">
        <div class="empty-wrap">
          <img src="@/assets/images/empty.svg" alt="info" />
          <div class="empty-text">
            <p>
              Choose the asset and amount you want to use as collateral as well
              as the amount of MIM you want to Borrow.
            </p>
            <p class="empty-bottom">
              If you want to learn more read our docs
              <a class="empty-link" href="#" target="_blank">here</a>
            </p>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-if="!isInfoPressed" class="stable-preview">
          <div class="item" v-for="(item, i) in basicInfo" :key="i">
            <p class="item-title">{{ item.name }}</p>
            <p class="item-value">{{ item.value || "0.0" }}</p>
          </div>
        </div>
        <div v-else class="info-list-wrap">
          <div class="info-list">
            <div
              v-for="(item, i) in additionalInfo"
              :key="i"
              class="info-list-item"
            >
              <img
                class="info-list-icon"
                src="@/assets/images/info.svg"
                alt="info"
              />

              <span class="info-list-name">{{ item.name }}:</span>
              <span class="info-list-value">{{ item.value }}</span>
            </div>
          </div>
          <div class="info-list-bottom">
            <div class="info-bottom">
              <div class="info-list-subitem">
                <span class="info-list-name">1 MIM</span>
                <span class="info-list-value">1 USD</span>
              </div>
              <div class="info-list-subitem">
                <span class="info-list-name">1 {{ pool.name }}</span>
                <span class="info-list-value">{{ tokentToMim }} MIM</span>
              </div>
            </div>
          </div>
        </div></template
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "StableInfo",
  props: {
    pool: {
      type: Object,
    },
    isEmpty: {
      type: Boolean,
      default: false,
    },
    isDegenBox: {
      type: Boolean,
      default: false,
    },
    tokentToMim: {
      type: String,
    },
  },
  data: () => ({
    isInfoPressed: false,
    collateralDecimals: 4,
  }),

  computed: {
    tokenInUsd() {
      return this.pool.userInfo.userCollateralShare / this.pool.tokenPrice;
    },

    borrowLeft() {
      const maxMimBorrow = (this.tokenInUsd / 100) * (this.pool.ltv - 1);
      let leftBorrow = parseFloat(
        maxMimBorrow - this.pool.userInfo.userBorrowPart
      ).toFixed(20);

      if (+leftBorrow < 0) leftBorrow = "0";

      let re = new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^-?\\d+(?:\.\\d{0,` + (4 || -1) + `})?`
      );
      return leftBorrow.toString().match(re)[0];
    },

    basicInfo() {
      return [
        {
          name: "Collateral Deposit",
          value: parseFloat(this.pool.userInfo.userCollateralShare).toFixed(
            this.collateralDecimals
          ),
        },
        {
          name: "Collateral Value",
          value: parseFloat(this.tokenInUsd).toFixed(4),
        },

        {
          name: "MIM Borrowed",
          value: parseFloat(this.pool.userInfo.userBorrowPart).toFixed(4),
        },
        {
          name: "Liquidation Price",
          value: parseFloat(this.pool.userInfo.liquidationPrice).toFixed(4),
        },
      ];
    },
    additionalInfo() {
      return [
        { name: "MIM Left To Borrow", value: this.borrowLeft },
        { name: "Maximum collateral ratio", value: this.pool.ltv },
        { name: "Liquidation fee", value: this.pool.stabilityFee },
        { name: "Borrow fee", value: this.pool.borrowFee },
        { name: "Interest", value: this.pool.interest },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.stable-info {
  background-color: rgba(35, 33, 45, 0.3);
  border-radius: 30px;

  .empty-wrap {
    padding: 23px 65px;

    .empty-bottom {
      margin-top: 15px;
    }

    .empty-text {
      font-size: 18px;
      line-height: 27px;
      color: rgba(255, 255, 255, 0.6);
    }

    .empty-link {
      color: #759ffa;
    }
  }

  .info-wrap {
    display: flex;
    justify-content: space-between;
    padding: 9px 30px 7px 30px;
    min-height: 40px;

    .strategy {
      display: grid;
      grid-gap: 10px;
      grid-template-columns: repeat(3, auto);
      align-items: center;
    }

    .info-btn {
      background-color: transparent;
      cursor: pointer;
      border: none;
      /* margin: 9px 30px 7px 0;*/
      width: 24px;
      height: 24px;

      .info-icon {
        width: 24px;
        height: 24px;
      }

      &:disabled {
        cursor: default;
      }
    }
  }

  .stable-data {
    position: relative;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 30px;

    .stable-preview {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      padding: 30px;
    }

    .item {
      text-align: center;
      border-bottom: 1px rgba(255, 255, 255, 0.1) solid;
      padding-top: 14px;
      padding-bottom: 14px;

      &:nth-child(odd) {
        border-right: 1px rgba(255, 255, 255, 0.1) solid;
      }

      &:nth-last-child(-n + 2) {
        border-bottom: none;
        padding-bottom: 0;
      }
      &:nth-child(-n + 2) {
        padding-top: 0;
      }
    }

    .item-title {
      font-size: 18px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 12px;
    }
    .item-value {
      font-size: 30px;
      font-weight: 700;
    }
  }
}

.info-list-wrap {
  padding: 20px 15px;

  .info-list-bottom {
    background-color: rgba(255, 255, 255, 0.04);
    border-radius: 30px;
    padding: 0 17px 10px 17px;
    margin-top: 10px;

    .info-bottom {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 52px;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      .info-list-subitem {
        display: flex;
        justify-content: space-between;
        color: rgba(255, 255, 255, 0.6);
        line-height: 25px;
      }
    }
  }

  .info-list-value {
    font-weight: 700;
    color: white;
  }

  .info-list {
    background-color: rgba(255, 255, 255, 0.04);
    border-radius: 30px;
    padding: 0 17px 10px 17px;
    overflow-y: auto;
    height: 210px;

    .info-list-item {
      display: flex;
      justify-content: space-between;
      color: rgba(255, 255, 255, 0.6);
      line-height: 25px;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .info-list-name {
      flex: 1 1 auto;
      text-align: left;
    }
    .info-list-icon {
      padding-right: 12px;
    }
  }
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}
</style>
