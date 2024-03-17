<template>
  <div :class="['card', { gold: pointsInfo?.gold }]">
    <div class="label">{{ pointsInfo.label }}</div>

    <div class="source-points">
      <div class="icons-wrap">
        <img class="source-icon" :src="pointsInfo.icon" alt="Token icon" />

        <img class="chain-icon" :src="getChainIcon(81457)" alt="Chain icon" />
      </div>

      <div class="source-description">
        <div class="description-title">{{ pointsInfo.title }}</div>
        <div class="description-subtitle">{{ pointsInfo.subtitle }}</div>
      </div>
    </div>

    <div class="deposited">
      <div class="deposited-text">Deposited</div>
      <div class="deposited-value">
        <img
          v-if="pointsInfo.deposited?.icon"
          class="deposited-icon"
          :src="pointsInfo.deposited.icon"
          alt="Token icon"
        />
        {{ pointsInfo.deposited.value }}
      </div>
    </div>

    <div class="line"></div>

    <ul class="list">
      <li class="list-item">
        <div class="item-title">Points Earned</div>
        <div class="item-value">
          <div class="item-amount">220,395</div>
          <div class="item-price">$200,000</div>
        </div>
      </li>
      <li class="list-item">
        <div class="item-title">Points Pending</div>
        <div class="item-value">410.00</div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { getChainIcon } from "@/helpers/chains/getChainIcon";

export default {
  props: {
    pointsInfo: {} as any,

    gold: {
      type: Boolean,
      default: false,
    },
  },

  methods: { getChainIcon },
};
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  max-width: 411px;
  width: 100%;
  padding: 40px 16px 22px;
  border-radius: 16px;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
  backdrop-filter: blur(12.5px);
  border: 1px solid #fcfd02;
  margin: 0 auto;
}

.gold {
  background: linear-gradient(
      104deg,
      rgba(251, 253, 3, 0.21) 0%,
      rgba(251, 253, 3, 0.21) 28.64%,
      rgba(254, 255, 172, 0.21) 52.14%,
      rgba(253, 255, 0, 0.21) 70.64%,
      rgba(253, 255, 0, 0.21) 100%
    ),
    linear-gradient(
      146deg,
      rgba(35, 0, 0, 0.07) 0%,
      rgba(156, 0, 0, 0.07) 101.49%
    ),
    linear-gradient(
      146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%
    );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
  backdrop-filter: blur(12.5px);
}

.label {
  position: absolute;
  top: 0;
  left: -1px;
  border-radius: 16px 0 8px 0;
  background: #fcfd02;
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-size: 12px;
  font-weight: 500;
}

.source-points {
  gap: 10px;
  display: flex;
  align-items: center;
  margin-bottom: 14px;
}

.icons-wrap {
  position: relative;
  width: 44px;
  height: 44px;
  margin-right: 6px;
}

.source-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.chain-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  top: -5px;
  right: -10px;
  border: 1px solid #0d1427;
}

.source-description {
  font-weight: 500;
}

.description-title {
  font-size: 20px;
  line-height: 150%;
}

.description-subtitle {
  font-size: 16px;
  line-height: 150%;
}

.deposited {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.deposited-text {
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
}

.deposited-value {
  font-size: 16px;
  font-weight: 500;
  line-height: 150%;
  gap: 4px;
  display: flex;
  align-items: center;
}

.deposited-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.line {
  height: 1px;
  width: 100%;
  margin: 8px 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(242, 242, 242, 0.12) 47.5%,
    rgba(255, 255, 255, 0) 100%
  );
}

.list {
  gap: 4px;
  display: flex;
  flex-direction: column;
  list-style: none;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-value {
  font-weight: 500;
}

.item-amount {
  color: #fcfd02;
}

.item-price {
  color: #878b93;
  font-size: 14px;
}
</style>
