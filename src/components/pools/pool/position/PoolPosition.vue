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

    <div class="pool-position">
      <Tabs :name="activeTab" :items="tabItems" @select="selectTab" />

      <Deposited
        :pool="pool"
        :userPointsStatistics="userPointsStatistics"
        @updatePoolInfo="$emit('updateInfo')"
        v-show="activeTab === 'deposited'"
      />

      <Staked
        :pool="pool"
        :userPointsStatistics="userPointsStatistics"
        v-show="activeTab === 'staked'"
      />

      <Locked
        :pool="pool"
        :userPointsStatistics="userPointsStatistics"
        v-show="activeTab === 'locked'"
      />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: {
    pool: { type: Object },
    userPointsStatistics: { type: Object },
    isMyPositionPopupOpened: { type: Boolean, default: false },
  },

  emits: ["closePopup", "updateInfo"],

  data() {
    return {
      activeTab: "deposited",
      tabItems: ["deposited", "staked", "locked"],
    };
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

  components: {
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    Deposited: defineAsyncComponent(() =>
      import("@/components/pools/pool/position/Deposited.vue")
    ),
    Staked: defineAsyncComponent(() =>
      import("@/components/pools/pool/position/Staked.vue")
    ),
    Locked: defineAsyncComponent(() =>
      import("@/components/pools/pool/position/Locked.vue")
    ),
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

@media (max-width: 1400px) {
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
    width: 100%;
    max-width: 385px;
    padding: 0;
    border: none;
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
