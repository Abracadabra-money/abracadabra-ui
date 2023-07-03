<template>
  <div class="position-links" v-if="actions">
    <router-link
      class="position-link"
      v-for="(action, idx) in actions"
      :to="{ name: action.name, params: { id: action.id } }"
      :key="idx"
    >
      <img class="position-link-icon" :src="action.icon" alt="Hammer" />
      <p class="position-link-title">{{ action.title }}</p>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    actions: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.position-links {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.position-link {
  display: inline-flex;
  flex: 0 0 67px;
  flex-direction: column;
  align-items: center;
}

.position-link-icon {
  width: 24px;
  height: 24px;
  box-sizing: content-box;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  margin-bottom: 8px;
}

.position-link-title {
  font-size: 10px;
  line-height: 110%;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
}
</style>
