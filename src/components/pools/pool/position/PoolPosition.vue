<template>
  <div
    :class="['backdrop', { isOpened: isMyPositionPopupOpened }]"
    @click.self="closePopup"
  ></div>
  <div :class="['pool-position-wrap', { isOpened: isMyPositionPopupOpened }]">
    <img
      class="close"
      src="@/assets/images/close-icon.png"
      alt="Close popup"
      @click="closePopup"
    />

    <PointsEarned
      class="points-earned"
      :pointsEarned="pointsEarned"
      v-if="pointsEarned"
    />

    <div class="pool-position">
      <Tabs :name="activeTab" :items="tabItems" @select="selectTab" />

      <Deposited
        :pool="pool"
        :isProperNetwork="isProperNetwork"
        v-if="activeTab === 'deposited'"
      />

      <!-- <LockBlock :pool="pool" @updateInfo="onUpdate" /> -->
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { formatTokenBalance } from "@/helpers/filters";
import { fetchUserPointsStatistics } from "@/helpers/blast/stake/points";

export default {
  props: {
    pool: { type: Object },
    isProperNetwork: { type: Boolean },
    isMyPositionPopupOpened: { type: Boolean, default: false },
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
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    PointsEarned: defineAsyncComponent(() =>
      import("@/components/pools/pool/PointsEarned.vue")
    ),
    Deposited: defineAsyncComponent(() =>
      import("@/components/pools/pool/position/Deposited.vue")
    ),
    // LockBlock: defineAsyncComponent(() =>
    //   import("@/components/pools/pool/LockBlock.vue")
    // ),
  },
};
</script>

<style lang="scss" scoped>
.pool-position-wrap {
  position: absolute;
  top: 128px;
  right: -380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 3;
}

.pool-position {
  display: flex;
  flex-direction: column;
  width: 385px;
  padding: 16px;
  gap: 16px;
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

.points-earned {
  display: none !important;
}

.blast-icon {
  width: 28px;
  height: 28px;
  margin-right: 10px;
  border-radius: 50px;
}

.close {
  align-self: flex-end;
  display: none;
  transition: opacity 0.3s ease-in-out;
  cursor: pointer;
}

.close:hover {
  opacity: 0.5;
}

@media (max-width: 1300px) {
  .backdrop {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: none;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: end;
    background: rgba(25, 25, 25, 0.1);
    backdrop-filter: blur(10px);
    z-index: 2;
  }

  .pool-position-wrap {
    position: fixed;
    top: initial;
    left: 0;
    right: 0;
    bottom: 0;
    display: none;
    width: 100%;
    padding: 16px 20px;
    gap: 16px;
    border-radius: 20px 20px 0 0;
    border: 1px solid #342866;
    background: #101622;
    box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
    backdrop-filter: blur(20px);
  }

  .pool-position {
    min-width: 375px;
    padding: 0;
    background: transparent;
    box-shadow: none;
  }

  .close {
    align-self: flex-end;
    display: block;
  }

  .points-earned {
    display: flex !important;
  }

  .points-earned-row {
    display: none;
  }

  .isOpened {
    display: flex !important;
  }
}

@media screen and (max-width: 500px) {
  .pool-position {
    min-width: 100%;
  }
}
</style>
