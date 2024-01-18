import { useImage } from "@/helpers/useImage";
import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import Notification from "@/components/notifications/Notification.vue";

describe("Notification", () => {
  it("renders the notification with the correct title", () => {
    const notification = {
      type: "success",
      title: "Success",
      description: "This is a success notification",
      msg: "Some message",
    };

    const wrapper = shallowMount(Notification, {
      props: {
        notification,
      },
    });

    expect(wrapper.find(".title").text()).toBe("Success");
  });

  it("returns the correct image URL based on the notification type", () => {
    const notification = {
      type: "warning",
      title: "Warning",
      description: "This is a warning notification",
      msg: "Some message",
    };

    const wrapper = shallowMount(Notification, {
      props: {
        notification,
      },
    });

    const imgUrl = wrapper.vm.getImgUrl(notification.type);
    expect(imgUrl).toBe(
      useImage("assets/images/notification-icons/warning-icon.png")
    );
  });

  it("deletes the notification when closeNotification method is called", () => {
    const notification = {
      id: 1,
      type: "info",
      title: "Info",
      description: "This is an info notification",
      msg: "Some message",
    };

    const deleteNotificationMock = vi.fn();
    const wrapper = shallowMount(Notification, {
      props: {
        notification,
      },
      global: {
        mocks: {
          $store: {
            commit: deleteNotificationMock,
          },
        },
      },
    });

    wrapper.vm.closeNotification();
    expect(deleteNotificationMock).toHaveBeenCalledWith(
      "notifications/delete",
      notification.id
    );
  });

  it("increments the timeValue every second for pending notifications", () => {
    vi.useFakeTimers();

    const notification = {
      type: "pending",
      title: "Pending",
      description: "This is a pending notification",
      msg: "Some message",
    };

    const wrapper = shallowMount(Notification, {
      props: {
        notification,
      },
    });

    expect(wrapper.vm.timeValue).toBe(0);

    vi.advanceTimersByTime(1000);
    expect(wrapper.vm.timeValue).toBe(1);

    vi.advanceTimersByTime(2000);
    expect(wrapper.vm.timeValue).toBe(3);

    vi.useRealTimers();
  });

  it("closes the notification after 15 seconds for non-pending notifications", () => {
    vi.useFakeTimers();

    const notification = {
      id: 1,
      type: "info",
      title: "Info",
      description: "This is an info notification",
      msg: "Some message",
    };

    const deleteNotificationMock = vi.fn();
    shallowMount(Notification, {
      props: {
        notification,
      },
      global: {
        mocks: {
          $store: {
            commit: deleteNotificationMock,
          },
        },
      },
    });

    expect(deleteNotificationMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(15000);
    expect(deleteNotificationMock).toHaveBeenCalledWith(
      "notifications/delete",
      notification.id
    );

    vi.useRealTimers();
  });
});
