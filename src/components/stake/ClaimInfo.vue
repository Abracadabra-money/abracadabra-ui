<template>
  <div class="claim-info">
    <h3>Claimable</h3>
    <div class="claim-info__row">
      <div class="claim-info__left">
        <div class="claim-info__img">
          <img src="@/assets/images/tokens/MIM.png" alt="MIM" />
        </div>
        <div class="claim-info__count">
          <h4>MIM</h4>
          <div>
            {{ count }}
          </div>
        </div>
      </div>
      <BaseButton
        @click="claimHandler"
        :disabled="disableClaim"
        :width="'100px'"
      >
        Claim
      </BaseButton>
    </div>
  </div>
</template>

<script>
const BaseButton = () => import("@/components/base/BaseButton");

export default {
  name: "ClaimInfo",
  props: {
    count: {
      type: [Number, String],
      required: true,
    },
    disableClaim: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    claimHandler() {
      this.$emit("onClaim");
    },
  },
  components: {
    BaseButton,
  },
};
</script>

<style lang="scss" scoped>
.claim-info {
  background-image: url("../../assets/images/bg-claim.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  box-sizing: border-box;
  border: 1px solid rgba(129, 128, 255, 0.2);
  border-radius: 30px;
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
