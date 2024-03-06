<template>
  <div class="pool-action-block">
    <div class="inputs-wrap">
      <BaseTokenInput />
      <BaseTokenInput />
      <IconButton
        class="plus-icon"
        plus
        active
        :width="44"
        :height="44"
        borderRadius="16px"
      />
    </div>

    <div class="info-blocks">
      <div class="info-block lp">
        <div class="tag">
          <span class="title">mLP</span>
          <span class="value">
            <BaseTokenIcon size="24px" />
            0.242371
          </span>
        </div>

        <div class="tag">
          <span class="title">APR</span>
          <span class="value apr"> 102.21% </span>
        </div>
      </div>

      <div class="info-block swap">
        <div class="tag">
          <span class="title">Current Price</span>
          <span class="value">
            <img
              class="switch-chain-image"
              src="@/assets/images/beam/switch-button.svg"
              alt="Switch network"
            />
            1 MIM = 1,636.39 USDT
            <span class="usd-equivalent"> ($1,687.87) </span>
          </span>
        </div>

        <div class="tag">
          <span class="title">Network Fee</span>

          <span class="value">
            <img class="gas-icon" src="@/assets/images/gas.svg" />
            $0.01
          </span>
        </div>
      </div>
    </div>

    <BaseButton primary> Deposit </BaseButton>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: {
    pool: { type: Object },
  },

  computed: {},

  methods: {},

  components: {
    Deposit: defineAsyncComponent(() =>
      import("@/components/pools/pool/Deposit.vue")
    ),
    Remove: defineAsyncComponent(() =>
      import("@/components/pools/pool/Deposit.vue")
    ),
    BaseTokenInput: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenInput.vue")
    ),
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    IconButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/IconButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-action-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  border-radius: 20px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  padding: 24px;
  width: 100%;
}

.inputs-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.plus-icon {
  position: absolute;
  top: calc(50% - 28px);
  left: calc(50% - 28px);
  width: 46px;
  height: 46px;
}

.info-blocks {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.tag {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  color: #878b93;
  font-size: 16px;
  font-weight: 500;
}

.value {
  display: flex;
  align-items: center;
  gap: 4px;
}

.apr {
  color: #fff;
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 16px;
  font-weight: 600;
}

.usd-equivalent {
  color: #575c62;
  font-size: 16px;
  font-weight: 400;
}
</style>
