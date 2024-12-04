import { fadeIn } from "@/helpers/useAnimation/simple/fadeIn";
import { fadeOut } from "@/helpers/useAnimation/simple/fadeOut";

const beforeEnter = (element: HTMLElement) => {
  element.style.opacity = "0";
};

export default { beforeEnter, enter: fadeIn, leave: fadeOut };
