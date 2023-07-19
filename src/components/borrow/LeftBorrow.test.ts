import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import LeftBorrow from "@/components/borrow/LeftBorrow.vue";

describe("LeftBorrow.vue", async () => {
  const wrapper: any = mount(LeftBorrow);

  it("Should render in default situation", () => {
    const leftBorrow = wrapper.find(".left-borrow");
    expect(leftBorrow.exists()).toBe(true);
    expect(wrapper.text()).toBe("MIMS LEFT TO BORROW:0");
  });

  it("Should render and calculate computed properties correct, when borrowLeft passed", async () => {
    await wrapper.setProps({ borrowLeft: 10 });
    expect(wrapper.text()).toBe("MIMS LEFT TO BORROW:10");
  });
});
