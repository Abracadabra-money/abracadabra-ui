<template>
  <div class="pool-compound-card">
    <div class="lp-token">
      <BaseTokenIcon :name="lpToken.name" :icon="lpToken.icon" size="40px" />
      <div class="token-amount">
        <span class="value">{{ lpToken.amount }}</span>
        <span class="usd">{{ lpToken.amountUsd }}</span>
      </div>
    </div>

    <ul class="deposited-token-parts token-list">
      <li
        class="deposited-token-part list-item"
        v-for="token in tokensList"
        :key="token.name"
      >
        <span class="token-name">
          <BaseTokenIcon :icon="token.icon" :name="token.name" size="28px" />
          {{ token.name }}</span
        >
        <div class="token-amount">
          <span class="value">{{ token.amount }}</span>
          <span class="usd">{{ token.amountUsd }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { formatTokenBalance } from "@/helpers/filters";
import { fetchUserPointsStatistics } from "@/helpers/blast/stake/points";

export default {
  props: {
    lpToken: { type: Object },
    tokensList: { type: Array },
  },

  emits: ["closePopup", "updateInfo"],

  data() {
    return {
      userPointsStatistics: null,
      activeTab: "deposited",
      tabItems: ["deposited", "staked", "locked"],
    };
  },

  computed: {
    pointsEarned() {
      return formatTokenBalance(
        this.userPointsStatistics?.liquidityPoints?.total?.finalized
      );
    },

    disableEarnedButton() {
      return true;
    },
  },

  methods: {
    selectTab(action) {
      this.activeTab = action;
    },

    onUpdate() {
      this.$emit("updateInfo");
    },

    closePopup() {
      this.$emit("closePopup");
    },
  },

  async created() {
    this.userPointsStatistics = await fetchUserPointsStatistics(this.account);
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-compound-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 26px;
  border-radius: 16px;
  background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
}

.lp-token {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lp-token .token-amount {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.lp-token .token-amount .value {
  font-size: 24px;
  font-weight: 500;
  line-height: 24px;
}

.lp-token .token-amount .usd {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

.token-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.token-name {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 500;
}

.token-amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.list-item .token-amount .value {
  margin-bottom: -8px;
  font-size: 14px;
  font-weight: 500;
}

.list-item .token-amount .usd {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 400;
}

.token-icon {
  margin-right: 0;
}
</style>
