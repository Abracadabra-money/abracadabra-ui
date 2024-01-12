import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import ApeSpecialInfoBlock from "./ApeSpecialInfoBlock.vue";

describe("ApeSpecialInfoBlock", () => {
  it("renders the component correctly", () => {
    const wrapper = shallowMount(ApeSpecialInfoBlock);
    expect(wrapper.exists()).toBe(true);
  });

  it("displays the correct title", () => {
    const wrapper = shallowMount(ApeSpecialInfoBlock);
    const title = wrapper.find(".title");
    expect(title.text()).toBe("Magic  Ape");
  });
});
