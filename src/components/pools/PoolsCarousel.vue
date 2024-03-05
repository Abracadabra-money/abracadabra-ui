<template>
  <Carousel
    :wrap-around="true"
    :transition="500"
    :autoplay="3000"
    :breakpoints="breakpoints"
  >
    <slide :index="index" v-for="(pool, index) in pools">
      <PoolCard :pool="pool" />
    </slide>

    <template #addons>
      <pagination />
    </template>
  </Carousel>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination } from "vue3-carousel";
import PoolCard from "@/components/pools/PoolCard.vue";

export default {
  props: {
    pools: { type: Array },
  },

  data() {
    return {
      breakpoints: {
        375: {
          itemsToShow: 1,
        },
        768: {
          itemsToShow: 2,
        },
        950: {
          itemsToShow: 3,
        },
        1350: {
          itemsToShow: 3,
        },
      },
    };
  },

  components: { Carousel, Slide, Pagination, PoolCard },
};
</script>

<style lang="scss" scoped>
.carousel {
  width: 100%;
}

.carousel::v-deep(.carousel__slide) {
  padding: 0 8px;
}

.carousel::v-deep(.carousel__pagination-button::after) {
  width: 10px;
  height: 10px;
  border-radius: 6px;
  background-color: rgba(112, 136, 204, 0.4);
}

.carousel::v-deep(.carousel__pagination-button--active::after) {
  transform: scale(1.4);
  background-color: #7088cc;
}
</style>
