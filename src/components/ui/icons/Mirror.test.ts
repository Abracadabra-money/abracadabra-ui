import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Mirror from "@/components/ui/icons/Mirror.vue";

describe("Mirror", () => {
  it("renders the correct width and height", () => {
    const width = 20;
    const height = 20;
    const wrapper = shallowMount(Mirror, {
      propsData: {
        width,
        height,
      },
    });

    const svg = wrapper.find("svg");
    expect(svg.attributes("style")).toContain(`width: ${width}px`);
    expect(svg.attributes("style")).toContain(`height: ${height}px`);
  });

  it("changes fill color on hover", () => {
    const wrapper = shallowMount(Mirror);

    const svg = wrapper.find("svg");
    const path = svg.find("path");

    svg.trigger("mouseover");
    expect(path.attributes("fill")).toBe("white");

    svg.trigger("mouseout");
    expect(path.attributes("fill")).toBe("white");
  });
});
