<template>
  <div class="pool-compound-card">
    <div class="lp-token">
      <BaseTokenIcon :name="lpToken.name" :icon="lpToken.icon" size="40px" />
      <div class="token-amount">
        <span class="value">{{ lpToken.amount }}</span>
        <span class="usd">{{ lpToken.amountUsd }}</span>
      </div>
    </div>

    <div class="rewards-wrap">
      <h4 class="title">
        Founder boost
        <RocketIcon class="rocket-icon" tooltip="tooltip" fill="black" />
      </h4>

      <ul class="rewards-list">
        <li class="list-item">
          <span class="item-title">
            <img
              src="@/assets/images/points-dashboard/blast.png"
              class="reward-icon"
            />
            Points
          </span>

          <span class="item-value">5,311.55</span>
        </li>

        <li class="list-item">
          <span class="item-title">
            <img
              src="@/assets/images/points-dashboard/gold-points.svg"
              class="reward-icon"
            />
            Gold
          </span>

          <span class="item-value">5,311.55</span>
        </li>

        <li class="list-item">
          <span class="item-title">
            <img
              src="@/assets/images/points-dashboard/potion.png"
              class="reward-icon"
            />
            Potion
          </span>

          <span class="item-value">5,311.55</span>
        </li>
      </ul>
    </div>
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
    RocketIcon: defineAsyncComponent(() =>
      import("@/components/ui/icons/RocketIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-compound-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 15px 20px;
  border-radius: 16px;
  background: linear-gradient(
    104deg,
    #fde403d8 0%,
    #fdfd03da 28.64%,
    #feffacda 52.14%,
    #ffff00d7 70.64%,
    #ffff00df 100%
  );
  color: black;
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
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

.rewards-wrap {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
}

.rocket-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  padding: 3px;
  border-radius: 17px;
  background: rgba(0, 0, 0, 0.16);
}

.rewards-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
  list-style: none;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-title {
  display: flex;
  align-items: center;
  gap: 4px;
}

.reward-icon {
  width: 24px;
}

.item-value {
  font-size: 16px;
  font-weight: 400;
}
</style>
