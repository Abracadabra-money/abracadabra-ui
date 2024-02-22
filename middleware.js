import { next } from "@vercel/edge";

export default async function middleware(request) {
  next();
}
