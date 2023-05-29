<template>
  <div class="user-assets">
    <template v-for="(asset, idx) in assets">
      <router-link
        class="asset-item"
        v-if="asset.routName"
        :to="{ name: asset.routName }"
        :key="idx"
      >
        <p class="title">{{ asset.title }}</p>
        <p class="value">{{ asset.value }}</p>
      </router-link>
      <div class="asset-item" v-else :key="`${idx}-${asset.title}`">
        <p class="title">{{ asset.title }}</p>
        <p class="value">{{ asset.value }}</p>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    assets: {
      type: Array,
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.user-assets {
  width: 100%;
  border-radius: 30px;
  background-color: $clrBg2;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 33px;
}

.asset-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  line-height: 27px;
  color: #fff;
}

.title {
  font-weight: 400;
  color: #ffffffcc;
}

.value {
  font-weight: 700;
}
</style>
