<template>
  <div class="points-earned-wrap">
    <div class="title">
      <img class="label-img" src="@/assets/images/networks/blast.png" />
      Points earned
    </div>

    <div class="points-earned-amount">500</div>
  </div>
</template>

<script>
import { formatLargeSum } from "@/helpers/filters";

export default {
  props: {},

  computed: {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.points-earned-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 52px;
  width: 100%;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: #fcfd02;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #000;
  font-size: 18px;
  font-weight: 600;
  margin: auto auto auto 12px;
}

.label-img {
  width: 32px;
  height: 32px;
  border-radius: 5px;
}

.points-earned-amount {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 120px;
  border-radius: 0px 8px 0px 0px;
  clip-path: polygon(30% 0%, 100% 0%, 70% 100%, 0% 100%);
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  color: #fcfd02;
  font-size: 18px;
  font-weight: 600;
}

@media (max-width: 1300px) {
  .points-earned-wrap {
    max-width: 375px;
  }
}
</style>
