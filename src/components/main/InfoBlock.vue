<template>
  <div class="info-block">
    <div :key="key" v-for="(item,key) of content" class="info-block__item">
      <div>{{key}}</div>
      <div>{{item}}</div>
    </div>
  </div>
</template>

<script>

export default {
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
    width: 740px;
    padding: 30px;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    background-color: $clrBg3;
    border-radius: 20px;
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

