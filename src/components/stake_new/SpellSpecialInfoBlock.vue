<template>
  <div class="special-info-block">
    <h3 class="title">Make SPELL work for you</h3>

    <p class="text">
      Stake your SPELL into mSPELL! No impermanent loss, no loss of governance
      rights. Take part in the fee sharing mechanism of Abracadabra and earn
      MIM! Find out more here. sSPELL automatically earns fees from MIM
      repayments from all wizards proportional to your share of the stake pool.
    </p>
  </div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss" scoped>
.special-info-block {
  @include font;
  padding: 14px 20px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  border: 1px solid #4f53b2;
  border-radius: 30px;
  background: linear-gradient(
      90deg,
      rgba(45, 74, 150, 0.32) 0%,
      rgba(116, 92, 210, 0.32) 100%
    ),
    url("@/assets/images/stake/spell-bg.png");
  background-repeat: no-repeat;
  background-position: center right;
}

.title {
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
}

.text {
  color: rgba(255, 255, 255, 0.6);
  line-height: 150%;
}
</style>
