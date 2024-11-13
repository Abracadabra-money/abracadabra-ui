import gsap from "gsap";
import { fadeInUp } from "@/helpers/useAnimation/simple/fadeInUp";
import { fadeOutRight } from "@/helpers/useAnimation/simple/fadeOutRight";

export const beforeEnter = (element: HTMLElement) => {
  gsap.set(element, { y: "100%", opacity: 0 });
};

export default { beforeEnter, enter: fadeInUp, leave: fadeOutRight };
