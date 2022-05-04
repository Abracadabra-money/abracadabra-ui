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

<script>
const NotificationItem = () =>
  import("@/components/notifications/Notification");

export default {
  computed: {
    notifications() {
      return this.$store.getters["notifications/getAll"];
    },
  },
  components: {
    NotificationItem,
  },
};
</script>

<style lang="scss" scoped>
.notification-container {
  height: fit-content;
  // overflow-y: scroll;
  position: fixed;
  z-index: 1000;
  top: 110px;
  right: 30px;
  width: 400px;
  & .notification-item {
    margin-bottom: 20px;
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s;
}
.list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
