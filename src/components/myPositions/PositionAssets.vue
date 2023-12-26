<template>
  <div class="assets-wrap">
    <div class="asset">
      <p class="asset-title">Collateral Deposited</p>
      <div class="asset-info">
        <div class="asset-token">
          <BaseTokenIcon class="token-icon" size="44px" />
          <span class="token-name">MIM-2Crv STIP Boosted</span>
        </div>

        <div class="asset-values">
          <span class="token-value">2345325</span>
          <span class="usd-equivalent">$456456</span>
        </div>
      </div>
    </div>

    <div class="asset">
      <p class="asset-title">Mim to Repay</p>
      <div class="asset-info">
        <div class="asset-token">
          <BaseTokenIcon class="token-icon" size="44px" />
          <span class="token-name">MIM</span>
        </div>

        <div class="asset-values">
          <span class="token-value">2345325</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import GetLpLink from "@/components/ui/GetLpLink.vue";
export default {
  props: {
    assetsInfo: {
      type: Object,
      required: true,
    },
  },

  components: {
    BaseTokenIcon,
    GetLpLink,
  },
};
</script>

<style lang="scss" scoped>
.assets-wrap {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.asset {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
  padding: 16px;
  gap: 32px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.04) 0%,
    rgba(116, 92, 210, 0.04) 100%
  );
}

.asset-title {
  font-family: Poppins;
  font-size: 16px;
  font-weight: 500;
}

.asset-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.asset-token {
  display: flex;
  align-items: center;
  gap: 4px;
}

.token-icon {
  margin-right: 0;
}

.token-name {
  color: #fff;
  font-size: 20px;
  font-weight: 500;
}

.asset-values {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 4px;
}

.token-value {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.usd-equivalent {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 400;
}
</style>
