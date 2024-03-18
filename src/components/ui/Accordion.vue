<template>
  <div class="card" v-for="item in items" :key="item.id">
    <div class="card-header">
      <span>How to maximize your Points</span>

      <img
        class="arrow-icon"
        src="@/assets/images/blast/arrow-dawn.png"
        alt=""
        @click.prevent="toggleExpand(item)"
      />
    </div>

    <div
      class="card-body"
      :ref="'content' + item.id"
      :style="[item.isExpand ? { height: item.computedHeight } : {}]"
    >
      <ul class="boost-ways-list">
        <li class="boost-way">
          <span class="title">Deposit USDb</span>
          <span class="value">3X Points</span>
        </li>

        <li class="boost-way">
          <span class="title">Deposit MIM</span>
          <span class="value">1X Points</span>
        </li>

        <li class="boost-way">
          <span class="title">Deposit WETH in the Cauldron</span>
          <span class="value">2x Points</span>
        </li>

        <li class="boost-way">
          <span class="title">Lock your MIM & USDb to get Boost</span>
          <span class="value">20X Points </span>
        </li>

        <li class="boost-way">
          <span class="title">
            Mint MIM from WETH Cauldron on Blast and deposit it
          </span>
          <span class="value">15X Points</span>
        </li>
      </ul>
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
          title: "Sample Title 1",
          content: "Lorem ipsum dolor sit amet",
          isExpand: false,
          computedHeight: 0,
        },
      ],
    };
  },
  methods: {
    toggleExpand(item: any) {
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
@import url("https://fonts.googleapis.com/css2?family=Inconsolata&display=swap");

.card {
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.card-header,
.card-content {
  margin: 10px 0;
}

.arrow-icon {
  width: 24px;
  height: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.card-header span {
  font-weight: 600;
}

.card-body {
  height: 0;
  overflow: hidden;
  transition: 0.3s;
}

.icon {
  float: right;
}

hr {
  margin: 0;
  height: 1px;
  display: block;
  border-width: 0;
  border-top: 1px solid #aaa;
}

.points-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.table-title {
  font-size: 16px;
  font-weight: 500;
}

.boost-ways-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.boost-way {
  display: flex;
  justify-content: space-between;
}

.title {
  color: #878b93;
  font-size: 16px;
  font-weight: 400;
}

.value {
  font-size: 16px;
  font-weight: 500;
  min-width: 120px;
  text-align: end;
}

@media (max-width: 700px) {
  .points-info {
    padding: 16px;
  }

  .boost-way {
    flex-direction: column;
  }

  .title,
  .value,
  .table-title {
    font-size: 14px;
  }

  .value {
    text-align: start;
  }
}
@media (max-width: 700px) {
  .card {
    display: none;
  }
}
</style>
