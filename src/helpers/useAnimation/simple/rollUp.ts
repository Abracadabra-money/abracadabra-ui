import gsap from "gsap";
import { NORMAL_DURATION } from "@/helpers/useAnimation/constants";

export const rollUp = (element: Element, done: () => void) => {
  gsap.to(element, {
    duration: NORMAL_DURATION,
    y: -20,
    height: 0,
    ease: "power2.in",
    onComplete: done,
  });
};
