<template>
  <button class="sort-btn">
    <Arrows class="arrows" :sortOrder="sortOrder" />
    <slot></slot>
  </button>
</template>

<script>
import Arrows from "@/components/icons/Arrows.vue";
export default {
  props: {
    sortOrder: {
      default: null,
    },
  },

  components: {
    Arrows,
  },
};
</script>

<style lang="scss" scoped>
.sort-btn {
  display: flex;
  align-items: center;
  min-width: 100px;
  height: 36px;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);

  color: #99a0b2;

  text-align: center;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;

  transition: color 0.7s;
}

.sort-btn:hover {
  color: white;
  cursor: pointer;
}

.arrows {
  width: 20px;
  align-items: center;
}

@media screen and (max-width: 600px) {
  .text {
    font-size: 14px;
  }
}
</style>
