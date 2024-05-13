import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import GetLpLink from "@/components/ui/links/GetLpLink.vue";

describe("GetLpLink", () => {
  it("renders the link with the correct href and target", () => {
    const link = "https://example.com";
    const wrapper = shallowMount(GetLpLink, {
      propsData: { link },
    });

    expect(wrapper.find("a").attributes("href")).toBe(link);
    expect(wrapper.find("a").attributes("target")).toBe("_blank");
  });

  it("renders the icon based on the link", () => {
    const link = "https://example.com/sushi";
    const wrapper = shallowMount(GetLpLink, {
      propsData: { link },
    });

    expect(wrapper.find("img").attributes("src")).toBe(
      "file:///src/assets/images/get-lp-icons/sushi.png"
    );
  });

  it("applies the correct CSS classes", () => {
    const link = "https://example.com";
    const wrapper = shallowMount(GetLpLink, {
      propsData: { link },
    });

    expect(wrapper.find("a").classes()).toContain("farm-link");
  });
});
