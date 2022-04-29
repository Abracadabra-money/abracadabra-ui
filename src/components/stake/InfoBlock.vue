<template>
  <div class="profile-info">
    <div class="info-wrap">
      <div class="strategy">
        <template v-if="isInfoPressed || isEmpty">
          <img src="@/assets/images/degenbox.svg" alt="degenbox" />
          <span>Degenbox strategy</span>
          <img src="@/assets/images/arrow_right.svg" alt="degenbox"
        /></template>
      </div>
      <div v-if="lockedUntil" class="info-block">
        <img class="info-icon" src="@/assets/images/Clock.svg" alt="info" />
        <LockedTimer :finalTime="lockedUntil" />
      </div>
    </div>
    <div class="profile-data">
      <div v-if="!isInfoPressed" class="profile-preview">
        <div class="item" v-for="(item, i) in profileData" :key="i">
          <p class="item-name">{{ item.name }}</p>
          <div class="item-row">
            <div class="item-icon">
              <img
                v-if="!isArray(item.icon)"
                class="item-icon__img"
                :src="getImgUrl(item.icon)"
                alt="info"
              />
              <template v-if="isArray(item.icon)">
                <img
                  v-for="(icon, key) in item.icon"
                  :key="key"
                  class="item-icon__img"
                  :src="getImgUrl(icon)"
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
    lockedUntil: {
      type: [String, Boolean],
    },
    mainTokenName: {
      type: String,
    },
    tokensInfo: {
      type: Object,
    },
    icon: {
      type: String,
    },
    title: {
      type: String,
    },
    rate: {
      type: [String, Number],
    },
  },
  watch: {
    tokensInfo() {
      this.$nextTick();
    },
  },
  methods: {
    getImgUrl(type) {
      var images = require.context(
        "../../assets/images/tokens-icon/",
        false,
        /\.svg$/
      );
      return images("./" + type + ".svg");
    },
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
    getBallance(tokenName, range) {
      const balance = this.tokensInfo[tokenName].balance;
      console.log(balance);
      return balance ? parseFloat(balance).toFixed(range) : 0;
    },
    toFixed(num, range) {
      let fixed = parseFloat(num).toFixed(range);
      fixed = isNaN(fixed) ? 0 : fixed;
      return fixed || 0;
    },
  },
  computed: {
    profileData() {
      return [
        {
          title: "Spell",
          icon: "spell-icon",
          name: "Your balance",
          value: this.getBallance("stakeToken", 2) || 0,
        },
        {
          title: this.title,
          icon: this.icon,
          name: "Staked",
          value: this.getBallance("mainToken", 2) || 0,
        },
        {
          title: "Ratio",
          icon: "spell-icon",
          text: `${this.rate ? "1" : "0"} ${
            this.mainTokenName
          } = ${this.toFixed(this.rate, 4)} SPELL`,
        },
        {
          title: "Staking APR",
          icon: ["spell-icon", this.icon],
          text: this.toFixed(this.tokensInfo.apr, 2) + "%",
        },
      ];
    },
  },
  data: () => ({
    isInfoPressed: false,
    isEmpty: false,
  }),
  components: {
    LockedTimer,
  },
};
</script>

<style lang="scss" scoped>
.profile-info {
  background-color: rgba(35, 33, 45, 0.3);
  border-radius: 30px;

  .info-wrap {
    display: flex;
    justify-content: space-between;
    padding: 9px 30px 7px 30px;

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
