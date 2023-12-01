export default {
  name: "notifications",
  namespaced: true,
  state: {
    notifications: [],
    lastId: 0,
  },
  mutations: {
    add(state, notification) {
      state.notifications.push(notification);
    },
    setLastId(state, id) {
      state.lastId = id;
    },
    delete(state, id) {
      state.notifications = state.notifications.filter(
        (item) => item.id !== id
      );
    },
    deleteAll(state) {
      state.notifications = [];
    },
    updateTitle(state, payload) {
      state.notifications.find((notification) => {
        if (notification.id === payload.id) notification.title = payload.title;
      });
    },
  },
  actions: {
    new({ commit, state }, payload) {
      const id = state.lastId + 1;
      const notification = { ...payload, id };
      commit("setLastId", id);
      commit("add", notification);
      return id;
    },
  },
  getters: {
    getAll: (state) => state.notifications,
  },
};
