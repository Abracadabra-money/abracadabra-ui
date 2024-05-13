import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import DiscordIcon from "@/components/ui/icons/Discord.vue";

describe("DiscordIcon", () => {
  it("renders the correct width and height", () => {
    const width = 20;
    const height = 20;
    const wrapper = shallowMount(DiscordIcon, {
      propsData: {
        width,
        height,
      },
    });

    expect(wrapper.find("svg").attributes("style")).toContain(
      `width: ${width}px`
    );
    expect(wrapper.find("svg").attributes("style")).toContain(
      `height: ${height}px`
    );
  });

  it("changes fill color on hover", () => {
    const wrapper = shallowMount(DiscordIcon);

    wrapper.find("svg").trigger("mouseover");

    expect(wrapper.find("path").attributes("fill")).toBe("white");
  });
});
