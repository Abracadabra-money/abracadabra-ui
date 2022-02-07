<template>
  <div
    class="dropdown link"
    :class="{ active: isOpen }"
    @click.stop="toggleDropdown"
    v-click-outside="closeDropdown"
  >
    <div class="title">
      Tools
      <img
        class="arrow"
        src="@/assets/images/arrow-down.svg"
        alt="Arrow down"
      />
    </div>
    <div class="list" v-if="isOpen">
      <router-link
        class="list-link"
        v-for="(link, inx) in options"
        :key="inx"
        :to="{ name: link }"
        >{{ link }}</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
    },
  },

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
  position: relative;
}

.title {
  display: flex;
  align-items: center;
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

.active {
  border-radius: 20px 20px 0 0;
  background: #575668;

  .arrow {
    transform: rotate(180deg);
  }
}
</style>
