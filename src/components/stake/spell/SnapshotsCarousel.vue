<template>
  <div class="carousel-wrap">
    <h3 class="title">Governance Proposals</h3>
    <Carousel :wrap-around="true" :transition="500" :autoplay="100000">
      <slide :index="1" v-for="data in proposalsData" :key="data.id">
        <CarouselSlide :data="data" />
      </slide>

      <template #addons>
        <pagination />
      </template>
    </Carousel>
  </div>
</template>

<script lang="ts">
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination } from "vue3-carousel";
// @ts-ignore
import { fetchProposals } from "@/helpers/snapshot/fetchProposals";
import { defineAsyncComponent } from "vue";

export default {
  data(): any {
    return {
      proposalsData: [],
    };
  },

  async created() {
    this.proposalsData = await fetchProposals();
  },

  components: {
    Slide,
    Carousel,
    Pagination,
    CarouselSlide: defineAsyncComponent(
      () => import("@/components/stake/spell/CarouselSlide.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.carousel-wrap {
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.title {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.45px;
  margin-bottom: 18px;
}

.carousel {
  max-width: 685px;
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

@media screen and (max-width: 1024px) {
  .carousel {
    max-width: 100%;
  }
}

@media screen and (max-width: 600px) {
  .carousel-wrap {
    padding: 12px;
  }
}
</style>
