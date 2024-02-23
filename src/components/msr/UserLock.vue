<template>
  <li class="user-lock">
    <span class="locked-token">
      Locked
      <div class="token-amount">
        <BaseTokenIcon :icon="mimIcon" name="MIM" size="24px" />
        1000
      </div>
    </span>

    <span class="locked-time">23h 12m 12s</span>
  </li>
</template>

<script>
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import mimIcon from "@/assets/images/tokens/MIM.png";

export default {
  data() {
    return { mimIcon };
  },

  computed: {},

  methods: {},

  components: { BaseTokenIcon },
};
</script>

<style lang="scss" scoped>
.user-lock {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 10px);
  min-height: 58px;
  padding: 12px 16px 12px 12px;
  border-radius: 10px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  font-size: 18px;
  font-weight: 500;
}

.locked-token,
.token-amount {
  display: flex;
  align-items: center;
}

.locked-token {
  gap: 12px;
}
</style>
