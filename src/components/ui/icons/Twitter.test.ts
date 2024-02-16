import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import TwitterIcon from "@/components/ui/icons/Twitter.vue";

describe("TwitterIcon", () => {
  it("renders the correct width and height", () => {
    const width = 20;
    const height = 20;
    const wrapper = shallowMount(TwitterIcon, {
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

  it("has the correct link and target attributes", () => {
    const link = "https://twitter.com/MIM_Spell";
    const target = "_blank";
    const wrapper = shallowMount(TwitterIcon);

    const a = wrapper.find("a");
    expect(a.attributes("href")).toBe(link);
    expect(a.attributes("target")).toBe(target);
    expect(a.attributes("rel")).toBe("noreferrer noopener");
  });

  it("changes fill color on hover", async () => {
    const wrapper = shallowMount(TwitterIcon);
    const svg = wrapper.find("svg");
    const path = svg.find("path");

    expect(path.attributes("fill")).toBe("white");

    await svg.trigger("mouseover");

    expect(path.attributes("fill")).toBe("white");

    await svg.trigger("mouseout");

    expect(path.attributes("fill")).toBe("white");
  });
});
