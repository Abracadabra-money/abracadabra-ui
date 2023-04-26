<template>
  <div class="not-found" v-if="emptyType">
    <img
      class="not-found__img"
      src="@/assets/images/empty-stats-list.png"
      alt="Pools not found"
    />
    <p class="not-found__text" v-if="!wrongNetwork">
      No {{ popupType }} found with this name
    </p>

    <template v-else>
      <p class="not-found__text">no {{ popupType }} on this network</p>
      <p class="not-found__text">in the future they will be displayed here</p>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    emptyType: {
      type: String,
      default: "",
    },
    popupType: {
      type: String,
      default: "",
    },
  },

  computed: {
    wrongNetwork() {
      return this.emptyType === "pools";
    },
  },
};
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 30px 10px;
}

.not-found__img {
  width: 186px;
  max-width: 100%;
  height: auto;
  margin-bottom: 19px;
}
</style>
