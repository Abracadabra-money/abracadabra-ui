<template>
  <div class="acardion">
    <h4 class="title">Freaquently Asked Questions</h4>

    <div class="card" v-for="item in items" :key="item.id">
      <div class="card-header">
        <span>{{ item.title }}</span>

        <img
          :class="['arrow-icon', { rotate: item.isExpand }]"
          src="@/assets/images/arrow-down.svg"
          alt=""
          @click.prevent="toggleExpand(item)"
        />
      </div>

      <div
        class="card-body"
        :ref="'content' + item.id"
        :style="[item.isExpand ? { height: item.computedHeight } : {}]"
      >
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      items: [
        {
          id: 1,
          title: "Why did I earn Potion Points?",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          isExpand: false,
          computedHeight: 0,
        },
        {
          id: 2,
          title: "Will there be more airdrops of Potions?",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          isExpand: false,
          computedHeight: 0,
        },
        {
          id: 3,
          title: "What can I do with my Potions?",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          isExpand: false,
          computedHeight: 0,
        },
        {
          id: 4,
          title: "How can I get Potion Points?",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          isExpand: false,
          computedHeight: 0,
        },
        {
          id: 5,
          title: "How can I get Potion Points?",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          isExpand: false,
          computedHeight: 0,
        },
      ],
    };
  },
  methods: {
    toggleExpand(item: any) {
      const openItem = this.items.find((item) => {
        if (item.isExpand) return item;
        else return null;
      });

      if (openItem?.id === item.id) {
        item.isExpand = !item.isExpand;
        return;
      } else {
        this.items.forEach((item) => {
          item.isExpand = false;
        });
      }

      item.isExpand = !item.isExpand;
    },

    getComputedHeight() {
      this.items.forEach((item) => {
        // @ts-ignore
        var content = this.$refs["content" + item.id][0];

        content.style.height = "auto";
        content.style.position = "absolute";
        content.style.visibility = "hidden";
        content.style.display = "block";

        var height = getComputedStyle(content).height;

        // @ts-ignore
        item.computedHeight = height;

        content.style.height = 0;
        content.style.position = null;
        content.style.visibility = null;
        content.style.display = null;
      });
    },
  },

  mounted() {
    this.getComputedHeight();
  },
};
</script>

<style lang="scss" scoped>
.acardion {
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  padding: 24px 24px 0;
  gap: 24px;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 24px;
  font-weight: 500;
  line-height: normal;
}

.card {
  position: relative;
  padding-bottom: 24px;
}

.card:not(:last-child):after {
  content: "";
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 46.5%,
    rgba(255, 255, 255, 0) 100%
  );
}

.card-header {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.card-header span {
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
}

.arrow-icon {
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
}

.rotate {
  transform: rotate(180deg);
}

.card-body {
  height: 0;
  overflow: hidden;
  transition: 0.3s;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  line-height: normal;
}

@media (max-width: 700px) {
  .acardion {
    padding: 16px;
  }

  .card {
    padding-bottom: 14px;
  }

  .title {
    font-size: 18px;
  }

  .card-header span,
  .card-body {
    font-size: 14px;
  }
}
</style>
