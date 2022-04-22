<template>
  <div class="pos-farm-item" :class="{ 'pos-farm-item-opened': opened }">
    <div class="header">
      <img
        src="@/assets/images/networks/polygon-icon.svg"
        alt="Token"
        class="header-img"
      />
      <div class="header-token">
        <p class="header-token-title">UST</p>
        <p v-if="!opened" class="header-token-price">$ {{ 464654 }}</p>
      </div>
      <div v-if="!opened" class="header-content">
        <div>
          <p class="header-content-title">Initial collateral deposited</p>
          <p class="header-content-value">$ {{ 464654 }}</p>
        </div>
        <div>
          <p class="header-content-title">MIM borrowed</p>
          <p class="header-content-value">$ {{ 464654 }}</p>
        </div>
      </div>
      <div v-else class="header-content-opened">
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
    <div v-if="opened" class="lp-data">
      <div class="lp-data-item">
        <div class="lp-data-title">Earned</div>
        <div class="lp-data-wrap">
          <div class="lp-data-info">
            <img
              class="lp-data-icon"
              src="@/assets/images/tokens-icon/MIM.svg"
              alt="LP"
            />
            <p class="lp-data-token">ETH</p>
          </div>
          <div class="lp-data-balance-wrap">
            <p class="lp-data-balance">1.00</p>
            <p class="lp-data-price">$ 1.00</p>
          </div>
        </div>
        <div class="lp-data-actions">
          <button class="lp-data-btn">Harvest</button>
        </div>
      </div>
      <div class="lp-data-item">
        <div class="lp-data-title">Earned</div>
        <div class="lp-data-wrap">
          <div class="lp-data-info">
            <img
              class="lp-data-icon"
              src="@/assets/images/tokens-icon/MIM.svg"
              alt="LP"
            />
            <p class="lp-data-token">ETH</p>
          </div>
          <div class="lp-data-balance-wrap">
            <p class="lp-data-balance">1.00</p>
            <p class="lp-data-price">$ 1.00</p>
          </div>
        </div>
        <div class="lp-data-actions">
          <button class="lp-data-btn">Harvest</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SpecPosFarmItem",
  components: {},
  props: {
    opened: { type: Boolean, default: true },
  },
  data: () => ({
    openedItems: [
      {
        title: "Stake",
        icon: require("@/assets/images/myposition/graph-up.svg"),
      },
      {
        title: "Unstake",
        icon: require("@/assets/images/myposition/graph-up.svg"),
      },
    ],
  }),
  methods: {},
};
</script>

<style lang="scss" scoped>
.pos-farm-item {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  border-radius: 20px;
  padding: 18px 20px;

  .header {
    display: grid;
    grid-template-columns: auto auto 1fr;
    column-gap: 10px;
    align-items: center;
    min-height: 96px;
    box-sizing: content-box;

    &-img {
      width: 80px;
      height: 80px;
    }
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
          padding: 0;
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
    }

    &-token {
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
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 37px;

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
      margin-right: 10px;
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
    &-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 10px;
    }
    &-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 7px 20px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 20px;
      font-weight: 600;
      font-size: 16px;
      color: #ffffff;
      border: none;
      cursor: pointer;
    }
  }
}
</style>
