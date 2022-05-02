<template>
  <div class="info-bar">
    <img
      class="info-bar-icon"
      src="@/assets/images/info-bar/strategy.png"
      alt="Іtrategy"
      v-if="pool.hasStrategy"
      @mouseover="addNotifications('strategy')"
    />
    <img
      class="info-bar-icon"
      src="@/assets/images/info-bar/spirit.png"
      alt="Іtrategy"
      v-if="false"
    />
    <img
      class="info-bar-icon"
      src="@/assets/images/info-bar/new.png"
      alt="Іtrategy"
      v-if="false"
    />
    <img
      class="info-bar-icon"
      src="@/assets/images/info-bar/depreciated.png"
      alt="Вepreciated"
      v-if="pool.isDepreciated"
      @mouseover="addNotifications('strategy')"
      @mouseleave="deleteNotifications('strategy')"
    />
  </div>
</template>

<script>
export default {
  props: {
    pool: {
      type: Object,
      require: true,
    },
  },

  data() {
    return {
      notifications: {
        strategy: { msg: "strategy" },
        depreciated: { msg: "depreciated" },
      },

      id: null,
    };
  },

  methods: {
    async addNotifications(type) {
      this.id = await this.$store.dispatch(
        "notifications/new",
        this.notifications[type]
      );
    },

    deleteNotifications() {
      this.$store.commit("notifications/delete", this.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.info-bar {
  display: flex;
  justify-content: flex-end;
}

.info-bar-icon {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.info-bar-icon:not(:last-child) {
  margin-right: 10px;
}
</style>
