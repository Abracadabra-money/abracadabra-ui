export default {
  state: {
    mobileMenu: false,
    showPopup: false,
    popupType: null,
    popupData: null,
  },
  mutations: {
    setMobileMenu(state, show) {
      state.mobileMenu = show;
    },

    setPopupState(state, { type, isShow, data }) {
      state.popupData = data;
      state.popupType = type;
      state.showPopup = isShow;
    },

    setPopupData(state, data) {
      state.popupData = data;
    },

    closePopups(state) {
      state.popupType = null;
      state.showPopup = false;
      state.popupData = null;
    },
  },
  getters: {
    getMobileMenu: (state) => state.mobileMenu,
    getPopupState: (state) => state.showPopup,
    getPopupType: (state) => state.popupType,
    getPopupData: (state) => state.popupData,
  },
};
