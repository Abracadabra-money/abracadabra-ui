<template>
  <div class="rewards-wrap">
    <div class="rewards-fraction">
      <div class="title">Reward earned</div>
      <span class="value">1000</span>
    </div>

    <div class="rewards-fraction">
      <div class="title">
        Vesting
        <span class="claim-timing">
          Will become claimable on <span class="time"> 29 Feb 00:00 UTC</span>
        </span>
      </div>
      <span class="value">800</span>
    </div>

    <div class="rewards-fraction">
      <div class="title">Ready to claim</div>
      <span class="value">200</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  computed: {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.rewards-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 12px 16px 12px 12px;
  border-radius: 10px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.rewards-fraction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 14px;
  font-weight: 400;
}

.title {
  display: flex;
  flex-direction: column;
  line-height: normal;
}

.claim-timing {
  font-size: 12px;
  line-height: normal;
  color: #878b93;
}

.time {
  color: white;
}
</style>
