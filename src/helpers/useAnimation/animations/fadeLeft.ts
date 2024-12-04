import gsap from "gsap";
import { fadeInLeft } from "@/helpers/useAnimation/simple/fadeInLeft";
import { fadeOutLeft } from "@/helpers/useAnimation/simple/fadeOutLeft";

export const beforeEnter = (element: HTMLElement) => {
  gsap.set(element, { x: "-100%", opacity: 0 });
};

export default { beforeEnter, enter: fadeInLeft, leave: fadeOutLeft };
