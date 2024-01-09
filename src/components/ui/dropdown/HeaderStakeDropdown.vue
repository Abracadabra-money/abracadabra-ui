<template>
  <div
    class="dropdown-tools header-link"
    :class="{ active: showDropdownList }"
    @click="toggleDropdown()"
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

    <div class="list" v-if="showDropdownList">
      <router-link class="list-link" :to="{ name: 'StakeSpell' }">
        <div class="link-title">
          <span class="stake-token">
            <img class="link-icon" src="@/assets/images/tokens/SPELL.png" />
            Spell
          </span>
          <span class="apr">127.28%</span>
        </div>
        <p class="link-description">Stake Spell</p>
      </router-link>

      <router-link class="list-link" :to="{ name: 'magicGLP' }">
        <div class="link-title">
          <span class="stake-token">
            <img class="link-icon" src="@/assets/images/tokens/SPELL.png" />
            GLP
          </span>
          <span class="apr">127.28%</span>
        </div>
        <p class="link-description">Stake GLP</p>
      </router-link>

      <router-link class="list-link" :to="{ name: 'magicAPE' }">
        <div class="link-title">
          <span class="stake-token">
            <img class="link-icon" src="@/assets/images/tokens/SPELL.png" />
            APE
          </span>
          <span class="apr">127.28%</span>
        </div>
        <p class="link-description">Stake APE</p>
      </router-link>

      <router-link class="list-link" :to="{ name: 'magicLVL' }">
        <div class="link-title">
          <span class="stake-token">
            <img class="link-icon" src="@/assets/images/tokens/SPELL.png" />
            LVL
          </span>
          <span class="apr">127.28%</span>
        </div>
        <p class="link-description">Stake LVL</p>
      </router-link>

      <router-link class="list-link" :to="{ name: 'magicKLP' }">
        <div class="link-title">
          <span class="stake-token">
            <img class="link-icon" src="@/assets/images/tokens/SPELL.png" />
            KLP
          </span>
          <span class="apr">127.28%</span>
        </div>
        <p class="link-description">Stake KLP</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";

export default {
  data() {
    return {
      showDropdownList: false,
    };
  },

  methods: {
    toggleDropdown() {
      this.showDropdownList = !this.showDropdownList;
    },

    closeDropdown() {
      this.showDropdownList = false;
    },
  },

  components: {
    BaseTokenIcon,
  },
};
</script>

<style lang="scss" scoped>
.dropdown-tools {
  position: relative;

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
</style>
