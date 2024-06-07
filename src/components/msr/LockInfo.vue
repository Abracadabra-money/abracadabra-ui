<template>
  <div class="lock-info">
    <p class="total-locked">
      Locked Balance

      <RowSkeleton v-if="isMimSavingRateInfoLoading" />
      <span class="token-amount" v-else>
        <BaseTokenIcon :icon="mimIcon" name="MIM" size="24px" />
        {{ totalLocked }}
      </span>
    </p>

    <p class="description">
      Locked funds will be automatically converted to Staking status upon timer
      completion
    </p>

    <ul class="user-locks" v-if="userLocks.length > 0">
      <UserLock
        v-for="(userLock, index) in userLocks"
        :userLock="{
          ...userLock,
          decimals: mimSavingRateInfo.stakingToken.decimals,
        }"
        :key="index"
      />
    </ul>
    <div class="empty-wrap" v-else>
      <ConnectWalletBlock class="connect-wallet" v-if="!account" />
      <BaseLoader v-else-if="isMimSavingRateInfoLoading" medium />
      <BaseSearchEmpty class="search-empty" v-else />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapGetters, mapMutations } from "vuex";
import { formatTokenBalance } from "@/helpers/filters";
import { formatUnits } from "viem";
import mimIcon from "@/assets/images/tokens/MIM.png";

export default {
  props: {
    mimSavingRateInfo: { type: Object },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  data() {
    return {
      userLocks: [],
      mimIcon,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      localUserLocks: "getUserLocks",
    }),

    totalLocked() {
      return this.account
        ? this.formatTokenBalance(
            formatUnits(
              this.mimSavingRateInfo?.userInfo.balances.locked || 0n,
              this.mimSavingRateInfo?.stakingToken.decimals || 18
            )
          )
        : "0";
    },

    currentDate() {
      return Date.now();
    },
  },

  watch: {
    mimSavingRateInfo() {
      const currentLocks =
        this.mimSavingRateInfo?.userInfo.userLocks.length > 0
          ? this.mimSavingRateInfo?.userInfo.userLocks
          : [];

      const allAvailableLocks = currentLocks
        .map((currentLock) => {
          return { ...currentLock, account: this.account };
        })
        .concat(
          this.localUserLocks.data
            .map((lock) => {
              return {
                ...lock,
                fromStorage: true,
              };
            })
            .filter((lock) => {
              const expired = Number(lock.unlockTime) * 1000 < this.currentDate;
              const isFromCurrent = !!currentLocks.find(
                (currentLock) => currentLock.unlockTime == lock.unlockTime
              );
              const properAccount = lock.account == this.account;

              return (expired && !isFromCurrent) || !properAccount;
            })
        );

      this.userLocks = allAvailableLocks.filter(
        (lock) => lock.account === this.account
      );

      this.setUserLocks(allAvailableLocks);
    },
  },

  methods: {
    ...mapMutations({
      setUserLocks: "setUserLocks",
    }),

    formatTokenBalance,
  },

  components: {
    UserLock: defineAsyncComponent(() =>
      import("@/components/msr/UserLock.vue")
    ),
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
    BaseSearchEmpty: defineAsyncComponent(() =>
      import("@/components/base/BaseSearchEmpty.vue")
    ),
    ConnectWalletBlock: defineAsyncComponent(() =>
      import("@/components/myPositions/ConnectWalletBlock.vue")
    ),
    RowSkeleton: defineAsyncComponent(() =>
      import("@/components/ui/skeletons/RowSkeleton.vue")
    ),
    BaseLoader: defineAsyncComponent(() =>
      import("@/components/base/BaseLoader.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.lock-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 318px;
}

.total-locked {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 500;
}

.token-amount {
  display: flex;
  align-items: center;
  gap: 8px;
}

.token-icon {
  margin-right: 0 !important;
}

.empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  gap: 16px;
  margin: auto;
  padding: 12px 16px 12px 12px;
  max-height: 229px;
}

.description {
  font-size: 14px;
  font-weight: 400;
}

.user-lock-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-locks {
  display: flex;
  flex-direction: column;
  gap: 16px;
  list-style: none;
  width: calc(100% + 16px);
  padding: 0 16px 0 0;
}

.search-empty,
.connect-wallet {
  margin: auto;
  max-height: 132px;
  max-width: 163px;
}

.row-skeleton {
  height: 27px !important ;
}

.spinner {
  max-height: 132px !important;
  max-width: 163px !important;
  padding: 0 !important;
}
</style>
