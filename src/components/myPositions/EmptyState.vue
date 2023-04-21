<template>
  <div class="wrap">
    <img
      class="image"
      src="@/assets/images/empty-pos-list.png"
      alt="Empty list"
    />
    <p class="title">No open positions</p>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.image {
  max-width: 246px;
  margin-bottom: 30px;
}
.title {
  font-size: 18px;
  line-height: 27px;
  letter-spacing: 0.025em;
  color: rgba(255, 255, 255, 0.6);
}
</style>
