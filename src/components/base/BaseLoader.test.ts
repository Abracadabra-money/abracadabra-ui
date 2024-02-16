import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import BaseLoader from "@/components/base/BaseLoader.vue";

describe("BaseLoader", () => {
  it('renders loader when type is "loader"', () => {
    const wrapper = shallowMount(BaseLoader, {
      propsData: {
        type: "loader",
      },
    });

    expect(wrapper.find(".loader-wrap-mini").exists()).toBe(true);
    expect(wrapper.find(".spinner").exists()).toBe(false);
  });

  it('renders spinner when type is not "loader"', () => {
    const wrapper = shallowMount(BaseLoader, {
      propsData: {
        type: "spinner",
      },
    });

    expect(wrapper.find(".loader-wrap-mini").exists()).toBe(false);
    expect(wrapper.find(".spinner").exists()).toBe(true);
  });

  it("renders text when text prop is provided", () => {
    const text = "Loading...";
    const wrapper = shallowMount(BaseLoader, {
      propsData: {
        text,
      },
    });

    expect(wrapper.find(".spinner-text").text()).toBe(text);
  });

  it("sets the correct default props", () => {
    const wrapper = shallowMount(BaseLoader);

    expect(wrapper.props().type).toBe("spinner");
    expect(wrapper.props().color).toBe(
      "linear-gradient(107.5deg, #5282fd -3.19%, #76c3f5 101.2%)"
    );
    expect(wrapper.props().text).toBeUndefined();
    expect(wrapper.props().small).toBe(false);
    expect(wrapper.props().medium).toBe(false);
    expect(wrapper.props().large).toBe(false);
  });
});
