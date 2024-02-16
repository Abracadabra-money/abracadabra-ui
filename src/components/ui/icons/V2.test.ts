import { describe, it, expect } from "vitest";
import V2 from "@/components/ui/icons/V2.vue";
import { shallowMount } from "@vue/test-utils";

describe("MyComponent", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(V2);
    expect(wrapper.exists()).toBe(true);
  });

  it("sets the correct default props", () => {
    const wrapper = shallowMount(V2);
    expect((wrapper.props() as { width: number }).width).toBe(20);
    expect((wrapper.props() as { height: number }).height).toBe(18);
  });

  it("updates the width prop correctly", async () => {
    const wrapper = shallowMount(V2);
    await wrapper.setProps({ width: 30 });
    expect((wrapper.props() as { width: number }).width).toBe(30);
  });

  it("updates the height prop correctly", async () => {
    const wrapper = shallowMount(V2, { props: { height: 18 } });
    await wrapper.setProps({ height: 25 });
    expect((wrapper.props() as { height: number }).height).toBe(25);
  });

  it("changes fill color on hover", async () => {
    const wrapper = shallowMount(V2);
    const svg = wrapper.find("svg");
    svg.trigger("mouseover");
    expect(svg.find("path").attributes().fill).toBe("white");
    svg.trigger("mouseout");
    expect(svg.find("path").attributes().fill).toBe("white");
  });
});
