"use server"

import {signIn, signOut, getSession} from "next-auth/react"
import {redirect} from "next/navigation"
import bcrypt from "bcryptjs"
import User from "@/models/User"
import {getServerSession} from "next-auth"
import {authOptions} from "@/lib/auth"
import {connectDB} from "@/lib/mongodb"

export async function signInWithProvider(provider: "google" | "apple") {
  try {
    const result = await signIn(provider, {
      callbackUrl: "/dashboard",
      redirect: false,
    })

    if (result?.error) {
      return {error: result.error}
    }

    if (result?.url) {
      // Fetch user role and redirect accordingly
      const session = await getSession()
      if (session?.user?.role === "ADMIN") {
        redirect("/admin")
      } else {
        redirect("/dashboard")
      }
    }

    return {success: true}
  } catch (error) {
    return {error: "An error occurred during sign in"}
  }
}

export async function signOutUser() {
  try {
    await signOut({
      callbackUrl: "/",
      redirect: false,
    })
    redirect("/")
  } catch (error) {
    return {error: "An error occurred during sign out"}
  }
}

export async function getCurrentSession() {
  try {
    const session = await getSession()
    return session
  } catch (error) {
    return null
  }
}

export async function registerUser({name, email, password}: {name?: string; email: string; password: string}) {
  await connectDB()
  if (!email || !password) {
    return {error: "Email and password are required"}
  }
  const existingUser = await User.findOne({email})
  if (existingUser) {
    return {error: "A user with this email already exists"}
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isActive: true,
    role: "CUSTOMER",
  })
  return {success: true, user: {id: user._id, email: user.email, name: user.name}}
}

export async function loginUser({email, password}: {email: string; password: string}) {
  await connectDB()
  if (!email || !password) {
    return {error: "Email and password are required"}
  }
  const user = await User.findOne({email})
  if (!user || !user.password) {
    return {error: "Invalid email or password"}
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return {error: "Invalid email or password"}
  }
  // Redirect based on user role
  if (user.role === "ADMIN") {
    return {
      success: true,
      user: {id: user._id, email: user.email, name: user.name, role: user.role},
      redirect: "/admin",
    }
  }
  return {
    success: true,
    user: {id: user._id, email: user.email, name: user.name, role: user.role},
    redirect: "/dashboard",
  }
}
