import { cook } from "@/helpers/cauldron/cauldron";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import store from "@/store";

const sendCook = async (cauldron, cookData, value, notificationId) => {
  try {
    await cook(cauldron, cookData, value);

    store.commit("notifications/delete", notificationId);
    store.commit("setPopupState", {
      type: "success",
      isShow: true,
    });
  } catch (e) {
    console.log("cook Error:", e);

    const errorNotification = {
      msg: notificationErrorMsg(e),
      type: "error",
    };

    store.commit("notifications/delete", notificationId);
    store.dispatch("notifications/new", errorNotification);
  }
};

export default sendCook;