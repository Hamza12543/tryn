"use client"

import {useState, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {updateAdminProfile, getAdminProfile} from "@/actions/profile"
import { useSession } from "next-auth/react"


type Props = {
  user: {
    name?: string
    phone?: string
    email: string
  }
}

export default function AdminProfileForm() {
  const [formData, setFormData] = useState({
    name:  "",
    phone:  "",
    email: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [fetching, setFetching] = useState(true)
const { update } = useSession() 

  useEffect(() => {
    const fetchProfile = async () => {
      const result = await getAdminProfile()
      if (result?.user) {
        setFormData({
          name: result.user.name || "",
          phone: result.user.phone || "",
          email: result.user.email || "",
        })
      } else if (result?.error) {
        setMessage("❌ " + result.error)
      }
      setFetching(false)
    }

    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setFormData((prev) => ({...prev, [name]: value}))
  }

  // Remove this line, and instead get the session inside handleSubmit if needed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    
    const result = await updateAdminProfile({
      name: formData.name,
      phone: formData.phone,
    })

    if (result?.error) {
      setMessage("❌ " + result.error)
    } else {
      setMessage("✅ " + result.message)
      await update({ name: result.user?.name })
    }

    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <Input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <Input type="email" value={formData.email} disabled />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  )
}
