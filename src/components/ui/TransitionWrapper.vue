<template>
  <Transition
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
    :appear="appear"
    ><slot></slot>
  </Transition>
</template>

<script lang="ts">
import { useAnimation } from "@/helpers/useAnimation/useAnimation";

export default {
  props: {
    animationType: {
      type: String,
      default: "fade",
    },
    appear: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    beforeEnter: function (el: Element) {
      const animation = useAnimation(this.animationType);
      if (animation && animation.beforeEnter) {
        animation.beforeEnter(el);
      }
    },
    enter: function (el: Element, done: () => void) {
      const animation = useAnimation(this.animationType);
      if (animation && animation.enter) {
        animation.enter(el, done);
      }
    },
    leave: function (el: Element, done: () => void) {
      const animation = useAnimation(this.animationType);
      if (animation && animation.leave) {
        animation.leave(el, done);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
