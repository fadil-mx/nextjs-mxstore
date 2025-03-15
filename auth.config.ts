import type { NextAuthConfig } from 'next-auth'
export default {
  providers: [],
  callbacks: {
    authorized: ({ request, auth }: any) => {
      const protectedPaths = [
        /\/checkout(\/.*)?/,
        /\/account(\/.*)?/,
        /\/admin(\/.*)?/,
      ]
      const { pathname } = request.nextUrl
      if (protectedPaths.some((path) => pathname.match(path))) return !!auth
      return true
    },
  },
} satisfies NextAuthConfig
