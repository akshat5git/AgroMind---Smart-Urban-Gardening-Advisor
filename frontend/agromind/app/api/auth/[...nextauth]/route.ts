export const runtime = "nodejs";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"


const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        // Replace with DB logic later
                
        const user = await prisma.user.findUnique({
          where: { email: "test@gmail.com" },
        })

        if (
          credentials?.email === "test@gmail.com" &&
          credentials?.password === "1234"
        ) {
          return { id: "1", email: "test@gmail.com" }
        }
        return null
      },
    }),
  ],
})

export { handler as GET, handler as POST }