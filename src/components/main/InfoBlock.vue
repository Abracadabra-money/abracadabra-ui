<template>
  <div class="info-block">
    <svg class="info-block__img" @click="expand()" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9.5" stroke="white"/>
      <path d="M11.984 7.81598C11.7174 7.81598 11.4934 7.72531 11.312 7.54398C11.1307 7.36265 11.04 7.13865 11.04 6.87198C11.04 6.60531 11.1307 6.38131 11.312 6.19998C11.4934 6.01865 11.7174 5.92798 11.984 5.92798C12.2614 5.92798 12.4907 6.01865 12.672 6.19998C12.864 6.38131 12.96 6.60531 12.96 6.87198C12.96 7.13865 12.864 7.36265 12.672 7.54398C12.4907 7.72531 12.2614 7.81598 11.984 7.81598ZM11.168 9.31998H12.816V17H11.168V9.31998Z" fill="white"/>
    </svg>
    <div class="info-block__wrap">
      <div :key="key" v-for="(item,key) of content" class="info-block__item">
        <div>{{key}}</div>
        <div>{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    expand() {
      console.log("expand");
    }
  },
  props: {
    content: {
      type: Object,
      default: () => ({
        'Collater Deposit': "0.0", 
        'Collater Value': "0.0", 
        'MIM Borrowed': "0.0", 
        'Liquidation Price': "0.0"
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  $clrBorder: #474650;
  .info-block {
    position: relative;
    padding-top: 40px;
    position: relative;
    width: 680px;
    background-color: $clrBg3;
    border-radius: 20px;
    &__img {
      cursor: pointer;
      position: absolute;
      right: 32px;
      top: 8px;
    }
    &__wrap {
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.04);
      box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.05);
      backdrop-filter: blur(100px);
      /* Note: backdrop-filter has minimal browser support */
      border-radius: 30px;
    }
    &__item {
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 340px;
      height: 112px;
      & div:nth-child(1) {
        font-family: Prompt;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 27px;
        display: flex;
        color: rgba(255, 255, 255, 0.6);
      }
      & div:nth-child(2) {
        font-family: Prompt;
        font-style: normal;
        font-weight: bold;
        font-size: 30px;
        line-height: 45px;
        color: #FFFFFF;
      }
      &:nth-child(even) {
        border-left: 1px solid $clrBorder;
      }
      &:not(:nth-child(-n+2)) {
        border-top: 1px solid $clrBorder;
      }
    }
  }
</style>

