<template>
  <div class="swap-view">
    <div class="swap-wrapper">
      <div class="swap-head">
        <h3 class="head-title">MIM SWAP</h3>

        <SwapSettingsPopup />
      </div>

      <div class="swap-body">
        <div class="inputs-wrap">
          <!-- class="beam-input"
          :decimals="18"
          :max="parsedMimBalance"
          :value="inputValue"
          :name="'MIM'"
          :icon="$image('assets/images/tokens/MIM.png')"
          :error="amountError"
          isBigNumber
          @updateInputValue="updateMainValue"
          :disabled="isActionsDisabled"
        /> -->

          <BaseTokenInput />

          <button class="swap-button">
            <SwapIcon />
          </button>

          <!-- class="beam-input"
            :decimals="18"
            :max="parsedMimBalance"
            :value="inputValue"
            :name="'MIM'"
            :icon="$image('assets/images/tokens/MIM.png')"
            :error="amountError"
            isBigNumber
            @updateInputValue="updateMainValue"
            :disabled="isActionsDisabled" -->
          <BaseTokenInput />
        </div>

        <div class="swap-info">
          <div class="swap-info-item">
            <div class="info-title">Current price</div>
            <div class="info-value">
              <SwapIcon fill="#7088CC" />
              <span>1 GLP = 1,636.39 ETH</span>
              <span class="info-price">($1,687.87)</span>
            </div>
          </div>
          <div class="swap-info-item">
            <div class="info-title">Price Impact</div>
            <div class="info-value">93.00%</div>
          </div>
          <div class="swap-info-item">
            <div class="info-title">Minimum received</div>
            <div class="info-value">0.242371 DAI</div>
          </div>
          <div class="swap-info-item">
            <div class="info-title">Network Fee</div>
            <div class="info-value"><FeeIcon /> $0.01</div>
          </div>
        </div>

        <div class="router-wrap">
          <h4 class="title">Auto Router</h4>

          <div class="router">
            <div class="dashed"></div>
            <img
              class="token-icon"
              src="@/assets/images/tokens/MIM.png"
              alt=""
            />
            <img
              class="token-icon"
              src="@/assets/images/tokens/SPELL.png"
              alt=""
            />
            <img
              class="token-icon"
              src="@/assets/images/tokens/ETH.png"
              alt=""
            />
          </div>

          <p class="text">
            This route optimizes your total output by considering split routes,
            multiple hops, and the gas cost of each step.
          </p>
        </div>

        <!-- :disabled="disableBtn"
      @click="actionHandler" -->
        <BaseButton :primary="true"> Swap</BaseButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  components: {
    SwapSettingsPopup: defineAsyncComponent(
      () => import("@/components/popups/SwapSettingsPopup.vue")
    ),
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    SwapIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/SwapIcon.vue")
    ),
    FeeIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/FeeIcon.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.swap-view {
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100vh;
  width: 100%;
}

.swap-wrapper {
  max-width: 550px;
  width: 100%;
  padding: 0 8px;
  margin: 0 auto;
}

.swap-head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.head-title {
  font-size: 32px;
  font-weight: 600;
  line-height: normal;
}

.swap-body {
  @include block-wrap;
  gap: 24px;
  display: flex;
  flex-direction: column;
}

.inputs-wrap {
  gap: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.swap-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  margin: 0 auto;
  border-radius: 16px;
  border: 1px solid #2d4a96;
  background: rgba(25, 31, 47, 0.38);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(68px);
  cursor: pointer;
}

.swap-info,
.router-wrap {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.swap-info-item {
  display: flex;
  justify-content: space-between;
  color: #878b93;
  line-height: normal;
}

.info-value {
  font-weight: 500;
  gap: 4px;
  display: flex;
  align-items: center;
}

.info-price {
  color: #575c62;
}

.title {
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
}

.router {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashed {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 1px;
  width: 100%;
  background-image: linear-gradient(
    90deg,
    #7088cc,
    #7088cc 65%,
    transparent 65%,
    transparent 100%
  );
  background-size: 20px 1px;
  border: none;
}

.token-icon {
  z-index: 1;
  width: 20px;
  height: 20px;
}

.text {
  color: #878b93;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
}
</style>
