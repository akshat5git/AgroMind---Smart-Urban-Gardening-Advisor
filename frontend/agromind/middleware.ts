// middleware.ts
export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/dashboard",
    "/profile",
    "/((?!api|_next|signin).*)" // protect everything except signin & api
  ],
}