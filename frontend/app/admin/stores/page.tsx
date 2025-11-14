"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Navbar from "../../../components/navbar"

interface Store {
  id: number
  name: string
  email: string
  address: string
  average_rating: number
}

interface Owner {
  id: number
  name: string
  email: string
}

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [owners, setOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filter, setFilter] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  })

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) router.push("/")

    const fetchStores = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`)
        setStores(response.data)
      } catch (err) {
        console.error("Failed to fetch stores:", err)
      }
    }

    const fetchOwners = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/stores/owners`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setOwners(response.data)
      } catch (err) {
        console.error("Failed to fetch owners:", err)
      }
    }

    Promise.all([fetchStores(), fetchOwners()]).finally(() => setLoading(false))
  }, [router])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stores`,
        newStore,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setNewStore({ name: "", email: "", address: "", owner_id: "" })
      setShowAddForm(false)

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`)
      setStores(response.data)
    } catch (err) {
      console.error("Failed to add store:", err)
    }
  }

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(filter.toLowerCase()) ||
      store.email.toLowerCase().includes(filter.toLowerCase()) ||
      store.address.toLowerCase().includes(filter.toLowerCase()),
  )

  const sortedStores = [...filteredStores].sort((a, b) => {
    let aValue = a[sortBy as keyof Store] || ""
    let bValue = b[sortBy as keyof Store] || ""

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
          <h1 className="text-3xl font-bold text-foreground">Manage Stores</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {showAddForm ? "Cancel" : "Add Store"}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-slate-900 p-6 rounded-lg border border-border mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Add New Store</h2>

            <form onSubmit={handleAddStore} className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <input
                type="text"
                placeholder="Store Name"
                value={newStore.name}
                onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-border text-foreground"
                required
              />

              <input
                type="email"
                placeholder="Store Email"
                value={newStore.email}
                onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-border text-foreground"
                required
              />

              <input
                type="text"
                placeholder="Store Address"
                value={newStore.address}
                onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-border text-foreground"
                required
              />

              <select
                value={newStore.owner_id}
                onChange={(e) => setNewStore({ ...newStore, owner_id: e.target.value })}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-border text-foreground"
                required
              >
                <option value="">Assign Owner</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="col-span-1 md:col-span-4 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg"
              >
                Add Store
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
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-border text-foreground"
          />
        </div>

        <div className="overflow-x-auto bg-slate-900 rounded-lg border border-border">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button onClick={() => handleSort("name")} className="font-semibold text-foreground hover:text-primary transition">
                    Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button onClick={() => handleSort("email")} className="font-semibold text-foreground hover:text-primary transition">
                    Email {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button onClick={() => handleSort("address")} className="font-semibold text-foreground hover:text-primary transition">
                    Address {sortBy === "address" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button onClick={() => handleSort("average_rating")} className="font-semibold text-foreground hover:text-primary transition">
                    Rating {sortBy === "average_rating" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedStores.map((store) => (
                <tr key={store.id} className="border-b border-border hover:bg-slate-800 transition">
                  <td className="px-6 py-4 text-foreground">{store.name}</td>
                  <td className="px-6 py-4 text-secondary">{store.email}</td>
                  <td className="px-6 py-4 text-secondary">{store.address}</td>
                  <td className="px-6 py-4">
                    <span className="text-primary font-semibold">{store.average_rating} ⭐</span>
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
