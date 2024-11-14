import gsap from "gsap";
import { NORMAL_DURATION } from "@/helpers/useAnimation/constants";

export const scaleOut = (element: Element, done: () => void) => {
  gsap.to(element, {
    duration: NORMAL_DURATION,
    scale: 0,
    ease: "power1.in",
    onComplete: done,
  });
};
