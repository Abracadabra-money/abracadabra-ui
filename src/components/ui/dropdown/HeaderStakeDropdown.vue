<template>
  <div
    class="dropdown-tools"
    :class="{ active: showDropdownList }"
    @click="toggleDropdown"
    v-click-outside="closeDropdown"
  >
    <div class="dropdown-title">
      Stake
      <img
        class="arrow"
        src="@/assets/images/arrow-down.svg"
        alt="Arrow down"
      />
    </div>

    <Transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div class="list" v-show="showDropdownList">
        <router-link class="list-link" :to="{ name: 'StakeSpell' }">
          <div class="link-title">
            <span class="stake-token">
              <img
                class="link-icon"
                src="@/assets/images/stake/tokens/Spell.png"
              />
              Spell
            </span>
            <span class="apr" v-if="spellApr"
              >APR: {{ formatPercent(spellApr) }}</span
            >
            <div class="loader-wrap" v-else>
              <BaseLoader type="loader" />
            </div>
          </div>
          <p class="link-description">Stake Spell</p>
        </router-link>

        <router-link class="list-link" :to="{ name: 'magicGLP' }">
          <div class="link-title">
            <span class="stake-token">
              <img
                class="link-icon"
                src="@/assets/images/stake/tokens/GLP.png"
              />
              GLP
            </span>
            <span class="apr" v-if="glpApr"
              >APR: {{ formatPercent(glpApr) }}</span
            >
            <div class="loader-wrap" v-else>
              <BaseLoader type="loader" />
            </div>
          </div>
          <p class="link-description">Stake GLP</p>
        </router-link>

        <router-link class="list-link" :to="{ name: 'magicAPE' }">
          <div class="link-title">
            <span class="stake-token">
              <img
                class="link-icon"
                src="@/assets/images/stake/tokens/APE.png"
              />
              APE
            </span>
            <span class="apr" v-if="apeApr"
              >APR: {{ formatPercent(apeApr) }}</span
            >
            <div class="loader-wrap" v-else>
              <BaseLoader type="loader" />
            </div>
          </div>
          <p class="link-description">Stake APE</p>
        </router-link>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { formatPercent } from "@/helpers/filters";
import BaseLoader from "@/components/base/BaseLoader.vue";
import { useAnimation } from "@/helpers/useAnimation/useAnimation";
import { ARBITRUM_CHAIN_ID, MAINNET_CHAIN_ID } from "@/constants/global";
import { getMagicGlpApy } from "@/helpers/collateralsApy/getMagicGlpApy";
import { getMagicApeApy } from "@/helpers/collateralsApy/getMagicApeApy";
import { getSpellStakingApr } from "@/helpers/stake/spell/getSpellStakingApr";

export default {
  data() {
    return {
      spellApr: null as string | null,
      glpApr: null as number | null,
      apeApr: null as number | null,
      showDropdownList: false,
    };
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),
  },

  methods: {
    formatPercent,
    ...useAnimation("roll"),

    async getSpellApr() {
      const spellAprs = await getSpellStakingApr();
      this.spellApr = spellAprs?.sSpellApr;
    },

    async getGlpApr() {
      const glpAprs = await getMagicGlpApy(ARBITRUM_CHAIN_ID);
      this.glpApr = glpAprs.magicGlpApy;
    },

    async getApeApr() {
      this.apeApr = await getMagicApeApy(MAINNET_CHAIN_ID);
    },

    toggleDropdown() {
      this.showDropdownList = !this.showDropdownList;
    },

    closeDropdown() {
      this.showDropdownList = false;
    },
  },

  async created() {
    this.getSpellApr();
    this.getGlpApr();
    this.getApeApr();
  },

  components: {
    BaseLoader,
  },
};
</script>

<style lang="scss" scoped>
.dropdown-tools {
  position: relative;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 600;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;

  .dropdown-title {
    display: flex;
    align-items: center;
  }
}

.arrow {
  margin-left: 5px;
  transition: all 300ms ease-in-out;
}

.list {
  position: absolute;
  top: calc(100% + 12.5px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 233px;
  padding: 16px;
  gap: 16px;
  border-radius: 12px;
  border: 1px solid #2d4a96;
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  overflow: hidden;
}

.list-link {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 100%;
  color: #fff;
  font-size: 16px;
  line-height: 24px;
}

.list-link:hover {
  opacity: 0.5;
}

.stake-token {
  display: flex;
  align-items: center;
  gap: 4px;
}

.link-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  color: #fff;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}

.link-icon {
  width: 32px;
  height: 32px;
}

.link-description {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
}

.apr {
  color: #fff;
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 14px;
  font-weight: 600;
}

.active {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
}

.active .arrow {
  transform: rotate(180deg);
}

.logo-link-wrap {
  width: 100%;
  border-top: 1px solid #7089cc55;
  padding-top: 8px;
}

.loader-wrap {
  width: 30px;
  height: 24px;
}
</style>
