<template>
  <div class="profile">
    <h1 class="title">STAKE</h1>
    <ProfileInfo />
    <div class="profile-actions">
      <DefaultButton primary disabled>Approve</DefaultButton>
      <DefaultButton disabled>Stake</DefaultButton>
    </div>
  </div>
</template>

<script>
import DefaultButton from "@/components/main/DefaultButton.vue";
const ProfileInfo = () => import("@/components/stake/ProfileInfo");

export default {
  name: "StableCoins",
  components: { ProfileInfo, DefaultButton },
  data: () => ({}),
};
</script>

<style lang="scss" scoped>
.profile {
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

.profile-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-top: 92px;
}

</style>
