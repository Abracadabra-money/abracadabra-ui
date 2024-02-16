import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import CheckBox from "@/components/ui/checkboxes/CheckBox.vue";

describe("CheckBox", () => {
  it("renders correctly when value is true", () => {
    const wrapper = shallowMount(CheckBox, {
      propsData: {
        value: true,
      },
    });

    expect(wrapper.classes()).toContain("active");
  });

  it("renders correctly when value is false", () => {
    const wrapper = shallowMount(CheckBox, {
      propsData: {
        value: false,
      },
    });

    expect(wrapper.classes()).not.toContain("active");
  });

  it("renders correctly when disabled is true", () => {
    const wrapper = shallowMount(CheckBox, {
      propsData: {
        disabled: true,
      },
    });

    expect(wrapper.classes()).toContain("disabled");
  });

  it("renders correctly when disabled is false", () => {
    const wrapper = shallowMount(CheckBox, {
      propsData: {
        disabled: false,
      },
    });

    expect(wrapper.classes()).not.toContain("disabled");
  });

  it('emits "update" event when clicked and not disabled', () => {
    const wrapper = shallowMount(CheckBox, {
      propsData: {
        disabled: false,
      },
    });

    wrapper.trigger("click");

    expect(wrapper.emitted("update")).toBeTruthy();
  });

  it('does not emit "update" event when clicked and disabled', () => {
    const wrapper = shallowMount(CheckBox, {
      propsData: {
        disabled: true,
      },
    });

    wrapper.trigger("click");

    expect(wrapper.emitted("update")).toBeFalsy();
  });
});
