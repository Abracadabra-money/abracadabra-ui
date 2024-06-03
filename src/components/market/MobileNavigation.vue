<template>
  <div class="mobile-navigation">
    <div
      class="nav-item"
      v-for="tabItem in mobileTabs"
      :key="`mobileTab=${tabItem.id}`"
      :class="{ active: tabItem.id === currentMobileTab }"
      @click="$emit('chamgeMobileTab', tabItem.id)"
    >
      <img
        :class="['nav-icon', { mini: tabItem.id !== 0 }]"
        :src="tabItem.icon"
        :alt="`${tabItem.text} icon`"
      />

      <p class="nav-text">{{ tabItem.text }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { useImage } from "@/helpers/useImage";

export default {
  props: {
    currentMobileTab: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      mobileTabs: [
        {
          id: 0,
          text: "Manage",
          icon: useImage("assets/images/nav-1.png"),
        },
        {
          id: 1,
          text: "My Position",
          icon: useImage("assets/images/nav-2.png"),
        },
        {
          id: 2,
          text: "Stats",
          icon: useImage("assets/images/nav-3.png"),
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.mobile-navigation {
  display: none;
  align-items: center;
  justify-content: center;
  padding: 12px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(16, 22, 34, 0.6);
  gap: 52px;
  box-shadow: 0px 4px 36.4px 0px rgba(98, 88, 195, 0);
  backdrop-filter: blur(12.5px);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  &.active,
  &:hover {
    .nav-text {
      color: #7088cc;
    }
  }
}

.nav-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.nav-text {
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
  transition: all 0.3s ease;
}

@media screen and (max-width: 1024px) {
  .mobile-navigation {
    display: flex;
  }
}

@media screen and (max-width: 640px) {
  .mobile-navigation {
    padding: 8px;
    gap: 52px;
  }

  .nav-icon {
    width: 36px;
    height: 36px;

    &.mini {
      width: 28px;
    }
  }

  .nav-text {
    font-size: 14px;
  }
}
</style>
