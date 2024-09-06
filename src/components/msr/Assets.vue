<template>
  <div class="user-assets-wrap">
    <div
      class="asset deposited"
      @mousemove="showDepositedTooltip = true"
      @mouseleave="showDepositedTooltip = false"
    >
      <img
        class="icon-left-top"
        src="@/assets/images/market/m-icon.svg"
        alt=""
      />

      <template v-if="!showDepositedTooltip">
        <div class="deposit">
          <h4 class="item-title">Deposited</h4>

          <RowSkeleton v-if="isMimSavingRateInfoLoading" />
          <div class="token-amount" v-else>
            <BaseTokenIcon :icon="mimIcon" name="MIM" size="32px" />
            {{ formatTokenBalance(deposited) }}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="deposit-compound">
          <div class="compound-part">
            <h4 class="item-title">Staked</h4>

            <RowSkeleton v-if="isMimSavingRateInfoLoading" />
            <div class="token-amount" v-else>
              <BaseTokenIcon :icon="mimIcon" name="MIM" size="13.75px" />
              {{ formatTokenBalance(unlockedAmount) }}
            </div>
          </div>

          <div class="compound-part">
            <h4 class="item-title">Locked</h4>

            <RowSkeleton v-if="isMimSavingRateInfoLoading" />
            <div class="token-amount" v-else>
              <BaseTokenIcon :icon="mimIcon" name="MIM" size="13.75px" />
              {{ formatTokenBalance(lockedAmount) }}
            </div>
          </div>
        </div>
      </template>
    </div>

    <div class="asset reward">
      <img class="icon-right-center" src="@/assets/images/market/m-icon.svg" />

      <h4 class="item-title">
        Rewards
        <Tooltip fill="#99A0B2" tooltip="Rewards" :width="20" :height="20" />
      </h4>

      <RowSkeleton v-if="isMimSavingRateInfoLoading" />
      <div class="reward-tokens" v-else>
        <div
          class="reward-token"
          v-for="(token, index) in rewardTokens"
          :key="index"
        >
          <BaseTokenIcon :icon="token.icon" :name="token.name" size="24px" />
          {{ token.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import mimIcon from "@/assets/images/tokens/MIM.png";
import { formatTokenBalance } from "@/helpers/filters";

export default {
  props: {
    lockedAmount: { type: [String, Number], default: 0 },
    unlockedAmount: { type: [String, Number], default: 0 },
    rewardTokens: { type: Object },
    depositedToken: { type: Object },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  data() {
    return { mimIcon, showDepositedTooltip: false };
  },

  computed: {
    deposited() {
      return Number(this.lockedAmount) + Number(this.unlockedAmount);
    },
  },

  methods: {
    formatTokenBalance,
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
    RowSkeleton: defineAsyncComponent(
      () => import("@/components/ui/skeletons/RowSkeleton.vue")
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
  justify-content: space-between;
  align-items: center;
  width: 50%;
  height: 84px;
  padding: 12px 24px;
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

.reward {
  border: 1px solid #2d4a96;
  background: linear-gradient(
      90deg,
      rgba(45, 74, 150, 0.32) 0%,
      rgba(116, 92, 210, 0.32) 100%
    ),
    linear-gradient(
      146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%
    );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
}

.icon-left-top {
  position: absolute;
  top: 17px;
  left: 0;
}

.icon-right-center {
  position: absolute;
  top: 0;
  left: 0;
}

.item-title {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 500;
  color: #99a0b2;
}

.token-icon {
  margin-right: 0 !important;
}

.token-amount {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 24px;
  font-weight: 500;
}

.reward-tokens {
  display: flex;
  align-items: center;
  gap: 21px;
}

.reward-token {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.deposit {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.deposit-compound {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 54px;
}

.compound-part {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.compound-part .item-title,
.compound-part .token-amount {
  color: #fff;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

.row-skeleton {
  height: 20px !important;
}

@media (max-width: 500px) {
  .user-assets-wrap {
    flex-direction: column;
  }

  .asset {
    width: 100%;
  }
}
</style>
