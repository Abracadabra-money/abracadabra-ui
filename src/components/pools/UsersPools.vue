<template>
  <div class="users-pools">
    <ul class="pools-list">
      <li class="pool-card" :index="index" v-for="(pool, index) in usersPools">
        <PoolCard :pool="pool" />
      </li>
    </ul>

    <PoolsCarousel class="pools-carousel" :pools="usersPools" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";

export default {
  props: {
    usersPools: { type: Array },
  },

  components: {
    PoolsCarousel: defineAsyncComponent(() =>
      import("@/components/pools/PoolsCarousel.vue")
    ),
    PoolCard: defineAsyncComponent(() =>
      import("@/components/pools/PoolCard.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.pools-list {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 1px;
  list-style: none;
  overflow: auto;
}

.pools-carousel {
  display: none;
}

@media (max-width: 1050px) {
  .pools-list {
    display: none;
  }

  .pools-carousel {
    display: block;
  }
}
</style>
