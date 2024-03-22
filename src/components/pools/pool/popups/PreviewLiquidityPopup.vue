<template>
  <div class="backdrop" @click.self="closePopup">
    <div class="preview-popup">
      <div class="header">
        <h3 class="title">Preview</h3>
        <img
          class="close-img"
          src="@/assets/images/cross.svg"
          alt="Close popup"
          @click="closePopup"
        />
      </div>

      <div :class="['preview-tokens-wrap', { remove }]">
        <div class="base-quote-wrap">
          <div class="token-info-wrap">
            <div class="tokenIcon">
              <BaseTokenIcon
                :icon="pool.tokens.baseToken.config.icon"
                :name="pool.tokens.baseToken.config.name"
                size="60px"
              />
            </div>
            <div class="token-value">
              {{
                formatTokenBalance(
                  previewInfo.baseTokenAmount,
                  pool.tokens.baseToken.config.decimals
                )
              }}
            </div>
          </div>

          <div class="icon-button-wrap">
            <IconButton
              class="icon-button"
              plus
              active
              disable
              :width="40"
              :height="40"
              borderRadius="16px"
            />
          </div>
          <div class="token-info-wrap">
            <div class="tokenIcon">
              <BaseTokenIcon
                :icon="pool.tokens.quoteToken.config.icon"
                :name="pool.tokens.quoteToken.config.name"
                size="60px"
              />
            </div>
            <div class="token-value">
              {{
                formatTokenBalance(
                  previewInfo.quoteTokenAmount,
                  pool.tokens.quoteToken.config.decimals
                )
              }}
            </div>
          </div>
        </div>
        <div class="icon-button-wrap">
          <IconButton
            class="icon-button"
            arrowRight
            active
            disable
            :width="40"
            :height="40"
            borderRadius="16px"
          />
        </div>
        <div class="token-info-wrap">
          <div class="tokenIcon">
            <BaseTokenIcon :icon="pool.icon" :name="pool.name" size="60px" />
          </div>
          <div class="token-value">
            {{ formatTokenBalance(previewInfo.lpAmount, pool.decimals) }}
          </div>
        </div>
      </div>

      <div class="info-block swap">
        <div class="tag">
          <span class="title">Current Price</span>
          <CurrentPrice
            :fromToken="pool.tokens.baseToken"
            :toToken="pool.tokens.quoteToken"
          />
        </div>

        <!-- <div class="tag">
          <span class="title">Network Fee</span>

          <span class="value">
            <img class="gas-icon" src="@/assets/images/gas.svg" />
            $0.01
          </span>
        </div> -->
      </div>

      <BaseButton primary @click="$emit('deposit')"> Confirm </BaseButton>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";

export default {
  props: {
    pool: {
      type: Object,
    },

    previewInfo: {
      type: Object,
    },

    remove: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {};
  },

  methods: {
    formatTokenBalance(value) {
      return formatTokenBalance(formatUnits(value, 18));
    },

    formatAmount(value) {
      return formatTokenBalance(value);
    },

    confirmTransaction() {
      this.$emit("deposit");
      this.closePopup();
    },

    closePopup() {
      this.$emit("close");
    },
  },

  components: {
    CurrentPrice: defineAsyncComponent(() =>
      import("@/components/pools/CurrentPrice.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
    IconButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/IconButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 300;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  background: rgba(25, 25, 25, 0.1);
  backdrop-filter: blur(10px);
}

.preview-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px;
  max-width: 533px;
  width: 100%;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 24px;
  font-weight: 500;
}

.header .title {
  font-size: 24px;
  font-weight: 500;
}

.close-img {
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.close-img:hover {
  opacity: 0.5;
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
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

.preview-tokens-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.remove {
  flex-direction: row-reverse;
}

.base-quote-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 3;
}

.token-info-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

.token-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  margin-right: 0;
  border-radius: 20px;
  border: 1px solid rgba(45, 74, 150, 0);
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.2) 0%,
    rgba(116, 92, 210, 0.2) 100%
  );
  box-shadow: 0px 4px 29.4px 0px rgba(85, 82, 253, 0.24);
}

.icon-button-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

.icon-button {
  margin-bottom: 25px;
}
</style>
