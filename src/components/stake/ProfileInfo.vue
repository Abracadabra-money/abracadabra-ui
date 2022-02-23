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
      <div  class="info-block">
        <img v-if="lockedUntil" class="info-icon" src="@/assets/images/Clock.svg" alt="info" />
        <div v-if="lockedUntil">Unlock in {{lockedUntil}}h</div> 
      </div>
    </div>
    <div class="profile-data">
        <div v-if="!isInfoPressed" class="profile-preview">
          <div class="item" v-for="(item, i) in profileData" :key="i">
            <p class="item-name">{{ item.name }}</p>
            <div class="item-row">
                <div class="item-icon">
                    <img v-if="!isArray(item.icon)" class="item-icon__img" :src="getImgUrl(item.icon)" alt="info" />
                    <template v-if="isArray(item.icon)">
                        <img v-for="(icon, key) in item.icon" :key="key"  class="item-icon__img" :src="getImgUrl(icon)" alt="info" />
                    </template>
                    </div>
                <div>
                    <p class="item-title">{{ item.title }}</p>
                    <p v-if="item.value" class="item-value">{{ !isNaN(item.value) ? item.value : "0.0" }}</p>
                    <p v-if="item.text" class="item-text">{{ item.text }}</p>
                </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "profileInfo",
  props: {
    lockedUntil: {
      type: [String, Boolean]
    },
    tokensInfo: {
      type: Object
    }
  },
  methods: {
    getImgUrl(type) {
      var images = require.context('../../assets/images/tokens-icon/', false, /\.svg$/)
      return images('./' + type + ".svg")
    },
    isArray(item) {
        return Array.isArray(item);
    },
    getUSDSumm(tokenName) {
      if (!this.tokensInfo[tokenName].price) return false;
      if (!+this.tokensInfo[tokenName].balance) return 0;
      const balanceInUsd =
        +this.tokensInfo[tokenName].balance * +this.tokensInfo[tokenName].price;
      return this.toFixed(balanceInUsd,6);
    },
    toFixed(num,range) {
      let fixed = parseFloat(num).toFixed(range);
      fixed = isNaN(fixed) ? 0 : fixed;
      console.log(fixed)
      return fixed || 0;
    }
  },
  computed: {
    profileData() {
      return [
        { title: "Spell",       icon: "spell-icon",  name: "Your balance", value: this.getUSDSumm("stakeToken") + "$" },
        { title: "sSpell",      icon: "sspell-icon", name: "Staked",       value: this.getUSDSumm("mainToken")  + "$" },
        { title: "Ratio",       icon: "spell-icon",  
          text: `1 sSPELL = ${this.toFixed(this.tokensInfo.tokensRate,4)} SPELL` },
        { title: "Staking APR", icon: ["spell-icon","sspell-icon"], text: (this.tokensInfo.apr || 0) + "%"  },
      ]
    }
  },
  data: () => ({
    isInfoPressed: false,
    isEmpty: false
  }),
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
        color: #FFFFFF
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
