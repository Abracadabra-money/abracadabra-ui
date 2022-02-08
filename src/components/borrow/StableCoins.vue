<template>
  <div class="stable">
    <h1 class="title">Mint Stablecoins</h1>
    <StableInfo />
    <div class="stable-actions">
      <DefaultButton primary>Approve</DefaultButton>
      <DefaultButton>Mint MIM</DefaultButton>
    </div>
    <div class="stable-list">
      <div v-for="(item, i) in listData" :key="i" class="list-item">
        <span>{{ item.name }}:</span>
        <span>{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import DefaultButton from "@/components/main/DefaultButton.vue";
const StableInfo = () => import("@/components/borrow/StableInfo");

export default {
  name: "StableCoins",
  components: { StableInfo, DefaultButton },
  data: () => ({
    listData: [
      { name: "Borrow Fee", value: 10 },
      { name: "Free", value: 10 },
    ],
  }),
};
</script>

<style lang="scss" scoped>
.stable {
  padding: 30px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
}
.title {
  font-size: 24px;
  text-transform: uppercase;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 30px;
}

.stable-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-top: 92px;
}
.stable-list {
  margin-top: 30px;
  .list-item {
    display: flex;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.6);
    line-height: 25px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
