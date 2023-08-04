<template>
  <div class="claim-mim-block" :style="backgroundImage">
    <h3 class="title">Claimable</h3>

    <div class="claim-info-wrap">
      <div class="claim-info">
        <div class="token-icon-wrap">
          <img
            class="token-icon"
            src="@/assets/images/tokens/MIM.png"
            alt="MIM icon"
          />
        </div>

        <div class="claim-amount">
          <h4>MIM</h4>
          <div class="claim-value">{{ claimAmount }}</div>
        </div>
      </div>

      <BaseButton
        :width="'100px'"
        :disabled="isDisableClaimButton"
        @click="$emit('claimMim')"
      >
        Claim
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { useImage } from "@/helpers/useImage";
import BaseButton from "@/components/base/BaseButton.vue";

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

  computed: {
    backgroundImage() {
      return `background-image: url(${useImage("assets/images/bg-claim.png")})`;
    },
  },

  components: {
    BaseButton,
  },
};
</script>

<style lang="scss" scoped>
.claim-mim-block {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border: 1px solid rgba(129, 128, 255, 0.2);
  border-radius: 30px;
  box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.05);
  backdrop-filter: blur(100px);
  padding: 20px;
}

.title {
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  text-align: left;
  margin-bottom: 10px;
}

.claim-info-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.claim-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.token-icon-wrap {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 63px;
  width: 63px;
}

.token-icon {
  height: 32px;
  width: 32px;
}

.claim-amount {
  text-align: left;
  font-size: 18px;
}
</style>
