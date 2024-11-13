import gsap from "gsap";
import { NORMAL_DURATION } from "@/helpers/useAnimation/constants";

export const fadeOut = (el: gsap.TweenTarget, done: () => void) => {
  gsap.to(el, {
    duration: NORMAL_DURATION,
    opacity: 0,
    ease: "power1.in",
    onComplete: done,
  });
};
