<template>
  <router-link
    class="stake-item-link"
    :style="{ backgroundImage: backgroundStyle }"
    to=""
  >
    <h3 class="title">{{ stakeItem.name }}</h3>

    <div class="apr-wrap">APR <span class="apr-value">0.0%</span></div>

    <div class="tokens-wrap stake">
      Stake <BaseTokenIcon :icon="stakeToken.icon" :name="stakeToken.name" />
      {{ stakeToken.symbol }}
      <span class="main-token-info" v-if="mainToken">
        Into <BaseTokenIcon :icon="mainToken.icon" :name="mainToken.name" />
      </span>
    </div>

    <div class="tokens-wrap reward">
      Reward
      <div class="reward-tokens">
        <BaseTokenIcon
          :icon="icon"
          :name="name"
          :key="name"
          size="24px"
          v-for="{ icon, name } in rewardTokens"
        />
      </div>
    </div>

    <p class="description">
      {{ stakeItem.description }}
    </p>
  </router-link>
</template>

<script lang="ts">
import type { RouterLinkParams } from "@/types/global";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import { formatPercent } from "@/helpers/filters";
import type { StakeListItem } from "@/types/stake/stakeList";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import { defineAsyncComponent } from "vue";

export default {
  props: {
    stakeItem: {
      type: Object as () => StakeListItem,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    mainToken() {
      return this.stakeItem.mainToken;
    },

    stakeToken() {
      return this.stakeItem.stakeToken;
    },

    rewardTokens() {
      return this.stakeItem.rewardTokens;
    },

    backgroundStyle() {
      return `
      url(${this.stakeItem.backgroundImage})
      `;
    },
  },

  methods: {
    // goToStake(stakeItem: StakeListItem): RouterLinkParams {
    //   return { name: stakeItem.routerLinkName };
    // },
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.stake-item-link {
  display: flex;
  flex-direction: column;
  height: 280px;
  max-width: 411px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #2d4a96;
  background-repeat: no-repeat;
  background-size: 120%;
  background-position: center;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  color: white;
  text-decoration: none;
}

.title {
  font-size: 24px;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.apr-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 12px 0;
}

.apr-value {
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 16px;
  font-weight: 600;
}

.tokens-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  padding: 12px 32px;
  margin: 0 0 0 -16px;
  border-radius: 0 12px 12px 0;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.32) 0%,
    rgba(116, 92, 210, 0.32) 100%
  );
  backdrop-filter: blur(15.649999618530273px);
}

.main-token-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tokens-wrap.stake {
  font-size: 20px;
  font-weight: 400;
  margin: 0 0 6px -16px;
}

.tokens-wrap.reward {
  font-size: 16px;
  font-weight: 400;
}

.reward-tokens {
  display: flex;
  align-items: center;
}

.token-icon {
  margin-right: 0 !important;
}

.reward-tokens .token-icon:not(:first-of-type) {
  margin: 0 0 0 -4px;
}

.description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 400;
  margin: 16px 0 0 0;
}

@media (max-width: 500px) {
    .stake-item-link {
      justify-content: center;
  background-size: 150%;
    }
  }
</style>
