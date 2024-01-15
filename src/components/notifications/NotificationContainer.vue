<template>
  <div class="notification-container">
    <transition-group name="list">
      <NotificationItem
        v-for="notification in notifications"
        :notification="notification"
        :key="notification.id"
      />
    </transition-group>
  </div>
</template>

<script lang="ts">
import NotificationItem from "@/components/notifications/Notification.vue";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({ notifications: "notifications/getAll" }),
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

.list-enter-active,
.list-leave-active {
  transition: all 0.4s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
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
