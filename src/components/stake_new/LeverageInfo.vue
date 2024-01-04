<template>
  <div class="leverage-info">
    {{ leverageInfo.label }}
    <router-link
      v-if="leverageInfo.id"
      :to="{
        name: 'Market',
        params: {
          chainId: selectedNetwork,
          cauldronId: leverageInfo.id,
        },
      }"
      class="leverege-link"
      >here.</router-link
    >
  </div>
</template>

<script lang="ts">
export default {
  props: {
    selectedNetwork: { type: Number, required: true },
    leverageInfo: { type: Object as any, required: true },
  },
};
</script>

<style lang="scss" scoped>
.everage-info {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
}

.leverege-link {
  color: #fff;
  text-decoration-line: underline;
}
</style>
