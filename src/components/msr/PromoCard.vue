<template>
  <div class="lock-promo deposited" v-if="isStake">
    <div class="promo-title">
      <h4 class="promo-message">Lock your Staked MIM for Boosted APR</h4>

      <div class="apr-wrap">
        <span class="apr-message">Boosted APR</span>
        <RowSkeleton v-if="isMimSavingRateInfoLoading" />
        <span class="apr-value" v-else>{{ formatPercent(boostedApr) }}</span>
      </div>
    </div>

    <div class="staking-wrap">
      <div class="currently-staked">
        <div class="title">You Currently Staking</div>

        <RowSkeleton v-if="isMimSavingRateInfoLoading" />
        <div class="token-amount" v-else>
          <BaseTokenIcon
            :icon="mimSavingRateInfo?.stakingToken.icon || mimIcon"
            :name="mimSavingRateInfo?.stakingToken.name || 'MIM'"
            size="32px"
          />
          {{ formatAmount(mimSavingRateInfo?.userInfo.balances.unlocked) }}
        </div>
      </div>
    </div>
  </div>

  <div class="lock-promo no-deposited" v-else>
    <p class="no-deposit-description">
      Staking allows for instant withdrawls, while the lock option provides a
      boosted APR
    </p>

    <div class="min-max-apr">
      <div class="staked-apr-wrap">
        <span class="apr-title">Staked APR</span>
        <RowSkeleton v-if="isMimSavingRateInfoLoading" />
        <span class="staked-apr-value" v-else>{{
          formatPercent(mimSavingRateInfo?.baseApr || 0)
        }}</span>
      </div>

      <div class="locked-apr-wrap">
        <span class="apr-title">Locked APR</span>
        <RowSkeleton v-if="isMimSavingRateInfoLoading" />
        <span class="locked-apr-value" v-else>{{
          formatPercent(boostedApr)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { formatPercent, formatTokenBalance } from "@/helpers/filters";
import { formatUnits } from "viem";
import mimIcon from "@/assets/images/tokens/MIM.png";

export default {
  props: {
    mimSavingRateInfo: {
      type: null as any,
      default: null,
      required: false,
    },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  data() {
    return {
      mimIcon,
    };
  },

  computed: {
    boostedApr() {
      return (this.mimSavingRateInfo?.baseApr || 0) * 3;
    },

    isStake() {
      if (this.isMimSavingRateInfoLoading) return false;
      const { unlocked } = this.mimSavingRateInfo!.userInfo.balances;
      return unlocked > 0n;
    },
  },

  methods: {
    formatPercent,

    formatAmount(amount: bigint) {
      return formatTokenBalance(
        formatUnits(amount, this.mimSavingRateInfo?.stakingToken.decimals || 18)
      );
    },
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    RowSkeleton: defineAsyncComponent(
      () => import("@/components/ui/skeletons/RowSkeleton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.lock-promo {
  display: flex;
  flex-direction: column;
  gap: 21px;
  height: 191px;
  margin-top: auto;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0px 4px 29.8px 0px rgba(0, 0, 0, 0.42) inset;
  backdrop-filter: blur(50px);
  cursor: pointer;
}

.deposited {
  background: url("@/assets/images/msr/mim-bg-image.png"),
    linear-gradient(
      90deg,
      rgba(45, 74, 150, 0.34) 0%,
      rgba(116, 92, 210, 0.34) 100%
    );
  background-position: right 0 bottom 0;
  background-repeat: no-repeat;
}

.no-deposited {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-image: url("@/assets/images/msr/lock-promo-card-background.svg");
  background-position: top -10px left 0;
  background-repeat: no-repeat;
}

.currently-staked {
  width: 50%;
}

.promo-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 42px;
}

.promo-message {
  max-width: 241px;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
}

.apr-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 90px;
}

.apr-message {
  font-size: 14px;
  font-weight: 500;
}

.apr-value {
  color: #fff;
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 32px;
  font-weight: 500;
}

.staking-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.currently-staked {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  font-size: 18px;
  width: 175px;
}

.title {
  font-size: 14px;
  font-weight: 500;
}

.token-amount {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 38px;
}

.row-skeleton {
  background-image: linear-gradient(
    90deg,
    #2d4b966d 0px,
    #745cd27a 60px,
    #2d4b966d 120px
  ) !important;
}

.apr-wrap .row-skeleton {
  height: 24px !important ;
}

.row-skeleton {
  height: 32px !important ;
}

.no-deposit-description {
  font-size: 16px;
  font-weight: 500;
  line-height: 30px;
  justify-self: center;
  align-self: center;
}

.min-max-apr {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 0 18px 0;
}

.staked-apr-wrap,
.locked-apr-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.apr-title {
  font-size: 14px;
  font-weight: 500;
}

.staked-apr-value,
.locked-apr-value {
  font-size: 34px;
  font-weight: 600;
}

.locked-apr-value {
  color: #806ec6;
}

@media (max-width: 500px) {
  .lock-promo {
    margin-top: 0;
  }

  .no-deposited {
    background-position: top -10px left -80px;
  }

  .apr-value {
    font-size: 28px;
  }

  .promo-message {
    font-size: 18px;
  }

  .token-amount {
    font-size: 32px;
  }

  .no-deposit-description {
    font-size: 14px;
    line-height: 24px;
  }
}
</style>
