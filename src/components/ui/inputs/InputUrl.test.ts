import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import InputUrl from "@/components/ui/inputs/InputUrl.vue";

describe("InputUrl", () => {
  it("renders the component correctly", () => {
    const wrapper = shallowMount(InputUrl);
    expect(wrapper.exists()).toBe(true);
  });

  it("sets the initial value of url correctly", () => {
    const targetUrl = "https://example.com";
    const wrapper = shallowMount(InputUrl, {
      propsData: {
        targetUrl,
      },
    });
    expect(wrapper.vm.url).toBe(targetUrl);
  });

  it("updates the input value correctly", () => {
    const wrapper = shallowMount(InputUrl);
    const input = wrapper.find(".input-url");
    const newValue = "https://example.com";
    input.setValue(newValue);
    expect(wrapper.vm.url).toBe(newValue);
  });

  it('emits the "update-input" event correctly', () => {
    const wrapper = shallowMount(InputUrl);
    const input = wrapper.find(".input-url");
    const newValue = "https://example.com";
    input.setValue(newValue);
    expect(wrapper.emitted("update-input")).toBeTruthy();
    expect(wrapper.emitted("update-input")?.[0]?.[0]).toBe(newValue);
  });
});
