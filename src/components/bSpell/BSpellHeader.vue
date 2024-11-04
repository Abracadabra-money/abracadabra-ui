<template>
  <div class="content-header">
    <div class="left-block">
      <div class="tabs-wrap">
        <button
          :class="['tab-btn', { 'tab-btn-active': activeTab === tabInfo.name }]"
          v-for="tabInfo in tabsInfo"
          :key="tabInfo.name"
          @click="changeActiveTab(tabInfo.name)"
        >
          <img
            class="tab-icon"
            v-if="tabInfo.icon"
            :src="tabInfo.icon"
            alt="bSPELL icon"
          />

          {{ tabInfo.title }}
        </button>
      </div>

      <p class="header-title">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod

        <a
          class="header-link"
          href="http://"
          target="_blank"
          rel="noopener noreferrer"
          >tempor</a
        >
      </p>
    </div>

    <div class="right-block">
      <div class="info">
        <p class="info-title">bSpell In Curculation</p>
        <p class="info-text">
          <img
            class="info-icon"
            src="@/assets/images/tokens/bSPELL.png"
            alt="bSPELL icon"
          />{{ formatLargeSum(totalCirculation) }}
        </p>
      </div>
      <div class="line"></div>
      <div>
        <p class="info-title">Staked</p>
        <p class="info-text">
          <img
            class="info-icon"
            src="@/assets/images/tokens/bSPELL.png"
            alt="bSPELL icon"
          />120.00M
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { useImage } from "@/helpers/useImage";
import { bSpellLockConfig } from "@/helpers/bSpell/сonfig";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { formatLargeSum } from "@/helpers/filters";

export default {
  emits: ["changeActiveTab"],

  data() {
    return {
      bSpellTabName: "BSpellBlock",
      spellPowerTabName: "SpellPowerBlock",
      activeTab: "BSpellBlock",
      totalCirculation: "0.0",
      updateInterval: null as null | NodeJS.Timeout,
      tabsInfo: [
        {
          name: "BSpellBlock",
          icon: useImage("assets/images/tokens/bSPELL.png"),
          title: "bSpell",
        },
        {
          name: "SpellPowerBlock",
          icon: "",
          title: "Spell Power",
        },
      ],
    };
  },

  methods: {
    formatLargeSum,

    changeActiveTab(tabName: string) {
      this.activeTab = tabName;
      this.$emit("changeActiveTab", tabName);
    },

    async bSpellCurculation() {
      const chains = Object.keys(bSpellLockConfig).map(Number);

      const responses = await Promise.allSettled(
        chains.map(async (chainId) => {
          const {
            bSpell: { contract },
          } = bSpellLockConfig[chainId];
          const publicClient = getPublicClient(chainId);

          return publicClient.readContract({
            address: contract.address,
            abi: contract.abi,
            functionName: "totalSupply",
          });
        })
      );

      const totalCirculation = responses
        .filter(
          (result): result is PromiseFulfilledResult<bigint> =>
            result.status === "fulfilled"
        )
        .reduce((acc, { value }) => acc + value, 0n);

      this.totalCirculation = formatUnits(totalCirculation, 18);
    },
  },

  created() {
    this.bSpellCurculation();

    this.updateInterval = setInterval(async () => {
      await this.bSpellCurculation();
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(Number(this.updateInterval));
  },
};
</script>

<style lang="scss" scoped>
.content-header {
  z-index: 1;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
}

.left-block {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.tabs-wrap {
  display: flex;
  align-items: center;
}

.tab-btn {
  max-width: 189px;
  width: 100%;
  height: 52px;
  border: transparent;
  outline: transparent;
  border-radius: 36px;
  cursor: pointer;
  background: transparent;
  gap: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  line-height: 150%;
  color: #fff;
}

.tab-btn-active {
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.24) 0%,
    rgba(116, 92, 210, 0.24) 100%
  );
}

.tab-icon {
  width: 32px;
  height: 32px;
}

.header-title,
.header-link {
  font-size: 16px;
  font-weight: 400;
  line-height: 110%;
  color: #ffffff99;
}

.header-link {
  color: #7088cc;
  text-decoration: underline #7088cc;
}

.right-block {
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  padding: 12px 24px;
  gap: 20px;
  display: flex;
  align-items: center;
}

.line {
  height: 100%;
  width: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 46.5%,
    rgba(255, 255, 255, 0) 100%
  );
}

.info-title {
  color: #878b93;
  font-weight: 500;
  display: flex;
  justify-content: center;
}

.info-text {
  font-size: 28px;
  font-weight: 500;
  gap: 6px;
  display: flex;
  align-items: center;
  line-height: 150%;
}

.info-icon {
  width: 24px;
  height: 24px;
}
</style>
