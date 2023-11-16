<template>
  <div class="farm-card">
    <div class="card-header">
      <TokenChainIcon name="" icon="" />
      <span class="farm-card-name">ETH/SPELL</span>
    </div>

    <ul class="card-stats">
      <li class="tvl">
        <span class="stat-name">TVL</span>
        <span class="stat-value">$25 545.065</span>
      </li>
      <li class="boosted-yield">
        <span class="stat-name">Boosted Yield</span>
        <span class="stat-value">215.65%</span>
      </li>
      <li class="apr">
        <span class="stat-name">APR</span>
        <span class="stat-value">215.65%</span>
      </li>
    </ul>
  </div>
</template>
<script>
import TokenChainIcon from "@/components/ui/icons/arbitrum/TokenChainIcon.vue";

export default {
  components: {
    TokenChainIcon,
  },
};
</script>
<style lang="scss" scoped>
.farm-card {
  width: 302px;
  height: 246px;
  border-radius: 16px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  backdrop-filter: blur(12.5px);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: 16px 16px 0px 0px;
  background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
}

.farm-card-name {
  margin-left: 8px;
}

.card-stats {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 0;
  list-style: none;
}

.tvl {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.tvl .stat-name {
  font-size: 16px;
}

.tvl .stat-value {
  font-size: 28px;
}

.boosted-yield,
.apr {
  display: flex;
  padding: 6px 12px;
  align-items: center;
  gap: 12px;
  border-radius: 12px;
  border: 1px solid var(--primary-gradient, #2d4a96);
}

.boosted-yield {
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.32) 0%,
    rgba(116, 92, 210, 0.32) 100%
  );
}

.apr {
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
}

.stat-name {
  font-size: 14px;
  font-weight: 500;
  color: #878b93;
}

.stat-value {
  font-size: 16px;
  font-weight: 400;
}
</style>
