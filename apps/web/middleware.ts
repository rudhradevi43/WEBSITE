import { auth } from "./auth";

export default auth((request) => {
  const isLoggedIn = Boolean(request.auth);
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login");

  if (!isLoggedIn && !isAuthRoute && request.nextUrl.pathname.startsWith("/app")) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/app/:path*"]
};
