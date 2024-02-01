import { marked } from "marked";
import DOMPurify from "dompurify";

export const parseMarkdownToHTML = (body) => {
  return DOMPurify.sanitize(marked.parse(body));
};
