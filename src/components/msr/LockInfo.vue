<template>
  <div class="lock-info">
    <p class="total-locked">
      Locked Balance
      <span class="token-amount">
        <BaseTokenIcon :icon="mimIcon" name="MIM" size="24px" />
        {{ totalLocked }}</span
      >
    </p>

    <p class="description">
      Locked funds will be automatically converted to Staking status upon timer
      completion
    </p>

    <div class="empty-wrap" v-if="account">
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

      <BaseSearchEmpty class="search-empty" v-else />
    </div>

    <ConnectWalletBlock class="connect-wallet" v-if="!account" />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { formatTokenBalance } from "@/helpers/filters";
import { formatUnits } from "viem";
import mimIcon from "@/assets/images/tokens/MIM.png";

export default {
  props: {
    mimSavingRateInfo: { type: Object },
  },

  data() {
    return {
      mimIcon,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount" }),

    totalLocked() {
      return this.account
        ? this.formatTokenBalance(
            formatUnits(
              this.mimSavingRateInfo.userInfo.balances.locked,
              this.mimSavingRateInfo.stakingToken.decimals
            )
          )
        : "-";
    },

    userLocks() {
      return this.mimSavingRateInfo.userInfo.userLocks;
    },
  },

  methods: {
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
  },
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.lock-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
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
  align-items: flex-start;
  align-self: stretch;
  gap: 16px;
  min-height: 138px;
  padding: 12px 16px 12px 12px;
  border-radius: 10px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
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
  max-height: 146px;
  padding: 0 16px 0 0;
  overflow-y: auto;
}

.search-empty,
.connect-wallet {
  margin: auto;
  max-height: 131px;
  max-width: 163px;
}
</style>
