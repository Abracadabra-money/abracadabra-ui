<template>
  <div
    class="dropdown link"
    :class="{ active: isOpen }"
    @click.stop="toggleDropdown"
    v-click-outside="closeDropdown"
  >
    <img class="title" src="@/assets/images/social/points.svg" alt="Points" />
    <div class="list" v-if="isOpen">
      <router-link class="list-link" to="/">V 1</router-link>
      <router-link class="list-link" to="/">Forum</router-link>
      <div class="list-row">
        <router-link class="list-link" to="/"
          ><img src="@/assets/images/social/docs.svg" alt="Docs"
        /></router-link>
        <router-link class="list-link" to="/"
          ><img src="@/assets/images/social/medium.svg" alt="Medium"
        /></router-link>
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
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
    };
  },

  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    closeDropdown() {
      this.isOpen = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  display: flex;
  justify-content: center;
}

.title {
  max-width: 20px;
}

.list {
  position: absolute;
  top: 100%;
  left: 0;
  display: flex;
  flex-direction: column;
  background: #575668;
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
  background: #575668;

  .arrow {
    transform: rotate(180deg);
  }
}
</style>
