import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import LockedTimer from "./LockedTimer.vue";

describe("LockedTimer", () => {
  it("displays the correct countdown", async () => {
    const finalTime = "1634567890";

    const wrapper = mount(LockedTimer, {
      props: {
        finalTime,
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Unlock in");
  });
});
