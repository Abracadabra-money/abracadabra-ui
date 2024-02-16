import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Lens from "@/components/ui/icons/Lens.vue";

describe("Lens", () => {
  it("renders the correct SVG width and height", () => {
    const wrapper = shallowMount(Lens, {
      propsData: {
        isMobile: false,
        width: 20,
        height: 20,
      },
    });

    expect(wrapper.find("svg").attributes("style")).toContain(`width: 20px`);
    expect(wrapper.find("svg").attributes("style")).toContain(`height: 20px`);
  });

  it('applies the "list-link" class when isMobile is false', () => {
    const wrapper = shallowMount(Lens, {
      propsData: {
        isMobile: false,
        width: 20,
        height: 20,
      },
    });

    const link = wrapper.find("a");
    expect(link.classes()).toContain("list-link");
  });

  it('does not apply the "list-link" class when isMobile is true', () => {
    const wrapper = shallowMount(Lens, {
      propsData: {
        isMobile: true,
        width: 20,
        height: 20,
      },
    });

    const link = wrapper.find("a");
    expect(link.classes()).not.toContain("list-link");
  });
});
