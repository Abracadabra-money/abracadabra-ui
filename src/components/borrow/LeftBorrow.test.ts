import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import LeftBorrow from "@/components/borrow/LeftBorrow.vue";

describe("LeftBorrow.vue", async () => {
  const tooltip = vi.fn();

  const store = new Vuex.Store({
    modules: {
      connectProvider: {
        state: { chainId: 1 },
        getters: {
          getChainId: (state) => state.chainId,
        },
      },
    },
  });

  const wrapper: any = mount(LeftBorrow, {
    global: { plugins: [store], directives: { tooltip } },
  });

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
