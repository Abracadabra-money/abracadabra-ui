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

    <div class="list" v-show="showDropdownList" ref="dropdownList">
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
            <img class="link-icon" src="@/assets/images/stake/tokens/GLP.png" />
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
            <img class="link-icon" src="@/assets/images/stake/tokens/APE.png" />
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

      <!-- <router-link class="list-link" :to="{ name: 'magicKLP' }">
        <div class="link-title">
          <span class="stake-token">
            <img class="link-icon" src="@/assets/images/stake/tokens/KLP.png" />
            KLP
          </span> -->
      <!-- <span class="apr" v-if="klpApr"
            >APR: {{ formatPercent(klpApr) }}</span
          >  -->
      <!-- <div class="loader-wrap" v-else>
            <BaseLoader type="loader" />
          </div> -->
      <!-- </div>
        <p class="link-description">Stake KLP</p>
      </router-link> -->
    </div>
  </div>
</template>

<script>
import {
  ANALYTICS_URK,
  ARBITRUM_CHAIN_ID,
  MAINNET_CHAIN_ID,
} from "@/constants/global";
import axios from "axios";
import { mapGetters } from "vuex";
import { formatPercent } from "@/helpers/filters";
import BaseLoader from "@/components/base/BaseLoader.vue";
import { getMagicGlpApy } from "@/helpers/collateralsApy/getMagicGlpApy";
import { getMagicApeApy } from "@/helpers/collateralsApy/getMagicApeApy";
import { getSpellStakingApr } from "@/helpers/stake/spell/getSpellStakingApr";
import gsap from "gsap";

export default {
  data() {
    return {
      spellApr: null,
      glpApr: null,
      apeApr: null,
      klpApr: null,
      showDropdownList: false,
    };
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),
  },

  methods: {
    formatPercent,

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

    async getKlpApr() {
      const { data } = await axios.get(`${ANALYTICS_URK}/kinetix/info`);
      this.klpApr = data.apr;
    },

    toggleDropdown() {
      if (this.showDropdownList) {
        this.closeDropdown();
      } else {
        this.showDropdownList = true;
        this.openingAnimation();
      }
    },

    closeDropdown() {
      this.closingAnimation();
      setTimeout(() => (this.showDropdownList = false), 300);
    },

    openingAnimation() {
      gsap.fromTo(
        this.$refs.dropdownList,
        { y: -20, height: 0 },
        { duration: 0.3, y: 0, height: "auto", ease: "power2.out" }
      );
    },

    closingAnimation() {
      gsap.to(this.$refs.dropdownList, {
        duration: 0.3,
        y: -20,
        height: 0,
        ease: "power2.in",
      });
    },
  },

  async created() {
    this.getSpellApr();
    this.getGlpApr();
    this.getApeApr();
    // await this.getKlpApr();
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
