import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

/**
 * NextAuth Configuration — Authentication ka poora setup
 *
 * 3 Providers (tarike login karne ke):
 * 1. Credentials — Email + password (manual login)
 * 2. Google — "Sign in with Google" button
 * 3. GitHub — "Sign in with GitHub" button
 *
 * OAuth Flow (Google/GitHub):
 * 1. User clicks "Sign in with Google"
 * 2. NextAuth redirects to Google's login page
 * 3. User signs in on Google
 * 4. Google redirects back to our app with user info
 * 5. signIn callback fires → we create/find user in our DB
 * 6. JWT callback fires → we add user's MongoDB _id to token
 * 7. Session callback fires → we make user data available in useSession()
 */
export const authOptions: NextAuthOptions = {
  providers: [
    // ============================
    // 1. EMAIL + PASSWORD LOGIN
    // ============================
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found with this email");
          }

          // OAuth users ke paas password nahi hota
          if (!user.password) {
            throw new Error(
              "This email is linked to Google/GitHub. Please use social login."
            );
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error: ", error);
          throw error;
        }
      },
    }),

    // ============================
    // 2. GOOGLE LOGIN
    // ============================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ============================
    // 3. GITHUB LOGIN
    // ============================
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    /**
     * signIn Callback — Har login attempt ke baad fire hota hai
     *
     * OAuth users ke liye: Check karo ki user DB mein hai ya nahi.
     * Agar nahi hai → create karo (auto-registration!)
     * Agar hai → update name/image (in case they changed their Google/GitHub profile)
     *
     * Return true = allow sign in, false = block sign in
     */
    async signIn({ user, account }) {
      // Credentials login ke liye DB check authorize() mein already ho chuka hai
      if (account?.provider === "credentials") {
        return true;
      }

      // OAuth login — Google ya GitHub
      try {
        await connectToDatabase();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Naya user — auto-register karo (no password needed for OAuth)
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
          });
        } else {
          // Existing user — profile info update karo
          existingUser.name = user.name || existingUser.name;
          existingUser.image = user.image || existingUser.image;
          await existingUser.save();
        }

        return true;
      } catch (error) {
        console.error("OAuth signIn error:", error);
        return false;
      }
    },

    /**
     * JWT Callback — Token mein extra data add karo
     *
     * Token = encrypted cookie jo browser mein store hoti hai
     * Har request ke saath automatically bhejti hai
     *
     * Hum user ka MongoDB _id token mein daaalte hain,
     * taaki session mein available ho
     */
    async jwt({ token, user, account }) {
      if (user) {
        // First login — user object available hai
        // Credentials login mein user.id already MongoDB _id hai
        if (account?.provider === "credentials") {
          token.id = user.id;
        } else {
          // OAuth login — DB se MongoDB _id fetch karo
          try {
            await connectToDatabase();
            const dbUser = await User.findOne({ email: user.email });
            if (dbUser) {
              token.id = dbUser._id.toString();
            }
          } catch (error) {
            console.error("JWT callback error:", error);
          }
        }
      }
      return token;
    },

    /**
     * Session Callback — useSession() mein kya data available hoga
     *
     * session.user mein token se data copy karo
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login", // Custom login page
    error: "/login", // Error pe bhi login page pe redirect
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
