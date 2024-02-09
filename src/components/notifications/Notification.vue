<template>
  <div class="notification" :class="['notification-' + notification.type]">
    <button class="close-button" @click="closeNotification"></button>
    <img
      class="notification-icon"
      :src="getImgUrl(notification.type)"
      alt="Notification icon"
    />

    <h3 class="title">
      {{ notificationTitle }} <span v-if="isPending">{{ parsedTime }}</span>
    </h3>
    <h4 class="subtitle">{{ notification.discription }}</h4>
    <p class="text">{{ notification.msg }}</p>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { useImage } from "@/helpers/useImage";
import { mapMutations } from "vuex";
export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      timerInterval: null as any,
      timeValue: 0,
    };
  },

  computed: {
    isPending() {
      return this.notification.type === "pending";
    },

    notificationTitle() {
      return this.notification?.title
        ? this.notification.title
        : this.notification.type;
    },

    parsedTime() {
      return moment(this.timeValue * 1000).format("mm:ss");
    },
  },

  methods: {
    ...mapMutations({
      deleteNotification: "notifications/delete",
    }),

    getImgUrl(type: string) {
      const icon = type ? type : "info";
      return useImage(`assets/images/notification-icons/${icon}-icon.png`);
    },

    closeNotification() {
      this.deleteNotification(this.notification.id);
    },
  },

  created() {
    if (this.isPending) {
      this.timerInterval = setInterval(() => {
        this.timeValue++;
      }, 1000);
    } else {
      setTimeout(() => {
        this.closeNotification();
      }, 15000);
    }
  },

  beforeUnmount() {
    clearInterval(this.timerInterval);
  },
};
</script>

<style lang="scss" scoped>
.notification {
  padding: 16px 16px 16px 80px;
  border-radius: 16px;
  background: rgba(16, 22, 34, 0.4);
  border: 1px solid var(--Primary-Solid, #7088cc);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(50px);
  position: relative;
  gap: 4px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.notification-success {
  border: 1px solid $success;

  .title {
    color: $success;
  }
}

.notification-pending {
  border: 1px solid $pending;

  .title {
    color: $pending;
  }
}

// todo warning color and icon
.notification-warning {
  border: 1px solid $warning;

  .title {
    color: $warning;
  }
}

.notification-error {
  border: 1px solid $error;

  .title {
    color: $error;
  }
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 14px;
  height: 14px;
  border: transparent;
  outline: transparent;
  cursor: pointer;
  background: url("@/assets/images/notification-icons/close-icon.svg");
}

.notification-icon {
  position: absolute;
  width: 52px;
  height: 52px;
  top: 16px;
  left: 16px;
}

.title {
  font-weight: 600;
  line-height: 150%;
  letter-spacing: 0.4px;

  &::first-letter {
    text-transform: uppercase;
  }
}

.subtitle {
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
}

.text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 120%;
}
</style>
