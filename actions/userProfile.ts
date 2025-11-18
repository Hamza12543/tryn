"use server"

import {getServerSession} from "next-auth"
import {authOptions} from "@/lib/auth"
import {connectDB} from "@/lib/mongodb"
import User, {IUser} from "@/models/User"
import {revalidatePath} from "next/cache"

// Define a proper type
export type UserProfileData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export async function getUserProfile(): Promise<UserProfileData> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) throw new Error("Not authenticated")

  await connectDB()
  const user = await User.findOne({email: session.user.email}).lean() as IUser | null
  if (!user) throw new Error("User not found")

  return {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email,
    phone: user.phone ?? "",
    avatar: user.avatar ?? "",
    address: {
      street: user.address?.addressLine1 ?? "",
      city: user.address?.city ?? "",
      state: user.address?.county ?? "",
      zipCode: user.address?.postcode ?? "",
      country: user.address?.country ?? "",
    },
  }
}

export async function updateUserProfile(data: UserProfileData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) throw new Error("Not authenticated")

  await connectDB()
  const user = await User.findOneAndUpdate(
    {email: session.user.email},
    {
      $set: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        avatar: data.avatar,
        name: `${data.firstName} ${data.lastName}`.trim(),
        address: {
          addressLine1: data.address.street,
          city: data.address.city,
          county: data.address.state,
          postcode: data.address.zipCode,
          country: data.address.country,
        },
      },
    },
    {new: true}
  ).lean()

  if (!user) throw new Error("User not found")

  revalidatePath("/profile")

  return {
    success: true,
    user: await getUserProfile(),
  }
}
