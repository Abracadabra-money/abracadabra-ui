<template>
  <div class="popup-body">
    <div class="popup-page" v-if="step === 1">
      <h3 class="title">Withdraw Pop Up</h3>
      <p class="description">
        You are about to withdraw your locked funds, forfeiting the imminent
        launch of MIMswap as well as all the LLE available rewards for its
        participants.
      </p>

      <div class="pool-info-wrap">
        <div class="promo-label">Withdrawing Locked MIM</div>

        <div class="total-by-token">
          <div class="token-part">
            <BaseTokenIcon :name="'MIM'" :icon="tokenInfo.icon" size="32px" />
            {{ parsedAmount }}
          </div>
        </div>

        <div class="decorative-line"></div>
      </div>
    </div>

    <div class="popup-page" v-if="step === 2">
      <h3 class="title">Withdraw Pop Up 2</h3>
      <p class="description">
        By doing so, you are missing out on the Founder’s Boost, the largest
        incentivisation tool in the Abracadabra and MIMswap Ecosystem as well as
        distribution of
      </p>
      <div class="reasons-block">
        <img class="bg" src="@/assets/images/blast/points-box.png" alt="" />
        <div class="title">Including distribution of</div>
        <div>
          <div class="reason-item">
            <div class="point"></div>
            <p>Blast Points</p>
          </div>
          <div class="reason-item">
            <div class="point gold"></div>
            <p>Gold</p>
          </div>
          <div class="reason-item">
            <!-- <div class="point potion"></div> -->
            <img
              class="point-img"
              src="@/assets/images/color-logo.png"
              alt=""
            />
            <p>Potion points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="popup-page" v-if="step === 3">
      <h3 class="title">Withdraw Pop Up</h3>
      <p class="description">
        You are about to withdraw your locked funds, forfeiting the imminent
        launch of MIMswap as well as all the LLE available rewards for its
        participants.
      </p>

      <div class="pool-info-wrap">
        <div class="promo-label">Are you sure you want to continue?</div>

        <div class="total-by-token">
          <div class="token-part">
            <BaseTokenIcon :name="'MIM'" :icon="tokenInfo.icon" size="32px" />
            {{ parsedAmount }}
          </div>
        </div>

        <div class="decorative-line"></div>
      </div>

      <BlastCheckbox :value="isConfirmed" @update="toggleIsConfirmed" />
    </div>

    <BaseButton
      :disabled="isDisabled"
      :primary="isPrimary && !isDisabled"
      :warning="!isPrimary && !isDisabled"
      @click="actionHandler"
      >{{ buttonText }}</BaseButton
    >
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";

export default {
  props: {
    tokenInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      step: 1,
      isConfirmed: false,
    };
  },

  computed: {
    parsedAmount() {
      return formatTokenBalance(
        formatUnits(this.tokenInfo.lockedAmount, this.tokenInfo.decimals)
      );
    },
    buttonText() {
      return this.step === 3 ? "Withdraw and Exit LLE" : "Next";
    },
    isPrimary() {
      return this.step !== 3;
    },
    isDisabled() {
      return !this.isConfirmed && this.step === 3;
    },
  },

  methods: {
    actionHandler() {
      if (this.step === 3) {
        this.$emit("withdrawLocked");
      } 
      else this.step += 1;
    },
    toggleIsConfirmed() {
      this.isConfirmed = !this.isConfirmed;
    },
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    BlastCheckbox: defineAsyncComponent(
      () => import("@/components/ui/checkboxes/BlastCheckbox.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.reasons-block {
  display: flex;
  position: relative;
  padding-top: 40px;
  padding-left: 14px;

  .title {
    position: absolute;
    top: 0;
    left: 10px;
    z-index: 30;
    font-size: 16px;
    line-height: 36px;
    font-weight: 500;
    color: black;
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 290px;
    height: 131px;
  }
  .reason-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 2px 0;

    .point-img {
      width: 12px;
      height: 12px;
      object-fit: contain;
      margin-right: 12px;
    }

    .point {
      width: 11px;
      height: 11px;
      border-radius: 3px;
      background: #737700;
      margin-right: 12px;

      &.gold {
        background: #fcfd02;
      }

      &.potion {
        background: #745cd2;
      }
    }
  }
}

.pool-info-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.decorative-line {
  min-width: 100%;
  height: 6px;
  border-radius: 16px 0 0 16px;
  background: #fcfd02;
  clip-path: polygon(0 1%, 100% 0%, 98% 100%, 0 100%);
}

.token-part {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
}

.promo-label {
  display: flex;
  align-items: center;
  max-width: 425px;
  width: 100%;
  height: 45px;
  padding: 12px;
  border-radius: 16px 0 0 16px;
  background: #fcfd02;
  clip-path: polygon(0 1%, 100% 0%, 88% 100%, 0 100%);
  color: black;
  font-size: 18px;
  font-weight: 500;
}

.pool-info {
  display: flex;
  align-items: center;
}

.popup-body {
  gap: 24px;
  display: flex;
  flex-direction: column;
}

.popup-page {
  gap: 16px;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 24px;
  font-weight: 500;
  line-height: 36px;
}

.description {
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}
</style>
