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
      <h2>{{ notificationTitle }}</h2>
      <img
        class="notification-item__close"
        src="@/assets/images/notification-icons/close-icon.svg"
        alt=""
        @click="closeNotification"
      />
    </div>
    <p class="notification-item__discription">{{ notification.discription }}</p>
    <p class="notification-item__content">{{ notification.msg }}</p>
    <div class="timer" v-if="notification.type === 'pending'">
      <img
        class="timer-icon"
        src="@/assets/images/notification-icons/pending-icon.svg"
        alt="Timer"
      />
      <p class="timer-number">{{ parsedTime }}</p>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      timerInterval: null,
      timeValue: 0,
    };
  },

  computed: {
    notificationTitle() {
      if (this.notification?.title) return this.notification.title;

      return this.notification.type;
    },

    parsedTime() {
      return moment(this.timeValue * 1000).format("mm:ss");
    },
  },

  methods: {
    getImgUrl(type) {
      if (!type) {
        return this.$image(`assets/images/notification-icons/info-icon.png`);
      }

      return this.$image(`assets/images/notification-icons/${type}-icon.png`);
    },

    closeNotification() {
      this.$store.commit("notifications/delete", this.notification.id);
    },
  },

  created() {
    this.timerInterval = setInterval(() => {
      this.timeValue++;
    }, 1000);

    if (this.notification.type !== "pending") {
      setTimeout(() => {
        this.closeNotification();
      }, 15000);
    }
  },

  beforeDestroy() {
    clearInterval(this.timerInterval);
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
    margin-right: 5px;
    width: 45px;
    height: auto;
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
    align-items: center;
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
  &__pending {
    border: 1px solid #9695f8;
  }
}

.timer {
  display: flex;
  align-items: center;
  padding: 10px 0 0;
}

.timer-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.timer-number {
  font-weight: 600;
  font-size: 18px;
  line-height: 20px;
  text-align: center;
}
</style>
