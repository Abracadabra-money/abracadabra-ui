<template>
  <div class="msr-view">
    <div :class="['carousel-container', { active: isCarouselMode }]">
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
              <span class="item-name">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <CarouselNavigation
        :mimSavingRateInfo="mimSavingRateInfo"
        @next="next"
        @prev="prev"
        v-if="isCarouselMode"
      />
    </div>

    <ActionBlock
      :activeAction="activeAction"
      :mimSavingRateInfo="mimSavingRateInfo"
      @chooseLockAction="selectAction(1)"
      @updateMimSavingRateInfo="createMimSavingRateInfo"
      v-if="isCarouselMode"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { getMimSavingRateInfo } from "@/helpers/mimSavingRate/getMimSavingRateInfo";
import { ARBITRUM_CHAIN_ID } from "@/constants/global.ts";

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
      mimSavingRateInfo: null,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      getChainById: "getChainById",
    }),

    translateOffset() {
      if (this.activeIndex === null) return 0;
      const middleIndex = Math.floor(this.actions.length / 2);
      let marginalElementsOffset = 0;
      switch (this.activeIndex) {
        case 0:
          marginalElementsOffset = -40;
          break;

        case 2:
          marginalElementsOffset = 40;
          break;

        default:
          break;
      }

      return (
        (middleIndex - this.activeIndex) * this.itemWidth -
        marginalElementsOffset
      );
    },

    activeAction() {
      return this.actions[this.activeIndex].name;
    },

    isCarouselMode() {
      return this.activeIndex !== null;
    },
  },

  watch: {
    async account() {
      await this.createMimSavingRateInfo();
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

    async createMimSavingRateInfo() {
      const publicClient = this.getChainById(ARBITRUM_CHAIN_ID).publicClient;

      this.mimSavingRateInfo = await getMimSavingRateInfo(
        this.account,
        publicClient
      );

      console.log(this.mimSavingRateInfo);
    },
  },

  async created() {
    await this.createMimSavingRateInfo();
  },

  components: {
    ActionBlock: defineAsyncComponent(() =>
      import("@/components/msr/ActionBlock.vue")
    ),
    CarouselNavigation: defineAsyncComponent(() =>
      import("@/components/msr/CarouselNavigation.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.msr-view {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 931px;
}

.carousel-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 127px;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  align-items: center;
  transition: transform 0.5s;
}

.carousel-item {
  min-width: 200px;
  height: 200px;
  transition: all 0.5s ease-in-out;
  margin: 20px;
  cursor: pointer;
}

.carousel-item:hover {
  transform: scale(110%);
}

.item-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.item-name {
  display: none;
  position: absolute;
  left: calc(50% - 65px);
  width: 130px;
  font-size: 24px;
  font-weight: 500;
  text-align: center;
}

.carousel-item:hover .item-content .item-name,
.carousel-item.active .item-content .item-name {
  transform: translateY(-50px);
  display: block;
}

.carousel-item.active {
  transform: scale(250%);
  margin: 0 400px;
  opacity: 1 !important;
}

.carousel-item.inactive {
  opacity: 0.5;
}
</style>
