import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Tabs from "@/components/ui/Tabs.vue";

describe("Tabs", () => {
  it("renders the component correctly", () => {
    const wrapper = mount(Tabs, {
      props: {
        name: "Tab 1",
        items: ["Tab 1", "Tab 2", "Tab 3"],
        icons: ["icon1.png", "icon2.png", "icon3.png"],
        width: "220px",
        small: false,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".switch").exists()).toBe(true);
    expect(wrapper.findAll(".switch-btn").length).toBe(3);
    expect(wrapper.find(".switch-btn-active").exists()).toBe(true);
    expect(wrapper.findAll(".icon").length).toBe(3);
  });

  it('emits the "select" event when a button is clicked', async () => {
    const wrapper = mount(Tabs, {
      props: {
        name: "Tab 1",
        items: ["Tab 1", "Tab 2", "Tab 3"],
        icons: ["icon1.png", "icon2.png", "icon3.png"],
        width: "220px",
        small: false,
      },
    });

    const buttons = wrapper.findAll(".switch-btn");
    await buttons[1].trigger("click");

    expect(wrapper.emitted("select")).toBeTruthy();
    expect(wrapper.emitted("select")?.[0]?.[0]).toBe("Tab 2");
  });
});
