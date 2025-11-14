"use client"

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
  rating_count: number
}

interface Rating {
  id: number
  user_id: number
  rating: number
  name: string
  email: string
  created_at: string
}

export default function StoreOwnerDashboard() {
  const [store, setStore] = useState<Store | null>(null)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) router.push("/")

    const fetchData = async () => {
      try {
        const storeRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/store-owner/store`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const ratingsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/store-owner/ratings`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setStore(storeRes.data)
        setRatings(ratingsRes.data)
      } catch (err) {
        console.error("Failed to fetch data:", err)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-foreground mb-8">Store Dashboard</h1>

        {store ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-900 p-6 rounded-lg border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">{store.name}</h2>
                <p className="text-secondary mb-2">Email: {store.email}</p>
                <p className="text-secondary mb-4">Address: {store.address}</p>
                <div className="bg-slate-800 p-4 rounded">
                  <p className="text-sm text-secondary">Average Rating</p>
                  <p className="text-3xl font-bold text-primary">{store.average_rating} / 5</p>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-lg border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div className="bg-slate-800 p-3 rounded">
                    <p className="text-secondary text-sm">Total Ratings</p>
                    <p className="text-2xl font-bold text-primary">{store.rating_count}</p>
                  </div>
                  <div className="bg-slate-800 p-3 rounded">
                    <p className="text-secondary text-sm">Rating Distribution</p>
                    <p className="text-sm text-secondary mt-1">Check individual ratings below</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-6">Recent Ratings</h3>
              {ratings.length === 0 ? (
                <p className="text-secondary">No ratings yet</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {ratings.map((rating) => (
                    <div key={rating.id} className="bg-slate-800 p-4 rounded border border-border">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{rating.name}</p>
                          <p className="text-sm text-secondary">{rating.email}</p>
                          <p className="text-sm text-secondary">{new Date(rating.created_at).toLocaleDateString()}</p>
                        </div>
                        <p className="text-2xl text-primary">{rating.rating} ⭐</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-slate-900 p-6 rounded-lg border border-border">
            <p className="text-secondary">No store assigned to your account</p>
          </div>
        )}

        <div className="mt-8">
          <a href="/user/settings" className="text-primary hover:text-primary-dark transition">
            ← Change Password
          </a>
        </div>
      </div>
    </div>
  )
}
