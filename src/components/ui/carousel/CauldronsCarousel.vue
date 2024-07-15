<template>
  <Carousel
    :wrap-around="true"
    :transition="500"
    :breakpoints="breakpoints"
    :autoplay="3000"
  >
    <!-- <slide :index="1">
      <CrvUsdMimCard />
    </slide> -->

    <slide :index="1">
      <CamelotCard />
    </slide>

    <slide :index="1">
      <EmpowerCard />
    </slide>

    <slide :index="1">
      <CamelotUsdcMimCard />
    </slide>

    <slide :index="1">
      <MimUsdtArbPool />
    </slide>

    <slide :index="1">
      <MimUsdtKavaPool />
    </slide>

    <slide :index="1">
      <MimUsdcArbPool />
    </slide>

    <template #addons>
      <pagination />
    </template>
  </Carousel>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination } from "vue3-carousel";
// import CrvUsdMimCard from "@/components/cauldrons/promoCards/CrvUsdMimCard.vue";
import CamelotCard from "@/components/cauldrons/promoCards/CamelotCard.vue";
import EmpowerCard from "@/components/cauldrons/promoCards/EmpowerCard.vue";
import CamelotUsdcMimCard from "@/components/cauldrons/promoCards/CamelotUsdcMimCard.vue";
import MimUsdtArbPool from "@/components/cauldrons/promoCards/MimUsdtArbPool.vue";
import MimUsdtKavaPool from "@/components/cauldrons/promoCards/MimUsdtKavaPool.vue";
import MimUsdcArbPool from "@/components/cauldrons/promoCards/MimUsdcArbPool.vue";

export default {
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

  components: {
    CamelotCard,
    EmpowerCard,
    CamelotUsdcMimCard,
    MimUsdtArbPool,
    MimUsdtKavaPool,
    MimUsdcArbPool,
    Carousel,
    Slide,
    Pagination,
    // CrvUsdMimCard,
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
