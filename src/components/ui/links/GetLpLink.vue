<template>
  <a class="farm-link" :href="link" target="_blank">
    <img src="@/assets/images/farm-lp.svg" alt="" />
    <p>Get LP’s</p>
    <img src="@/assets/images/farm-lp-arrow.svg" alt="" />
  </a>
</template>
<script>
export default {
  props: { link: { type: String, required: true } },
};
</script>
<style lang="scss">
.farm-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  min-width: 130px;
  gap: 4px;
  padding: 3px 10px;
  background: rgba(8, 14, 31, 0.6);
  border-radius: 16px;
  border: 1px solid var(--primary-solid, #7088cc);
  box-shadow: 0px 4px 9px 0px rgba(134, 92, 230, 0.08);
  font-size: 16px;
  color: white;
  transition: opacity 0.7s;
}

.farm-link:hover {
  cursor: pointer;
  opacity: 0.7;
}
</style>
