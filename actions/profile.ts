"use server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// ✅ Helper: safely serialize mongoose docs
function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

// ✅ Only return safe fields
function safeUser(user: any) {
  if (!user) return null;
  return {
    id: user._id?.toString(), // ✅ Convert ObjectId to string
    name: user.name || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
    email: user.email,
    avatar: user.avatar || "",
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
    updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : null,
  };
}

// ✅ Fetch Admin Profile
export async function getAdminProfile() {
  try {
    await connectDB();

    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return { error: "Unauthorized" };
    }

    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) {
      return { error: "Admin not found" };
    }

    return { user: safeUser(serialize(user)) }; // ✅ plain object only
  } catch (error) {
    console.error("getAdminProfile error:", error);
    return { error: "Server error" };
  }
}

// ✅ Update Admin Profile
export async function updateAdminProfile(data: {
  name?: string;
  phone?: string;
}) {
  try {
    await connectDB();

    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return { error: "Unauthorized" };
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { ...data },
      { new: true, lean: true }
    );

    if (!updatedUser) {
      return { error: "Admin not found" };
    }

    return {
      message: "Profile updated successfully",
      user: safeUser(serialize(updatedUser)), // ✅ plain object only
    };
  } catch (error) {
    console.error("updateAdminProfile error:", error);
    return { error: "Server error" };
  }
}
