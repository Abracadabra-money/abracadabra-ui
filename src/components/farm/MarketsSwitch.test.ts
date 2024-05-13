import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import MarketsSwitch from "@/components/farm/MarketsSwitch.vue";

describe("MarketsSwitch", () => {
  it("renders switch buttons correctly when not deprecated", () => {
    const items = ["Item 1", "Item 2", "Item 3"];
    const wrapper = shallowMount(MarketsSwitch, {
      props: {
        name: "Item 1",
        items,
        isDeprecated: false,
      },

      computed: {
        currentName() {
          return "Item 2";
        },
      },
    });

    const buttons = wrapper.findAll(".switch-btn");
    expect(buttons.length).toBe(items.length);

    buttons.forEach((button, index) => {
      expect(button.text()).toBe(items[index]);
      expect(button.classes()).toContain("switch-btn");
      expect(button.attributes()["disabled"]).toBeFalsy();
    });
  });

  it("renders deprecated section correctly when deprecated", () => {
    const wrapper = shallowMount(MarketsSwitch, {
      props: {
        name: "Item 1",
        items: [],
        isDeprecated: true,
      },
    });

    const deprecatedSection = wrapper.find(".depreciated");
    expect(deprecatedSection.exists()).toBe(true);

    const icon = deprecatedSection.find(".depreciated-icon");
    expect(icon.exists()).toBe(true);
    expect(icon.attributes("src")).toBe(
      "/src/assets/images/info-bar/depreciated.png"
    );

    const title = deprecatedSection.find(".title");
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe("Depreciated");

    const description = deprecatedSection.find(".description");
    expect(description.exists()).toBe(true);
    expect(description.text()).toBe("Only unstake available");
  });
});
