"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Navbar from "../../../components/navbar"

interface Store {
  id: number
  name: string
  address: string
  average_rating: number
}

interface Rating {
  store_id: number
  rating: number
}

export default function UserDashboard() {
  const [stores, setStores] = useState<Store[]>([])
  const [userRatings, setUserRatings] = useState<Map<number, number>>(new Map())
  const [selectedRatings, setSelectedRatings] = useState<Map<number, number>>(new Map())
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (!token) router.push("/")

    const fetchData = async () => {
      try {
        const user_obj = JSON.parse(user!)
        const storesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`)

        const ratingsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/ratings/user/${user_obj.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setStores(storesRes.data)
        const ratingsMap = new Map()
        ratingsRes.data.forEach((r: Rating) => {
          ratingsMap.set(r.store_id, r.rating)
        })
        setUserRatings(ratingsMap)
      } catch (err) {
        console.error("Failed to fetch data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleSubmitRating = async (storeId: number) => {
    const rating = selectedRatings.get(storeId)
    if (!rating) return

    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ratings`,
        { store_id: storeId, rating },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setUserRatings(new Map(userRatings).set(storeId, rating))
      setSelectedRatings(new Map(selectedRatings).delete(storeId))
    } catch (err) {
      console.error("Failed to submit rating:", err)
    }
  }

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-foreground mb-8">Discover Stores</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-border text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStores.map((store) => (
            <div key={store.id} className="bg-slate-900 p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-2">{store.name}</h3>
              <p className="text-secondary mb-2">{store.address}</p>
              <div className="mb-4">
                <span className="text-primary font-semibold">Rating: {store.average_rating} / 5</span>
              </div>

              {userRatings.has(store.id) ? (
                <div className="bg-slate-800 p-3 rounded">
                  <p className="text-sm text-secondary">
                    Your rating: <span className="text-primary">{userRatings.get(store.id)} / 5</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <select
                    value={selectedRatings.get(store.id) || ""}
                    onChange={(e) =>
                      setSelectedRatings(new Map(selectedRatings).set(store.id, Number.parseInt(e.target.value)))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-border text-foreground"
                  >
                    <option value="">Select a rating...</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} ⭐
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleSubmitRating(store.id)}
                    disabled={!selectedRatings.get(store.id)}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                  >
                    Submit Rating
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
