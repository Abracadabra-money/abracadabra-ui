import gsap from "gsap";
import { NORMAL_DURATION } from "@/constants/animations";

export const setSlideUp = (el: gsap.TweenTarget) => {
    gsap.set(el, { y: "100%" });
}

export const slideUp = (el: any, done: () => void) => {
    gsap.to(el, {
        duration: NORMAL_DURATION,
        y: "0%",
        ease: 'power1.in',
        onComplete: done,
    });
}

export const slideUpOut = (el: gsap.TweenTarget, done: () => void) => {
    gsap.to(el, {
        duration: NORMAL_DURATION,
        y: "-100%",
        ease: 'power1.in',
        onComplete: done,
    });
}