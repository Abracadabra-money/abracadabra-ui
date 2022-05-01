<template>
  <div class="claim-info">
    <h3>Claimable</h3>
    <div class="claim-info__row">
      <div class="claim-info__left">
        <div class="claim-info__img">
          <img src="@/assets/images/tokens/MIM.png" alt="MIM" />
        </div>
        <div class="claim-info__count">
          <h4>
            {{ token }}
          </h4>
          <div>
            {{ count }}
          </div>
        </div>
      </div>
      <a class="button" @click="claim">Claim</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClaimInfo",
  props: {
    icon: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    count: {
      type: [Number, String],
      required: true,
    },
  },
  methods: {
    claim() {
      this.$emit("onClaim");
    },
  },
};
</script>

<style lang="scss" scoped>
.claim-info {
  height: 130px;
  background-image: url("../../assets/images/bg-claim.png");
  background-size: contain;
  background-repeat: no-repeat;
  box-sizing: border-box;
  box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.05);
  backdrop-filter: blur(100px);
  padding: 20px;
  &__left {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  & h3 {
    font-family: "Prompt";
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 27px;
    text-align: left;
    /* #FFFFFF */
    color: #ffffff;
  }
  &__img {
    background: rgba(255, 255, 255, 0.04);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 63px;
    width: 63px;
    & img {
      height: 32px;
      width: 32px;
    }
  }
  & .button {
    border: 1px solid #648fcc;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    min-width: 100px;
    height: 50px;
    line-height: 50px;
    font-family: "Prompt";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    display: block;
    align-items: center;
    color: #ffffff;
  }
  &__count {
    text-align: left;
    margin-left: 14px;
    font-family: "Prompt";
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    align-items: center;
    color: #ffffff;
  }
  &__row {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
