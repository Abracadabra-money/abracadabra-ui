import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import BaseTokenIcon from "./BaseTokenIcon.vue";
import { useImage } from "@/helpers/useImage";

describe("BaseTokenIcon", () => {
  it("renders the token icon with the correct props", () => {
    const wrapper = shallowMount(BaseTokenIcon, {
      propsData: {
        icon: "custom_icon.png",
        name: "Custom Token",
        type: "token",
        size: "64px",
      },
    });

    const imgElement = wrapper.find("img");
    expect(imgElement.exists()).toBe(true);
    expect(imgElement.attributes("src")).toBe("custom_icon.png");
    expect(imgElement.attributes("alt")).toBe("Custom Token");
    expect(imgElement.attributes("style")).toBe("height: 64px; width: 64px;");
  });

  it('renders the select icon when type is "select"', () => {
    const wrapper = shallowMount(BaseTokenIcon, {
      propsData: {
        type: "select",
      },
    });

    const imgElement = wrapper.find("img");
    expect(imgElement.exists()).toBe(true);
    expect(imgElement.attributes("src")).toBe(
      useImage("assets/images/base_select_icon.png")
    );
    expect(imgElement.attributes("alt")).toBe("Token");
    expect(imgElement.attributes("style")).toBe("height: 32px; width: 32px;");
  });

  it("renders the default token icon when no icon prop is provided", () => {
    const wrapper = shallowMount(BaseTokenIcon);

    const imgElement = wrapper.find("img");
    expect(imgElement.exists()).toBe(true);
    expect(imgElement.attributes("src")).toBe(
      useImage("assets/images/base_token_icon.png")
    );
    expect(imgElement.attributes("alt")).toBe("Token");
    expect(imgElement.attributes("style")).toBe("height: 32px; width: 32px;");
  });
});
