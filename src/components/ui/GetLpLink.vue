<template>
  <div class="farm-link-wrap">
    <a class="farm-link" :href="link" target="_blank">
      <img src="@/assets/images/farm-lp.svg" alt="" />
      <p>Get LP’s</p>
      <img src="@/assets/images/farm-lp-arrow.svg" alt="" />
    </a>
  </div>
</template>
<script>
export default {
  props: { link: { type: String, required: true } },
};
</script>
<style lang="scss">
.farm-link-wrap {
  display: flex;
  justify-content: center;
}

.farm-link {
  display: flex;
  grid-column-gap: 7px;
  justify-content: space-between;
  align-items: center;
  padding: 3px 10px;
  background: rgba(157, 244, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
  border-radius: 30px;
  font-size: 14px;
  color: #63caf8;
}
</style>
