<template>
  <div class="card">
    <div class="card-head">
      <h3 class="title">Pending points will be sent in</h3>
      <div class="timer">
        <span class="timer-value">22m</span>
        <span class="timer-value">12s</span>
      </div>
    </div>

    <div class="card-body">
      <div class="info">
        <span class="info-title">Points Earned</span>
        <span class="info-earned">10,435.00</span>
      </div>
      <div class="info">
        <span class="info-title">Points Pending</span>
        <span class="info-pending">646,710.00</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss" scoped>
.card {
  max-width: 411px;
  height: 148px;
  padding: 20px 2px;
  width: 100%;
  background: #fcfd02;
  border-radius: 12px;
  clip-path: polygon(
    87px 10px,
    100px 0,
    100% 0,
    100% 124px,
    387px 100%,
    51% 100%,
    22% 100%,
    0 100%,
    0 27px,
    20px 10px
  );
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 11px;
  padding: 0 14px;
}

.title {
  color: #000;
  font-family: Poppins;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-transform: uppercase;
}

.timer {
  gap: 2px;
  display: flex;
  align-items: center;
}

.timer-value {
  min-width: 40px;
  min-height: 30px;
  border-radius: var(--Radius-Tiny, 10px);
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: #171717;
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  font-size: 12px;
  font-weight: 500;
  line-height: 150%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-body {
  width: 100%;
  background: #000;
  height: 85px;
  border-radius: 0 0 0 12px;
  clip-path: polygon(100% 0, 100% 62px, 384px 100%, 0 100%, 0 0);
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
}

.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
}

.info-earned {
  color: #fcfd02;
  font-size: 20px;
  font-weight: 600;
  line-height: 150%;
}

.info-pending {
  font-size: 16px;
  font-weight: 500;
  line-height: 150%;
}
</style>
