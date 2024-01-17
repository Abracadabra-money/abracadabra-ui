import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import SpellSpecialInfoBlock from "@/components/stake/spell/SpellSpecialInfoBlock.vue";

describe("SpellSpecialInfoBlock", () => {
  it("renders special info correctly", () => {
    const specialInfo = [
      { text: "Info 1", link: "https://example.com/info1" },
      { text: "Info 2", link: "https://example.com/info2" },
    ];

    const wrapper = shallowMount(SpellSpecialInfoBlock, {
      propsData: { specialInfo },
    });

    const infoElements = wrapper.findAll(".text");
    expect(infoElements.length).toBe(specialInfo.length);

    specialInfo.forEach((info, idx) => {
      const element = infoElements.at(idx);
      if (element) {
        expect(element.text()).toBe(`${info.text} here!`);
      }
    });

    const linkElements = wrapper.findAll(".info-link");
    expect(linkElements.length).toBe(
      specialInfo.filter((info) => info.link).length
    );
  });
});
