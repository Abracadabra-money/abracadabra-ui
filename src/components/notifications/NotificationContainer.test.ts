import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import NotificationItem from "@/components/notifications/Notification.vue";
import NotificationContainer from "@/components/notifications/NotificationContainer.vue";

describe("NotificationContainer", () => {
  it("renders NotificationItem components for each notification", () => {
    const notifications = [
      { id: 1, message: "Notification 1" },
      { id: 2, message: "Notification 2" },
      { id: 3, message: "Notification 3" },
    ];

    const wrapper = shallowMount(NotificationContainer, {
      computed: {
        notifications: () => notifications,
      },
    });

    const notificationItems = wrapper.findAllComponents(NotificationItem);
    expect(notificationItems.length).toBe(notifications.length);
  });

  it("renders the correct message for each notification", () => {
    const notifications = [
      { id: 1, message: "Notification 1" },
      { id: 2, message: "Notification 2" },
      { id: 3, message: "Notification 3" },
    ];

    const wrapper = shallowMount(NotificationContainer, {
      computed: {
        notifications: () => notifications,
      },
    });

    const notificationItems = wrapper.findAllComponents(NotificationItem);
    notificationItems.forEach((item, index) => {
      expect(item.props().notification.message).toBe(
        notifications[index].message
      );
    });
  });
});
