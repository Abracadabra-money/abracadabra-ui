import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import InputNumber from "@/components/ui/inputs/InputNumber.vue";

describe("InputNumber", () => {
  it("renders the input element with the correct props", () => {
    const placeholder = "1000";
    const isDisabled = true;
    const max = 0;
    const wrapper = shallowMount(InputNumber, {
      propsData: { placeholder, isDisabled, max },
    });

    const inputElement = wrapper.find("input.input-number");
    expect(inputElement.exists()).toBe(true);
    expect(inputElement.classes()).toContain("disabled");
    expect(inputElement.attributes("type")).toBe("number");
    expect(inputElement.attributes("placeholder")).toBe(placeholder);
  });

  it("updates the inputValue and emits changeInputNumber event on input", () => {
    const wrapper = shallowMount(InputNumber);
    const inputElement = wrapper.find("input.input-number");
    const inputValue = "123";

    inputElement.setValue(inputValue);
    inputElement.trigger("input");

    expect(wrapper.vm.inputValue).toBe(inputValue);
    expect(wrapper.emitted("changeInputNumber")).toBeTruthy();
    expect(wrapper.emitted("changeInputNumber")?.[0]?.[0]).toBe(inputValue);
  });

  it("sets the inputValue to max and emits changeInputNumber event on button click", () => {
    const max = 100;
    const wrapper = shallowMount(InputNumber, {
      propsData: { max },
    });
    const buttonElement = wrapper.find("button.btn-max");

    buttonElement.trigger("click");

    expect(wrapper.vm.inputValue).toBe(max);
    expect(wrapper.emitted("changeInputNumber")).toBeTruthy();
    expect(wrapper.emitted("changeInputNumber")?.[0]?.[0]).toBe(max);
  });

  it("computes errorAmount correctly", () => {
    const max = 100;
    const wrapper = shallowMount(InputNumber, {
      propsData: { max, isValidation: true },
    });

    wrapper.vm.inputValue = "200";

    expect(wrapper.vm.errorAmount).toBe(true);

    wrapper.vm.inputValue = "50";

    expect(wrapper.vm.errorAmount).toBe(false);
  });
});
