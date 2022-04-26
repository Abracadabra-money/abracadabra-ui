<template>
  <div class="pos-item">
    <div class="header">
      <div class="header-token">
        <TokenIcon :token="pool.token.name" size="80px" bgColor="transparent" />
        <div>
          <p class="header-token-title">{{ pool.token.name }}</p>
          <p v-if="!opened" class="header-token-price">$ {{ price }}</p>
        </div>
      </div>

      <div class="header-content">
        <button
          v-for="(item, i) in openedItems"
          :key="i"
          class="header-opened-item"
        >
          <img :src="item.icon" alt="Hammer" class="header-opened-img" />
          <p class="header-opened-title">{{ item.title }}</p>
        </button>
      </div>
    </div>
    <div class="lp-data">
      <div>
        <div class="lp-data-item">
          <div class="lp-data-title">Initial collateral deposited</div>
          <div class="lp-data-wrap">
            <div class="lp-data-info">
              <TokenIcon :token="'USD'" size="50px" bgColor="transparent" />
              <p class="lp-data-token">USD</p>
            </div>
            <div class="lp-data-balance-wrap">
              <p class="lp-data-balance">{{ 666666 }}</p>
              <p class="lp-data-price">$ {{ 666666 }}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="lp-data-item">
          <div class="lp-data-title">Borrowed</div>
          <div class="lp-data-wrap">
            <div class="lp-data-info">
              <TokenIcon :token="pool.name" size="50px" bgColor="transparent" />
              <p class="lp-data-token">USD</p>
            </div>
            <div class="lp-data-balance-wrap">
              <p class="lp-data-balance">{{ 66666 }}</p>
              <p class="lp-data-price">$ {{ 66666 }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-if="opened">
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

  .header {
    display: flex;
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
        background-color: transparent;
        border: none;
        cursor: pointer;
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

@media (min-width: 1024px) {
  .lp-data {
    grid-template-columns: 1fr 1fr !important;
  }
}
</style>
