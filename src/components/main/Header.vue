<template>
  <header class="header">
    <nav class="nav">
      <router-link class="link" to="/">Borrow</router-link>
      <router-link class="link" to="/about">Leverage</router-link>
      <router-link class="link" to="/about">Positions</router-link>
      <router-link class="link" to="/about">Farm</router-link>
      <div
        class="dropdown-tools link"
        :class="{ active: isDropdownTools }"
        @click="toggleDropdown('tools')"
        v-click-outside="closeDropdownTools"
      >
        <div class="title">
          Tools
          <img
            class="arrow"
            src="@/assets/images/arrow-down.svg"
            alt="Arrow down"
          />
        </div>
        <div class="list" v-if="isDropdownTools">
          <router-link class="list-link" to="/stake">Stake</router-link>
          <router-link class="list-link" :to="{ name: 'Bridge' }"
            >Bridge</router-link
          >
          <router-link class="list-link" to="/">Swap</router-link>
          <a href="#" class="list-link" target="_blank">Analytics</a>
        </div>
      </div>
      <ConnectButton />
      <div
        class="dropdown-other link"
        :class="{ active: isDropdownOther }"
        @click.stop="toggleDropdown('other')"
        v-click-outside="closeDropdownOther"
      >
        <img
          class="title"
          src="@/assets/images/social/points.svg"
          alt="Points"
        />
        <div class="list" v-if="isDropdownOther">
          <router-link class="list-link" to="/">V 1</router-link>
          <router-link class="list-link" to="/">Forum</router-link>
          <div class="list-row">
            <a href="/" class="list-link" target="_blank"
              ><img src="@/assets/images/social/docs.svg" alt="Docs"
            /></a>
            <a href="/" class="list-link" target="_blank"
              ><img src="@/assets/images/social/medium.svg" alt="Medium"
            /></a>
          </div>
          <div class="list-row">
            <router-link class="list-link" to="/"
              ><img src="@/assets/images/social/twitter.svg" alt="Twitter"
            /></router-link>
            <router-link class="list-link" to="/"
              ><img src="@/assets/images/social/discord.svg" alt="Discord"
            /></router-link>
          </div>
        </div>
      </div>
      <MimTokenBlock />
    </nav>
  </header>
</template>

<script>
const ConnectButton = () => import("@/components/ui/ConnectButton");
const MimTokenBlock = () => import("@/components/ui/MimTokenBlock");

export default {
  data() {
    return {
      isDropdownTools: false,
      isDropdownOther: false,
    };
  },

  methods: {
    toggleDropdown(nameDropdown) {
      if (nameDropdown === "tools") {
        this.isDropdownTools = !this.isDropdownTools;
      }
      if (nameDropdown === "other")
        this.isDropdownOther = !this.isDropdownOther;
    },

    closeDropdownTools() {
      this.isDropdownTools = false;
    },

    closeDropdownOther() {
      this.isDropdownOther = false;
    },
  },

  components: {
    ConnectButton,
    MimTokenBlock,
  },
};
</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  height: 80px;
  top: 15px;
  left: 0;
  right: 0;
  max-width: 860px;
  margin: 0 auto;
  z-index: 10;
}

.nav {
  display: flex;
  justify-content: space-between;
}

.link {
  background: #ffffff0f;
  backdrop-filter: blur(40px);
  border-radius: 20px;
  padding: 13px 18px;
  font-size: 16px;
  line-height: 24px;
  color: #fff;
  cursor: pointer;
  min-width: 80px;
}

.link:hover {
  background: #ffffff33;
}

.dropdown-tools {
  position: relative;

  .title {
    display: flex;
    align-items: center;
  }
}

.dropdown-other {
  display: flex;
  justify-content: center;
  max-width: 90px;
  width: 100%;

  .title {
    max-width: 20px;
  }
}

.arrow {
  margin-left: 5px;
  transition: all 300ms ease-in-out;
}

.list {
  position: absolute;
  top: 100%;
  left: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff33;
  width: 100%;
  border-radius: 0 0 20px 20px;
}

.list-link {
  padding: 13px 0;
  display: flex;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  line-height: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.list-link:hover {
  background: -webkit-linear-gradient(#5282fd, #76c3f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.list-link:last-child {
  border-bottom: none;
}

.list-row {
  display: flex;
  justify-content: space-evenly;

  .list-link {
    border-bottom: none;
  }

  img {
    max-width: 24px;
  }
}

.list-row:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.active {
  border-radius: 20px 20px 0 0;
  background: #ffffff33;

  .arrow {
    transform: rotate(180deg);
  }
}
</style>
