import { next } from "@vercel/edge";

export default async function middleware(request) {
  console.log("im alive");
  next();
}
