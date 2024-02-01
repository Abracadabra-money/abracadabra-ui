import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Docs from "@/components/ui/icons/Docs.vue";

describe("Docs", () => {
  it("renders the correct href", () => {
    const wrapper = shallowMount(Docs);
    const link = wrapper.find("a");
    expect(link.attributes("href")).toBe(
      "https://abracadabramoney.gitbook.io/abracadabra-money-wiki/"
    );
  });

  it("renders the correct fill color on hover", () => {
    const wrapper = shallowMount(Docs);
    const svg = wrapper.find("svg");
    svg.trigger("mouseover");
    expect(svg.find("path").attributes("fill")).toBe("white");
  });
});
