<template>
  <div class="pos-farm-item pos-farm-item-opened">
    <div class="header">
      <div class="header-token">
        <BaseTokenIcon :name="pool.name" :icon="pool.icon" size="80px" />
        <p class="header-token-title">{{ pool.name }}</p>
      </div>
      <div class="header-content-opened">
        <router-link
          v-for="(item, i) in openedItems"
          :key="i"
          class="header-opened-item"
          :to="{
            name: 'FarmPool',
            params: { id: pool.id, unstake: item.name === 'unstake' },
          }"
        >
          <img :src="item.icon" alt="Hammer" class="header-opened-img" />
          <p class="header-opened-title">{{ item.title }}</p>
        </router-link>
      </div>
    </div>
    <div class="lp-data">
      <div>
        <div class="lp-data-item">
          <div class="lp-data-title">Earned</div>
          <div class="lp-data-wrap">
            <div class="lp-data-info">
              <BaseTokenIcon
                :name="pool.tokenName"
                :icon="pool.icon"
                size="50px"
              />
              <p class="lp-data-token">{{ pool.tokenName }}</p>
            </div>
            <div class="lp-data-balance-wrap" v-if="pool.accountInfo">
              <p class="lp-data-balance">{{ earnedData.balance }}</p>
              <p class="lp-data-price">$ {{ earnedData.usd }}</p>
            </div>
          </div>
          <div class="lp-data-actions">
            <button
              class="lp-data-btn"
              v-if="pool.accountInfo"
              :disabled="!+earnedData.balance"
              @click="harvest"
            >
              Harvest
            </button>
          </div>
        </div>
      </div>
      <div>
        <div class="lp-data-item">
          <div class="lp-data-title">{{ pool.stakingTokenType }} deposited</div>
          <div class="lp-data-wrap">
            <div class="lp-data-info">
              <BaseTokenIcon :name="pool.name" :icon="pool.icon" size="50px" />
              <p class="lp-data-token">{{ pool.name }}</p>
            </div>
            <div class="lp-data-balance-wrap" v-if="pool.accountInfo">
              <p class="lp-data-balance">{{ depositedData.balance }}</p>
              <p class="lp-data-price">$ {{ depositedData.usd }}</p>
            </div>
          </div>
          <div v-if="balanceList.length" class="balance-list">
            <div
              class="lp-data-wrap"
              v-for="balanceItem in balanceList"
              :key="balanceItem.name"
            >
              <div class="lp-data-info">
                <BaseTokenIcon
                  :name="balanceItem.name"
                  :icon="balanceItem.icon"
                />
                <p>
                  {{ balanceItem.name }}
                </p>
              </div>
              <div v-if="pool.accountInfo" class="lp-data-balance-wrap">
                <p class="balance-list-balance">{{ balanceItem.balance }}</p>
                <p class="lp-data-price">$ {{ balanceItem.usd }}</p>
              </div>
            </div>
          </div>
          <div class="lp-data-actions">
            <router-link
              class="lp-data-btn"
              v-if="pool.accountInfo"
              :disabled="!+depositedData.balance"
              :to="{
                name: 'FarmPool',
                params: { id: pool.id, unstake: true },
              }"
            >
              Withdraw
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");
import { getTokenIconByName } from "../../utils/helpers";

export default {
  name: "SpecPosFarmItem",
  components: { BaseTokenIcon },
  props: {
    pool: { type: Object, required: true },
  },
  data: () => ({
    openedItems: [
      {
        title: "Stake",
        name: "stake",
        icon: require("@/assets/images/myposition/graph-up.svg"),
      },
      {
        title: "Unstake",
        name: "unstake",
        icon: require("@/assets/images/myposition/graph-up.svg"),
      },
    ],
  }),
  methods: {
    parse(value) {
      return parseFloat(value).toFixed(4);
    },

    prepBalanceData(factor = 0, priceValue) {
      const factorParsed = this.parse(
        this.$ethers.utils.formatEther(factor.toString())
      );

      const price = this.parse(factorParsed * priceValue);

      return {
        usd: price,
        balance: this.parse(factorParsed),
      };
    },
    async harvest() {
      try {
        const tx = await this.pool.contractInstance.withdraw(
          this.pool.poolId,
          0
        );

        const receipt = await tx.wait();

        console.log("unstakeHandler success:", receipt);
      } catch (error) {
        console.log("harvest err:", error);
      }
    },
  },
  computed: {
    balanceList() {
      return [
        {
          name: this.pool.depositedBalance?.token0.name,
          balance: this.parse(
            this.pool.accountInfo?.tokensBalanceInfo?.token0.amount
          ),
          usd: this.parse(
            this.pool.accountInfo?.tokensBalanceInfo?.token0.amountInUsd
          ),
          icon: getTokenIconByName(this.pool.depositedBalance?.token0.name),
        },
        {
          name: this.pool.depositedBalance?.token1.name,
          balance: this.parse(
            this.pool.accountInfo?.tokensBalanceInfo?.token1.amount
          ),
          usd: this.parse(
            this.pool.accountInfo?.tokensBalanceInfo?.token1.amountInUsd
          ),
          icon: getTokenIconByName(this.pool.depositedBalance?.token1.name),
        },
      ].filter((e) => e.name && e.balance);
    },
    userRewardParsed() {
      return this.parse(
        this.$ethers.utils.formatEther(
          this.pool.accountInfo?.userReward.toString()
        )
      );
    },

    earnedData() {
      return this.prepBalanceData(
        this.pool.accountInfo?.userReward,
        this.pool.tokenPrice
      );
    },
    depositedData() {
      return this.prepBalanceData(
        this.pool.accountInfo?.userInfo.amount,
        this.pool.lpPrice
      );
    },
  },
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 96px;
    box-sizing: content-box;

    &-content-opened {
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;

      .header-opened-item {
        flex: 0 0 67px;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        padding: 0;
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
    }
  }

  .lp-data {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 37px;
    margin-top: 10px;

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
      border: none;
      cursor: pointer;
      color: white;

      &:disabled {
        cursor: default;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
  .balance-list {
    display: grid;
    grid-template-rows: repeat(auto-fill, 1fr);
    grid-row-gap: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 9px 0;

    &-balance {
      font-size: 14px;
      line-height: 21px;
    }
  }
}

@media (min-width: 1024px) {
  .lp-data {
    grid-template-columns: 1fr 1fr !important;
  }
}
</style>
