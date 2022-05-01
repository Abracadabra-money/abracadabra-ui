<template>
  <div class="profile-info">
    <div class="info-wrap">
      <template v-if="!isEmpty">
        <div v-if="tokensInfo.lockedUntil" class="info-block">
          <img class="info-icon" src="@/assets/images/Clock.svg" alt="info" />
          <LockedTimer :finalTime="tokensInfo.lockedUntil" />
        </div>
      </template>
    </div>
    <div class="profile-data">
      <template v-if="isEmpty">
        <div class="empty-wrap">
          <img :src="emptyData.img" v-if="emptyData.img" alt="info" />
          <div class="empty-text">
            <p v-if="emptyData.text">
              {{ emptyData.text }}
            </p>
            <p class="empty-bottom" v-if="emptyData.bottom">
              {{ emptyData.bottom }}
              <a
                class="empty-link"
                :href="emptyData.link"
                v-if="emptyData.link"
                target="_blank"
                >here</a
              >
            </p>
          </div>
        </div>
      </template>
      <div v-else class="profile-preview">
        <div class="item" v-for="(item, i) in profileData" :key="i">
          <p class="item-name">{{ item.name }}</p>
          <div class="item-row">
            <div class="item-icon">
              <img
                v-if="!isArray(item.icon)"
                class="item-icon__img"
                :src="item.icon"
                alt="info"
              />
              <template v-if="isArray(item.icon)">
                <img
                  v-for="(icon, key) in item.icon"
                  :key="key"
                  class="item-icon__img"
                  :src="icon"
                  alt="info"
                />
              </template>
            </div>
            <div>
              <p class="item-title">{{ item.title }}</p>
              <p v-if="item.value" class="item-value">
                {{ item.value ? item.value : "0.0" }}
              </p>
              <p v-if="item.text" class="item-text">{{ item.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LockedTimer from "@/components/stake/LockedTimer.vue";

export default {
  name: "info-block",
  props: {
    tokensInfo: {},
  },
  data: () => ({
    emptyData: {
      img: require(`@/assets/images/empty_borrow.svg`),
      text: "Some text 4 empty view",
      bottom: "If you want to learn more read our docs",
      link: "https://abracadabra.money/",
    },
  }),
  computed: {
    isEmpty() {
      return !this.tokensInfo;
    },
    profileData() {
      if (this.isEmpty) return [];

      return [
        {
          title: this.tokensInfo.stakeToken.name,
          icon: this.tokensInfo.stakeToken.icon,
          name: "Your balance",
          value: parseFloat(this.tokensInfo.stakeToken.balance).toFixed(4) || 0,
        },
        {
          title: this.tokensInfo.mainToken.name,
          icon: this.tokensInfo.mainToken.icon,
          name: "Staked",
          value: parseFloat(this.tokensInfo.mainToken.balance).toFixed(4) || 0,
        },
        {
          title: "Ratio",
          icon: this.tokensInfo.stakeToken.icon,
          text: `${this.tokensInfo.tokensRate ? "1" : "0"} ${
            this.tokensInfo.mainToken.name
          } = ${parseFloat(this.tokensInfo.tokensRate).toFixed(4)} SPELL`,
        },
        {
          title: "Staking APR",
          icon: [
            this.tokensInfo.stakeToken.icon,
            this.tokensInfo.mainToken.icon,
          ],
          text: parseFloat(this.tokensInfo.apr).toFixed(2) + "%",
        },
      ];
    },
  },
  methods: {
    isArray(item) {
      return Array.isArray(item);
    },
    getUSDSumm(tokenName) {
      if (!this.tokensInfo[tokenName].price) return false;
      if (!+this.tokensInfo[tokenName].balance) return 0;
      const balanceInUsd =
        +this.tokensInfo[tokenName].balance * +this.tokensInfo[tokenName].price;
      return this.toFixed(balanceInUsd, 6);
    },
  },
  components: {
    LockedTimer,
  },
};
</script>

<style lang="scss" scoped>
.empty-wrap {
  background: #2b2b3c;
  box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.05);
  backdrop-filter: blur(100px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 30px;
  padding: 23px 65px;
  min-height: 280px;

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
.profile-info {
  background-color: rgba(35, 33, 45, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 30px;

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

    .info-block {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: none;
      height: 24px;
      font-weight: bold;
      font-size: 16px;

      .info-icon {
        margin-right: 14px;
        width: 24px;
        height: 24px;
      }
    }
  }

  .profile-data {
    position: relative;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 30px;

    .profile-preview {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      padding: 30px;
      background: #2b2b3c;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(100px);
      border-radius: 30px;
    }
    .item-row {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .item-icon {
      margin-right: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 10px;
      min-width: 64px;
      height: 64px;
      &__img {
        min-width: 20px;
        height: 20px;
      }
    }
    .item {
      text-align: left;
      border-bottom: 1px rgba(255, 255, 255, 0.1) solid;
      padding-top: 14px;
      padding-bottom: 14px;

      &:nth-child(odd) {
        border-right: 1px rgba(255, 255, 255, 0.1) solid;
      }
      &:nth-child(even) {
        padding-left: 30px;
      }

      &:nth-last-child(-n + 2) {
        border-bottom: none;
        padding-bottom: 0;
      }
      &:nth-child(-n + 2) {
        padding-top: 0;
      }
    }

    .item-name {
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 12px;
    }
    .item-text {
      font-weight: bold;
      font-size: 16px;
      line-height: 24px;
      color: #ffffff;
    }
    .item-title {
      font-weight: normal;
      font-size: 18px;
      line-height: 27px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 9px;
    }
    .item-value {
      font-size: 30px;
      font-weight: 700;
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
