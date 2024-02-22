<template>
  <div class="msr-view">
    <div class="carousel-container">
      <div class="carousel">
        <div
          class="carousel-track"
          :style="{ transform: `translateX(${translateOffset}px)` }"
        >
          <div
            class="carousel-item"
            v-for="(item, index) in actions"
            :key="index"
            :class="{ active: index === activeIndex, inactive: isCarouselMode }"
          >
            <div
              class="item-content"
              @click="selectAction(index)"
              :style="{ backgroundColor: item.color }"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="arrows" v-if="isCarouselMode">
        <button @click="prev" class="arrow left">&lt;</button>
        <button @click="next" class="arrow right">&gt;</button>
      </div>
    </div>

    <ActionBlock
      :activeAction="activeAction"
      @chooseLockAction="selectAction(1)"
      v-if="isCarouselMode"
    />
  </div>
</template>

<script>
import ActionBlock from "@/components/msr/ActionBlock.vue";

export default {
  data() {
    return {
      actions: [
        { id: 0, color: "blue", name: "Stake" },
        { id: 1, color: "blueviolet", name: "Lock" },
        { id: 2, color: "gold", name: "Claim" },
      ],
      activeIndex: null,
      itemWidth: 200,
    };
  },

  computed: {
    translateOffset() {
      if (this.activeIndex === null) return 0;
      const middleIndex = Math.floor(this.actions.length / 2);
      return (middleIndex - this.activeIndex) * this.itemWidth;
    },

    activeAction() {
      return this.actions[this.activeIndex].name;
    },

    isCarouselMode() {
      return this.activeIndex !== null;
    },
  },

  methods: {
    selectAction(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    },

    prev() {
      if (this.activeIndex === 0)
        return (this.activeIndex = this.actions.length - 1);
      this.activeIndex = this.activeIndex - 1;
    },

    next() {
      if (this.activeIndex === this.actions.length - 1)
        return (this.activeIndex = 0);
      this.activeIndex = this.activeIndex + 1;
    },
  },

  components: {
    ActionBlock,
  },
};
</script>

<style lang="scss" scoped>
.msr-view {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  min-height: 100dvh;
  padding: 110px 80px 0 0;
}

.carousel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  overflow-y: visible;
  overflow-x: hidden;
}

.carousel-track {
  display: flex;
  align-items: center;
  height: 450px;
  transition: transform 0.5s;
}

.carousel-item {
  min-width: 200px;
  height: 200px;
  overflow: hidden;
  margin-right: 20px;
  transition: all 0.5s ease-in-out;
  cursor: pointer;
}

.carousel-item:hover {
  transform: scale(110%);
}

.carousel-item:hover {
  transform: scale(110%);
}

.item-content {
  width: 100%;
  height: 100%;
}

.carousel-item.active {
  transform: scale(200%);
  margin: 0 400px;
  opacity: 1 !important;
  overflow: hidden;
}

.carousel-item.inactive {
  opacity: 0.5;
}

.arrows {
  position: absolute;

  bottom: 50px;
}

.arrow {
  background-color: transparent;
  border: none;
  color: rgb(249, 245, 245);
  font-size: 40px;
  cursor: pointer;
  z-index: 2;
}
</style>
