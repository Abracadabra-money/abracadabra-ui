import { mount } from "@vue/test-utils";
import StatusName from "@/components/ui/StatusName.vue";
import { describe, expect, it } from "vitest";

describe("StatusName.vue renders with correct depends on props", () => {
  it("isSafe", () => {
    const wrapper = mount(StatusName, {
      props: { isSafe: true, isMedium: false, isHigh: false, bordered: false },
    });

    const backgroundColor = wrapper.vm.backgroundColor;
    const statusName = wrapper.vm.statusName;
    expect(statusName).toEqual("Safe");
    expect(backgroundColor).toEqual("#63CAF8");
  });

  it("isMedium", () => {
    const wrapper = mount(StatusName, {
      props: { isSafe: false, isMedium: true, isHigh: false, bordered: false },
    });
    const backgroundColor = wrapper.vm.backgroundColor;
    const statusName = wrapper.vm.statusName;
    expect(statusName).toEqual("Medium");
    expect(backgroundColor).toEqual("#FFB800");
  });

  it("isHigh", () => {
    const wrapper = mount(StatusName, {
      props: { isSafe: false, isMedium: false, isHigh: true, bordered: false },
    });
    const backgroundColor = wrapper.vm.backgroundColor;
    const statusName = wrapper.vm.statusName;
    expect(statusName).toEqual("High");
    expect(backgroundColor).toEqual("#FE1842");
  });

  it("none", () => {
    const wrapper = mount(StatusName, {
      props: { isSafe: false, isMedium: false, isHigh: false, bordered: false },
    });
    const backgroundColor = wrapper.vm.backgroundColor;
    const statusName = wrapper.vm.statusName;
    expect(statusName).toBeNull();
    expect(backgroundColor).toEqual("rgba(255, 255, 255, 0.3)");
  });

  it("bordered", () => {
    const wrapper = mount(StatusName, {
      props: { isSafe: false, isMedium: false, isHigh: false, bordered: true },
    });
    const backgroundColor = wrapper.vm.backgroundColor;
    expect(backgroundColor).toEqual("transparent");
  });
});
