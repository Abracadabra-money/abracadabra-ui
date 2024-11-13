import gsap from "gsap";
import { NORMAL_DURATION } from "@/helpers/useAnimation/constants";

export const fadeOutRight = (element: Element, done: () => void) => {
  gsap.to(element, {
    duration: NORMAL_DURATION,
    opacity: 0,
    x: "100%",
    ease: "power1.in",
    onComplete: done,
  });
};
