"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, formData)

      setSuccess("Account created successfully! Please log in.")
      setFormData({ name: "", email: "", address: "", password: "" })
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-border text-foreground focus:outline-none focus:border-primary"
          placeholder="John Doe"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-border text-foreground focus:outline-none focus:border-primary"
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-border text-foreground focus:outline-none focus:border-primary"
          placeholder="123 Main St, City"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-border text-foreground focus:outline-none focus:border-primary"
          placeholder="Min 8 chars, 1 uppercase, 1 special char"
          required
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-500 text-sm">{success}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>
    </form>
  )
}
