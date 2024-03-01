<template>
  <div class="points-info">
    <h4 class="table-title">How to maximize your Points</h4>

    <ul class="boost-ways-list">
      <li class="boost-way">
        <span class="title">Deposit USDb</span>
        <span class="value">3X Points</span>
      </li>

      <li class="boost-way">
        <span class="title">Deposit MIM</span>
        <span class="value">1X Points</span>
      </li>

      <li class="boost-way">
        <span class="title">Deposit WETH in the Cauldron</span>
        <span class="value">2x Points</span>
      </li>

      <li class="boost-way">
        <span class="title">Lock your MIM & USDb to get Boost</span>
        <span class="value">20X Points </span>
      </li>

      <li class="boost-way">
        <span class="title">
          Mint MIM from WETH Cauldron on Blast and deposit it
        </span>
        <span class="value">15X Points</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss" scoped>
.points-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.table-title {
  font-size: 16px;
  font-weight: 500;
}

.boost-ways-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.boost-way {
  display: flex;
  justify-content: space-between;
}

.title {
  color: #878b93;
  font-size: 16px;
  font-weight: 400;
}

.value {
  font-size: 16px;
  font-weight: 500;
  min-width: 120px;
  text-align: end;
}

@media (max-width: 700px) {
  .points-info {
    padding: 16px;
  }

  .boost-way {
    flex-direction: column;
  }

  .title,
  .value,
  .table-title {
    font-size: 14px;
  }

  .value {
    text-align: start;
  }
}
</style>
