// import {NextAuthOptions} from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
// import AppleProvider from "next-auth/providers/apple"
// import CredentialsProvider from "next-auth/providers/credentials"
// import {MongoDBAdapter} from "@auth/mongodb-adapter"
// import clientPromise from "@/lib/mongodb"
// import {checkAuthEnv} from "@/lib/env-check"

// // Check environment variables in development
// if (process.env.NODE_ENV === "development") {
//   checkAuthEnv()
// }

// if (!process.env.NEXTAUTH_SECRET) {
//   throw new Error("Please provide process.env.NEXTAUTH_SECRET")
// }

// export const authOptions: NextAuthOptions = {
//   secret: process.env.NEXTAUTH_SECRET,
//   adapter: MongoDBAdapter(clientPromise),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     AppleProvider({
//       clientId: process.env.APPLE_ID!,
//       clientSecret: process.env.APPLE_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: {label: "Email", type: "email"},
//         password: {label: "Password", type: "password"},
//       },
//       async authorize(credentials) {
//         if (!credentials || !credentials.email || !credentials.password) {
//           throw new Error("Invalid email or password")
//         }
//         const {connectDB} = await import("@/lib/mongodb")
//         await connectDB()
//         const User = (await import("@/models/User")).default
//         const bcrypt = (await import("bcryptjs")).default
//         const user = await User.findOne({email: credentials.email})
//         if (!user || !user.password) {
//           throw new Error("Invalid email or password")
//         }
//         const isMatch = await bcrypt.compare(credentials.password, user.password)
//         if (!isMatch) {
//           throw new Error("Invalid email or password")
//         }
//         return {
//           id: user._id.toString(),
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async session({session, user, token}) {
//       if (session.user) {
//         session.user.id = user?.id || token?.id
//         session.user.role = token?.role
//       }
//       return session
//     },
//     async jwt({token, user}) {
//       if (user) {
//         token.id = user.id
//         token.role = user.role
//       }
//       return token
//     },
//     async signIn({user, account, profile, email, credentials}) {
//       // Prevent duplicate users for same email (OAuth vs custom)
//       const UserModel = (await import("@/models/User")).default
//       const existingUser = await UserModel.findOne({email: user.email})
//       if (existingUser && !existingUser.password && account?.provider !== "credentials") {
//         // OAuth login for existing OAuth user: allow
//         return true
//       }
//       if (existingUser && existingUser.password && account?.provider !== "credentials") {
//         // OAuth login for existing local user: allow
//         return true
//       }
//       if (!existingUser) {
//         // New user, allow creation
//         return true
//       }
//       // Otherwise, allow
//       return true
//     },
//   },
//   pages: {
//     signIn: "/login",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   debug: process.env.NODE_ENV === "development",
// }

import {NextAuthOptions} from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import AppleProvider from "next-auth/providers/apple"
import CredentialsProvider from "next-auth/providers/credentials"
import {MongoDBAdapter} from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import {checkAuthEnv} from "@/lib/env-check"

if (process.env.NODE_ENV === "development") {
  checkAuthEnv()
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please provide process.env.NEXTAUTH_SECRET")
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password")
        }

        const {connectDB} = await import("@/lib/mongodb")
        await connectDB()
        const User = (await import("@/models/User")).default
        const bcrypt = (await import("bcryptjs")).default

        const user = await User.findOne({email: credentials.email})
        if (!user || !user.password) {
          throw new Error("Invalid email or password")
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password)
        if (!isMatch) {
          throw new Error("Invalid email or password")
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
          addresses: user.addresses,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({token, user, trigger, session}) {
      // On login
      if (user) {
        token.id = user.id
        token.role = user.role
        token.name = user.name
        token.email = user.email
        token.phone = (user as any).phone
        token.avatar = (user as any).avatar
        token.firstName = (user as any).firstName
        token.lastName = (user as any).lastName
        token.address = (user as any).address
        token.addresses = (user as any).addresses
      }

      // On profile update (optional)
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name
        if (session.phone) token.phone = session.phone
        if (session.avatar) token.avatar = session.avatar
        if (session.address) token.address = session.address
        if (session.addresses) token.addresses = session.addresses
      }

      return token
    },

    async session({session, token}) {
      if (session.user) {
        // session.user.id = token.id as string
        // session.user.role = token.role as string
        // session.user.name = token.name as string
        // session.user.email = token.email as string
        // session.user.phone = token.phone as string
        // session.user.avatar = token.avatar as string
        // session.user.firstName = token.firstName as string
        // session.user.lastName = token.lastName as string
        // session.user.address = token.address as any
        // session.user.addresses = token.addresses as any[]
        const u = session.user as any // 👈 bypass type error

        u.id = token.id as string
        u.role = token.role as string
        u.name = token.name as string
        u.email = token.email as string
        u.phone = token.phone as string
        u.avatar = token.avatar as string
        u.firstName = token.firstName as string
        u.lastName = token.lastName as string
        u.address = token.address as any
        u.addresses = token.addresses as any[]
      }
      return session
    },

    async signIn({user, account}) {
      const UserModel = (await import("@/models/User")).default
      const existingUser = await UserModel.findOne({email: user.email})

      if (existingUser && !existingUser.password && account?.provider !== "credentials") {
        return true
      }
      if (existingUser && existingUser.password && account?.provider !== "credentials") {
        return true
      }
      if (!existingUser) {
        return true
      }
      return true
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
}
