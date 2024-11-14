import gsap from "gsap";
import { rollUp } from "@/helpers/useAnimation/simple/rollUp";
import { rollDown } from "@/helpers/useAnimation/simple/rollDown";

export const beforeEnter = (element: HTMLElement) => {
  gsap.set(element, { height: 0 });
};

export default { beforeEnter, enter: rollDown, leave: rollUp };
