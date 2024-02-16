import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import BaseLink from "@/components/ui/links/BaseLink.vue";

describe("BaseLink", () => {
  it("renders the correct href", () => {
    const href = "https://example.com";
    const wrapper = shallowMount(BaseLink, {
      props: { href },
    });

    expect(wrapper.attributes("href")).toBe(href);
  });

  it("renders the correct target", () => {
    const target = "_blank";
    const wrapper = shallowMount(BaseLink, {
      props: { target, href: "https://example.com" },
    });

    expect(wrapper.attributes("target")).toBe(target);
  });

  it("renders the correct text", () => {
    const text = "Test Link";
    const wrapper = shallowMount(BaseLink, {
      props: { text, href: "https://example.com" },
    });

    expect(wrapper.text()).toBe(text);
  });

  it("renders the correct icon", () => {
    const icon = "assets/images/test-icon.png";
    const wrapper = shallowMount(BaseLink, {
      props: { icon, href: "https://example.com" },
    });

    expect(wrapper.find(".degenbox-icon").attributes("src")).toBe(icon);
  });

  it("renders the ArrowTopRight component", () => {
    const wrapper = shallowMount(BaseLink, {
      props: { href: "https://example.com" },
    });

    expect(wrapper.findComponent({ name: "ArrowTopRight" }).exists()).toBe(
      true
    );
  });

  it("has the correct CSS classes", () => {
    const wrapper = shallowMount(BaseLink, {
      props: { href: "https://example.com" },
    });

    expect(wrapper.classes()).toContain("base-link");
    expect(wrapper.find(".inner-wrap").classes()).toContain("inner-wrap");
    expect(wrapper.find(".degenbox-icon").classes()).toContain("degenbox-icon");
  });
});
