export default {
    name: "notification",
    state: {
      notification: [],
      notificationId: 0
    },
    mutations: {
      addNotification(state, payload) {
        const notification = {
          ...payload,
        };

        state.notificationId++;
  
        state.notification.push(notification);
      },
      deleteNotification(state, id) {
        state.notification = state.notification.filter((item) => item.id !== id);
      },
    },
    actions: {},
    getters: {
      getNotifications: (state) => state.notification,
      getNotificationId: (state) => state.notificationId,
    },
  };
  