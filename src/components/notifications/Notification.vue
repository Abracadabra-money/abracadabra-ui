<template>
  <div
    class="notification-item"
    :class="['notification-item__' + notification.type]"
  >
    <div class="notification-item__header">
      <img
        :src="getImgUrl(notification.type)"
        alt=""
        class="notification-item__icon"
      />
      <h2>{{ notification.title }}</h2>
      <img
        class="notification-item__close"
        src="@/assets/images/notification-icons/close-icon.svg"
        alt=""
        @click="closeNotification"
      />
    </div>
    <p class="notification-item__discription">{{ notification.discription }}</p>
    <p class="notification-item__content">{{ notification.msg }}</p>
  </div>
</template>

<script>
export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getImgUrl(type) {
      // var images = require.context(
      //   "../../assets/images/notification-icons/",
      //   false,
      //   /\.svg$/
      // );
      // return images("./" + type + "-icon.svg");

      if (!type) {
        return require(`@/assets/images/notification-icons/info-icon.svg`);
      }

      return require(`@/assets/images/notification-icons/${type}-icon.svg`);
    },
    closeNotification() {
      this.$store.commit("notifications/delete", this.notification.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.notification-item {
  padding: 20px;
  background: rgba(66, 63, 77, 0.4);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(100px);
  border-radius: 30px;
  &__close {
    margin-left: auto;
    margin-top: -20px;
    cursor: pointer;
  }
  &__icon {
    margin-right: 16px;
  }
  &__header {
    font-family: Prompt;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0.025em;
    text-transform: uppercase;
    display: flex;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 13px;
    margin-bottom: 13px;
  }
  &__discription {
    font-size: 16px;
    letter-spacing: 0.025em;
    color: #ffffff;
  }
  &__content {
    margin-top: 5px;
    font-size: 16px;
    letter-spacing: 0.025em;
    /* #FFFFFF */
    color: rgba(255, 255, 255, 0.6);
  }
}
.notification-item {
  &__success {
    border: 1px solid #63ff7b;
  }
  &__info {
    border: 1px solid #517ef2;
  }
  &__error {
    border: 1px solid #d94844;
  }
  &__warning {
    border: 1px solid #e5d752;
  }
}
</style>
