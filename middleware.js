import { next, ipAddress } from "@vercel/edge";
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

const ratelimit = new Ratelimit({
    redis: kv,
    // 5 requests from the same IP in 10 seconds
    limiter: Ratelimit.slidingWindow(5, '10 s'),
  })

export default async function middleware(request) {
  const ip = ipAddress(request);
  console.log("ip is:", ip)

  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    ip
  )

  console.log("limit", success)

  next();
}
