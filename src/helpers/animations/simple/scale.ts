import gsap from "gsap";
import { NORMAL_DURATION } from "@/constants/animations";

export const setScale = (el: gsap.TweenTarget) => {
    gsap.set(el, { scale: 0 });
}

export const scaleIn = (el: gsap.TweenTarget, done: () => void) => {
    gsap.to(el, {
        duration: NORMAL_DURATION,
        scale: 1,
        ease: 'power1.in',
        onComplete: done,
    });
}

export const scaleOut = (el: gsap.TweenTarget, done: () => void) => {
    gsap.to(el, {
        duration: NORMAL_DURATION,
        scale: 0,
        ease: 'power1.in',
        onComplete: done,
    });
}