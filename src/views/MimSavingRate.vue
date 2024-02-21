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
            v-for="(item, index) in items"
            :key="index"
            :class="{ active: index === activeIndex }"
          >
            <div
              class="item-content"
              @click="selectItem(index)"
              :style="{ backgroundColor: item.color }"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="arrows" v-if="activeIndex !== null">
        <button @click="prev" class="arrow left">&lt;</button>
        <button @click="next" class="arrow right">&gt;</button>
      </div>
    </div>

    <ActionBlock :activeAction="activeAction" v-if="activeIndex !== null" />
  </div>
</template>

<script>
import ActionBlock from "@/components/msr/ActionBlock.vue";

export default {
  data() {
    return {
      items: [
        { id: 0, color: "blue", name: "Stake" },
        { id: 1, color: "blueviolet", name: "Lock" },
        { id: 2, color: "gold", name: "Claim" },
      ],
      activeIndex: null,
      isCarouselMode: false,
      itemWidth: 200,
    };
  },

  computed: {
    translateOffset() {
      if (this.activeIndex === null) return 0;
      const middleIndex = this.items.length / 2;
      return (middleIndex - this.activeIndex) * this.itemWidth;
    },

    activeAction() {
      return this.items[this.activeIndex].name;
    },
  },

  methods: {
    selectItem(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    },

    prev() {
      if (this.activeIndex === 0)
        return (this.activeIndex = this.items.length - 1);
      this.activeIndex = this.activeIndex - 1;
    },

    next() {
      if (this.activeIndex === this.items.length - 1)
        return (this.activeIndex = 0);
      this.activeIndex = this.activeIndex + 1;
    },
  },

  components: {
    ActionBlock,
  },
};
</script>

<style scoped>
.msr-view {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 100dvh;
  padding: 110px 80px;
}

.carousel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
  width: 200px;
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
  border: 2px solid black;
  transform: scale(200%);
  margin: 0 400px;
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

.action-block {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 762px;
  min-width: 533px;
  padding: 24px;

  border-radius: 20px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}
</style>
