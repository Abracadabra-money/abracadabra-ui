import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import InputSearch from "@/components/ui/inputs/InputSearch.vue";

describe("InputSearch", () => {
  it("emits changeSearch event with input value", () => {
    const wrapper = shallowMount(InputSearch);
    const input = wrapper.find(".search-input");

    input.setValue("test");
    input.trigger("input");

    expect(wrapper.emitted("changeSearch")).toBeTruthy();
    expect(wrapper.emitted("changeSearch")?.[0]?.[0]).toBe("test");
  });
});
