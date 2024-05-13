import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import NetworkChip from "@/components/ui/NetworkChip.vue";

describe("NetworkChip", () => {
  it("renders the component correctly", () => {
    const wrapper = shallowMount(NetworkChip);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders the name prop correctly", () => {
    const name = "Test Network";
    const wrapper = shallowMount(NetworkChip, {
      propsData: {
        name,
      },
    });
    expect(wrapper.find("span").text()).toBe(name);
  });

  it("renders the icon prop correctly", () => {
    const icon = "path/to/icon.png";
    const wrapper = shallowMount(NetworkChip, {
      propsData: {
        icon,
      },
    });
    expect(wrapper.find("img").attributes("src")).toBe(icon);
  });

  it("renders the selected class when selected prop is true", () => {
    const wrapper = shallowMount(NetworkChip, {
      propsData: {
        selected: true,
      },
    });
    expect(wrapper.classes()).toContain("selected");
  });

  it("renders the disabled class when disabled prop is true", () => {
    const wrapper = shallowMount(NetworkChip, {
      propsData: {
        disabled: true,
      },
    });

    expect(wrapper.attributes().disabled).toBe("");
  });
});
