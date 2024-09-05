<template>
  <ul class="tag-list">
    <li class="tag lock" v-if="lock">
      <img :src="lockIcon" class="tag-icon" />
      Lock
    </li>
  </ul>
</template>

<script lang="ts">
import lockIcon from "@/assets/images/stake/stake-list/conditional-tags/lock-tag.svg";

export default {
  props: {
    lock: { type: Boolean, default: false },
  },

  data() {
    return { lockIcon };
  },
};
</script>

<style lang="scss" scoped>
.tag-list {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
}

.tag {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
}

.tag-icon {
  width: 20px;
  height: 20px;
}

.lock {
  background: radial-gradient(
    162.72% 95.57% at 64.44% 92.56%,
    #15141b 28.65%,
    #141f44 100%
  );
  box-shadow: 0px 4px 9px 0px rgba(134, 92, 230, 0.08);
}
</style>
