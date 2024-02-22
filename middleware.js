import { next, ipAddress } from "@vercel/edge";

export default async function middleware(request) {
  const ip = ipAddress(request);
  console.log("im alive");
  console.log("ip is:", ip)
  next();
}
