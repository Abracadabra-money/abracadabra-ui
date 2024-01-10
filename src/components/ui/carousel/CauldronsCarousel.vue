<template>
  <Carousel :transition="1000" :wrap-around="true" :breakpoints="breakpoints">
    <slide :index="1">
      <CamelotCard />
    </slide>
    <slide :index="2">
      <EmpowerCard />
    </slide>
    <slide :index="2">
      <CamelotUsdcMimCard />
    </slide>

    <template #addons>
      <pagination />
    </template>
  </Carousel>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import CamelotCard from "@/components/cauldrons/CamelotCard.vue";
import EmpowerCard from "@/components/cauldrons/EmpowerCard.vue";
import CamelotUsdcMimCard from "@/components/cauldrons/CamelotUsdcMimCard.vue";

export default {
  data() {
    return {
      breakpoints: {
        375: {
          itemsToShow: 1,
        },
        600: {
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

  components: {
    CamelotCard,
    EmpowerCard,
    CamelotUsdcMimCard,
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
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
