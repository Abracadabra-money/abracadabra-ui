<template>
  <Carousel :wrap-around="true" :transition="500" :autoplay="3000">
    <slide :index="0">
      <PoolCard :stakeInfo="stakeInfo" />
    </slide>

    <slide :index="1">
      <BlastCauldronCard />
    </slide>

    <template #addons>
      <pagination />
    </template>
  </Carousel>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination } from "vue3-carousel";
import PoolCard from "@/components/blastStatistics/cards/PoolCard.vue";
import BlastCauldronCard from "@/components/blastStatistics/cards/BlastCauldronCard.vue";

export default {
  props: {
    stakeInfo: { type: Object },
  },

  components: {
    Carousel,
    Slide,
    Pagination,
    PoolCard,
    BlastCauldronCard,
  },
};
</script>

<style lang="scss" scoped>
.carousel {
  width: 100%;
  padding: 1px;
  overflow: hidden;
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
