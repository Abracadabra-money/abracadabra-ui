<template>
  <button @click="$emit('select')" class="stats-item" :disabled="isSelected">
    <span class="network-data" :class="{ 'network-data-new': isNew }">
      <img class="network-image" :src="icon" alt="network" />
      <span class="network-name-wrap">
        <span>{{ name }}</span>
        <span v-if="isNew" class="network-new">New</span>
      </span>
    </span>
    <span>
      <span class="column-title">TOTAL MIM BORROWED</span>
      <span>14.35K</span>
    </span>
    <span>
      <span class="column-title">MIMS LEFT TO BORROW</span>
      <span>12.33K</span>
    </span>
    <span>
      <span class="column-title">INTEREST</span>
      <span>4%</span>
    </span>
    <span>
      <span class="column-title">LIQUIDATION FEE</span>
      <span>12.5%</span>
    </span>
    <span class="degenbox">
      <img
        v-if="degen"
        class="degenbox-img"
        src="@/assets/images/degenbox.svg"
        alt="DegenBox"
      />
    </span>
  </button>
</template>

<script>
export default {
  name: "StatsItem",
  props: {
    icon: {
      type: String,
    },
    name: {
      type: String,
      default: "",
    },
    degen: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.stats-item {
  position: relative;
  display: grid;
  background-color: #2a2835;
  line-height: 21px;
  border-radius: 26px;
  padding: 10px;
  height: auto;
  grid-gap: 4px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  color: white;
  text-align: left;

  &:disabled {
    cursor: default;
    outline: 1px solid #8180ff;
  }
}

.network-data {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
  margin-bottom: 6px;
  .network-image {
    height: 32px;
    min-width: 32px;
    object-fit: contain;
    margin-right: 8px;
  }
  .network-name-wrap {
    position: relative;
    display: flex;
    align-items: center;
    height: 32px;

    .network-new {
      position: absolute;
      display: flex;
      align-items: center;
      top: 100%;
      background-color: #6372f8;
      padding: 0 10px;
      border-radius: 32px;
      font-size: 12px;
      line-height: 16px;
    }
  }
}

.network-data-new {
  margin-bottom: 21px;
}

.column-title {
  display: block;
  color: rgba(255, 255, 255, 0.6);
}

.degenbox {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  justify-content: center;

  .degenbox-img {
    width: 32px;
  }
}

@media (min-width: 1024px) {
  .stats-item {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 60px;
    align-items: center;
    padding: 0 20px;
    grid-gap: 0;
    height: 100px;
    font-size: 16px;
    border-radius: 30px;
  }
  .network-data {
    margin-bottom: 0;
    .network-image {
      height: 28px;
      min-width: 28px;
      margin-right: 8px;
    }
    .network-name-wrap {
      height: 28px;
    }
  }
  .column-title {
    display: none;
  }

  .degenbox {
    position: static;
    .degenbox-img {
      width: 40px;
    }
  }
}
</style>
