<template>
  <div class="popup">
    <div class="popup-header" @click="$emit('closePopup')">
      <img class="arrow" src="@/assets/images/arrow.svg" />
      <span class="header-text">Menu</span>
    </div>

    <div class="list">
      <h5 class="list-title">Stake</h5>

      <router-link
        class="list-link"
        :to="{ name: 'StakeSpell' }"
        @click="$emit('closeMobileMenu')"
      >
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

      <router-link
        class="list-link"
        :to="{ name: 'magicGLP' }"
        @click="$emit('closeMobileMenu')"
      >
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

      <router-link
        class="list-link"
        :to="{ name: 'magicAPE' }"
        @click="$emit('closeMobileMenu')"
      >
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

      <router-link
        class="list-link"
        :to="{ name: 'magicKLP' }"
        @click="$emit('closeMobileMenu')"
      >
        <div class="link-title">
          <span class="stake-token">
            <img class="link-icon" src="@/assets/images/stake/tokens/KLP.png" />
            KLP
          </span>
          <!-- <span class="apr" v-if="klpApr"
            >APR: {{ formatPercent(klpApr) }}</span
          >
          <div class="loader-wrap" v-else>
            <BaseLoader type="loader" />
          </div> -->
        </div>
        <p class="link-description">Stake KLP</p>
      </router-link>
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

export default {
  data() {
    return {
      spellApr: null,
      glpApr: null,
      apeApr: null,
      klpApr: null,
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

    closeDropdown() {
      this.showDropdownList = false;
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
.popup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #7089cc44;
  cursor: pointer;
}

.popup-header:hover .header-text,
.popup-header:hover .arrow {
  opacity: 0.5;
}

.header-text {
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
}

.arrow {
  transform: rotate(90deg);
}

.list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 24px;
}

.list-title {
  font-size: 16px;
  font-weight: 500;
  margin-top: 24px;
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
