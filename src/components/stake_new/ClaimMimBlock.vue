<template>
  <div class="claim-mim-block">
    <h3 class="title">Claimable</h3>

    <div class="row">
      <div class="token-info">
        <img
          class="token-icon"
          src="@/assets/images/tokens/MIM.png"
          alt="MIM icon"
        />
        <div>
          <h4 class="token-name">MIM</h4>
          <p class="token-amount">{{ claimAmount }}</p>
        </div>
      </div>
      <button
        class="claim-button"
        :disabled="isDisableClaimButton"
        @click="$emit('claimMim')"
      >
        Claim
      </button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    claimAmount: {
      type: String,
      required: true,
    },
    isDisableClaimButton: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.claim-mim-block {
  @include font;
  border: 1px solid #4550a9;
  border-radius: 16px;
  padding: 14px 20px;
  background: linear-gradient(
    91deg,
    rgba(27, 24, 68, 0.6) 14.68%,
    rgba(13, 19, 38, 0.6) 76.58%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  gap: 10px;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.token-info {
  gap: 8px;
  display: flex;
  align-items: center;
}

.token-icon {
  width: 44px;
  height: 44px;
}

.token-name,
.token-amount {
  font-weight: 500;
  line-height: 150%;
}

.claim-button {
  padding: 12px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  border: 2px solid #7088cc;
  background: rgba(255, 255, 255, 0.01);
  color: #7088cc;
  font-weight: 600;
  line-height: 150%;
}
</style>
