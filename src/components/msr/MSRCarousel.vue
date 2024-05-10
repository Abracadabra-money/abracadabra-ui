<template>
  <div
    :class="[
      'carousel-container',
      {
        active: isCarouselMode,
        inactive: !isCarouselMode,
      },
    ]"
  >
    <CarouselTabs
      :items="tabItems"
      :name="activeTabItem"
      activeColor="white"
      @select="$emit('selectAction', $event)"
    />

    <div class="carousel">
      <div
        class="carousel-track"
        :style="{ transform: `translateX(${translateOffset}px)` }"
      >
        <div
          class="carousel-item"
          v-for="(item, index) in actions"
          :key="index"
          :class="{
            active: index === activeIndex,
            inactive: isCarouselMode && index !== activeIndex,
            odd: index % 2 != 0,
            even: index % 2 == 0,
          }"
        >
          <img class="item-image" :src="item.image" />
        </div>
      </div>
    </div>

    <template v-if="isCarouselMode">
      <TotalInfo
        :mimSavingRateInfo="mimSavingRateInfo"
        :activeTabItem="activeTabItem"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import type { MimSavingRateInfo } from "@/helpers/mimSavingRate/getMimSavingRateInfo";
import type { MSRAction, MSRActionName } from "@/views/MimSavingRate.vue";

export default {
  props: {
    mimSavingRateInfo: { type: Object as PropType<MimSavingRateInfo | null> },
    actions: { type: Array as PropType<MSRAction[]>, required: true },
    activeIndex: {
      type: Number as unknown as PropType<number | null>,
    },
    isCarouselMode: { type: Boolean, required: true },
  },

  data() {
    return {
      itemWidth: 240,
    };
  },

  computed: {
    tabItems(): MSRActionName[] {
      return this.actions.map((action: MSRAction) => action.name);
    },

    activeTabItem(): MSRActionName {
      return (
        this.actions.find((action: MSRAction) => action.id == this.activeIndex)
          ?.name || "Lock"
      );
    },

    translateOffset(): number {
      if (this.activeIndex === null || this.activeIndex === undefined) return 0;
      const middleIndex = Math.floor(this.actions.length / 2);
      let marginalElementsOffset = 0;

      return (
        (middleIndex - this.activeIndex) * this.itemWidth -
        marginalElementsOffset
      );
    },
  },

  components: {
    TotalInfo: defineAsyncComponent(
      () => import("@/components/msr/TotalInfo.vue")
    ),
    CarouselTabs: defineAsyncComponent(
      () => import("@/components/msr/CarouselTabs.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.carousel-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  height: calc(100vh - 186px);
  overflow: hidden;
}

.carousel {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.carousel-container.active .carousel,
.carousel-container.active .carousel .carousel-track {
  width: auto;
}

.carousel-track {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;
  width: 100%;
  transition: transform 0.5s;
}

.carousel-item {
  min-width: 200px;
  transform: scale(180%);
  transition: transform 0.5s ease-in;
  margin: 20px;
  cursor: pointer;
}

.item-content {
  position: relative;
  min-width: 100%;
  height: 100%;
}

.item-name {
  display: block;
  font-size: 32px;
  font-weight: 600;
  text-align: center;
}

.item-image {
  width: 200px;
}

.carousel-item:hover .item-content .item-name,
.carousel-item.active .item-content .item-name {
  opacity: 1 !important;
}

.carousel-item.active {
  transform: scale(275%);
  opacity: 1 !important;
  z-index: 2;
}

.carousel-item.inactive {
  opacity: 0;
}

.switch {
  position: absolute;
  top: 0;
  z-index: 1;
}

@media (max-width: 760px) {
  .carousel-container {
    width: 191px;
    height: 100%;
  }

  .carousel-container.inactive {
    overflow: visible;
    height: 100%;
  }

  .carousel {
    width: auto;
    overflow: visible;
  }

  .carousel-container.inactive .carousel .carousel-track {
    flex-direction: column;
    width: auto;
    height: 100%;
    overflow: visible;
  }

  .carousel-item.active {
    transform: scale(1);
    margin: 50px 20px 20px 20px;
  }

  .item-name {
    font-size: 24px;
    opacity: 1;
  }

  .arrow {
    width: 40px;
  }
}
</style>
