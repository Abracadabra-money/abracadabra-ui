<template>
  <div class="user-assets-wrap">
    <div class="asset staked">
      <img
        class="icon-left-top"
        src="@/assets/images/market/m-icon.svg"
        alt=""
      />

      <h4 class="item-title">
        Not-locked
        <Tooltip fill="#99A0B2" tooltip="Not-locked" :width="20" :height="20" />
      </h4>

      <div class="token-amount">
        <BaseTokenIcon :icon="mimIcon" name="MIM" size="32px" />
        {{ unlockedAmount }}
      </div>
    </div>

    <div class="asset locked">
      <img
        class="icon-right-center"
        src="@/assets/images/market/m-icon.svg"
        alt=""
      />

      <h4 class="item-title">
        Locked
        <Tooltip fill="#99A0B2" tooltip="Not-locked" :width="20" :height="20" />
      </h4>

      <div class="token-amount">
        <BaseTokenIcon :icon="mimIcon" name="MIM" size="32px" />
        {{ lockedAmount }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import mimIcon from "@/assets/images/tokens/MIM.png";

export default {
  props: {
    lockedAmount: { type: [String, Number], default: 0 },
    unlockedAmount: { type: [String, Number], default: 0 },
  },

  data() {
    return { mimIcon };
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style scoped>
.user-assets-wrap {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.asset {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 109.5px;
  width: 50%;
  padding: 20px 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.icon-left-top {
  position: absolute;
  top: 17px;
  left: 0;
}

.icon-right-center {
  position: absolute;
  top: 65px;
  right: 0;
}

.item-title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 500;
  color: #99a0b2;
}

.token-amount {
  display: flex;
  align-items: center;
  font-size: 32px;
  font-weight: 500;
}
</style>
