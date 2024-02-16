import { describe, it, expect, vi } from "vitest";
import { shallowMount, mount } from "@vue/test-utils";
import ScrollToTop from "@/components/ui/ScrollToTop.vue";

describe("ScrollToTop", () => {
  it("should render the scroll top button when scrollPosition is not 0", () => {
    const wrapper = shallowMount(ScrollToTop, {
      data() {
        return {
          scrollPosition: 100,
        };
      },
    });

    expect(wrapper.find(".scroll-top").exists()).toBe(true);
  });

  it("should not render the scroll top button when scrollPosition is 0", () => {
    const wrapper = shallowMount(ScrollToTop, {
      data() {
        return {
          scrollPosition: 0,
        };
      },
    });

    expect(wrapper.find(".scroll-top").exists()).toBe(false);
  });

  it("should scroll to top when clicked", () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    const wrapper = mount(ScrollToTop, {
      data() {
        return {
          scrollPosition: 100,
        };
      },
    });

    wrapper.find(".scroll-top").trigger("click");

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("should update scrollPosition when scrolled", () => {
    const wrapper = mount(ScrollToTop);

    expect(wrapper.vm.scrollPosition).toBe(0);

    window.scrollY = 100;
    wrapper.vm.onScroll();

    expect(wrapper.vm.scrollPosition).toBe(100);
  });

  it("should add scroll event listener on created", () => {
    window.addEventListener = vi.fn();

    mount(ScrollToTop);

    expect(window.addEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });

  it("should remove scroll event listener on beforeUnmount", () => {
    window.removeEventListener = vi.fn();

    const wrapper = mount(ScrollToTop);
    wrapper.unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });
});
