<template>
  <div class="under-maintenance">
    <h1 class="title">Abracadabra.money is currently under maintenance</h1>
  </div>
</template>

<script>
export default {
  name: "UnderMaintenance",
};
</script>

<style lang="scss" scoped>
.under-maintenance {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
}

.title {
  font-family: "Prompt", sans-serif;
  font-weight: 600;
  font-size: 40px;
  line-height: 1.3;
  background: -webkit-linear-gradient(107.5deg, #5282fd -3.19%, #76c3f5 101.2%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media (max-width: 640px) {
  .title {
    font-size: 28px;
  }
}
</style>
