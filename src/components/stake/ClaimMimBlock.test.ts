import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ClaimMimBlock from "@/components/stake/ClaimMimBlock.vue";

describe("ClaimMimBlock.vue", async () => {
  it("Should render claim amount and active button claim", async () => {
    const props = {
      claimAmount: "0.307276485593160177",
      isDisableClaimButton: false,
    };

    const wrapper = mount(ClaimMimBlock, { props });

    expect(wrapper.find(".claim-value").text()).toBe("0.307276485593160177");
    expect(wrapper.find(".default-button").classes().includes("disabled")).toBe(
      false
    );
  });

  it("Should render claim zero amount and disabled button claim", async () => {
    const props = {
      claimAmount: "0",
      isDisableClaimButton: true,
    };

    const wrapper = mount(ClaimMimBlock, { props });

    expect(wrapper.find(".claim-value").text()).toBe("0");
    expect(wrapper.find(".default-button").classes().includes("disabled")).toBe(
      true
    );
  });
});
