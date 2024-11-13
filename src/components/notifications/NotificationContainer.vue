<template>
  <div class="notification-container">
    <TransitionGroup @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <NotificationItem
        v-for="notification in notifications"
        :notification="notification"
        :key="notification.id"
      />
    </TransitionGroup>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { useAnimation } from "@/helpers/useAnimation/useAnimation";
import NotificationItem from "@/components/notifications/Notification.vue";

export default {
  computed: {
    ...mapGetters({ notifications: "notifications/getAll" }),
  },

  methods: {
    ...useAnimation("notification"),
  },

  components: {
    NotificationItem,
  },
};
</script>

<style lang="scss" scoped>
.notification-container {
  height: fit-content;
  position: fixed;
  z-index: 1000;
  top: 110px;
  right: 30px;
  width: 500px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  & .notification-item {
    margin-bottom: 20px;
  }
}

@media (max-width: 600px) {
  .notification-container {
    right: 0;
    left: 0;
    margin: 0 auto;
    width: 90vw;
  }
}
</style>
