<template>
  <div class="action">
    <Tabs name="stake" :items="['stake', 'unstake']" />
    <h2 class="action-title">Stake MIM</h2>
    <BaseTokenInput />
    <BaseButton class="action-button" primary>Stake</BaseButton>

    <div class="lock-promo">
      <div class="staking-info">
        <div class="currently-staked">
          <div class="title">You Currently Staking</div>
          <div class="token-amount">
            <BaseTokenIcon :icon="mimIcon" name="MIM" size="32px" />
            1000
          </div>
        </div>

        <p class="promo-text">Lock your MIM and Boost your APR to 150%</p>
      </div>

      <BaseButton primary @click="$emit('chooseLockAction')">
        Lock staked MIM &gt;
      </BaseButton>
    </div>
  </div>
</template>

<script>
import Tabs from "@/components/ui/Tabs.vue";
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import mimIcon from "@/assets/images/tokens/MIM.png";

export default {
  data() {
    return { mimIcon };
  },

  computed: {},

  methods: {},

  components: { Tabs, BaseTokenInput, BaseButton, BaseTokenIcon },
};
</script>

<style lang="scss" scoped>
.lock-promo {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 32px;
  padding: 24px;
  border-radius: 0px 0px var(--Radius-Regular, 20px) var(--Radius-Regular, 20px);
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.22) 0%,
    rgba(116, 92, 210, 0.22) 100%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  font-weight: 500;
}

.staking-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.currently-staked,
.promo-text {
  width: 50%;
}

.currently-staked {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 18px;
}

.token-amount {
  display: flex;
  align-items: center;
  font-size: 28px;
}

.promo-text {
  width: 200px;
  text-align: right;
  font-size: 16px;
}
</style>
