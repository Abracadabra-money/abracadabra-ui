import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import OrderButton from "@/components/myPositions/OrderButton.vue";

describe("OrderButton", () => {
  it("renders the correct tooltip", () => {
    const cauldronObject = {
      config: {
        chainId: "chainId",
        id: "cauldronId",
      },
    };
    const wrapper = shallowMount(OrderButton, {
      propsData: {
        cauldronObject,
      },
    });

    const tooltip = wrapper.findComponent({ name: "Tooltip" });
    expect(tooltip.exists()).toBe(true);
    expect(tooltip.props().tooltip).toBe("order");
    expect(tooltip.props().fill).toBe("#7088CC");
  });

  it("renders the correct link text", () => {
    const cauldronObject = {
      config: {
        chainId: "chainId",
        id: "cauldronId",
      },
    };
    const wrapper = shallowMount(OrderButton, {
      propsData: {
        cauldronObject,
      },
    });
    const linkText = wrapper.find(".link-text");
    expect(linkText.text()).toBe("Order");
  });

  it("renders the correct arrow image", () => {
    const cauldronObject = {
      config: {
        chainId: "chainId",
        id: "cauldronId",
      },
    };
    const wrapper = shallowMount(OrderButton, {
      propsData: {
        cauldronObject,
      },
    });

    const arrowImage = wrapper.find(".arrow");
    expect(arrowImage.attributes().src).toBe(
      "/src/assets/images/beam/arrow-link.png"
    );
  });
});
