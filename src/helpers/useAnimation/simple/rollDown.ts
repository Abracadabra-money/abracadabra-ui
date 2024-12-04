import gsap from "gsap";
import { NORMAL_DURATION } from "@/helpers/useAnimation/constants";

export const rollDown = (element: Element, done: () => void) => {
  gsap.fromTo(
    element,
    { y: -20, height: 0 },
    {
      y: 0,
      height: "auto",
      ease: "power2.out",
      duration: NORMAL_DURATION,
      onComplete: done,
    }
  );
};
