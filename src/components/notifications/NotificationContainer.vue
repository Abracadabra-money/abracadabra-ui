<template>
  <TransitionGroup
    tag="div"
    class="notification-container"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @leave="onLeave"
    :css="false"
  >
    <NotificationItem
      v-for="notification in notifications"
      :notification="notification"
      :key="notification.id"
    />
  </TransitionGroup>
</template>

<script lang="ts">
import NotificationItem from "@/components/notifications/Notification.vue";
import { setFade, fadeIn, fadeOut } from "@/helpers/animations/simple/fade";
import {
  setSlideUp,
  slideUp,
  slideUpOut,
} from "@/helpers/animations/simple/slide";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({ notifications: "notifications/getAll" }),
  },

  methods: {
    onBeforeEnter(el: gsap.TweenTarget) {
      setFade(el);
      setSlideUp(el);
    },

    onEnter(el: gsap.TweenTarget, done: () => void) {
      fadeIn(el, done);
      slideUp(el, done);
    },

    onLeave(el: gsap.TweenTarget, done: () => void) {
      fadeOut(el, done);
      slideUpOut(el, done);
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
