import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import GitHubIcon from "@/components/ui/icons/GitHub.vue";

describe("GitHubIcon", () => {
  it("renders the correct width and height", () => {
    const width = 30;
    const height = 30;
    const wrapper = shallowMount(GitHubIcon, {
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

  it("changes fill color on hover", async () => {
    const wrapper = shallowMount(GitHubIcon);

    expect(wrapper.find("path").attributes("fill")).toBe("white");

    await wrapper.find("svg").trigger("mouseover");

    expect(wrapper.find("path").attributes("fill")).toBe("white");

    await wrapper.find("svg").trigger("mouseout");

    expect(wrapper.find("path").attributes("fill")).toBe("white");
  });
});
