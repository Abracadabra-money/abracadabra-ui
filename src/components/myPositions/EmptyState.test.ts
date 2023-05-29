import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import EmptyState from "@/components/myPositions/EmptyState.vue";

describe("EmptyState.vue", () => {
  it("renders", () => {
    const wrapper = mount(EmptyState, {});
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toBe("No open positions");
  });
});
