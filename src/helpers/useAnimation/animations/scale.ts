import gsap from "gsap";
import { scaleIn } from "@/helpers/useAnimation/simple/scaleIn";
import { scaleOut } from "@/helpers/useAnimation/simple/scaleOut";

const beforeEnter = (element: HTMLElement) => {
  gsap.set(element, { scale: 0 });
};

export default { beforeEnter, enter: scaleIn, leave: scaleOut };
