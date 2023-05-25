import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";

import HealthProgress from "@/components/myPositions/HealthProgress.vue";

describe("HealthProgress.vue", () => {
  it("has .safe class with no props passed", () => {
    const wrapper = mount(HealthProgress);
    console.log(wrapper);
    const infoDiv = wrapper.find(".progress");
    expect(infoDiv.exists()).toBe(true);
    expect(infoDiv.classes()).toContain("safe");
  });

  it("has .safe class with such positionRisk prop", () => {
    const wrapper = mount(HealthProgress, {
      props: {
        positionRisk: "safe",
      },
    });
    console.log(wrapper);
    const infoDiv = wrapper.find(".progress");
    expect(infoDiv.classes()).toContain("safe");
  });

  it("has .medium class with such positionRisk prop", () => {
    const wrapper = mount(HealthProgress, {
      props: {
        positionRisk: "medium",
      },
    });
    console.log(wrapper);
    const infoDiv = wrapper.find(".progress");
    expect(infoDiv.classes()).toContain("medium");
  });

  it("has .high class with such positionRisk prop", () => {
    const wrapper = mount(HealthProgress, {
      props: {
        positionRisk: "high",
      },
    });
    console.log(wrapper);
    const infoDiv = wrapper.find(".progress");
    expect(infoDiv.classes()).toContain("high");
  });
});
