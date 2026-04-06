export const runtime = "nodejs";

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { verifyCaptcha } from "../../signup/route";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
        token: {}, // Add token field for CAPTCHA
      },

      async authorize(credentials) {
        const verifyCaptchaResult = await verifyCaptcha(credentials?.token || "");
        if (!verifyCaptchaResult) {
          return null; // CAPTCHA verification failed
        }


        if (!credentials?.email || !credentials?.password) return null;

        console.log("aa gya1");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        console.log("aa gya2");

        if (!user) return null;

        if (!user.password) return null; // Google-only user

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) return null;

        console.log("aa gya3");

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // 🔥 IMPORTANT ADD THIS
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
});


export { handler as GET, handler as POST };