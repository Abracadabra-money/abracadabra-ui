<template>
  <Carousel :wrap-around="true" :transition="500" :breakpoints="breakpoints">
    <slide :index="0" v-if="isLockedPosition">
      <PoolCard :stakeInfo="stakeInfo" isLocked />
    </slide>

    <slide :index="1" v-if="isUnlockedPosition">
      <PoolCard :stakeInfo="stakeInfo" />
    </slide>

    <slide :index="2" v-if="cauldronInfo?.userPosition?.collateralDeposited">
      <BlastCauldronCard :cauldronInfo="cauldronInfo" />
    </slide>

    <template #addons>
      <pagination />
    </template>
  </Carousel>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination } from "vue3-carousel";
import PoolCard from "@/components/blastOnboarding/cards/PoolCard.vue";
import BlastCauldronCard from "@/components/blastOnboarding/cards/BlastCauldronCard.vue";

export default {
  props: {
    stakeInfo: { type: Object },
    cauldronInfo: { type: Object },
    isLockedPosition: { type: Boolean },
    isUnlockedPosition: { type: Boolean },
    isCauldronPosition: { type: Boolean },
  },

  data() {
    return {
      breakpoints: {
        1350: {
          itemsToShow: 1,
        },
      },
    };
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
  width: 100%;
  padding: 0 4px 0 10px;
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
