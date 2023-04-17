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
      <template v-if="!isEmpty && !account">
        <div class="empty-wrap">
          <img src="@/assets/images/empty-pos-list.png" alt="info" />
          <div class="empty-text">
            <p>Connect wallet to check your position</p>
          </div>
          <BaseButton :width="'200px'" @click="connectHandler"
            >Connect</BaseButton
          >
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
                {{ item.value ? item.value : "0.0" }} <br />

                <span class="usd-balance" v-if="item.valueInUsd">{{
                  item.valueInUsd
                }}</span>
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
import filters from "@/filters/index.js";
import LockedTimer from "@/components/stake/LockedTimer.vue";
import BaseButton from "@/components/base/BaseButton.vue";

export default {
  name: "info-block",
  props: {
    tokensInfo: {},
  },
  data() {
    return {
      emptyData: {
        img: this.$image(`assets/images/empty_borrow.png`),
        text: "Some text 4 empty view!",
        bottom: "If you want to learn more read our docs",
        link: "https://abracadabramoney.gitbook.io/",
      },
    };
  },
  computed: {
    isEmpty() {
      return !this.tokensInfo;
    },
    account() {
      return this.$store.getters.getAccount;
    },
    profileData() {
      if (this.isEmpty) return [];

      return [
        {
          title: this.tokensInfo.stakeToken.name,
          icon: this.tokensInfo.stakeToken.icon,
          name: "Your balance",
          value: filters.formatTokenBalance(this.tokensInfo.stakeToken.balance),
          valueInUsd: filters.formatUSD(
            this.tokensInfo.stakeToken.balance *
              this.tokensInfo.stakeToken.price
          ),
        },
        {
          title: this.tokensInfo.mainToken.name,
          icon: this.tokensInfo.mainToken.icon,
          name: "Staked",
          value: filters.formatTokenBalance(this.tokensInfo.mainToken.balance),
          valueInUsd: filters.formatUSD(
            this.tokensInfo.mainToken.balance * this.tokensInfo.mainToken.price
          ),
        },
        {
          title: "Ratio",
          icon: this.tokensInfo.stakeToken.icon,
          text: `1 ${this.tokensInfo.mainToken.name} = ${filters.formatToFixed(
            this.tokensInfo.tokensRate,
            4
          )} ${this.tokensInfo.stakeToken.name}`,
        },
        {
          title: "Staking APR",
          icon: [
            this.tokensInfo.stakeToken.icon,
            this.tokensInfo.mainToken.icon,
          ],
          text: filters.formatPercent(this.tokensInfo.apr),
        },
      ];
    },
  },
  methods: {
    async connectHandler() {
      await this.$connectWallet();
    },
    isArray(item) {
      return Array.isArray(item);
    },
  },
  components: {
    LockedTimer,
    BaseButton,
  },
};
</script>

<style lang="scss" scoped>
.usd-balance {
  font-weight: normal;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.empty-wrap {
  background: #2b2b3c;
  box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.05);
  backdrop-filter: blur(100px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 30px;
  padding: 23px 65px;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  img {
    max-width: 130px;
    width: 90%;
    height: auto;
  }
}
.empty-bottom {
  margin-top: 15px;
}

.empty-text {
  font-size: 18px;
  line-height: 27px;
  color: rgba(255, 255, 255, 0.6);
  padding: 10px 0;
}

.empty-link {
  color: #759ffa;
}

.profile-info {
  background-color: rgba(35, 33, 45, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 30px;
}

.info-wrap {
  display: flex;
  justify-content: space-between;
  padding: 9px 30px 7px 30px;
  min-height: 40px;
}

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
}

.info-icon {
  margin-right: 14px;
  width: 24px;
  height: 24px;
}

.profile-data {
  position: relative;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 30px;
}

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
}

.item-icon__img {
  min-width: 20px;
  height: 20px;
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
  font-size: 26px;
  font-weight: 700;
  line-height: 1;
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

@media (max-width: 1300px) {
  .item-value {
    font-size: 18px;
  }
  .profile-preview {
    padding: 16px 15px;
  }
}

@media (max-width: 600px) {
  .profile-preview {
    grid-template-columns: 1fr;
  }

  .item:nth-child(odd) {
    border-right: none;
  }

  .item:nth-child(even) {
    padding-left: 0;
  }

  .item:nth-last-child(-n + 2) {
    border-bottom: 1px rgba(255, 255, 255, 0.1) solid;
    padding-bottom: 14px;
  }

  .item:nth-last-child(n-1) {
    padding-bottom: 14px;
    padding-top: 14px;
  }
}
</style>
