<template>
  <div class="points-earned-card">
    <div class="points-earned-title">POINTS EARNED</div>
    <div class="points-earned-value-border">
      <div class="points-earned-value">
        {{ formatAmount(userPointsEarned) }}
      </div>
    </div>
  </div>
</template>

<script>
import { formatTokenBalance } from "@/helpers/filters";

export default {
  props: { userPointsEarned: { type: Number } },

  methods: {
    formatAmount(value) {
      return formatTokenBalance(value);
    },
  },
};
</script>

<style lang="scss" scoped>
.points-earned-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 61px;
  margin-bottom: -1px;
  clip-path: polygon(0 58%, 4% 24%, 22% 22%, 26% 0, 100% 0%, 100% 100%, 0 100%);
  background-color: #fcfd02;
  border: 2px solid #fcfd02;
  color: #000;
  border-radius: 16px 16px 0 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  text-transform: uppercase;
}

.points-earned-value-border {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 101px;
  clip-path: polygon(100% 0, 100% 65%, 90% 100%, 0 100%, 0 0);
  background-color: #fcfd02;
  border-radius: 0 0 16px 16px;
}

.points-earned-value {
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% - 6px);
  height: 95px;
  clip-path: polygon(100% 0, 100% 65%, 90% 100%, 0 100%, 0 0);
  background-color: rgb(15, 16, 31);
  color: #fcfd02;
  border-radius: 0 0 16px 16px;

  font-size: 34px;
  font-weight: 500;
  line-height: 24px;
  text-transform: uppercase;
}
</style>
