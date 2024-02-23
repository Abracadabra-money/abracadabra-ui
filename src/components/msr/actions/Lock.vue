<template>
  <div class="action">
    <h2 class="action-title">Lock MIM</h2>
    <BaseTokenInput />
    <EpochTimeLine />
    <BaseButton class="action-button" primary>Lock</BaseButton>

    <div class="lock-info">
      <p class="description">
        Your MIM will bla bla bla and when lock time is ended > your MIM will
        migrate to Staked MIM where you can Unstake it
      </p>

      <p class="total-locked">Total Locked: 1000000 MIM</p>

      <ul class="user-locks">
        <UserLock v-for="index in 10" :key="index" />
      </ul>
    </div>
  </div>
</template>

<script>
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import EpochTimeLine from "@/components/msr/EpochTimeLine.vue";
import UserLock from "@/components/msr/UserLock.vue";

export default {
  data() {
    return {};
  },

  computed: {},

  methods: {},

  components: { BaseTokenInput, BaseButton, EpochTimeLine, UserLock },
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.lock-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.description {
  font-size: 14px;
  font-weight: 400;
}

.total-locked {
  font-size: 24px;
  font-weight: 500;
}

.user-locks {
  display: flex;
  flex-direction: column;
  gap: 16px;
  list-style: none;
  width: 100%;
  max-height: 206px;
  overflow-y: auto;
}
</style>
