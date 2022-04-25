<template>
  <div class="pos-item" :class="{ 'pos-item-opened': opened }">
    <div class="header">
      <div class="header-token">
        <TokenIcon :token="pool.token.name" size="80px" bgColor="transparent" />
        <div>
          <p class="header-token-title">{{ pool.token.name }}</p>
          <p v-if="!opened" class="header-token-price">$ {{ price }}</p>
        </div>
      </div>
      <div v-if="!opened" class="header-content">
        <div>
          <p class="header-content-title">Initial collateral deposited</p>
          <p class="header-content-value">$ {{ setComma(deposited) }}</p>
        </div>
        <div>
          <p class="header-content-title">MIM borrowed</p>
          <p class="header-content-value">$ {{ setComma(borrowed) }}</p>
        </div>
      </div>
      <div v-else class="header-content-opened">
        <div
          v-for="(item, i) in openedItems"
          :key="i"
          class="header-opened-item"
        >
          <img :src="item.icon" alt="Hammer" class="header-opened-img" />
          <p class="header-opened-title">{{ item.title }}</p>
        </div>
      </div>
    </div>
    <template v-if="opened">
      <div class="balances">
        <div class="balance">
          <p class="balance-title">Price</p>
          <p class="balance-value">{{ Number(price).toFixed(2) }}</p>
        </div>
        <div class="balance">
          <p class="balance-title">Initial collateral deposited</p>
          <p class="balance-value">$ {{ setComma(deposited) }}</p>
        </div>
        <div class="balance">
          <p class="balance-title">MIM borrowed</p>
          <p class="balance-value">$ {{ setComma(borrowed) }}</p>
          <p class="balance-subtitle">$ {{ setComma(borrowed) }}</p>
        </div>
      </div>
      <div class="footer">
        <div class="footer-title">
          <p>Position health</p>
          <p class="footer-value" :style="{ width: `${health}%` }">
            {{ health }}%
          </p>
        </div>
        <div class="footer-range">
          <div class="footer-range-line">
            <div class="footer-range-value"></div>
          </div>
          <StatusName :isSafe="true" :bordered="true" />
        </div>
        <div class="footer-list">
          <div
            v-for="(item, i) in valuesList"
            :key="i"
            class="footer-list-item"
          >
            <div class="footer-list-title">
              <img class="info-img" src="@/assets/images/info.svg" alt="info" />

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
const TokenIcon = () => import("@/components/ui/TokenIcon");
const StatusName = () => import("@/components/UIComponents/StatusName");

export default {
  name: "SpecPosBorrowItem",
  components: { TokenIcon, StatusName },
  props: {
    opened: { type: Boolean, default: true },
    pool: { type: Object, required: true },
  },
  data: () => ({
    price: 1,
    deposited: 1000,
    borrowed: 4500,
    health: 20,
    valuesList: [
      { title: "Current P/L", value: "+25% earned", color: "#63CAF8" },
      {
        title: "Closing Position now",
        value: "$ 400 USD Cheaper",
      },
    ],
    openedItems: [
      {
        title: "Repay MIMs",
        icon: require("@/assets/images/myposition/egg.svg"),
      },
      {
        title: "Remove Collateral",
        icon: require("@/assets/images/myposition/hammer.svg"),
      },
      {
        title: "Deleverage",
        icon: require("@/assets/images/myposition/graph-up.svg"),
      },
    ],
  }),
  methods: {
    setComma(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

  &-opened {
    .header {
      padding-bottom: 20px;
    }
    & > * {
      position: relative;
      &:after {
        content: "";
        position: absolute;
        right: 0;
        top: 100%;
        width: 100%;
        height: 1px;
        background-color: rgba(255, 255, 255, 0.1);
      }
      &:last-child:after {
        display: none;
      }
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 96px;
    box-sizing: content-box;

    &-content {
      justify-self: flex-end;
      text-align: right;

      &-title {
        font-weight: 400;
        font-size: 14px;
        line-height: 21px;
        color: rgba(255, 255, 255, 0.8);
      }
      &-value {
        font-weight: 600;
        font-size: 18px;
        line-height: 27px;
        letter-spacing: 0.025em;
      }

      &-opened {
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;

        .header-opened-item {
          flex: 0 0 67px;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
        }

        .header-opened-img {
          flex: 0 0 24px;
          width: 24px;
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
  .balances {
    display: flex;
    .balance {
      flex: 1 1;
      position: relative;
      padding: 20px 0;
      text-align: center;

      &-title {
        font-weight: 400;
        font-size: 18px;
        line-height: 27px;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 12px;
        padding: 0 40px;
      }
      &-value {
        font-weight: 600;
        font-size: 18px;
        line-height: 27px;
      }
      &-subtitle {
        font-weight: 400;
        font-size: 14px;
        line-height: 21px;
        color: rgba(255, 255, 255, 0.8);
      }

      &:after {
        content: "";
        position: absolute;
        right: 0;
        top: calc(50% - 10px);
        width: 1px;
        height: 20px;
        background-color: rgba(255, 255, 255, 0.1);
      }
      &:last-child:after {
        display: none;
      }
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
    &-value {
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      color: white;
      text-align: right;
    }

    &-range {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 4px;
      &-line {
        width: 417px;
        max-width: calc(100% - 70px);
        height: 8px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        margin-top: 16px;
      }
      &-value {
        background-color: #63caf8;
        border-radius: 20px;
        height: 100%;
      }
    }

    &-list {
      margin-top: 14px;

      &-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
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
</style>
