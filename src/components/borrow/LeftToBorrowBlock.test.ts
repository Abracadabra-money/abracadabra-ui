import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import LeftToBorrowBlock from "@/components/borrow/LeftToBorrowBlock.vue";
import { utils } from "ethers";

describe("LeftBorrow.vue", async () => {
  const wrapper: any = mount(LeftToBorrowBlock);

  it("Should render in default situation", () => {
    const leftToBorrowBlock = wrapper.find(".left-borrow");
    expect(leftToBorrowBlock.exists()).toBe(true);
    expect(wrapper.text()).toBe("MIMS LEFT TO BORROW:0");
  });

  it("Should render and calculate computed properties correct, when borrowLeft passed", async () => {
    await wrapper.setProps({ borrowLeft: utils.parseUnits("10") });
    expect(wrapper.text()).toBe("MIMS LEFT TO BORROW:10");
  });
});
