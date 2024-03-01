<template>
  <div :class="['actions-head', { 'show-actions': isActionTab }]">
    <div :class="['label', { 'show-actions': !isActionTab }]">
      <img class="label-img" src="@/assets/images/networks/blast.png" />

      <div class="label-text">
        <h3 class="title">BUILD ON BLAST</h3>
        <p class="subtitle">to earn points</p>
      </div>
    </div>

    <Tabs
      class="tabs"
      :name="actionActiveTab"
      :items="actionTabs"
      activeColor="#FCFC03"
      @select="changeActionTab"
      v-if="isActionTab"
    />

    <IconButton
      class="action-info-button"
      chart
      :width="44"
      :height="44"
      :active="!isActionTab"
      @click="changeCurrentMobileTab"
    />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  props: {
    mobileMode: { type: Boolean },
    currentMobileTab: { type: Number },
  },

  data() {
    return {
      actionActiveTab: "Stake" as string,
      actionTabs: ["Stake", "Withdraw"] as string[],
      isLock: false as boolean,
    };
  },

  computed: {
    isActionTab() {
      if (!this.mobileMode) return true;
      return this.currentMobileTab === 0;
    },
  },

  methods: {
    changeActionTab(action: string) {
      this.$emit("changeActionTab", action);
      this.actionActiveTab = action;
    },

    changeCurrentMobileTab() {
      const newTabIndex = this.isActionTab ? 1 : 0;
      this.$emit("changeCurrentMobileTab", newTabIndex);
    },
  },

  components: {
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    IconButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/IconButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.actions-head {
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: end;
  height: 73px;
  padding: 12px;
  font-size: 32px;
  font-weight: 600;
  line-height: normal;
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

.label {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  max-width: 303.5px;
  width: 100%;
  height: 71px;
  border-radius: 12px 0 0 12px;
  background-color: #fcfd02;
  -webkit-clip-path: polygon(0 1%, 100% 0%, 72.5% 100%, 0 100%);
  clip-path: polygon(0 1%, 100% 0%, 72.5% 100%, 0 100%);
}

.label-img {
  width: 40px;
  height: 40px;
  border-radius: 5px;
}

.title {
  color: #000;
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
}

.subtitle {
  color: #000;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
}

.action-info-button {
  position: absolute;
  display: none;
  top: 8px;
  right: 12px;
}

@media (max-width: 600px) {
  .actions-head {
    gap: 16px;
    padding: 8px 12px;
    justify-content: start;
  }

  .actions-head.show-actions {
    height: 126px;
  }

  .label {
    height: 60px;
    width: 270px;
    border-radius: 12px 0 0 0;
  }

  .label.show-actions {
    position: absolute;
    top: 0;
    left: 0;
    height: 71px;
    border-radius: 12px 0 0 12px;
  }

  .label-img {
    width: 30px;
    height: 30px;
  }

  .title {
    color: #000;
    font-size: 18px;
    line-height: 20px;
  }

  .subtitle {
    color: #000;
    font-size: 12px;
    line-height: 15px;
  }

  .action-info-button {
    display: flex;
  }
}
</style>
