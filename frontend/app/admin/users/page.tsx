"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Navbar from "../../../components/navbar"

interface User {
  id: number
  name: string
  email: string
  address: string
  role: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filter, setFilter] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "normal_user",
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) router.push("/")

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUsers(response.data)
      } catch (err) {
        console.error("Failed to fetch users:", err)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [router])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, newUser)
      setNewUser({ name: "", email: "", address: "", password: "", role: "normal_user" })
      setShowAddForm(false)
      // Refetch users
      const token = localStorage.getItem("token")
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(response.data)
    } catch (err) {
      console.error("Failed to add user:", err)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase()) ||
      user.address.toLowerCase().includes(filter.toLowerCase()),
  )

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortBy as keyof User] || ""
    let bValue = b[sortBy as keyof User] || ""

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = (bValue as string).toLowerCase()
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {showAddForm ? "Cancel" : "Add User"}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-slate-900 p-6 rounded-lg border border-border mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Add New User</h2>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-border text-foreground focus:outline-none focus:border-primary"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-border text-foreground focus:outline-none focus:border-primary"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-border text-foreground focus:outline-none focus:border-primary"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-border text-foreground focus:outline-none focus:border-primary"
                required
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-border text-foreground focus:outline-none focus:border-primary"
              >
                <option value="normal_user">Normal User</option>
                <option value="store_owner">Store Owner</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Add User
              </button>
            </form>
          </div>
        )}

        <div className="bg-slate-900 p-6 rounded-lg border border-border mb-6">
          <input
            type="text"
            placeholder="Filter by name, email, or address..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-border text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="overflow-x-auto bg-slate-900 rounded-lg border border-border">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("name")}
                    className="font-semibold text-foreground hover:text-primary transition"
                  >
                    Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("email")}
                    className="font-semibold text-foreground hover:text-primary transition"
                  >
                    Email {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("address")}
                    className="font-semibold text-foreground hover:text-primary transition"
                  >
                    Address {sortBy === "address" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("role")}
                    className="font-semibold text-foreground hover:text-primary transition"
                  >
                    Role {sortBy === "role" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-slate-800 transition">
                  <td className="px-6 py-4 text-foreground">{user.name}</td>
                  <td className="px-6 py-4 text-secondary">{user.email}</td>
                  <td className="px-6 py-4 text-secondary">{user.address}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
