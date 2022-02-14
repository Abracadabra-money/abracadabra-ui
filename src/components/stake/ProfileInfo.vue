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
      <div class="info-block">
        <img class="info-icon" src="@/assets/images/Clock.svg" alt="info" />
        <div>Unlock in 24h</div> 
      </div>
    </div>
    <div class="profile-data">

        <div v-if="!isInfoPressed" class="profile-preview">
          <div class="item" v-for="(item, i) in previewData" :key="i">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-title">{{ item.title }}</p>
            <p v-if="item.value" class="item-value">{{ item.value || "0.0" }}</p>
            <p v-if="item.text" class="item-text">{{ item.text }}</p>
          </div>
        </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "profileInfo",
  data: () => ({
    isInfoPressed: false,
    isEmpty: false,
    previewData: [
      { name: "Your balance", value: "200,000", title: "Spell", icon: "Spell"},
      { name: "Staked", value: "3,000", title: "sSpell", icon: "sSpell"  },
      { name: "", title: "Ratio", text: "1 sSPELL = 1.2292 SPELL", icon: "sSpell" },
      { name: "", title: "Staking APR", text: "26.98%", icon: "Spell-sSpell"  },
    ],
  }),
};
</script>

<style lang="scss" scoped>
.profile-info {
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
      cursor: pointer;
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
