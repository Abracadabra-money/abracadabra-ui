<template>
  <div class="card-wrap">
    <div class="row">
      <div class="cauldron-info">
        <img
          class="cauldron-icon"
          src="@/assets/images/tokens/yv-3crypto.png"
          alt=""
        />

        <span class="cauldron-name">yv-3Crypto</span>
      </div>
      <div class="apy-info">
        <div class="title">APY / Loop APY</div>
        <div class="value">75.28% / 10%</div>
      </div>
    </div>
    <div class="additional-info-wrap">
      <div class="additional-info">
        <div class="title">TMB</div>
        <div class="value">$612.12k</div>
      </div>
      <div class="additional-info">
        <div class="title">MIMS LB</div>
        <div class="value">4.71M</div>
      </div>
      <div class="additional-info">
        <div class="title">Interest</div>
        <div class="value">7%</div>
      </div>
      <div class="additional-info">
        <div class="title">TVL</div>
        <div class="value">292.9k</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.card-wrap {
  @include font;
  max-width: 416px;
  width: 100%;
  border-radius: 15px;
  background: linear-gradient(
      3deg,
      rgba(6, 21, 60, 0.52) 4.6%,
      rgba(23, 6, 57, 0.38) 97.12%
    ),
    url("@/assets/images/cauldrons/card-background.png");
  background-repeat: no-repeat;
  background-size: cover;
  padding: 10px 8px;
  display: flex;
  gap: 32px;
  flex-direction: column;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cauldron-info {
  display: flex;
  gap: 8px;
  align-items: center;
}

.cauldron-icon {
  width: 44px;
  height: 44px;
}

.cauldron-name {
  font-size: 18px;
  line-height: 150%;
}

.apy-info {
  border-radius: 12px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.5) 0%,
    rgba(116, 92, 210, 0.5) 100%
  );
  backdrop-filter: blur(16px);
  padding: 3px 14px;
}

.title {
  font-size: 12px;
  font-weight: 500;
  line-height: 150%;
}

.value {
  line-height: 150%;
}

.additional-info-wrap {
  display: flex;
  justify-content: space-between;
  padding: 0px 12px;
}
</style>
