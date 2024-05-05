<template>
  <div class="deposited-tooltip triangle">
    <div class="deposited-part staked">
      <span class="title">Staked</span>
      <span class="token-info">
        <BaseTokenIcon
          :name="depositedToken.name"
          :icon="depositedToken.icon"
          size="20px"
        />
        {{ formatTokenBalance(staked) }}
      </span>
    </div>

    <div class="deposited-part locked">
      <span class="title">Locked</span>
      <span class="token-info">
        <BaseTokenIcon
          :name="depositedToken.name"
          :icon="depositedToken.icon"
          size="20px"
        />
        {{ formatTokenBalance(locked) }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { formatTokenBalance } from "@/helpers/filters";
import { useImage } from "@/helpers/useImage";

export default {
  props: {
    staked: { type: [String, Number], default: 0 },
    locked: { type: [String, Number], default: 0 },
    depositedToken: {
      type: Object,
      default: () => {
        return {
          name: "MIM",
          icon: useImage(`assets/images/tokens/MIM.png`),
          decimals: 18,
        };
      },
    },
  },

  methods: {
    formatTokenBalance,
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.deposited-tooltip {
  position: absolute;
  bottom: 150%;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 306px;
  margin: 0 auto;
  z-index: 10;
  padding: 12px 20px;
  border-radius: 12px;
  background: rgb(0, 0, 0);
  backdrop-filter: blur(16px);
}

.triangle::after {
  content: "";
  position: absolute;
  transition: all 0.3s ease-in;
  bottom: -20px;
  left: 28%;
  border-top: 10px solid black;
  border-bottom: 10px solid transparent;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
}

.deposited-part {
  display: flex;
  justify-content: space-between;
  align-items: center;

  color: #fff;
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
}

.token-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.token-icon {
  margin-right: 0 !important;
}

@media (max-width: 500px) {
  .deposited-tooltip {
    left: -90px;
  }

  .triangle::after {
    left: 58%;
  }
}
</style>
