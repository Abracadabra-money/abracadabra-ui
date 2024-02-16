import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import BaseSearchEmpty from "@/components/base/BaseSearchEmpty.vue";

describe("BaseSearchEmpty", () => {
  it("renders the correct text", () => {
    const text = "No results found";
    const wrapper = shallowMount(BaseSearchEmpty, {
      propsData: {
        text,
      },
    });

    expect(wrapper.find(".text").text()).toBe(text);
  });

  it("renders the correct image", () => {
    const imageSrc = "/src/assets/images/not-found.png";
    const wrapper = shallowMount(BaseSearchEmpty, {
      propsData: {
        text: "No results found",
      },
    });

    expect(wrapper.find(".icon").attributes("src")).toBe(imageSrc);
  });
});
