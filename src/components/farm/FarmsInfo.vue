<template>
  <div class="farms-info">
    <div class="title-desc">
      <h2 class="title">Farming Opportunities</h2>
      <p class="description">
        <span class="desc-line">
          Use your favourite assets as collateral to borrow
        </span>
        <span class="desc-line">
          <img src="@/assets/images/farm/symbol-MIM.png" class="mim-symbol" />
          Magic Internet Money, a leading decentralised and collateral-backed
          stablecoin.
        </span>
      </p>
    </div>

    <div class="reward-cards"></div>
  </div>
</template>

<script></script>

<style lang="scss" scoped>
.farms-info {
  margin-bottom: 32px;
}

.title {
  color: #fff;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 10px;
}

.description {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}

.desc-line {
  display: flex;
  align-items: center;
}

.mim-symbol {
  margin-right: 4px;
}
</style>
