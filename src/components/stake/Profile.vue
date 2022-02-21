<template>
  <div class="profile">
    <h1 class="title">STAKE</h1>
    <ProfileInfo :tokens-info="tokensInfo" :locked-until="lockedUntil"  />
    <div class="profile-actions">
      <slot name="buttons"></slot>
    </div>
    <div class="profile-subscribtion">
      <div class="profile-subscribtion__approximate">
        <div>Approximate staking APR</div>
        <div>{{(this.tokensInfo.apr || 0) + "%"}}</div>
      </div>
      <p>Make SPELL work for you! Stake your SPELL and gain sSPELL. No impermanent loss, no loss of governance rights. Continuously compounding. After each new deposit, all staked SPELL are subject to a 24H lock-up period!</p>
      <p>sSPELL automatically earns fees from MIM repayments from all wizards proportional to your share of the stake pool.</p>
    </div>
  </div>
</template>

<script>
const ProfileInfo = () => import("@/components/stake/ProfileInfo");

export default {
  name: "Profile",
  components: { ProfileInfo },
  props: {
    tokensInfo: {
      type: Object
    },
    lockedUntil: {
      type: [String, Boolean]
    }
  },
  methods: {
    approve() {
      this.$emit("approve");
    },
    stake() {
      this.$emit("stake");
    }
  },
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
  display: flex;
  margin-top: 92px;
  & .default-button:last-child {
    margin-left: auto;
  }
}

</style>
