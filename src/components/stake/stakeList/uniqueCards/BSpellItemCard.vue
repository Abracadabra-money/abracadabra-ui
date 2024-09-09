<template>
  <router-link
    class="stake-item-link"
    :style="{ backgroundImage: backgroundStyle }"
    :to="{ name: 'BSpell' }"
  >
    <h3 class="title">{{ stakeItem.name }}</h3>

    <div class="tokens-wrap stake">
      Vest <BaseTokenIcon :icon="stakeToken.icon" :name="stakeToken.name" />
      {{ stakeToken.symbol }}
      <span class="main-token-info" v-if="mainToken">
        Into <BaseTokenIcon :icon="mainToken.icon" :name="mainToken.name" />
      </span>
    </div>

    <p class="vesting-wrap">
      Vesting time: <span class="vesting-time">3 months</span>
    </p>

    <div class="ratio-wrap">
      Ratio:
      <div class="tokens-ratio">
        <span class="token-ratio">
          1
          <BaseTokenIcon
            :icon="stakeToken.icon"
            :name="stakeToken.name"
            size="24px"
          />
        </span>
        =
        <span class="token-ratio">
          1
          <BaseTokenIcon
            :icon="mainToken.icon"
            :name="mainToken.name"
            size="24px"
          />
        </span>
      </div>
    </div>

    <p class="description">
      {{ stakeItem.description }}
    </p>
  </router-link>
</template>

<script lang="ts">
import { formatPercent } from "@/helpers/filters";
import { useImage } from "@/helpers/useImage";
import type { StakeListItem } from "@/types/stake/stakeList";
import { defineAsyncComponent } from "vue";

export default {
  data() {
    return {
      stakeItem: {
        name: "bSpell",
        description:
          "Stake your SPELL into mSPELL! No impermanent loss, no loss of governance rights. Protocol Fee 1% ",
        backgroundImage: useImage(
          "assets/images/stake/stake-list/background-images/bspell.png"
        ),
        routerLinkName: "BSpell",
        mainToken: {
          name: "Spell",
          symbol: "Spell",
          icon: useImage("assets/images/tokens/SPELL.png"),
        },
        stakeToken: {
          name: "bSpell",
          symbol: "bSpell",
          icon: useImage("assets/images/tokens/bSPELL.png"),
        },
      },
      apr: 0,
      isAPRFetching: false,
    };
  },

  computed: {
    mainToken() {
      return this.stakeItem.mainToken;
    },

    stakeToken() {
      return this.stakeItem.stakeToken;
    },

    backgroundStyle() {
      return `
      url(${this.stakeItem.backgroundImage})
      `;
    },
  },

  methods: {
    formatPercent,
    goToStake({ routerLinkName, routerQuery }: StakeListItem) {
      return {
        name: routerLinkName,
        query: routerQuery,
      };
    },
    async fetchAPR() {
      this.isAPRFetching = true;
      this.apr = 0;
      this.isAPRFetching = false;
    },
  },

  async mounted() {
    await this.fetchAPR();
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
  gap: 16px;
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
  transition: all 0.3s ease-in-out;
}

.stake-item-link:hover {
  transform: scale(1.01);
  z-index: 1;
}

.title {
  font-size: 24px;
  font-weight: 500;
}

.vesting-time {
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 16px;
  font-weight: 600;
}

.tokens-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  padding: 12px 32px 12px 16px;
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
  margin: 0 0 0 -16px;
}

.vesting-wrap,
.ratio-wrap {
  font-size: 16px;
  font-weight: 500;
}

.ratio-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tokens-ratio,
.token-ratio {
  display: flex;
  align-items: center;
  gap: 4px;
}

.token-icon {
  margin-right: 0 !important;
}

.description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 400;
}

.row-skeleton {
  height: 24px !important;
}

@media (max-width: 500px) {
  .stake-item-link {
    justify-content: center;
    background-size: 150%;
  }
}
</style>
