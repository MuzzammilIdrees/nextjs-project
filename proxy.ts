import nextAuthMiddleware from "next-auth/middleware";

export default function proxy(req: any, ctx: any) {
  return nextAuthMiddleware(req, ctx);
}

export const config = {
  // This tells the proxy to protect EVERY route inside the /admin folder
  matcher: ["/admin/:path*"],
};