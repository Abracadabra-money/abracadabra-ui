<template>
  <div class="card">
    <div class="card-head">
      <h3 class="title"><span>Next Airdrop in</span> <Timer airdrop dark /></h3>

      <div class="tabs-wrap">
        <button
          :class="['tabs-item', { 'tab-active': activeTab === 1 }]"
          @click="changeTab(1)"
        >
          <img
            class="tab-icon"
            src="@/assets/images/points-dashboard/blast.png"
            alt=""
          />
        </button>
        <button
          :class="['tabs-item', { 'tab-active': activeTab === 2 }]"
          @click="changeTab(2)"
        >
          <img
            class="tab-icon"
            src="@/assets/images/points-dashboard/gold-points.svg"
            alt=""
          />
        </button>
        <button
          :class="['tabs-item', { 'tab-active': activeTab === 3 }]"
          @click="changeTab(3)"
        >
          <img
            class="tab-icon"
            src="@/assets/images/points-dashboard/potion.png"
            alt=""
          />
        </button>
      </div>
    </div>

    <div class="card-body" v-if="activeTab === 1">
      <div class="total-points">
        <span class="total-title">Points</span>
        <span class="total-earned">{{
          formatTokenBalance(liquidityPoints)
        }}</span>
      </div>

      <div class="pending-info">
        Earning
        <span class="pending-amount">{{
          formatTokenBalance(pendingLiquidityPoints)
        }}</span>
        Points Per Hour
      </div>
    </div>
    <div class="card-body" v-else-if="activeTab === 2">
      <div class="total-points">
        <span class="total-title">Gold</span>
        <span class="total-earned">{{
          formatTokenBalance(developerPoints)
        }}</span>
      </div>

      <div class="pending-info">
        Earning
        <span class="pending-amount">{{
          formatTokenBalance(pendingDeveloperPoints)
        }}</span>
        Gold Per Hour
      </div>
    </div>
    <div class="card-body" v-else>
      <div class="total-points">
        <span class="total-title">Potion</span>
        <span class="total-earned">{{ formatTokenBalance(potionPoints) }}</span>
      </div>

      <div class="pending-info">
        Earning
        <span class="pending-amount">{{
          formatTokenBalance(pendingPotionPoints)
        }}</span>
        Potions Per Hour
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { formatTokenBalance } from "@/helpers/filters";

export default {
  props: {
    liquidityPoints: { type: Number, default: 0 },
    pendingLiquidityPoints: { type: Number, default: 0 },
    developerPoints: { type: Number, default: 0 },
    pendingDeveloperPoints: { type: Number, default: 0 },
    potionPoints: { type: Number, default: 0 },
    pendingPotionPoints: { type: Number, default: 0 },
  },

  data() {
    return {
      activeTab: 1,
    };
  },

  methods: {
    formatTokenBalance,

    changeTab(tab: number) {
      this.activeTab = tab;
    },
  },

  components: {
    Timer: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/stake/earnPoints/Timer.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.card {
  max-width: 501px;
  padding: 7px 2px 2px;
  width: 100%;
  background: #fcfd02;
  border-radius: 12px;
  clip-path: polygon(
    87px 10px,
    100px 0,
    100% 0,
    100% 80%,
    90% 100%,
    51% 100%,
    22% 100%,
    0 100%,
    0 27px,
    20px 10px
  );
  max-height: 169px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  padding: 0 14px;
}

.title {
  color: #000;
  font-family: Poppins;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-transform: uppercase;
  gap: 12px;
  display: flex;
  align-items: center;
}

.tabs-wrap {
  max-width: 228px;
  width: 100%;
  padding: 5px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(16, 18, 23, 0.81);
  display: flex;
  align-items: center;
}

.tabs-item {
  max-width: 72px;
  width: 100%;
  height: 36px;
  border: none;
  outline: transparent;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.tab-active {
  border-radius: 8px;
  background: #101217;
  object-fit: cover;
}

.tab-icon {
  width: 24px;
  height: 24px;
}

.total-points {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  border-bottom: 2px solid #fcfd02;
  background: #000;
  padding: 10px 16px;
}

.total-title {
  font-size: 18px;
  font-weight: 500;
}

.total-earned {
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
}

.pending-info {
  width: 100%;
  display: block;
  align-items: center;
  justify-content: center;
  background: #000;
  padding: 15px;
  text-align: center;
  border-radius: 0 0 12px 12px;
  clip-path: polygon(100% 0, 100% 37%, 90% 100%, 0 100%, 0 0);
  color: var(--additional-ffffff, #fff);
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
}

.pending-amount {
  color: #fcfd02;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.empty-info {
  background: #000;
  width: 100%;
  height: 107px;
  clip-path: polygon(100% 0, 100% 69%, 90% 100%, 0 100%, 0 0);
  border-radius: 0 0 12px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 500;
}

@media screen and (max-width: 1024px) {
  .card {
    margin: 0 auto;
  }
}

@media screen and (max-width: 600px) {
  .card {
    max-height: initial;
    padding-top: 18px;
  }

  .card-head {
    margin-bottom: 8px;
  }

  .title {
    gap: 4px;
    flex-direction: column;
  }

  .tabs-wrap {
    max-width: 156px;
  }

  .tabs-item {
    max-width: 48px;
  }

  .pending-info {
    clip-path: polygon(100% 0, 100% 34%, 90% 100%, 0 100%, 0 0);
  }

  .empty-info {
    clip-path: polygon(100% 0, 100% 66%, 90% 100%, 0 100%, 0 0);
  }
}
</style>
