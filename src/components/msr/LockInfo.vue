<template>
  <div class="lock-info">
    <p class="total-locked">
      Total Locked:
      <span class="token-amount">{{ totalLocked }}</span>
    </p>

    <div class="empty-wrap" v-if="account">
      <div class="user-lock-wrap" v-if="userLocks.length > 0">
        <p class="description">
          Your MIM will bla bla bla and when lock time is ended > your MIM will
          migrate to Staked MIM where you can Unstake it
        </p>

        <ul class="user-locks">
          <UserLock
            v-for="(userLock, index) in userLocks"
            :userLock="{
              ...userLock,
              decimals: mimSavingRateInfo.stakingToken.decimals,
            }"
            :key="index"
          />
        </ul>
      </div>

      <BaseSearchEmpty class="search-empty" v-else />
    </div>

    <ConnectWalletBlock class="connect-wallet" v-if="!account" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserLock from "@/components/msr/UserLock.vue";
import BaseSearchEmpty from "@/components/base/BaseSearchEmpty.vue";
import ConnectWalletBlock from "@/components/myPositions/ConnectWalletBlock.vue";
import { formatTokenBalance } from "@/helpers/filters";
import { formatUnits } from "viem";

export default {
  props: {
    mimSavingRateInfo: { type: Object },
  },

  computed: {
    ...mapGetters({ account: "getAccount" }),

    totalLocked() {
      return this.account
        ? `${this.formatTokenBalance(
            formatUnits(
              this.mimSavingRateInfo.userInfo.balances.locked,
              this.mimSavingRateInfo.stakingToken.decimals
            )
          )} MIM`
        : "-";
    },

    userLocks() {
      return this.mimSavingRateInfo.userInfo.userLocks;
    },
  },

  methods: {
    formatTokenBalance,
  },

  components: { UserLock, BaseSearchEmpty, ConnectWalletBlock },
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.lock-info {
  display: flex;
  flex-direction: column;
  margin-top: auto;
  gap: 16px;
  height: 250px;
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

.total-locked {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 500;
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
  max-height: 188px;
  max-width: 231px;
}
</style>
