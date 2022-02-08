<template>
  <div class="stable-info">
    <div class="info-wrap">
      <button class="info-btn">
        <img class="info-icon" src="@/assets/images/info.svg" alt="info" />
      </button>
      <div class="stable-data">
        <div class="item" v-for="i in 4" :key="i">
          <p class="item-title">Collateral Deposit</p>
          <p class="item-value">0.0</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StableInfo",
};
</script>

<style lang="scss" scoped>
.stable-info {
  background-color: rgba(35, 33, 45, 0.3);
  border-radius: 30px;
  margin-top: 30px;

  .info-wrap {
    text-align: right;

    .info-btn {
      background-color: transparent;
      cursor: pointer;
      border: none;
      margin: 9px 30px 7px 0;
      width: 24px;
      height: 24px;

      .info-icon {
        width: 24px;
        height: 24px;
      }
    }
  }

  .stable-data {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    background: rgba(255, 255, 255, 0.04);
    border-radius: 30px;
    padding: 30px;

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
</style>
