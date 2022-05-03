<template>
  <div class="empty-list">
    <img
      src="@/assets/images/empty-stats-list.png"
      alt="Empty list"
      class="image"
    />
    <p class="title">
      No pools on this network. <br />In the future they will be displayed here
    </p>
  </div>
</template>

<script>
export default {
  name: "EmptyStatsList",
};
</script>

<style lang="scss" scoped>
.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;

  .image {
  }
  .title {
    margin-top: 30px;
    text-align: center;
    font-weight: 400;
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0.025em;
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
