import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import InfoButton from "@/components/ui/buttons/InfoButton.vue";

describe("InfoButton", () => {
  it("renders the title and value correctly", () => {
    const title = "Button Title";
    const value = "Button Value";

    const wrapper = shallowMount(InfoButton, {
      props: {
        title,
        value,
      },
    });

    expect(wrapper.find(".button-title").text()).toBe(title);
    expect(wrapper.find(".button-value").text()).toBe(value);
  });
});
