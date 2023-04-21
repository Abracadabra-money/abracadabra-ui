<template>
  <div class="positions-wrap">
    <div class="positions-header">
      <p>{{ positionsTitle }}</p>
      <button class="btn-more" v-if="!isFarm" @click="toggleShowMore">
        <p class="btn-more-text">Show {{ buttonText }}</p>
        <img class="btn-more-icon" :src="showMoreIcon" alt="Show more" />
      </button>
    </div>

    <div class="position-list">
      <template v-if="!isFarm">
        <CauldronPositionItem
          v-for="cauldron in cauldrons"
          :key="cauldron.id"
          :opened="isShowMore"
          :pool="cauldron"
        />
      </template>
      <template v-else>
        <PositionFarmItem
          v-for="pool in cauldrons"
          :key="pool.id"
          :pool="pool"
        />
      </template>
    </div>
  </div>
</template>

<script>
import iconPlus from "@/assets/images/myposition/Icon-Plus.png";
import iconMinus from "@/assets/images/myposition/Icon-Minus.png";
import CauldronPositionItem from "@/components/myPositions/CauldronPositionItem.vue";
import PositionFarmItem from "@/components/myPositions/PositionFarmItem.vue";

export default {
  props: {
    isFarm: { type: Boolean, default: false },
    cauldrons: { type: Array, default: () => [] },
  },

  data() {
    return {
      isShowMore: false,
    };
  },

  computed: {
    positionsTitle() {
      return this.isFarm ? "Farm" : "Borrow";
    },

    showMoreIcon() {
      return this.isShowMore ? iconMinus : iconPlus;
    },

    buttonText() {
      return this.isShowMore ? "less" : "more";
    },
  },

  methods: {
    toggleShowMore() {
      this.isShowMore = !this.isShowMore;
    },
  },

  components: { CauldronPositionItem, PositionFarmItem },
};
</script>

<style lang="scss" scoped>
.positions-wrap {
  background: #2a2835;
  border-radius: 30px;
  padding: 20px;
}

.positions-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  text-transform: uppercase;
  margin-bottom: 18px;
}

.btn-more {
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.btn-more-text {
  font-size: 14px;
  line-height: 21px;
  background: linear-gradient(107.5deg, #5282fd -3.19%, #76c3f5 101.2%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.btn-more-icon {
  width: 20px;
  height: auto;
  object-fit: contain;
  margin-left: 8px;
}

.position-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media screen and (max-width: 600px) {
  .positions-wrap {
    padding: 20px 10px;
  }
}
</style>
