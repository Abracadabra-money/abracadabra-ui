<template>
  <div class="home">
    <h1 class="home-title">Magic.Money <br/> Make your Interest bearing assets liquid</h1>
    <div class="home-buttons">
      <ButtonGradient 
        primary
        @click="mint">
        MINT
      </ButtonGradient>
      <ButtonGradient
        @click="leverageUp">
        Leverage up
      </ButtonGradient>
    </div>
    <div class="mint-info">
      <InfoBlock :content='{
        "Collater Deposit": "0.0",
        "Collater Value": "0.0",
        "MIM Borrowed": "0.0",
        "Liquidation Price": "0.0"
      }'/>
      <div class="mint-info__actions">
          <ButtonGradient 
          disabled
          primary
          @click="mint">
          Approve
        </ButtonGradient>
        <ButtonGradient
          disabled
          @click="leverageUp">
          Mint MIM
        </ButtonGradient>
      </div>
    </div>
  </div>
</template>
<script>
import ButtonGradient from "@/components/main/ButtonGradient.vue";
import InfoBlock from '@/components/main/InfoBlock.vue';

export default  {
  methods: {
    mint() {
      console.log("mint");
    },
    leverageUp() {
      console.log("leverageUp");
    },
  },
  components: {
    ButtonGradient,
    InfoBlock
  }
}


</script>

<style lang="scss" scoped>
  .mint-info {
    background-color: #282632;
    padding: 0 30px;
    outline: 1px solid red;
    width: 740px;
    border: 20px;
    &__actions {
      margin-top: 228px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
  .home-title {
    margin-top: 240px;
    margin-bottom: 38px;
    font-family: Prompt;
    font-style: normal;
    font-weight: bold;
    font-size: 40px;
    line-height: 60px;
    text-align: center;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .home-buttons {
    display: flex;
    justify-content: space-between;
  }
  .home {
    margin: 0 auto;
    width: 570px;
  }
</style>
