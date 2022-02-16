<template>
  <div class="profile">
    <h1 class="title">STAKE</h1>
    <ProfileInfo />
    <div class="profile-actions">
      <DefaultButton primary disabled>Approve</DefaultButton>
      <DefaultButton disabled>Stake</DefaultButton>
    </div>
    <div class="profile-subscribtion">
      <div class="profile-subscribtion__approximate">
        <div>Approximate staking APR</div>
        <div>26.98%</div>
      </div>
      <p>Make SPELL work for you! Stake your SPELL and gain sSPELL. No impermanent loss, no loss of governance rights. Continuously compounding. After each new deposit, all staked SPELL are subject to a 24H lock-up period!</p>
      <p>sSPELL automatically earns fees from MIM repayments from all wizards proportional to your share of the stake pool.</p>
    </div>
  </div>
</template>

<script>
import DefaultButton from "@/components/main/DefaultButton.vue";
const ProfileInfo = () => import("@/components/stake/ProfileInfo");

export default {
  name: "Profile",
  components: { ProfileInfo, DefaultButton },
  data: () => ({}),
};
</script>

<style lang="scss" scoped>
.profile-subscribtion {
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  &__approximate {
    margin-top: 55px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    margin-bottom: 30px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  & p {
    margin-bottom: 20px;
    text-align: center;
  }
}
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
