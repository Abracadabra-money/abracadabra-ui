<template>
  <div class="backdrop" @click.self="closePopup">
    <div class="founder-popup">
      <div class="header">
        <h3 class="title">Become a Founder</h3>
        <img
          class="close-img"
          src="@/assets/images/cross.svg"
          alt="Close popup"
          @click="closePopup"
        />
      </div>

      <p class="description">
        Lock your Liquduituy for 3 month to becone a MIM Swap founder and get
        permanent buff
      </p>

      <div class="pool-info-wrap" v-if="stakeInfo">
        <div class="promo-label">Founders will recieve 30% of Points</div>

        <div class="pool-info">
          <TokenChainIcon
            class="pool-icon"
            :icon="mimUsdbIcon"
            name="MIM/USDB"
            :chainId="81457"
          />
          <div class="pool-text">
            <p class="pool-name">MIM / USDB Pool</p>
            <p class="values-description">Liquidity added into the pool</p>
          </div>
        </div>

        <div class="total-by-token">
          <div
            class="token-part"
            :key="index"
            v-for="(token, index) in stakeInfo.tokensInfo"
          >
            <BaseTokenIcon
              :name="token.config.name"
              :icon="token.config.icon"
              size="32px"
            />
            $
            {{ formatTokenBalance(token.totals.total, token.config.decimals) }}
          </div>
        </div>

        <div class="decorative-line"></div>
      </div>

      <FounderCheckBox :value="isBecomeFounder" @update="toggleBecomeFounder" />

      <BaseButton primary>Confirm</BaseButton>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import { approveTokenViem } from "@/helpers/approval";
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";
import mimUsdbIcon from "@/assets/images/tokens/MIM-USDB.png";

export default {
  props: {
    stakeInfo: {
      type: Object,
    },
  },

  data() {
    return {
      mimUsdbIcon,
      isBecomeFounder: false,
    };
  },

  computed: {},

  methods: {
    formatTokenBalance(value) {
      return formatTokenBalance(formatUnits(value, 18));
    },

    formatAmount(value) {
      return formatTokenBalance(value);
    },

    toggleBecomeFounder() {
      this.isBecomeFounder = !this.isBecomeFounder;
    },

    closePopup() {
      this.$emit("close");
    },
  },

  components: {
    TokenChainIcon: defineAsyncComponent(() =>
      import("@/components/ui/icons/TokenChainIcon.vue")
    ),
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    FounderCheckBox: defineAsyncComponent(() =>
      import("@/components/blastStatistics/FounderCheckBox.vue")
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
  background: rgba(25, 25, 25, 0.1);
  backdrop-filter: blur(10px);
}

.founder-popup {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 24px;
  padding: 32px;
  width: 533px;
  max-width: 100%;
  height: 503px;
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

.close-img {
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.close-img:hover {
  opacity: 0.5;
}

.description {
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
}

.pool-info-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.promo-label {
  display: flex;
  align-items: center;
  width: 425px;
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

.total-by-token {
  display: flex;
  align-items: center;
  gap: 20px;
}

.token-part {
  display: flex;
  align-items: center;
}

.decorative-line {
  min-width: 100%;
  height: 6px;
  border-radius: 16px 0 0 16px;
  background: #fcfd02;
  clip-path: polygon(0 1%, 100% 0%, 98% 100%, 0 100%);
}
</style>
