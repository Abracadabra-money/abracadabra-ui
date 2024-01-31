import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import GetTokenLink from "@/components/ui/links/GetTokenLink.vue";

describe("GetTokenLink", () => {
  it("renders the link with the correct props", () => {
    const href = "https://example.com";
    const text = "Get Token";
    const icon = "https://example.com/icon.png";

    const wrapper = shallowMount(GetTokenLink, {
      props: { href, text, icon },
    });

    expect(wrapper.find("a").attributes("href")).toBe(href);
    expect(wrapper.find("a").attributes("target")).toBe("_blank");
    expect(wrapper.find("a").attributes("rel")).toBe("noreferrer noopener");
    expect(wrapper.find(".icon").exists()).toBe(true);
    expect(wrapper.find(".icon").attributes("src")).toBe(icon);
    expect(wrapper.find(".icon").attributes("alt")).toBe("Degenbox icon");
    expect(wrapper.text()).toContain(text);
  });
});
